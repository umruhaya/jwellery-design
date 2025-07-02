import type { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs'
import { useState } from 'react'
import EventSource, { type EventSourceOptions } from 'react-native-sse'
import { type Message, useChatStore } from '~/store/chat'

const DEFAULT_SSE_OPTIONS: EventSourceOptions = {
	method: 'POST',
	timeout: 0,
	timeoutBeforeConnection: 500,
	withCredentials: false,
	headers: { 'Content-Type': 'application/json' },
	body: undefined,
	debug: false,
	pollingInterval: 0, // disable reconnections // other wise client would span the API
}

type SSEAssistantWidgetProps = {
	locale: string
}

const parseEvent = (data: string) => {
	try {
		return JSON.parse(data) as ResponseStreamEvent
	} catch (e) {
		console.error(e)
		return null
	}
}

function makeBase64Image(format: 'webp' | 'jpeg' | 'png', base64: string, alt: string = ''): string {
	const mime: Record<'webp' | 'jpeg' | 'png', string> = {
		webp: 'image/webp',
		jpeg: 'image/jpeg',
		png: 'image/png',
	}

	return `data:${mime[format]};base64,${base64}`
}

export const AssistantWidget = ({ locale }: SSEAssistantWidgetProps) => {
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)
	const { messages, addMessage, updateLastMessage, setMessageLoading } = useChatStore()

	const handleSend = () => {
		if (!input.trim() || loading) return
		setLoading(true)
		// add user message
		const userId = `u-${Date.now()}`
		const userMsg: Message = { id: userId, role: 'user', type: 'text', content: input }
		addMessage(userMsg)

		// // add assistant placeholder
		// const assistantId = `a-${Date.now()}`
		// addMessage({ id: assistantId, role: 'assistant', type: 'text', content: '', loading: true })

		// prepare SSE options with body
		const options: EventSourceOptions = {
			...DEFAULT_SSE_OPTIONS,
			body: JSON.stringify({ messages: [userMsg] }),
		}

		const sse = new EventSource('/api/chat', options)

		sse.addEventListener('open', () => {
			console.debug('SSE connection opened')
		})

		sse.addEventListener('message', (data) => {
			console.log(data)

			if (data.data === '[DONE]') {
				setLoading(false)
				return
			}

			const event = parseEvent(data.data || '')
			if (!event) {
				return
			}

			switch (event.type) {
				case 'response.output_item.added': {
					const id = event.sequence_number.toString()
					addMessage({ id, role: 'assistant', type: 'text', content: '', loading: true })
					break
				}
				case 'response.output_text.delta': {
					updateLastMessage(msg => ({ ...msg, content: msg.content + event.delta }))
					break
				}
				case 'response.output_text.done': {
					updateLastMessage(msg => ({ ...msg, loading: false }))
					break
				}
				case 'response.image_generation_call.generating': {
					const id = event.sequence_number.toString()
					addMessage({ id, role: 'assistant', type: 'image', content: '', loading: true })
					break
				}
				case 'response.image_generation_call.partial_image': {
					updateLastMessage(msg => ({ ...msg, content: event.partial_image_b64 }))
					break
				}
				case 'response.image_generation_call.completed': {
					updateLastMessage(msg => ({ ...msg, loading: false }))
					break
				}
			}
		})

		sse.addEventListener('close', (data) => {
			setLoading(false)
		})

		setInput('')
	}

	return (
		<div className='w-full max-w-md bg-white/90 rounded-xl shadow-lg p-4 flex flex-col'>
			<div className='h-64 overflow-y-auto mb-4 space-y-2'>
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						<div
							className={`p-2 rounded-lg ${
								msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'
							} ${msg.loading ? 'opacity-50 animate-pulse' : ''}`}
						>
							{msg.type === 'text' ? <div>{msg.content}</div> : null}
							{msg.type === 'image'
								? (
									<img
										src={msg.content === ''
											? 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
											: makeBase64Image('png', msg.content)}
										alt='assistant'
										className='max-w-xs rounded'
									/>
								)
								: null}
						</div>
					</div>
				))}
			</div>
			<div className='flex space-x-2'>
				<input
					type='text'
					value={input}
					onChange={(e) => setInput(e.currentTarget.value)}
					placeholder='Describe your dream jewelry...'
					className='flex-1 px-3 py-2 border rounded focus:outline-none'
					disabled={loading}
				/>
				<button
					type='button'
					onClick={handleSend}
					className='px-4 py-2 bg-primary text-white rounded disabled:opacity-50 flex items-center justify-center'
					disabled={loading}
				>
					{loading && (
						<svg
							className='animate-spin h-5 w-5 mr-2 text-white'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
						>
							<title>Send</title>
							<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'>
							</circle>
							<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'>
							</path>
						</svg>
					)}
					Send
				</button>
			</div>
		</div>
	)
}
