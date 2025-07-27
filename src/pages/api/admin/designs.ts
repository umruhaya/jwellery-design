import type { APIRoute } from 'astro'
import { DatabaseService } from '../../../services/database'

export const GET: APIRoute = async ({ request }) => {
	// Basic auth check
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
		const designs = await db.getAllFinalDesigns()
		return new Response(JSON.stringify(designs), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to fetch designs' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}
}

function isValidAuth(authHeader: string | null): boolean {
	if (!authHeader) return false

	const base64Credentials = authHeader.split(' ')[1]
	const credentials = atob(base64Credentials)
	const [username, password] = credentials.split(':')

	// Replace these with your actual credentials
	return username === 'admin' && password === 'your-secure-password'
}
