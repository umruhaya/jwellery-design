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
} from '~/store'
import { IMG_FORMAT } from 'astro:env/client'
import { updateGallery, upsertChat } from '~/services/database'
import type { ResponseTextDeltaEvent } from 'openai/lib/responses/EventTypes.mjs'
import type { ResponseTextDoneEvent } from 'openai/resources/responses/responses.mjs'

const ChatRequest = z.object({
	chatId: z.string().uuid(),
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
		const { chatId, locale, messages } = parsed.data

		await upsertChat(chatId, messages)

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
			// reasoning: {
			// 	effort: 'low',
			// },
			input: [
				{ role: 'system', content: formattedSystemPrompt },
				...messages,
			],
			tools: [
				{ type: 'image_generation', partial_images: 2, output_format: IMG_FORMAT, output_compression: 85 },
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
							firstName: { type: 'string' },
							lastName: { type: 'string' },
							email: { type: 'string' },
							phone: { type: 'string' },
							city: { type: 'string' },
							country: { type: 'string' },
							prompt: {
								type: 'string',
								description: 'Prompt used to generate the last image. aka specifications.',
							},
						},
						required: ['subject', 'firstName', 'lastName', 'email', 'phone', 'city', 'country', 'prompt'],
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
					if (process.env.NODE_ENV !== 'production' && event.type !== 'response.output_text.delta') {
						console.log(event)
					}
					// Prevent Tool Call delta sending to the client
					if (event.type === 'response.function_call_arguments.delta') {
						continue
					}
					if (event.type === 'response.function_call_arguments.done') {
						const args = JSON.parse(event.arguments)

						if (latestImageUrl) {
							sendAlert({ ...args, imageUrls: [latestImageUrl] })
								.then(() => {
									return updateGallery({
										chatId,
										imageUrl: latestImageUrl,
										...args,
									})
								})
								.then(() => {
									const textEvent: ResponseTextDoneEvent = {
										item_id: '',
										type: 'response.output_text.done',
										output_index: messages.length - 1,
										content_index: 0,
										sequence_number: 0,
										text: 'Thank you',
									}
									controller.enqueue(encoder.encode(`data: ${JSON.stringify(textEvent)}\n\n`))
								})
								.catch(console.error)
						}
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
