import { useMutation } from '@tanstack/react-query'
import { Stream } from 'openai/streaming'
import type { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs'
import { setChatStore, useChatStore } from '~/store/chat'
import { queryClient } from '~/lib/query-client'

interface UseAssistantStreamParams {
	messages: any[]
	locale: string
	abortController: AbortController
}

const DELTA_TEXT_BUFFER_SIZE = 10

export function useAssistantStream() {
	const { getMessages } = useChatStore()

	return useMutation({
		mutationKey: ['assistant-stream'],
		retry: false,
		mutationFn: async ({ messages, locale, abortController }: UseAssistantStreamParams) => {
			const timeout = 10000 // 10 second timeout
			let receivedToken = false
			const OUTPUT_IDX_OFFSET = getMessages().length

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive',
				},
				body: JSON.stringify({ messages, locale }),
				signal: abortController.signal,
			})

			if (response.status === 429) {
				throw new Error('Rate limit exceeded. Please try again later.')
			}

			if (response.status > 300) {
				throw new Error(`${response.status}: ${response.statusText}`)
			}

			const timeoutId = setTimeout(() => {
				if (!receivedToken) {
					abortController.abort()
					clearTimeout(timeoutId)
					throw new Error('Timeout: No response received')
				}
			}, timeout)

			const stream = Stream.fromSSEResponse<ResponseStreamEvent>(response, abortController)

			const deltaTextBuffer = {
				buffer: '',
				size: 0,
			}

			for await (const event of stream) {
				if (!event) continue

				receivedToken = true

				// Handle [DONE] message
				if (typeof event === 'string' && event === '[DONE]') {
					break
				}

				// Type guard to ensure we have a proper event object
				if (typeof event === 'object' && 'type' in event) {
					switch (event.type) {
						case 'response.output_text.delta': {
							setChatStore(draft => {
								const outputIdx = event.output_index + OUTPUT_IDX_OFFSET
								const contentIdx = event.content_index
								if (draft.messages[outputIdx] === undefined) {
									draft.messages[outputIdx] = {
										type: 'message',
										role: 'assistant',
										id: event.item_id,
										status: 'in_progress',
										content: [{ type: 'output_text', annotations: [], text: '' }],
									}
								}
								const message = draft.messages[outputIdx]
								if (
									message.type === 'message' && message.role === 'assistant' &&
									message.content[contentIdx]?.type === 'output_text'
								) {
									deltaTextBuffer.buffer += event.delta
									deltaTextBuffer.size += 1

									// update state if buffer size is greater than DELTA_TEXT_BUFFER_SIZE
									if (deltaTextBuffer.size > DELTA_TEXT_BUFFER_SIZE) {
										// flush the buffer and add the delta to the message
										message.content[contentIdx].text += deltaTextBuffer.buffer

										// reset the buffer
										deltaTextBuffer.buffer = ''
										deltaTextBuffer.size = 0
									}
								}
							})
							break
						}
						case 'response.image_generation_call.generating': {
							setChatStore(draft => {
								const outputIdx = event.output_index + OUTPUT_IDX_OFFSET
								draft.messages[outputIdx] = {
									type: 'image_generation_call',
									id: event.item_id,
									status: 'generating',
									result: '',
								}
							})
							break
						}
						case 'response.image_generation_call.partial_image': {
							setChatStore(draft => {
								const outputIdx = event.output_index + OUTPUT_IDX_OFFSET
								draft.messages[outputIdx] = {
									type: 'image_generation_call',
									id: event.item_id,
									status: 'in_progress',
									result: `data:image/jpeg;base64,${event.partial_image_b64}`,
								}
							})
							break
						}
						case 'response.image_generation_call.completed': {
							setChatStore(draft => {
								const outputIdx = event.output_index + OUTPUT_IDX_OFFSET
								if (draft.messages[outputIdx] !== undefined) {
									draft.messages[outputIdx].status = 'completed'
								}
							})
							break
						}
						case 'response.completed': {
							// Stream completed successfully
							break
						}
						case 'response.failed': {
							throw new Error(event.response.error?.message || 'Response failed')
						}
						case 'error': {
							throw new Error(`${event.code} ${event.message}`)
						}
					}
				}
			}

			clearTimeout(timeoutId)
			return { success: true }
		},
		onError: (error) => {
			console.error('Assistant stream error:', error)
			// You can add toast notifications or other error handling here
			// toast.error(error.message || 'An error occurred while processing your request')
		},
	}, queryClient)
}
