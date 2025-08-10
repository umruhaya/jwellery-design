import React from 'react'

type LogoProps = {
	size: number // pixel size for width/height
	className?: string // optional for styling
	title?: string // optional accessible title
}

export const CyoDesignLogo: React.FC<LogoProps> = ({ size, className, title = 'CYO Design Logo' }) => (
	<svg
		width={size}
		height={size / 2}
		viewBox='0 0 900 300'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		role='img'
		aria-label={title}
		className={className}
	>
		<title>{title}</title>

		{/* Transparent background */}
		<rect width='900' height='300' fill='none' />

		{/* Styles */}
		<style>
			{`
        .brand { fill: #FFFFFF; font-family: "Georgia", "Times New Roman", Times, serif; font-weight: 400; }
        .sub { fill: #FFFFFF; font-family: "Helvetica Neue", Arial, sans-serif; font-weight: 500; letter-spacing: 0.35em; }
      `}
		</style>

		{/* Main word: cyo */}
		<text
			className='brand'
			x='50%'
			y='130'
			dominantBaseline='middle'
			textAnchor='middle'
			fontSize='320'
		>
			cyo
		</text>

		{/* Subtext: DESIGN */}
		<text
			className='sub'
			x='50%'
			y='340'
			dominantBaseline='middle'
			textAnchor='middle'
			fontSize='96'
		>
			DESIGN
		</text>
	</svg>
)
