#!/bin/bash

# --- Configuration ---
# IMPORTANT: Ensure this user and key have SSH access and write permissions
# to the remote_base_path!
SSH_USER="umernaeem135acc"
SSH_HOST="cyodesign.com"
SSH_KEY_PATH="$HOME/.ssh/my-gcp-key"
REMOTE_BASE_PATH="/home/umernaeem135acc/cyodesign"
LOCAL_DIST_PATH="./dist"
LOCAL_ENV_FILE="./.env"

# --- Functions for better readability and error handling ---
log_info() { echo -e "\n[INFO] $1"; }
log_success() { echo -e "\n\033[0;32m[SUCCESS] $1\033[0m"; }
log_error() { echo -e "\n\033[0;31m[ERROR] $1\033[0m"; exit 1; }

# --- Pre-checks ---
log_info "Starting file deployment script..."
# Resolve SSH_KEY_PATH to an absolute path for better reliability
eval expanded_ssh_key_path=$SSH_KEY_PATH
if [ ! -f "$expanded_ssh_key_path" ]; then log_error "SSH key not found at $SSH_KEY_PATH. Please verify the path."; fi
if [ ! -d "$LOCAL_DIST_PATH" ]; then log_error "Local dist directory not found at $LOCAL_DIST_PATH. Please build your project first."; fi
if [ ! -f "$LOCAL_ENV_FILE" ]; then log_error "Local .env file not found at $LOCAL_ENV_FILE."; fi

# --- Main File Deployment Steps ---

# 1. Copy the entire ./dist directory to the server
log_info "Copying '$LOCAL_DIST_PATH' to '$SSH_USER@$SSH_HOST:$REMOTE_BASE_PATH/dist/'..."
# -r: recursive
# -a: archive mode (preserves permissions, timestamps, etc.)
# -P: shows progress during transfer
# -z: compress data during transfer (can speed up over slow links)
# --delete: removes files from destination that are no longer in source
# The trailing slash on $LOCAL_DIST_PATH/ is CRUCIAL to copy contents, not the folder itself
# The trailing slash on $REMOTE_BASE_PATH/dist/ is also important to put contents directly inside dist
rsync -raPz --delete "$LOCAL_DIST_PATH/" "$SSH_USER@$SSH_HOST:$REMOTE_BASE_PATH/dist/" \
    -e "ssh -i \"$expanded_ssh_key_path\"" || log_error "Failed to copy dist directory."
log_success "Dist directory copied successfully."

# 2. Copy .env to the server (overwrite if already exists)
log_info "Copying '$LOCAL_ENV_FILE' to '$SSH_USER@$SSH_HOST:$REMOTE_BASE_PATH/.env'..."
# -v: verbose
# -a: archive mode
# -P: shows progress
rsync -avP "$LOCAL_ENV_FILE" "$SSH_USER@$SSH_HOST:$REMOTE_BASE_PATH/.env" \
    -e "ssh -i \"$expanded_ssh_key_path\"" || log_error "Failed to copy .env file."
log_success ".env file copied successfully."

log_success "All local files have been transferred to the server!"

# --- Manual Instructions for the User ---
echo "
================================================================================
  MANUAL STEPS REQUIRED ON THE SERVER
================================================================================

1. Connect to your server:

   ssh -i \"$expanded_ssh_key_path\" $SSH_USER@$SSH_HOST

2. Once connected, navigate to your project directory:

   cd $REMOTE_BASE_PATH

3. Pull any latest code changes from your Git repository (e.g., 'main' branch):

   git pull origin main

   (If your main branch is called 'master' or something else, adjust accordingly.)

4. Install/update project dependencies using pnpm.

   pnpm install

5. Finally, restart your PM2 process to apply the changes:

   pm2 restart ecosystem.config.cjs

================================================================================
"