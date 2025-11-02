import type { ImageGenerationMessage, InputMessage, OutputMessage } from '~/store'
import { MarkdownRenderer } from './markdown-renderer'

export const InputMessageUI = ({ content }: InputMessage) => {
	return (
		<div className='flex justify-end ml-8'>
			<div className='flex flex-col gap-1'>
				<div className='flex justify-end'>
					<div className='flex flex-col gap-2'>
						{content.map((part, idx) =>
							part.type === 'input_image' && (
								<img
									key={idx}
									src={part.image_url === ''
										? 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
										: part.image_url}
									alt='user-image'
									className='w-[16rem] rounded'
								/>
							)
						)}
					</div>
				</div>
				{content.map((part, idx) =>
					part.type === 'input_text' &&
					(
						<div key={idx} className='flex justify-end'>
							<div className='p-2 rounded-2xl bg-primary text-white flex'>{part.text}</div>
						</div>
					)
				)}
			</div>
		</div>
	)
}

export const OutputMessageUI = ({ id, status, content }: OutputMessage) => {
	return (
		<div className='flex justify-start mr-8' key={id}>
			<div className='px-2 py-1 rounded-2xl bg-gray-100 text-gray-800'>
				{content.map((part, i) => <MarkdownRenderer key={i} text={part.text} />)}
			</div>
		</div>
	)
}

export const ImageGenerationMessageUI = ({ id, result, status }: ImageGenerationMessage) => {
	return (
		<div className='flex justify-start' id={id}>
			<div className='px-2 py-1 rounded-2xl bg-gray-100 text-gray-800'>
				<img
					src={result === ''
						? 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
						: result}
					alt='Generated Design Image'
					className={`w-[16rem] rounded ${status !== 'completed' ? 'animate-pulse' : ''}`}
				/>
			</div>
		</div>
	)
}
