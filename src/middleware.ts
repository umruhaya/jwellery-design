import { defineMiddleware } from 'astro:middleware'

const possibleLocalesPrefixes = ['/en', '/de', '/es', '/it', '/fr']

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = new URL(context.request.url)

	const locale = context.preferredLocale || 'en'

	// skip any localization for admin routes
	if (pathname.startsWith('/admin')) {
		return next()
	}

	// no henky penky on `/api` routes as well, (this one caused me and client alot of pain in the ass)
	if (pathname.startsWith('/api')) {
		return next()
	}

	// if we do not have a locale prefix in the pathname, then we need to add one based on the preferred locale
	if (!possibleLocalesPrefixes.some((prefix) => pathname.startsWith(prefix))) {
		return context.redirect(`/${locale}${pathname}`, 302)
	}

	return next()
})
