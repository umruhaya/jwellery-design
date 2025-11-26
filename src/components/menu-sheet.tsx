import { MenuIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '~/components/ui/sheet'
import { websiteUrl } from '~/config'
import { getTranslationForLocale } from '~/i18n/ui'
import { setChatStore, useChatStore } from '~/store'

type MenuSheetProps = {
	locale: string
}

export const MenuSheet = ({ locale }: MenuSheetProps) => {
	const { isMenuSheetOpen } = useChatStore()
	const ui = useMemo(() => getTranslationForLocale(locale), [locale])

	const setIsMenuSheetOpen = useCallback((open: boolean) => {
		setChatStore(draft => {
			draft.isMenuSheetOpen = open
		})
	}, [])

	return (
		<Sheet open={isMenuSheetOpen} onOpenChange={setIsMenuSheetOpen}>
			<SheetTrigger asChild>
				<MenuIcon className='text-white' />
			</SheetTrigger>
			<SheetContent side='left'>
				<SheetHeader>
				</SheetHeader>
				<div className='flex flex-col gap-4 p-8 font-didot'>
				
					<a href='#about' onClick={() => setIsMenuSheetOpen(false)}>
						<h1 className='text-2xl font-semibold'>{ui['aboutus.aboutus']}</h1>
					</a>
					<a href={`${websiteUrl}/collections`} onClick={() => setIsMenuSheetOpen(false)}>
						<h1 className='text-2xl font-semibold'>{ui['nav.shop']}</h1>
					</a>
					<a href='#gallery' onClick={() => setIsMenuSheetOpen(false)}>
						<h1 className='text-2xl font-semibold'>{ui['nav.gallery']}</h1>
					</a>
					<a href='#contact'>
						<Button variant='default' className='' onClick={() => setIsMenuSheetOpen(false)}>
							<h1 className='text-xl font-semibold'>{ui['lead.title']}</h1>
						</Button>
					</a>
				</div>
			</SheetContent>
		</Sheet>
	)
}
