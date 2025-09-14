import { sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { Chat } from '~/store'

export const chat = sqliteTable('chats', {
	id: text('id').primaryKey(),
	messages: text('messages').notNull(),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export const gallery = sqliteTable('gallery', {
	id: text('id').primaryKey(),
	chatId: text('chat_id').references(() => chat.id, { onDelete: 'set null' }),
	prompt: text('prompt').notNull(),
	imageUrl: text('image_url').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	email: text('email').notNull(),
	phone: text('phone').notNull(),
	city: text('city').notNull(),
	country: text('country').notNull(),
	updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})
