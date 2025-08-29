import { MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import { setChatStore, useChatStore } from '~/store'
import { useCallback } from 'react'

export const MenuSheet = () => {
	const { isMenuSheetOpen } = useChatStore()

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
					<a href='#about'>
						<h1 className='text-2xl font-semibold'>About Us</h1>
					</a>
					<a href='#gallery'>
						<h1 className='text-2xl font-semibold'>Gallery</h1>
					</a>
				</div>
			</SheetContent>
		</Sheet>
	)
}
