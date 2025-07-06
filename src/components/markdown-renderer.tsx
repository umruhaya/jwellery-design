import markdownit from 'markdown-it'

type MarkdownRendererProps = {
	text: string
}

// Activate/deactivate rules, with currying
const md = new markdownit({ html: true, linkify: true })

export const MarkdownRenderer = ({ text }: MarkdownRendererProps) => {
	const renderedHtml = md.render(text)

	return <div className='p-2 rounded-lg' dangerouslySetInnerHTML={{ __html: renderedHtml }} />
}
