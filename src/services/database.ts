// db-service.ts

import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/node'
import { count, sql } from 'drizzle-orm'
import { finalDesigns, gallery } from '~/models'

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

	async seedTablesWithSplashUrlData() {
		try {
			// Sample data for seeding
			const sampleDesigns = [
				{
					url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
					customerName: 'Elegance Collection',
					specifications: 'Handcrafted diamond pendant with platinum chain and custom setting',
				},
				{
					url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
					customerName: 'Royal Gems',
					specifications: 'Sapphire and diamond engagement ring with vintage-inspired filigree',
				},
				{
					url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
					customerName: 'Artisan Treasures',
					specifications: 'Custom rose gold bracelet with personalized birthstone arrangement',
				},
				{
					url: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427',
					customerName: 'Heritage Designs',
					specifications: 'Family heirloom redesigned into modern earrings with original emeralds',
				},
				{
					url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d',
					customerName: 'Luxury Adornments',
					specifications: 'Statement necklace featuring ethically sourced rubies and white gold accents',
				},
			]

			// check if the table is empty
			const finalDesignsCount = await db.select({ count: count() }).from(finalDesigns)
			if (finalDesignsCount[0].count > 0) {
				console.log('Database already seeded with sample designs')
				return
			}

			// Insert designs and add to gallery
			for (let i = 0; i < sampleDesigns.length; i++) {
				const designId = await this.addFinalDesign(sampleDesigns[i])

				// Add to gallery with rank based on insertion order
				await this.addToGallery({
					designId,
					rank: i + 1,
				})
			}

			console.log('Database seeded successfully with sample designs')
		} catch (error) {
			console.error('Error seeding database:', error)
			throw new Error('Failed to seed database with sample data')
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
		// await this.seedTablesWithSplashUrlData()

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
