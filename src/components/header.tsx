import { getLocalePath, getTranslationForLocale } from '~/i18n/ui'
import { CyoDesignLogo } from './logo'
import { useMemo } from 'react'
import { MenuSheet } from '~/components/MenuSheet'

type HeaderProps = {
	locale: string
}

export const Header = ({ locale }: HeaderProps) => {
	const localePath = useMemo(() => getLocalePath(locale ?? 'en'), [locale])
	const ui = useMemo(() => getTranslationForLocale(locale ?? 'en'), [locale])

	return (
		<header className='flex justify-between items-center px-4 md:px-10 pt-2 md:pt-8 relative z-20'>
			<div></div>
			<a href={locale === 'de' ? '/de' : '/'} className='flex items-center space-x-3'>
				<CyoDesignLogo size={150} />
			</a>
			<div></div>
			{
				/* <nav className="flex items-center gap-2 md:gap-8 text-base md:text-2xl">
				<a href="#gallery" className="text-white font-didot">{ui['nav.gallery']}</a>
				<a href={localePath('/about')} className="text-white font-didot">{ui['nav.about']}</a>
			</nav> */
			}
		</header>
	)
}
