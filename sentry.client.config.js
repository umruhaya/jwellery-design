import * as Sentry from '@sentry/astro'

Sentry.init({
	dsn: 'https://e3d5f288f906e42252ab8dc8e9fadd1c@o4508434925158400.ingest.us.sentry.io/4508434929221632',

	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
	sendDefaultPii: true,

	integrations: [
		Sentry.captureConsoleIntegration(),
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],

	// Define how likely traces are sampled. Adjust this value in production,
	// or use tracesSampler for greater control.
	tracesSampleRate: 1.0,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,
})
