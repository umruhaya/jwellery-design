import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface GalleryItem {
	galleryId: number
	rank: number
	designId: number
	url: string
	customerName: string
	specifications: string
	createdAt: string | null
}

interface GalleryCarouselProps {
	items: GalleryItem[]
	ui: Record<string, string>
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ items, ui }) => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		pauseOnHover: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	}

	return (
		<div className='w-full px-4 py-8 bg-white'>
			<Slider {...settings}>
				{items.map((item) => (
					<div key={item.galleryId} className='px-2'>
						<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
							<div className='relative pb-[100%]'>
								<img
									src={item.url}
									alt={`${item.customerName}'s design`}
									className='absolute inset-0 w-full h-full object-cover'
								/>
							</div>
							<div className='p-4'>
								<h3 className='font-[playfair] text-xl mb-2'>{item.customerName}</h3>
								{/* wrap the text into two lines */}
								<p className='text-gray-600 text-sm line-clamp-2'>{item.specifications}</p>
							</div>
						</div>
					</div>
				))}
			</Slider>
		</div>
	)
}

export default GalleryCarousel
