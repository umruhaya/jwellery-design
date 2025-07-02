type AssistantWidgetProps = {
	locale: string
}

export const AssistantWidget = ({ locale }: AssistantWidgetProps) => {
	return (
		<div className='w-full max-w-md bg-white/90 rounded-xl shadow-lg p-6 mb-8 flex flex-col items-center'>
			<div className='flex items-center mb-3'>
				<div className='w-8 h-8 bg-primary rounded-full flex items-center text-center justify-center text-white font-bold mr-3'>
					<span>AI</span>
				</div>
				<span className='font-semibold text-gray-800'>CYO Atelier Assistant</span>
			</div>
			<div className='w-full'>
				<input
					type='text'
					placeholder='Describe your dream jewelry...'
					className='w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring'
				/>
				<button
					type='button'
					className='mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded'
				>
					<svg
						className='w-5 h-5'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<title>Start Conversation</title>
						<path
							d='M12 19v-6m0 0V5m0 8l-4-4m4 4l4-4'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
					Start Conversation
				</button>
				<button
					type='button'
					className='mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded transition'
				>
					<svg
						className='w-5 h-5'
						fill='currentColor'
						viewBox='0 0 20 20'
						xmlns='http://www.w3.org/2000/svg'
					>
						<title>Voice Input</title>
						<path d='M10 18a8 8 0 100-16 8 8 0 000 16zm0-13v4l3 3-1.5 1.5L10 11V5h1z' />
					</svg>
					Voice Input
				</button>
			</div>
		</div>
	)
}
