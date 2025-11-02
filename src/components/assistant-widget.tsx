import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { setChatStore, useChatStore } from '~/store'
import { getTranslationForLocale } from '~/i18n/ui'
import { ImageIcon, MicIcon, XIcon } from 'lucide-react'
import { downscaleBase64Image, makeBase64Image } from '~/lib/image-utils'
import { AudioRecorder } from './audio-recorder'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '~/lib/query-client'
import { Spinner } from './spinner'
import { ImageGenerationMessageUI, InputMessageUI, OutputMessageUI } from '~/components/messages-ui'
import { useRef as useReactRef } from 'react'
import { useAssistantStream } from '~/hooks/use-assistant-stream'
import { UAParser } from 'ua-parser-js'

type AssistantWidgetProps = {
	locale: string
}

const MAX_ALLOWED_IMAGES = 2

// Utility: Detect if a string is base64 (data:) or a URL (http)
function isBase64Image(str: string | undefined): boolean {
	return !!str && str.startsWith('data:')
}

// Utility: Convert base64 to Blob
function base64ToBlob(base64: string): Blob {
	const arr = base64.split(',')
	const match = arr[0].match(/:(.*?);/)
	if (!match) {
		throw new Error('Invalid base64 image: cannot determine mime type')
	}
	const mime = match[1]
	const bstr = atob(arr[1])
	let n = bstr.length
	const u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new Blob([u8arr], { type: mime })
}

const parser = new UAParser()
const deviceType = parser.getDevice().type
// Check if it's mobile or tablet
const isMobileOrTablet = deviceType === 'mobile' || deviceType === 'tablet'

// React Query mutation for uploading base64 image to GCS and returning public URL
const useImageUploadMutation = () =>
	useMutation({
		mutationFn: async (base64: string) => {
			// 1. Get signed URL
			const res = await fetch('/api/create-signed-url', { method: 'POST' })
			if (!res.ok) throw new Error('Failed to get signed URL')
			const { signedUrl, publicUrl } = await res.json()
			// 2. Convert base64 to Blob
			const blob = base64ToBlob(base64)
			// 3. Upload to signed URL
			const uploadRes = await fetch(signedUrl, {
				method: 'PUT',
				body: blob,
				headers: { 'Content-Type': 'application/octet-stream' },
			})
			if (!uploadRes.ok) throw new Error('Failed to upload image')
			// 4. Return public URL
			return publicUrl
		},
	}, queryClient)

