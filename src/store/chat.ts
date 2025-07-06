import { create } from 'zustand'
import { z } from 'astro/zod'
import { produce, type WritableDraft } from 'immer'

export const userMessageSchema = z.object({
	// id: z.string(),
	role: z.literal('user'),
	content: z.array(z.union([
		z.object({
			type: z.literal('input_text'),
			text: z.string(),
		}),
		z.object({
			type: z.literal('input_image'),
			image_url: z.string(),
			// detail: z.enum(['low', 'high', 'auto']),
		}),
	])),
})

export const assistantMessageSchema = z.object({
	// id: z.string(),
	role: z.literal('assistant'),
	content: z.array(z.union([
		z.object({
			type: z.literal('output_text'),
			text: z.string(),
		}),
		z.object({
			type: z.literal('input_image'),
			image_url: z.string(),
			// detail: z.enum(['low', 'high', 'auto']),
		}),
	])),
})

export const chatSchema = z.object({
	lastUpdatedAt: z.date(),
	messages: z.array(z.union([userMessageSchema, assistantMessageSchema])),
})

export type Chat = z.infer<typeof chatSchema>
export type UserMessage = z.infer<typeof userMessageSchema>
export type AssistantMessage = z.infer<typeof assistantMessageSchema>
export type Message = Chat['messages'][0]

type ChatState = {
	messages: Message[]
	getMessages: () => Message[]
	addMessage: (msg: Message) => void
	updateLastMessage: (update: ((prev: Message) => Message) | Message) => void
	clear: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
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
	clear: () => set({ messages: [] }),
}))

export const setChatStore = (callback: (draft: WritableDraft<ChatState>) => void) => {
	useChatStore.setState((state) =>
		produce(state, (draft) => {
			callback(draft)
		})
	)
}
