import markdownit from 'markdown-it'

type MarkdownRendererProps = {
	text: string
}

// Activate/deactivate rules, with currying
const md = new markdownit({ html: true, linkify: true })

export const MarkdownRenderer = ({ text }: MarkdownRendererProps) => {
	const renderedHtml = md.render(text)

	return (
		<div className='bg-gray-100 text-gray-800 p-2 rounded-lg' dangerouslySetInnerHTML={{ __html: renderedHtml }} />
	)
}
