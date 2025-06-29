// @ts-check
import { defineConfig } from 'astro/config'

import node from '@astrojs/node'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
	site: 'https://cyodesign.com',
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [react()],

	i18n: {
		locales: ['en', 'de', 'fr', 'it', 'es'],
		defaultLocale: 'en',
		routing: {
			prefixDefaultLocale: false,
		},
	},
})
