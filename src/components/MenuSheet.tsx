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
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<div className='flex flex-col gap-4 p-8'>
					<div>
						<h1>Jewelry</h1>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
