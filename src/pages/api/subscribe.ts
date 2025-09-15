import type { APIRoute } from 'astro'
import { sendEmailLead } from '~/services/email'

export const POST: APIRoute = async ({ request }) => {
	try {
		const { email } = await request.json()
		if (!email || typeof email !== 'string' || !email.includes('@')) {
			return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 })
		}
		// TODO: Store email in database or send to email marketing service
		console.log('New subscriber:', email)
		await sendEmailLead(email)
		return new Response(JSON.stringify({ success: true }), { status: 200 })
	} catch (err) {
		console.error('FROM /api/subscribe', { err })
		return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 })
	}
}
