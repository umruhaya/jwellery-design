import type { ResponseStreamEvent } from 'openai/resources/responses/responses.mjs'
import React, { useMemo, useRef, useState } from 'react'
import EventSource, { type EventSourceOptions } from 'react-native-sse'
import {
	type ImageGenerationMessage,
	type InputMessage,
	type OutputMessage,
	setChatStore,
	useChatStore,
} from '~/store/chat'
import { MarkdownRenderer } from '~/components/markdown-renderer'
import { getTranslationForLocale } from '~/i18n/ui'
import { ImageIcon, XIcon } from 'lucide-react'
import { downscaleBase64Image, makeBase64Image } from '~/lib/image-utils'

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

const MAX_ALLOWED_IMAGES = 2

export const AssistantWidget = ({ locale }: SSEAssistantWidgetProps) => {
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)
	const [attachedImages, setAttachedImages] = useState<{ url: string; file: File }[]>([])
	const [warning, setWarning] = useState<string | null>(null)
	const { messages, getMessages, addMessage, updateLastMessage } = useChatStore()
	const imageRef = useRef<HTMLInputElement>(null)

	const ui = useMemo(() => getTranslationForLocale(locale), [locale, getTranslationForLocale])

	const disableSendMessage = !input.trim() || loading

	const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files) return

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
		const newFiles = Array.from(files)
		const totalImages = attachedImages.length + newFiles.length

		if (totalImages > MAX_ALLOWED_IMAGES) {
			setWarning(`You can attach up to ${MAX_ALLOWED_IMAGES} images only.`)
			return
		} else if (newFiles.some(file => allowedTypes.includes(file.type) === false)) {
			setWarning('Only JPG, PNG, and WEBP images are allowed.')
			return
		} else {
			setWarning(null)
		}

		setWarning(null)
		Promise.all(
			newFiles.map(file => {
				return new Promise<{ url: string; file: File }>((resolve, reject) => {
					const reader = new FileReader()
					reader.onload = () => resolve({ url: reader.result as string, file })
					reader.onerror = reject
					reader.readAsDataURL(file)
				})
			}),
		).then(images => {
			setAttachedImages(prev => [...prev, ...images])
		})
	}

	const handleRemoveImage = (idx: number) => {
		setAttachedImages(prev => prev.filter((_, i) => i !== idx))
	}

	const handleSend = async () => {
		if (disableSendMessage) return
		setLoading(true)

		const imagePart = await Promise.all(
			attachedImages.map(async img => {
				const downsizedUrl = img.url !== '' ? await downscaleBase64Image(img.url) : ''
				return ({
					type: 'input_image' as const,
					detail: 'auto' as const,
					image_url: downsizedUrl,
				})
			}),
		)
		// add user message
		addMessage({
			type: 'message',
			role: 'user',
			status: 'completed',
			content: [
				...imagePart,
				{ type: 'input_text', text: input },
			],
		})

		setAttachedImages([])

		const OUTPUT_IDX_OFFSET = getMessages().length

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
			if (data.data === '[DONE]') {
				setLoading(false)
				return
			}

			const event = parseEvent(data.data || '')
			console.debug(event)
			if (!event) {
				return
			}

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
							message.content[contentIdx].text += event.delta
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
							result: makeBase64Image('webp', event.partial_image_b64),
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
					setLoading(false)
					break
				}
				case 'response.failed': {
					alert(event.response.error?.message)
					break
				}
				case 'error': {
					alert(`${event.code} ${event.message} ${event.type}`)
					break
				}
			}
		})

		sse.addEventListener('close', (data) => {
			setLoading(false)
		})

		setInput('')
		setAttachedImages([])
	}

	return (
		<div className='w-full h-[28rem] md:h-[36rem] max-w-md lg:max-w-lg xl:max-w-xl bg-white/90 rounded-xl shadow-lg p-4 flex flex-col'>
			<div className='overflow-y-auto mb-4 h-full space-y-2'>
				{messages.length === 0
					? (
						<div className='flex flex-col justify-center gap-4 items-center h-full'>
							<div className='w-16 h-16 bg-primary rounded-full flex items-center text-center justify-center text-white font-bold'>
								<span className='text-2xl'>AI</span>
							</div>
							<span className='font-[playfair] text-xl font-semibold text-gray-800'>
								CYO Atelier Assistant
							</span>
							<span className='mx-4 md:mx-20 font-[playfair] text-center text-gray-600'>
								{ui['assistant.description']}
							</span>
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
				{messages.map((msg, i) => (
					<>
						{msg.type === 'message' && msg.role === 'user' && <InputMessageUI key={i} {...msg} />}
						{msg.type === 'message' && msg.role === 'assistant' && <OutputMessageUI key={i} {...msg} />}
						{msg.type === 'image_generation_call' && <ImageGenerationMessageUI key={i} {...msg} />}
					</>
				))}
			</div>
			{warning && <div className='text-red-600 text-sm mb-2'>{warning}</div>}
			{attachedImages.length > 0 && (
				<div className='flex gap-2 mb-2'>
					{attachedImages.map((img, idx) => (
						<div key={idx} className='relative'>
							<img src={img.url} alt='attachment' className='w-20 h-20 object-cover rounded' />
							<XIcon
								type='button'
								onClick={() => handleRemoveImage(idx)}
								className='absolute top-0 right-0 bg-zinc-700 p-1 m-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
							/>
						</div>
					))}
				</div>
			)}
			<div className='flex flex-wrap items-stretch gap-2'>
				<label className='p-2 bg-gray-200 rounded-full cursor-pointer flex items-center justify-center'>
					<input
						ref={imageRef}
						type='file'
						accept='image/jpeg,image/png,image/webp'
						multiple
						style={{ display: 'none' }}
						onChange={handleImageAttach}
						disabled={loading || attachedImages.length >= 2}
					/>
					<ImageIcon onClick={() => imageRef.current?.click()} />
				</label>
				<input
					type='text'
					value={input}
					onChange={(e) => setInput(e.currentTarget.value)}
					placeholder={ui['assistant.input.placeholder']}
					className='flex-1 min-w-0 px-3 py-2 border rounded-2xl focus:outline-none'
					disabled={loading}
				/>
				<button
					type='button'
					onClick={handleSend}
					className='p-2 bg-primary text-white rounded-full disabled:opacity-50 flex items-center justify-center w-12 h-12 min-w-[3rem] min-h-[3rem]'
					disabled={disableSendMessage}
				>
					{loading
						? (
							<svg
								className='animate-spin h-5 w-5 text-white'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
							>
								<title>{ui['assistant.sendButton']}</title>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
								>
								</circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
								>
								</path>
							</svg>
						)
						: (
							<img
								src='/icons/message-send.svg'
								className='w-6 h-6 object-contain'
								alt={ui['assistant.sendButton']}
							/>
						)}
				</button>
			</div>
		</div>
	)
}

const InputMessageUI = ({ content }: InputMessage) => {
	return (
		<div className='flex justify-end ml-8'>
			<div className='flex flex-col gap-1'>
				<div className='flex justify-end'>
					<div className='flex flex-col gap-2'>
						{content.map(part =>
							part.type === 'input_image' && (
								<img
									src={part.image_url === ''
										? 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
										: part.image_url}
									alt='user-image'
									className='w-[16rem] rounded'
								/>
							)
						)}
					</div>
				</div>
				{content.map(part =>
					part.type === 'input_text' &&
					(
						<div className='flex justify-end'>
							<div className='p-2 rounded-2xl bg-primary text-white flex'>{part.text}</div>
						</div>
					)
				)}
			</div>
		</div>
	)
}

const OutputMessageUI = ({ id, status, content }: OutputMessage) => {
	return (
		<div className='flex justify-start mr-8' key={id}>
			<div className='px-2 py-1 rounded-2xl bg-gray-100 text-gray-800'>
				{content.map((part, i) => <MarkdownRenderer key={i} text={part.text} />)}
			</div>
		</div>
	)
}

const ImageGenerationMessageUI = ({ id, result, status }: ImageGenerationMessage) => {
	return (
		<div className='flex justify-start' id={id}>
			<div className='px-2 py-1 rounded-2xl bg-gray-100 text-gray-800'>
				<img
					src={result === ''
						? 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
						: result}
					alt='Generated Design Image'
					className={`w-[16rem] rounded ${status !== 'completed' ? 'animate-pulse' : ''}`}
				/>
			</div>
		</div>
	)
}
