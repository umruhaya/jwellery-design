import type { APIRoute } from 'astro'
import { DASHBOARD_AUTH } from 'astro:env/server'
import { DatabaseService } from '~/services/database'

export const GET: APIRoute = async ({ request }) => {
	// Basic auth check (same as designs.ts)
	const authHeader = request.headers.get('Authorization')
	if (!isValidAuth(authHeader)) {
		return new Response('Unauthorized', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Admin Area"',
			},
		})
	}

	try {
		const db = await DatabaseService.get()
		const gallery = await db.getGallery()
		return new Response(JSON.stringify(gallery), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to fetch gallery' }), {
			status: 500,
		})
	}
}

export const POST: APIRoute = async ({ request }) => {
	// Basic auth check (same as above)
	const authHeader = request.headers.get('Authorization')
	if (!isValidAuth(authHeader)) {
		return new Response('Unauthorized', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Admin Area"',
			},
		})
	}

	try {
		const { designId, rank } = await request.json()
		const db = await DatabaseService.get()
		const id = await db.addToGallery({ designId, rank })
		return new Response(JSON.stringify({ id }), { status: 200 })
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to add to gallery' }), {
			status: 500,
		})
	}
}

export const PUT: APIRoute = async ({ request }) => {
	// Basic auth check (same as above)
	const authHeader = request.headers.get('Authorization')
	if (!isValidAuth(authHeader)) {
		return new Response('Unauthorized', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Admin Area"',
			},
		})
	}

	try {
		const { id, newRank } = await request.json()
		const db = await DatabaseService.get()
		await db.updateGalleryRank(id, newRank)
		return new Response(JSON.stringify({ success: true }), { status: 200 })
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to update rank' }), {
			status: 500,
		})
	}
}

function isValidAuth(authHeader: string | null): boolean {
	if (!authHeader) return false

	const base64Credentials = authHeader.split(' ')[1]
	const credentials = atob(base64Credentials)
	const [username, password] = credentials.split(':')

	return username === 'admin' && password === DASHBOARD_AUTH
}
