import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Define schema
export const finalDesigns = sqliteTable('final_designs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	url: text('url').notNull(),
	customerName: text('customer_name').notNull(),
	specifications: text('specifications').notNull(),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const gallery = sqliteTable('gallery', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	designId: integer('design_id').notNull(),
	rank: integer('rank').notNull(),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})
