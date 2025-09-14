import type { APIRoute } from 'astro'
import { z } from 'astro/zod'
import { db } from '~/services/database'
import { gallery } from '~/models'
import { count, desc } from 'drizzle-orm'
import { DASHBOARD_AUTH } from 'astro:env/server'

const GalleryQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
})

export const GET: APIRoute = async ({ request }) => {
	try {
		// Basic Auth Check
		const auth = request.headers.get('Authorization')

		if (!auth) {
			return new Response('Unauthorized', {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Admin Area"',
				},
			})
		}

		const base64Credentials = auth.split(' ')[1]
		const credentials = atob(base64Credentials)
		const [username, password] = credentials.split(':')

		if (username !== 'admin' || password !== DASHBOARD_AUTH) {
			return new Response('Unauthorized', {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Admin Area"',
				},
			})
		}

		const url = new URL(request.url)
		const queryParams = Object.fromEntries(url.searchParams)

		const { page, limit } = GalleryQuerySchema.parse(queryParams)
		const offset = (page - 1) * limit

		// Get total count
		const totalResult = await db.select({ count: count() }).from(gallery)
		const total = totalResult[0]?.count || 0

		// Get paginated items
		const items = await db
			.select()
			.from(gallery)
			.orderBy(desc(gallery.createdAt))
			.limit(limit)
			.offset(offset)

		const totalPages = Math.ceil(total / limit)

		return new Response(
			JSON.stringify({
				items,
				pagination: {
					page,
					limit,
					total,
					totalPages,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	} catch (error) {
		console.error('Gallery API error:', error)
		return new Response(
			JSON.stringify({ error: 'Failed to fetch gallery items' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	}
}
