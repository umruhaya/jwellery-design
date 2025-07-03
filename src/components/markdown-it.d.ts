declare module 'markdown-it' {
	interface Options {
		html?: boolean
		xhtmlOut?: boolean
		breaks?: boolean
		langPrefix?: string
		linkify?: boolean
		typographer?: boolean
		quotes?: string
		highlight?: (str: string, lang: string) => string
	}

	interface PluginWithOptions<T = any> {
		(md: MarkdownIt, options?: T): void
	}

	class MarkdownIt {
		constructor(options?: Options)
		use<T>(plugin: PluginWithOptions<T>, options?: T): this
		render(md: string): string
	}

	export = MarkdownIt
}
