// db-service.ts

import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/node'
import { chat, gallery } from '~/models'
import { NODE_ENV } from 'astro:env/server'
import type { Chat } from '~/store'

// in production, use the file database
// in development, use the remote database using the tunnel
const databaseUrl = NODE_ENV === 'production' ? 'file:.db/main.db' : 'http://127.0.0.1:8900'

// Initialize client
const client = createClient({
	url: databaseUrl,
})

export const db = drizzle(client)

export const upsertChat = async (chatId: string, messages: Chat['messages']) => {
	await db.insert(chat).values({
		id: chatId,
		messages: JSON.stringify(messages),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	})
		.onConflictDoUpdate({
			target: chat.id,
			set: {
				messages: JSON.stringify(messages),
				updatedAt: new Date().toISOString(),
			},
		})
}

export const updateGallery = async (
	args: {
		chatId: string
		prompt: string
		imageUrl: string
		firstName: string
		lastName: string
		email: string
		phone: string
		city: string
		country: string
	},
) => {
	return await db.insert(gallery).values({ id: crypto.randomUUID(), ...args })
}
