import type { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs'
import { useMemo, useState } from 'react'
import EventSource, { type EventSourceOptions } from 'react-native-sse'
import { type Message, useChatStore } from '~/store/chat'
import { MarkdownRenderer } from '~/components/markdown-renderer'
import { getTranslationForLocale } from '~/i18n/ui'

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
	const { messages, getMessages, addMessage, updateLastMessage, setMessageLoading } = useChatStore()

	const ui = useMemo(() => getTranslationForLocale(locale), [locale, getTranslationForLocale])

	const handleSend = () => {
		if (!input.trim() || loading) return
		setLoading(true)
		// add user message
		const userId = `u-${Date.now()}`
		const userMsg: Message = { id: userId, role: 'user', type: 'text', content: input }
		addMessage(userMsg)

		// prepare SSE options with body
		const options: EventSourceOptions = {
			...DEFAULT_SSE_OPTIONS,
			body: JSON.stringify({ messages: getMessages(), locale }),
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
		<div className='w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white/90 rounded-xl shadow-lg p-4 flex flex-col'>
			<div className='h-64 overflow-y-auto mb-4 space-y-2'>
				{messages.length === 0
					? (
						<div className='flex flex-col justify-center gap-4 items-center h-full'>
							<div className='w-16 h-16 bg-primary rounded-full flex items-center text-center justify-center text-white font-bold'>
								<span className='text-2xl'>AI</span>
							</div>
							<span className='font-semibold text-gray-800'>CYO Atelier Assistant</span>
						</div>
					)
					: (
						<div className='flex items-center mb-3'>
							<div className='w-8 h-8 bg-primary rounded-full flex items-center text-center justify-center text-white font-bold mr-3'>
								<span>AI</span>
							</div>
							<span className='font-semibold text-gray-800'>CYO Atelier Assistant</span>
						</div>
					)}
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						<div
							className={`p-2 rounded-lg ${msg.loading ? 'animate-pulse' : ''}`}
						>
							{msg.type === 'text'
								? msg.role === 'user'
									? <div className='p-2 rounded-lg bg-primary text-white'>{msg.content}</div>
									: <MarkdownRenderer text={msg.content} />
								: null}
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
					placeholder={ui['assistant.input.placeholder']}
					className='flex-1 px-3 py-2 border rounded-2xl focus:outline-none'
					disabled={loading}
				/>
				<button
					type='button'
					onClick={handleSend}
					className='p-2 bg-primary text-white rounded-full disabled:opacity-50 flex items-center justify-center'
					disabled={loading || input.length === 0}
				>
					{loading && (
						<svg
							className='animate-spin h-5 w-5 mr-2 text-white'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
						>
							<title>{ui['assistant.sendButton']}</title>
							<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'>
							</circle>
							<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'>
							</path>
						</svg>
					)}
					<img src='/icons/message-send.svg' className='relative top-0.5' alt={ui['assistant.sendButton']} />
				</button>
			</div>
		</div>
	)
}
