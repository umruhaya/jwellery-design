import { useEffect, useRef, useState } from 'react'
import { gallerySpecs } from '~/lib/gallery-specs'
import Autoplay from 'embla-carousel-autoplay'
import type { CarouselApi } from '~/components/ui/carousel'
import { getLocalePath, getTranslationForLocale } from '~/i18n/ui'

import { Card, CardContent } from '~/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'

interface Props {
	locale?: string
}

const GalleryCarousel: React.FC<Props> = ({ locale = 'en' }) => {
	const plugin = useRef(
		Autoplay({ delay: 2000, stopOnInteraction: true }),
	)
	const [api, setApi] = useState<CarouselApi | null>(null)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [snapCount, setSnapCount] = useState(0)
	const ui = getTranslationForLocale(locale)
	const localePath = getLocalePath(locale)

	useEffect(() => {
		if (!api) return
		const onSelect = () => {
			setCurrentIndex(api.selectedScrollSnap())
			setSnapCount(api.scrollSnapList().length)
		}
		onSelect()
		api.on('select', onSelect)
		api.on('reInit', onSelect)
		return () => {
			api.off('select', onSelect)
			api.off('reInit', onSelect)
		}
	}, [api])

	return (
		<>
			<Carousel
				className='w-full px-4'
				opts={{
					align: 'start',
					loop: true,
					slidesToScroll: 1,
				}}
				plugins={[plugin.current]}
				setApi={setApi}
			>
				<CarouselContent>
					{gallerySpecs.map((item, index) => (
						<CarouselItem key={index} className='basis-full md:basis-1/2 lg:basis-1/3'>
							<div className='p-1'>
								<Card>
									<CardContent>
										<div className='relative'>
											<div className='flex'>
												<img
													src={item.modelUrl}
													alt='gallery model'
													className='w-1/2'
												/>
												<img
													src={item.pieceUrl}
													alt='gallery piece'
													className='w-1/2'
												/>
											</div>
										</div>
										<div className='p-4'>
											<p className='text-gray-600 text-sm line-clamp-2'>{item.specification}</p>
										</div>
									</CardContent>
								</Card>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className='hidden md:block' />
				<CarouselNext className='hidden md:block' />
			</Carousel>
			<div className='mt-2 flex flex-col items-center gap-8 py-4'>
				<div className='flex items-center justify-center gap-2'>
					{Array.from({ length: snapCount }).map((_, i) => (
						<button
							key={i}
							type='button'
							className={'h-2 w-2 rounded-full transition-colors ' +
								(i === currentIndex ? 'bg-gray-900' : 'bg-gray-300')}
							aria-label={`Go to slide ${i + 1}`}
							aria-current={i === currentIndex ? 'true' : undefined}
							onClick={() => api?.scrollTo(i)}
						/>
					))}
				</div>
				<a href={localePath('/gallery')} className='text-sm text-primary underline'>
					{ui['gallery.more']}
				</a>
			</div>
		</>
	)
}

export default GalleryCarousel
