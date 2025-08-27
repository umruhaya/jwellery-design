import React from 'react'
import { gallerySpecs } from '~/lib/gallery-specs'
import Autoplay from 'embla-carousel-autoplay'

import { Card, CardContent } from '~/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'

const GalleryCarousel: React.FC = () => {
	const plugin = React.useRef(
		Autoplay({ delay: 2000, stopOnInteraction: true }),
	)

	return (
		<Carousel
			className='w-full px-4'
			opts={{
				align: 'start',
				loop: true,
				slidesToScroll: 1,
			}}
			plugins={[plugin.current]}
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
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	)
}

export default GalleryCarousel
