import type { APIRoute } from 'astro'
import { openai } from '~/services/openai'
import { z } from 'astro/zod'
import { getLanguageFromLocale } from '~/i18n/ui'
import { SYSTEM_PROMPT } from '~/lib/assistant-prompt'
import { sendAlert } from '~/services/email'
import {
	imageGenerationCallSchema,
	type ImageGenerationMessage,
	inputMessageSchema,
	outputMessageSchema,
} from '~/store/chat'
import { IMG_FORMAT } from 'astro:env/client'
import { DatabaseService } from '~/services/database'

const ChatRequest = z.object({
	locale: z.string(),
	messages: z.array(z.union([inputMessageSchema, outputMessageSchema, imageGenerationCallSchema])),
})

export const POST: APIRoute = async (ctx) => {
	const { request } = ctx
	try {
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

		// Find the latest completed image generation result
		const latestImage = [...messages]
			.reverse()
			.find((msg): msg is ImageGenerationMessage =>
				msg.type === 'image_generation_call' && msg.status === 'completed'
			)
		const latestImageUrl = latestImage?.result

		const stream = await openai.responses.create({
			model: 'gpt-4.1',
			stream: true,
			input: [
				{ role: 'system', content: formattedSystemPrompt },
				...messages,
			],
			tools: [
				{ type: 'image_generation', partial_images: 2, output_format: IMG_FORMAT, output_compression: 80 },
				{
					type: 'function',
					name: 'send_email',
					strict: true,
					description:
						'This send an email to our team with a subject, message, and optionally include the latest generated image. Only once the customer has clearly confirmed the design, it includes any important details of the design and personal information of the user.',
					parameters: {
						type: 'object',
						properties: {
							subject: {
								type: 'string',
								description: 'Email subject line.',
							},
							body: {
								type: 'string',
								description: 'Body of the email message.',
							},
							includeLatestImage: {
								type: 'boolean',
								description: 'Whether to include the latest generated image in the email.',
								default: false,
							},
						},
						required: ['subject', 'body', 'includeLatestImage'],
						additionalProperties: false,
					},
				},
			],
		})

		const encoder = new TextEncoder()
		// Build ReadableStream for SSE
		const sseStream = new ReadableStream({
			async start(controller) {
				for await (const event of stream) {
					process.env.NODE_ENV !== 'production' && console.log(event)
					// Prevent Tool Call leaking to the client
					if (event.type === 'response.function_call_arguments.delta') {
						continue
					}
					if (event.type === 'response.function_call_arguments.done') {
						const args = JSON.parse(event.arguments)

						if (args.includeLatestImage && latestImageUrl) {
							const db = await DatabaseService.get()
							db.addFinalDesign({
								url: latestImageUrl,
								customerName: args.customerName,
								specifications: args.specifications,
							})
							sendAlert({ ...args, imageUrls: [latestImageUrl] })
						}

						continue
					}
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
	} catch (e) {
		console.error(e)
		return new Response('Internal Server Error', { status: 500 })
	}
}
