import { create } from 'zustand'

export type Message = {
	id: string
	role: 'user' | 'assistant'
	type: 'text' | 'image'
	content: string
	loading?: boolean
}

type ChatState = {
	messages: Message[]
	addMessage: (msg: Message) => void
	updateLastMessage: (update: ((prev: Message) => Message) | Message) => void
	setMessageLoading: (id: string, loading: boolean) => void
	clear: () => void
}

export const useChatStore = create<ChatState>((set) => ({
	messages: [],
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
	setMessageLoading: (id, loading) =>
		set((state) => ({
			messages: state.messages.map((m) => m.id === id ? { ...m, loading } : m),
		})),
	clear: () => set({ messages: [] }),
}))
