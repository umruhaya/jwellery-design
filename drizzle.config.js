// write a drizzle config file for the sqlite database
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/models/index.ts',
	out: './drizzle',
	dialect: 'turso', // sqlite for local file
	dbCredentials: {
		url: 'file:.db/main.db',
		// url: 'http://127.0.0.1:8900', // make sure to run the tunnel to the remote server
	},
})
