#!/bin/bash
set -e # Exit on any error

# ============================================
# CONFIGURATION
# ============================================

# 1. Input/Output Paths
INPUT_DIR="./gallery/hero"
OUTPUT_DIR="./gallery/hero-output"
CLEANUP_AFTER_UPLOAD=false

# 2. Video Concatenation Order
VIDEO_ORDER=(
  "1-butterflies.mp4"
  "2-old-woman.mp4"
  "3-redhead.mp4"
  "4-two-women.mp4"
  "5-black-top-necklace.mp4"
  "6-couple.mp4"
  "7-black-top-rings.mp4"
)

# 3. Processing Settings
SPEED_FACTOR=0.8      # 20% slower (0.8x speed)
# NEW: How many seconds from the START to append to the END to create the loop.
LOOP_DURATION=1.0     # Appends the first 2.0 seconds to the end.

# 4. MP4 Encoding Settings
TARGET_RESOLUTION="1920:-2"
TARGET_CRF=23         # Constant Rate Factor (quality). 18-28 is a good range. Lower is higher quality.
TARGET_PRESET="medium" # Encoding speed vs. compression. "slow" is better but slower. "fast" is faster but larger file.

# 5. Google Cloud Storage
GCS_BUCKET="cyodesign"
FINAL_FILENAME="hero-v2.mp4"
GCS_OUTPUT_PATH="assets/hero/$FINAL_FILENAME"

# ============================================
# HELPER FUNCTIONS
# ============================================

print_step() {
  echo ""
  echo "============================================"
  echo "STEP: $1"
  echo "============================================"
}

print_status() {
  echo "→ $1"
}

# ============================================
# MAIN SCRIPT
# ============================================

# Step 0: Setup
print_step "0. SETUP"
print_status "Creating output directory..."
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/normalized"

# Step 1: Normalize all videos (remove audio, ensure same codec)
print_step "1. NORMALIZING VIDEOS (Removing audio streams)"

for video in "${VIDEO_ORDER[@]}"; do
  INPUT_PATH="$INPUT_DIR/$video"
  OUTPUT_PATH="$OUTPUT_DIR/normalized/$video"

  if [ ! -f "$INPUT_PATH" ]; then
    echo "ERROR: Video not found: $INPUT_PATH"
    exit 1
  fi

  print_status "Processing: $video"

  # Remove audio stream and ensure consistent video codec
  ffmpeg -y -i "$INPUT_PATH" \
    -c:v copy \
    -an \
    "$OUTPUT_PATH"

  print_status "Normalized: $video (audio removed)"
done

print_status "All videos normalized"

# Step 2: Create concat file for ffmpeg
print_step "2. CREATING VIDEO LIST FOR CONCATENATION"
CONCAT_FILE="$OUTPUT_DIR/concat_list.txt"
rm -f "$CONCAT_FILE"

for video in "${VIDEO_ORDER[@]}"; do
  echo "file 'normalized/$video'" >> "$CONCAT_FILE"
  print_status "Added to list: $video"
done

print_status "Concat list created at: $CONCAT_FILE"

# Step 3: Concatenate normalized videos
print_step "3. CONCATENATING VIDEOS"
CONCAT_OUTPUT="$OUTPUT_DIR/concatenated.mp4"
print_status "Concatenating ${#VIDEO_ORDER[@]} videos..."

ffmpeg -y -f concat -safe 0 -i "$CONCAT_FILE" \
  -c copy \
  "$CONCAT_OUTPUT"

print_status "Videos concatenated to: $CONCAT_OUTPUT"

# ==============================================================================
# NEW COMBINED STEP 4: Slow Down, Create Seamless Loop, and Encode to MP4
# This single command uses a "trim and append" strategy for the loop.
# ==============================================================================
print_step "4. SLOW DOWN, CREATE SEAMLESS LOOP & ENCODE"
FINAL_OUTPUT="$OUTPUT_DIR/$FINAL_FILENAME"

