import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = new URL(context.request.url)
	if (!pathname.match(/^\/(en|de|fr|it|es)\//)) {
		const locale = context.preferredLocale || 'en'
		console.log({ locale })
		return context.redirect(`/${locale}${pathname}`, 302)
	}

	return next()
})
