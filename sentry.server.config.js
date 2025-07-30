import * as Sentry from '@sentry/astro'

Sentry.init({
	dsn: 'https://e3d5f288f906e42252ab8dc8e9fadd1c@o4508434925158400.ingest.us.sentry.io/4508434929221632',

	// Adds request headers and IP for users, for more info visit: for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
	sendDefaultPii: true,

	// Define how likely traces are sampled. Adjust this value in production,
	// or use tracesSampler for greater control.
	tracesSampleRate: 1.0,
})
