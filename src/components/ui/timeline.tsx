'use client'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'

interface TimelineEntry {
	title: string
	content: React.ReactNode
	icon?: React.ReactNode // Add optional icon prop
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
	const ref = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [height, setHeight] = useState(0)

	useEffect(() => {
		if (ref.current) {
			const rect = ref.current.getBoundingClientRect()
			setHeight(rect.height)
		}
	}, [ref])

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start 10%', 'end 50%'],
	})

	const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
	const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

	return (
		<div
			className='w-full dark:bg-neutral-950 font-sans md:px-10'
			ref={containerRef}
		>
			<div ref={ref} className='relative mx-auto pb-20'>
				{data.map((item, index) => (
					<div
						key={index}
						className='flex justify-start pt-6'
					>
						<div className='flex flex-col z-40 items-center self-start'>
							<div className='h-10 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center border border-neutral-300 dark:border-neutral-700'>
								{item.icon
									? (
										item.icon
									)
									: (
										<div className='h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2' />
									)}
							</div>
						</div>

						<div className='relative pl-6 pr-4 w-full'>
							<h3 className='block text-2xl mb-4 text-left font-bold text-white'>
								{item.title}
							</h3>
							{item.content}
						</div>
					</div>
				))}
				<div
					style={{
						height: height + 'px',
					}}
					className='absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] '
				>
					<motion.div
						style={{
							height: heightTransform,
							opacity: opacityTransform,
						}}
						className='absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full'
					/>
				</div>
			</div>
		</div>
	)
}
