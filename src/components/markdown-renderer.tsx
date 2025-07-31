import markdownit from 'markdown-it'
import { useMemo } from 'react'

type StyleConfig = {
	paragraph?: string
	list?: string
	listItem?: string
	strong?: string
	lineBreak?: string
	heading?: Record<string, string> // h1, h2, etc.
	hr?: string
}

type MarkdownRendererProps = {
	text: string
	styles?: StyleConfig
}

const defaultStyles: StyleConfig = {
	paragraph: 'mb-4 leading-relaxed',
	list: 'ml-6 mb-4 list-disc marker:text-gray-400',
	listItem: 'mb-1',
	strong: 'font-semibold',
	lineBreak: 'mb-3',
	heading: {
		h1: 'text-2xl font-bold mb-4',
		h2: 'text-xl font-semibold mb-3',
		h3: 'text-lg font-medium mb-2',
	},
	hr: 'border-gray-300 border-t mb-4',
}

const md = new markdownit({ html: true, linkify: true })

export const MarkdownRenderer = ({ text, styles = defaultStyles }: MarkdownRendererProps) => {
	const transformedHtml = useMemo(() => {
		const renderedHtml = md.render(text)
		const parser = new DOMParser()
		const doc = parser.parseFromString(renderedHtml, 'text/html')

		// Apply transformations
		const applyStyles = (selector: string, className: string) => {
			doc.querySelectorAll(selector).forEach(el => {
				el.className = `${el.className} ${className}`.trim()
			})
		}

		// Apply styles
		if (styles.paragraph) applyStyles('p', styles.paragraph)
		if (styles.list) {
			applyStyles('ul', `${styles.list} list-disc`)
			applyStyles('ol', `${styles.list} list-decimal`)
		}
		if (styles.listItem) applyStyles('li', styles.listItem)
		if (styles.strong) applyStyles('strong', styles.strong)
		if (styles.hr) applyStyles('hr', styles.hr)

		// Handle headings
		if (styles.heading) {
			Object.entries(styles.heading).forEach(([tag, className]) => {
				applyStyles(tag, className)
			})
		}

		// Handle line breaks by replacing with styled divs
		if (styles.lineBreak) {
			doc.querySelectorAll('br').forEach(br => {
				const spacer = doc.createElement('div')
				spacer.className = styles.lineBreak!
				br.parentNode?.replaceChild(spacer, br)
			})
		}

		return doc.body.innerHTML
	}, [text, styles])

	return (
		<div
			className='p-2 rounded-lg'
			dangerouslySetInnerHTML={{ __html: transformedHtml }}
		/>
	)
}
