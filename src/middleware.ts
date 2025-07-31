import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = new URL(context.request.url)
	console.log({ pathname })

	const locale = context.preferredLocale || 'en'

	// skip any localization for admin routes
	if (pathname.startsWith('/admin')) {
		return next()
	}

	if (pathname.startsWith('/en')) {
		return context.rewrite(pathname.slice(3) || '/')
	}

	// no henky penky on `English` Locale as it is the default
	if (locale === 'en') {
		return next()
	}

	// no henky penky on `/api` routes as well, (this one caused me and client alot of pain in the ass)
	if (pathname.startsWith('/api')) {
		return next()
	}

	// if the pathname does not include any non default language locale, then add one
	if (
		!(
			pathname.startsWith('/de') ||
			pathname.startsWith('/es') ||
			pathname.startsWith('/it') ||
			pathname.startsWith('/fr')
		)
	) {
		return context.redirect(`/${locale}${pathname}`, 302)
	}

	return next()
})
