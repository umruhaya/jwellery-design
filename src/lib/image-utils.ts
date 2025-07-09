export function makeBase64Image(format: 'webp' | 'jpeg' | 'png', base64: string, alt: string = ''): string {
	const mime: Record<'webp' | 'jpeg' | 'png', string> = {
		webp: 'image/webp',
		jpeg: 'image/jpeg',
		png: 'image/png',
	}

	return `data:${mime[format]};base64,${base64}`
}

/**
 * Downsizes the image dimensions according to how OpenAI does?
 * if we can do this on client side, this means that the same downsizing
 * that was supposed to happen on OPENAI servers happens at the Client Side.
 * - This would help with storage and bandwidth costs as we scale
 * - client side downsizing mean faster image upload time for user for larger images
 * https://platform.openai.com/docs/guides/vision/calculating-costs
 */
const downscaleDimensions = ({ width, height }: { width: number; height: number }) => {
	const MAX_DIMENSION = 2048
	const TARGET_SMALLEST_SIDE = 768

	// Step 1: Downscale to fit within the 2048 x 2048 square
	if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
		if (width > height) {
			// If width is the largest side
			const scaleFactor = MAX_DIMENSION / width
			width = MAX_DIMENSION
			height = Math.floor(height * scaleFactor)
		} else {
			// If height is the largest side
			const scaleFactor = MAX_DIMENSION / height
			height = MAX_DIMENSION
			width = Math.floor(width * scaleFactor)
		}
	}

	// Step 2: Downscale the smallest side to 768
	if (width < height && width > TARGET_SMALLEST_SIDE) {
		const scaleFactor = TARGET_SMALLEST_SIDE / width
		width = TARGET_SMALLEST_SIDE
		height = Math.floor(height * scaleFactor)
	} else if (height < width && height > TARGET_SMALLEST_SIDE) {
		const scaleFactor = TARGET_SMALLEST_SIDE / height
		height = TARGET_SMALLEST_SIDE
		width = Math.floor(width * scaleFactor)
	}

	return { width, height }
}

/**
 * Downscale a base64 image string according to OpenAI's rules.
 * @param base64 - The base64 image string.
 * @returns Promise<string> - The downscaled base64 image string.
 */
export async function downscaleBase64Image(base64: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => {
			const { width, height } = img
			const { width: newWidth, height: newHeight } = downscaleDimensions({ width, height })

			const canvas = document.createElement('canvas')
			canvas.width = newWidth
			canvas.height = newHeight
			const ctx = canvas.getContext('2d')
			if (!ctx) {
				reject(new Error('Could not get canvas context'))
				return
			}
			ctx.drawImage(img, 0, 0, newWidth, newHeight)
			const IMAGE_QUALITY = 1 // 0-1
			const resultBase64 = canvas.toDataURL('image/jpeg', IMAGE_QUALITY)
			resolve(resultBase64)
		}
		img.onerror = (err) => reject(err)
		img.src = base64
	})
}
