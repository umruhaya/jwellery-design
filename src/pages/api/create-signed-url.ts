import type { APIRoute } from 'astro'
import { z } from 'astro/zod'
import { GCSStorageService } from '~/services/storage'
import { BUCKET_NAME } from 'astro:env/server'

const CreateSignedUrlRequest = z.object({
	userId: z.string().min(1),
	key: z.string().min(1),
})

const URL_EXPIRES_IN = 60 * 5 // 5 minutes

export const POST: APIRoute = async ({ request }) => {
	const payload = await request.json()
	const parsed = CreateSignedUrlRequest.safeParse(payload)
	if (!parsed.success) {
		return new Response(JSON.stringify({ errors: parsed.error.format() }), {
			status: 422,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	const { userId, key } = parsed.data
	const objectKey = `${userId}/${key}`

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