# First, get the exact duration of the concatenated video
ORIGINAL_DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$CONCAT_OUTPUT")

# Calculate the new duration after slowdown
SLOWED_DURATION=$(echo "$ORIGINAL_DURATION / $SPEED_FACTOR" | bc -l)

# Calculate the final duration after appending the loop segment
FINAL_DURATION=$(echo "$SLOWED_DURATION + $LOOP_DURATION" | bc -l)

print_status "Original duration: ${ORIGINAL_DURATION}s"
print_status "Duration after slowdown: ${SLOWED_DURATION}s"
print_status "Appending first ${LOOP_DURATION}s to the end for a seamless loop."
print_status "Final video duration will be: ${FINAL_DURATION}s"
print_status "Starting final single-pass encoding..."

# This is the magic command. It does everything in one go:
# - Takes the concatenated video as input.
# - Uses a filter_complex to chain multiple operations.
# - [0:v]setpts...[slowed]: Slows down the entire video.
# - [slowed]split[main][loop_part]: Creates two identical copies of the slowed stream.
# - [loop_part]trim...[trimmed_loop]: Takes one copy and trims it to the first LOOP_DURATION seconds.
# - [main][trimmed_loop]concat...[final_loop]: Appends the trimmed part to the end of the full-length part.
# - [final_loop]scale...[v_out]: Scales the result to the target resolution.
# - The final stream [v_out] is then encoded to MP4.
ffmpeg -y \
  -i "$CONCAT_OUTPUT" \
  -filter_complex \
  "[0:v]setpts=PTS/${SPEED_FACTOR}[slowed]; \
   [slowed]split[main][loop_part]; \
   [loop_part]trim=duration=${LOOP_DURATION}[trimmed_loop]; \
   [main][trimmed_loop]concat=n=2:v=1:a=0[final_loop]; \
   [final_loop]scale=${TARGET_RESOLUTION}[v_out]" \
  -map "[v_out]" \
  -c:v libx264 \
  -preset "$TARGET_PRESET" \
  -crf "$TARGET_CRF" \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -an \
  "$FINAL_OUTPUT"

print_status "Final MP4 created: $FINAL_OUTPUT"

# Get final file size
FILE_SIZE=$(ls -lh "$FINAL_OUTPUT" | awk '{print $5}')
print_status "Final file size: $FILE_SIZE"

# Step 5: Upload to Google Cloud Storage
print_step "5. UPLOADING TO GOOGLE CLOUD STORAGE"
print_status "Uploading to: gs://$GCS_BUCKET/$GCS_OUTPUT_PATH"

gsutil -m cp "$FINAL_OUTPUT" "gs://$GCS_BUCKET/$GCS_OUTPUT_PATH"

print_status "Upload complete!"

# Step 6: Cleanup (optional)
if [ "$CLEANUP_AFTER_UPLOAD" = true ]; then
  print_step "6. CLEANING UP"
  print_status "Removing intermediate files..."
  rm -rf "$OUTPUT_DIR/normalized"
  rm -f "$CONCAT_FILE"
  rm -f "$CONCAT_OUTPUT"
  print_status "Cleanup complete"
else
  print_step "6. SKIPPING CLEANUP"
  print_status "Intermediate files kept in: $OUTPUT_DIR"
fi

# Final summary
print_step "COMPLETE!"
echo ""
echo "Summary:"
echo "  → Processing pipeline optimized to a single re-encode."
echo "  → Loop created by appending the first ${LOOP_DURATION}s to the end."
echo "  → Final format is a highly compatible MP4."
echo "  → Final duration: ~${FINAL_DURATION} seconds"
echo "  → Final file size: $FILE_SIZE"
echo ""
echo "Final video uploaded to:"
echo "  → gs://$GCS_BUCKET/$GCS_OUTPUT_PATH"
echo ""
echo "Public URL (if bucket is public):"
echo "  → https://fsn1.your-objectstorage.com/$GCS_BUCKET/$GCS_OUTPUT_PATH"