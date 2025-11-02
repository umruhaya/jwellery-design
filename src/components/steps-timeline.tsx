import React from 'react'
import { Timeline } from '~/components/ui/timeline'
import { DollarSign, MessageCircle, Palette, Truck } from 'lucide-react' // Import icons from lucide-react
import { getTranslationForLocale } from '~/i18n/ui'

export function StepsTimeline({ locale }: { locale: string }) {
	const ui = getTranslationForLocale(locale)

	const data = [
		{
			title: `1. ${ui['steps.1.title']}`, // e.g., "1. Share Inspiration"
			icon: <MessageCircle className='w-6 h-6 text-amber-600' />,
			content: (
				<div className='flex items-center space-x-4'>
					<p className='text-sm text-gray-200 md:text-base leading-relaxed'>
						{ui['steps.1.description']}
					</p>
				</div>
			),
		},
		{
			title: `2. ${ui['steps.2.title']}`, // e.g., "2. Perfect the Design"
			icon: <Palette className='w-6 h-6 text-amber-600' />,
			content: (
				<div className='flex items-center space-x-4'>
					<p className='text-sm text-gray-200 md:text-base leading-relaxed'>
						{ui['steps.2.description']}
					</p>
				</div>
			),
		},
		{
			title: `3. ${ui['steps.3.title']}`, // e.g., "3. Receive a Quote"
			icon: <DollarSign className='w-6 h-6 text-amber-600' />,
			content: (
				<div className='flex items-center space-x-4'>
					<p className='text-sm text-gray-200 md:text-base leading-relaxed'>
						{ui['steps.3.description']}
					</p>
				</div>
			),
		},
		{
			title: `4. ${ui['steps.4.title']}`, // e.g., "4. Crafting & Delivery"
			icon: <Truck className='w-6 h-6 text-amber-600' />,
			content: (
				<div className='flex items-center space-x-4'>
					<p className='text-sm text-gray-200 md:text-base leading-relaxed'>
						{ui['steps.4.description']}
					</p>
				</div>
			),
		},
	]

	return (
		<div
			className='relative w-full overflow-hidden bg-cover bg-center bg-no-repeat min-h-[700px] md:min-h-[900px] flex items-center'
			style={{
				backgroundImage: 'url(https://fsn1.your-objectstorage.com/cyodesign/assets/bracelet-on-step.jpg)',
			}}
		>
			{/* Improved overlay for better contrast */}
			<div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/10'></div>

			<div className='relative z-10 w-full px-6 py-12 md:px-12 lg:px-16'>
				<div className='max-w-6xl mx-auto'>
					<h2 className='text-4xl md:text-5xl lg:text-6xl font-didot text-center mb-16 text-white tracking-wide'>
						{ui['steps.title']}
					</h2>

					{/* Timeline container with better positioning */}
					<div className='max-w-3xl mx-auto lg:mx-0 lg:max-w-4xl'>
						<Timeline data={data} />
					</div>
				</div>
			</div>
		</div>
	)
}
