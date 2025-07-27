// db-service.ts

import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/node'
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Define schema
const finalDesigns = sqliteTable('final_designs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	url: text('url').notNull(),
	customerName: text('customer_name').notNull(),
	specifications: text('specifications').notNull(),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

const gallery = sqliteTable('gallery', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	designId: integer('design_id').notNull(),
	rank: integer('rank').notNull(),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// Initialize client
const client = createClient({
	url: 'file:./main.db',
})

const db = drizzle(client)

// Types for our service
export interface FinalDesign {
	url: string
	customerName: string
	specifications: string
}

export interface GalleryItem {
	designId: number
	rank: number
}

/**
 * Service class for managing designs and gallery
 */
export class DatabaseService {
	dbInitialized = false
	private static instance: DatabaseService

	private constructor() {}

	// factory method
	static async get() {
		if (!DatabaseService.instance) {
			DatabaseService.instance = new DatabaseService()
		}
		if (!DatabaseService.instance.dbInitialized) {
			await DatabaseService.instance.initializeDatabase()
			DatabaseService.instance.dbInitialized = true
		}
		return DatabaseService.instance
	}

	/**
	 * Add a new final design
	 * @param design The design to add
	 * @returns The ID of the newly added design
	 */
	async addFinalDesign(design: FinalDesign): Promise<number> {
		try {
			const result = await db.insert(finalDesigns).values({
				url: design.url,
				customerName: design.customerName,
				specifications: design.specifications,
			}).returning({ id: finalDesigns.id })

			return result[0].id
		} catch (error) {
			console.error('Error adding final design:', error)
			throw new Error('Failed to add final design')
		}
	}

	/**
	 * Get all final designs
	 * @returns Array of all final designs
	 */
	async getAllFinalDesigns() {
		try {
			return await db.select().from(finalDesigns).orderBy(finalDesigns.createdAt)
		} catch (error) {
			console.error('Error fetching final designs:', error)
			throw new Error('Failed to fetch final designs')
		}
	}

	/**
	 * Get a specific final design by ID
	 * @param id The ID of the design to fetch
	 * @returns The design or null if not found
	 */
	async getFinalDesignById(id: number) {
		try {
			const results = await db.select().from(finalDesigns).where(sql`${finalDesigns.id} = ${id}`)
			return results.length > 0 ? results[0] : null
		} catch (error) {
			console.error(`Error fetching design with ID ${id}:`, error)
			throw new Error(`Failed to fetch design with ID ${id}`)
		}
	}

	/**
	 * Add a design to the gallery with a specific rank
	 * @param galleryItem The gallery item to add
	 * @returns The ID of the newly added gallery item
	 */
	async addToGallery(galleryItem: GalleryItem): Promise<number> {
		try {
			// First check if the design exists
			const design = await this.getFinalDesignById(galleryItem.designId)
			if (!design) {
				throw new Error(`Design with ID ${galleryItem.designId} not found`)
			}

			const result = await db.insert(gallery).values({
				designId: galleryItem.designId,
				rank: galleryItem.rank,
			}).returning({ id: gallery.id })

			return result[0].id
		} catch (error) {
			console.error('Error adding to gallery:', error)
			throw new Error('Failed to add to gallery')
		}
	}

	/**
	 * Update the rank of a gallery item
	 * @param id The ID of the gallery item
	 * @param newRank The new rank
	 */
	async updateGalleryRank(id: number, newRank: number): Promise<void> {
		try {
			await db.update(gallery)
				.set({ rank: newRank })
				.where(sql`${gallery.id} = ${id}`)
		} catch (error) {
			console.error(`Error updating rank for gallery item ${id}:`, error)
			throw new Error(`Failed to update rank for gallery item ${id}`)
		}
	}

	/**
	 * Remove an item from the gallery
	 * @param id The ID of the gallery item to remove
	 */
	async removeFromGallery(id: number): Promise<void> {
		try {
			await db.delete(gallery).where(sql`${gallery.id} = ${id}`)
		} catch (error) {
			console.error(`Error removing gallery item ${id}:`, error)
			throw new Error(`Failed to remove gallery item ${id}`)
		}
	}

	/**
	 * Get all gallery items ordered by rank
	 * @returns Array of gallery items with their associated design details
	 */
	async getGallery() {
		try {
			// Join gallery with finalDesigns to get complete information
			const result = await db.select({
				galleryId: gallery.id,
				rank: gallery.rank,
				designId: finalDesigns.id,
				url: finalDesigns.url,
				customerName: finalDesigns.customerName,
				specifications: finalDesigns.specifications,
				createdAt: finalDesigns.createdAt,
			})
				.from(gallery)
				.innerJoin(finalDesigns, sql`${gallery.designId} = ${finalDesigns.id}`)
				.orderBy(gallery.rank)

			return result
		} catch (error) {
			console.error('Error fetching gallery:', error)
			throw new Error('Failed to fetch gallery')
		}
	}

	/**
	 * Initialize the database by creating tables if they don't exist
	 */
	async initializeDatabase() {
		try {
			await client.execute(`
        CREATE TABLE IF NOT EXISTS final_designs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT NOT NULL,
          customer_name TEXT NOT NULL,
          specifications TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `)

			await client.execute(`
        CREATE TABLE IF NOT EXISTS gallery (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          design_id INTEGER NOT NULL,
          rank INTEGER NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `)

			console.log('Database initialized successfully')
		} catch (error) {
			console.error('Error initializing database:', error)
			throw new Error('Failed to initialize database')
		}
	}
}
