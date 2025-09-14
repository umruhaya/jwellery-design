import { CyoDesignLogo } from './logo'
import { MailIcon, PhoneIcon } from 'lucide-react'
import { LanguageSwitcherSheet } from './language-switcher-sheet'
import { MenuSheet } from './menu-sheet'

type HeaderProps = {
	locale: string
}

export const Header = ({ locale }: HeaderProps) => {
	return (
		<header className='flex justify-between items-center px-4 md:px-10 pt-2 md:pt-8 relative z-20'>
			<div>
				<MenuSheet locale={locale} />
			</div>
			<a href={locale === 'de' ? '/de' : '/'} className='flex items-center space-x-3'>
				<CyoDesignLogo size={150} />
			</a>
			<div className='flex items-center space-x-3'>
				<LanguageSwitcherSheet locale={locale} />
				<a href='tel:+4917678901234'>
					<PhoneIcon className='text-white' />
				</a>
				<a href='mailto:info@cyodesign.com'>
					<MailIcon className='text-white' />
				</a>
			</div>
		</header>
	)
}
