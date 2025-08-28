// @ts-check
import { defineConfig, envField } from 'astro/config'

import node from '@astrojs/node'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'
import sentry from '@sentry/astro'

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

	integrations: [
		react(),
		sentry({
			sourceMapsUploadOptions: {
				project: 'node',
				org: 'umernaeem',
				authToken: process.env.SENTRY_AUTH_TOKEN,
			},
		}),
	],

	i18n: {
		locales: ['en', 'de', 'fr', 'it', 'es'],
		defaultLocale: 'en',
		routing: {
			prefixDefaultLocale: false,
		},
	},

	env: {
		schema: {
			OPENAI_API_KEY: envField.string({ access: 'secret', context: 'server' }),
			EMAIL_HOST: envField.string({ access: 'secret', context: 'server' }),
			EMAIL_USER: envField.string({ access: 'secret', context: 'server' }),
			EMAIL_PASSWORD: envField.string({ access: 'secret', context: 'server' }),
			RECIPIENT_EMAIL: envField.string({ access: 'secret', context: 'server' }),
			SERVICE_ACCOUNT_KEY: envField.string({ access: 'secret', context: 'server' }),
			BUCKET_NAME: envField.string({ access: 'secret', context: 'server' }),
			IMG_FORMAT: envField.enum({
				access: 'public',
				context: 'client',
				default: 'jpeg',
				values: ['webp', 'jpeg', 'png'],
			}),
			DASHBOARD_AUTH: envField.string({ access: 'secret', context: 'server' }),
		},
	},
})
