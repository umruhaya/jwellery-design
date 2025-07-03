import type { APIRoute } from 'astro'
import { openai } from '~/services/openai'
import { z } from 'astro/zod'

const ChatRequest = z.object({
	locale: z.string(),
	messages: z.array(
		z.object({ role: z.enum(['user', 'assistant']), content: z.string() }),
	),
})

export const POST: APIRoute = async ({ request }) => {
	const payload = await request.json()
	const parsed = ChatRequest.safeParse(payload)
	if (!parsed.success) {
		return new Response(JSON.stringify({ errors: parsed.error.format() }), {
			status: 422,
			headers: { 'Content-Type': 'application/json' },
		})
	}
	const { messages } = parsed.data
	const stream = await openai.responses.create({
		model: 'gpt-4.1',
		stream: true,
		input: messages,
		tools: [{ type: 'image_generation', partial_images: 2, output_format: 'jpeg', output_compression: 50 }],
	})

	const encoder = new TextEncoder()
	// Build ReadableStream for SSE
	const sseStream = new ReadableStream({
		async start(controller) {
			for await (const event of stream) {
				process.env.NODE_ENV !== 'production' && console.log(event)
				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
				)
			}
			controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
			controller.close()
		},
	})

	return new Response(sseStream, {
		headers: {
			Connection: 'keep-alive',
			'Content-Encoding': 'none',
			'Cache-Control': 'no-cache, no-transform',
			'Content-Type': 'text/event-stream; charset=utf-8',
		},
	})
}
