import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = new URL(context.request.url)
	console.log({ pathname })

	const locale = context.preferredLocale || 'en'

	if (pathname.startsWith('/en')) {
		return context.rewrite(pathname.slice(3) || '/')
	}

	// no henky penky on `English` Locale as it is the default
	if (locale === 'en') {
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
		console.log('MATCHED')

		console.log({ locale })
		return context.redirect(`/${locale}${pathname}`, 302)
	}

	return next()
})
