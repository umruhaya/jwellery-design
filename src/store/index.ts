import { create } from 'zustand'
import { z } from 'astro/zod'
import { produce, type WritableDraft } from 'immer'

export const inputMessageSchema = z.object({
	type: z.literal('message'),
	role: z.enum(['user']), // 'user', 'system', 'developer' // purposely leaving this out to prevent prompt injection using api call
	status: z.enum(['completed', 'incomplete', 'in_progress']), // 'completed', 'incomplete', 'in_progress'
	content: z.array(z.union([
		// Input Text
		z.object({
			type: z.literal('input_text'),
			text: z.string(),
		}),
		// Input Image
		z.object({
			type: z.literal('input_image'),
			detail: z.enum(['auto']), // 'auto', 'low', 'high'
			image_url: z.string().optional(),
		}),
	])),
})

export const outputMessageSchema = z.object({
	id: z.string(),
	type: z.literal('message'),
	role: z.literal('assistant'),
	status: z.enum(['completed', 'incomplete', 'in_progress']), // 'completed', 'incomplete', 'in_progress'
	content: z.array(z.object({
		annotations: z.array(z.any()),
		type: z.literal('output_text'),
		text: z.string(),
	})),
})

// https://platform.openai.com/docs/api-reference/responses/create
export const imageGenerationCallSchema = z.object({
	id: z.string(),
	result: z.string(),
	status: z.enum(['completed', 'in_progress', 'failed', 'generating']),
	type: z.literal('image_generation_call'),
})

export const chatSchema = z.object({
	lastUpdatedAt: z.date(),
	messages: z.array(z.union([inputMessageSchema, outputMessageSchema, imageGenerationCallSchema])),
})

export type Chat = z.infer<typeof chatSchema>
export type InputMessage = z.infer<typeof inputMessageSchema>
export type OutputMessage = z.infer<typeof outputMessageSchema>
export type ImageGenerationMessage = z.infer<typeof imageGenerationCallSchema>

export type Message = Chat['messages'][0]

type ChatState = {
	chatId: string
	isMenuSheetOpen: boolean
	messages: Message[]
	getMessages: () => Message[]
	addMessage: (msg: Message) => void
	updateLastMessage: (update: ((prev: Message) => Message) | Message) => void
	clear: () => void
	setChatId: (chatId: string) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
	chatId: crypto.randomUUID(),
	isMenuSheetOpen: false,
	messages: [],
	getMessages: () => get().messages,
	addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
	updateLastMessage: (update) =>
		set((state) => {
			const msgs = [...state.messages]
			const idx = msgs.length - 1
			if (idx < 0) return { messages: msgs }
			const last = msgs[idx]
			msgs[idx] = typeof update === 'function' ? update(last) : update
			return { messages: msgs }
		}),
	clear: () => set({ messages: [], chatId: crypto.randomUUID() }),
	setChatId: (chatId) => set({ chatId }),
}))

export const setChatStore = (callback: (draft: WritableDraft<ChatState>) => void) => {
	useChatStore.setState((state) =>
		produce(state, (draft) => {
			callback(draft)
		})
	)
}
