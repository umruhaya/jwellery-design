import type { APIRoute } from 'astro'
import { openai } from '~/services/openai'
import { z } from 'astro/zod'
import { getLanguageFromLocale } from '~/i18n/ui'
import { SYSTEM_PROMPT } from '~/lib/assistant-prompt'

const ChatRequest = z.object({
	locale: z.string(),
	messages: z.array(
		z.object({
			id: z.string(),
			type: z.enum(['text', 'image']),
			role: z.enum(['user', 'assistant']),
			content: z.string(),
		}),
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
	const { locale, messages } = parsed.data

	const formattedSystemPrompt = SYSTEM_PROMPT.replaceAll('{{ language }}', getLanguageFromLocale(locale))

	const stream = await openai.responses.create({
		model: 'gpt-4.1',
		stream: true,
		input: [
			{ role: 'system', content: formattedSystemPrompt },
			...messages.map(({ role, content, type }) => ({ role, content })),
		],
		tools: [{ type: 'image_generation', partial_images: 2, output_format: 'webp', output_compression: 80 }],
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
