// write a drizzle config file for the sqlite database
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/models/index.ts',
	out: './drizzle',
	dialect: 'sqlite',
	dbCredentials: {
		url: 'file:./main.db',
	},
})
