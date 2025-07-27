import type { APIRoute } from 'astro'
import { z } from 'astro/zod'
import { GCSStorageService } from '~/services/storage'
import { BUCKET_NAME } from 'astro:env/server'
import { IMG_FORMAT } from 'astro:env/client'

const URL_EXPIRES_IN = 60 * 5 // 5 minutes

export const POST: APIRoute = async ({ request }) => {
	const key = crypto.randomUUID()
	const objectKey = `anonymous/${key}.${IMG_FORMAT}`

	const storage = GCSStorageService.getInstance()
	const { signedUrl, publicUrl } = await storage.createPresignedPutUrl(
		BUCKET_NAME,
		objectKey,
		URL_EXPIRES_IN,
	)

	return new Response(
		JSON.stringify({ signedUrl, publicUrl }),
		{ status: 200, headers: { 'Content-Type': 'application/json' } },
	)
}