export const AssistantWidget = ({ locale }: AssistantWidgetProps) => {
	const [input, setInput] = useState('')
	const [attachedImages, setAttachedImages] = useState<{ url: string; file: File }[]>([])
	const [warning, setWarning] = useState<string | null>(null)
	const [isRecording, setIsRecording] = useState(false)
	const { messages, getMessages, addMessage } = useChatStore()
	const imageRef = useRef<HTMLInputElement>(null)
	const imageUploadMutation = useImageUploadMutation()
	const uploadingImagesRef = useReactRef(new Set<string>())
	const abortControllerRef = useRef<AbortController | null>(null)

	const assistantStream = useAssistantStream()

	const ui = useMemo(() => getTranslationForLocale(locale), [locale, getTranslationForLocale])

	const loading = assistantStream.isPending
	const disableSendMessage = !input.trim() || loading

	const transcribeMutation = useMutation({
		mutationFn: async (audioBlob: Blob) => {
			const formData = new FormData()
			formData.append('audio', audioBlob, 'recording.mp3')

			const response = await fetch('/api/transcribe', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error('Failed to transcribe audio')
			}

			const data = await response.json()
			return data.text
		},
		onSuccess: (text) => {
			setInput(input => `${input} ${text}`)
			setIsRecording(false)
		},
		onError: (error) => {
			console.error('Transcription error:', error)
			setWarning('Failed to transcribe audio')
			setIsRecording(false)
		},
	}, queryClient)

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

		// Cancel any existing request
		if (abortControllerRef.current) {
			abortControllerRef.current.abort()
		}

		// Create new abort controller
		abortControllerRef.current = new AbortController()

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

		// Add user message
		addMessage({
			type: 'message',
			role: 'user',
			status: 'completed',
			content: [
				...imagePart,
				{ type: 'input_text', text: input },
			],
		})

		// Clear input and images
		setInput('')
		setAttachedImages([])

		// Start the stream
		assistantStream.mutate({
			messages: getMessages(),
			locale,
			abortController: abortControllerRef.current,
		})
	}

	// Cleanup abort controller on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort()
			}
		}
	}, [])

	// Background effect: scan all messages for base64 images and upload them
	useEffect(() => {
		// do not want to mess with the chat state while loading
		if (loading) return

		// Helper to update input image URL in chat state
		function updateInputImageUrl(msgIdx: number, contentIdx: number, newUrl: string) {
			setChatStore(draft => {
				const msg = draft.messages[msgIdx]
				if (msg && msg.type === 'message' && msg.role === 'user') {
					const content = msg.content[contentIdx]
					if (content && content.type === 'input_image') {
						content.image_url = newUrl
					}
				}
			})
		}
		// Helper to update output image (image generation) result in chat state
		function updateOutputImageResult(msgIdx: number, newUrl: string) {
			setChatStore(draft => {
				const msg = draft.messages[msgIdx]
				if (msg && msg.type === 'image_generation_call') {
					msg.result = newUrl
				}
			})
		}
		// Scan all messages
		messages.forEach((msg, msgIdx) => {
			// Input images (user messages)
			if (msg.type === 'message' && msg.role === 'user') {
				msg.content.forEach((content, contentIdx) => {
					if (
						content.type === 'input_image' && isBase64Image(content.image_url) &&
						!uploadingImagesRef.current.has(content.image_url!)
					) {
						uploadingImagesRef.current.add(content.image_url!)
						imageUploadMutation.mutate(content.image_url!, {
							onSuccess: (publicUrl) => {
								updateInputImageUrl(msgIdx, contentIdx, publicUrl)
								uploadingImagesRef.current.delete(content.image_url!)
							},
							onError: () => {
								uploadingImagesRef.current.delete(content.image_url!)
							},
						})
					}
				})
			}
			// Output images (assistant image generations)
			if (
				msg.type === 'image_generation_call' && isBase64Image(msg.result) &&
				!uploadingImagesRef.current.has(msg.result)
			) {
				uploadingImagesRef.current.add(msg.result)
				imageUploadMutation.mutate(msg.result, {
					onSuccess: (publicUrl) => {
						updateOutputImageResult(msgIdx, publicUrl)
						uploadingImagesRef.current.delete(msg.result)
					},
					onError: () => {
						uploadingImagesRef.current.delete(msg.result)
					},
				})
			}
		})
	}, [messages.length, imageUploadMutation, loading])

	console.log({ messages })

	return (
		<div className='w-full max-w-[800px] h-full bg-white/90 rounded-xl shadow-lg p-4 flex flex-col'>
			<div className='overflow-y-auto mb-4 h-full space-y-2'>
				{messages.length === 0
					? (
						<div className='flex flex-col justify-center gap-4 items-center h-full'>
							<div className='w-16 h-16 bg-primary rounded-full flex items-center text-center justify-center text-white font-bold'>
								<span className='text-2xl'>AI</span>
							</div>
							<span className='font-didot text-xl font-semibold text-gray-800'>
								CYO Atelier Assistant
							</span>
							<span className='mx-4 md:mx-20 font-didot text-center text-gray-600'>
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
					<React.Fragment key={i}>
						{msg.type === 'message' && msg.role === 'user' && <InputMessageUI {...msg} />}
						{msg.type === 'message' && msg.role === 'assistant' && <OutputMessageUI {...msg} />}
						{msg.type === 'image_generation_call' && <ImageGenerationMessageUI {...msg} />}
					</React.Fragment>
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
			{isRecording
				? (
					<AudioRecorder
						onAccept={(blob) => transcribeMutation.mutate(blob)}
						onCancel={() => setIsRecording(false)}
						isLoading={transcribeMutation.isPending}
					/>
				)
				: (
					<div className='flex flex-wrap items-stretch gap-2'>
						<label className='p-2 rounded-full cursor-pointer flex items-center justify-center'>
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
						<textarea
							style={{ resize: 'none' }}
							value={input}
							rows={2}
							onChange={e => setInput(e.currentTarget.value)}
							onKeyDown={e => {
								if (isMobileOrTablet) return
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									handleSend()
								}
							}}
							placeholder={ui['assistant.input.placeholder']}
							className='flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none'
							disabled={loading}
						/>
						<button
							type='button'
							onClick={() => setIsRecording(true)}
							className='p-2 rounded-full cursor-pointer flex items-center justify-center'
							disabled={loading}
						>
							<MicIcon className='w-6 h-6' />
						</button>
						<div className='flex items-center justify-center'>
							<button
								type='button'
								onClick={handleSend}
								className='p-2 bg-primary text-white rounded-full disabled:opacity-50 flex items-center justify-center w-12 h-12 min-w-[3rem] min-h-[3rem]'
								disabled={disableSendMessage}
							>
								{loading
									? <Spinner className='w-6 h-6 text-white' />
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
				)}
		</div>
	)
}
