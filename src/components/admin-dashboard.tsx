import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '~/lib/query-client'

// Type definitions
export type Design = {
	id: number
	url: string
	customerName: string
	specifications: string
}

export type GalleryItem = {
	galleryId: number
	designId: number
	rank: number
	url: string
	customerName: string
}

type AdminDashboardProps = {
	basicAuthString: string
}

// Helper function to create headers
const createAuthHeaders = (basicAuthString: string) => ({
	'Authorization': `Basic ${btoa(basicAuthString)}`,
	'Content-Type': 'application/json',
})

export function AdminDashboard({ basicAuthString }: AdminDashboardProps) {
	const authHeaders = createAuthHeaders(basicAuthString)

	// Query: Fetch all designs
	const {
		data: designs = [],
		isLoading: designsLoading,
		error: designsError,
	} = useQuery({
		queryKey: ['designs'],
		queryFn: async (): Promise<Design[]> => {
			const response = await fetch('/api/admin/designs', {
				headers: authHeaders,
			})
			if (!response.ok) {
				throw new Error('Failed to fetch designs')
			}
			return response.json()
		},
	}, queryClient)

	// Query: Fetch gallery items
	const {
		data: gallery = [],
		isLoading: galleryLoading,
		error: galleryError,
	} = useQuery({
		queryKey: ['gallery'],
		queryFn: async (): Promise<GalleryItem[]> => {
			const response = await fetch('/api/admin/gallery', {
				headers: authHeaders,
			})
			if (!response.ok) {
				throw new Error('Failed to fetch gallery')
			}
			return response.json()
		},
	}, queryClient)

	// Mutation: Add to gallery
	const addToGalleryMutation = useMutation({
		mutationFn: async (designId: number) => {
			// Get current gallery data to calculate next rank
			const currentGallery = queryClient.getQueryData<GalleryItem[]>(['gallery']) || []
			const nextRank = Math.max(0, ...currentGallery.map(item => item.rank)) + 1

			const response = await fetch('/api/admin/gallery', {
				method: 'POST',
				headers: authHeaders,
				body: JSON.stringify({ designId, rank: nextRank }),
			})

			if (!response.ok) {
				throw new Error('Failed to add design to gallery')
			}

			return response.json()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['gallery'] })
		},
	}, queryClient)

	// Mutation: Remove from gallery
	const removeFromGalleryMutation = useMutation({
		mutationFn: async (galleryId: number) => {
			const response = await fetch(`/api/admin/gallery?id=${galleryId}`, {
				method: 'DELETE',
				headers: authHeaders,
			})

			if (!response.ok) {
				throw new Error('Failed to remove design from gallery')
			}

			return response.json()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['gallery'] })
		},
	}, queryClient)

	// Helper function to check if design is in gallery
	const isDesignInGallery = (designId: number) => {
		return gallery.some(item => item.designId === designId)
	}

	// Show loading state while either query is loading
	if (designsLoading || galleryLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-lg text-gray-600'>Loading...</p>
				</div>
			</div>
		)
	}

	// Show error state if either query failed
	if (designsError || galleryError) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center text-red-600'>
					<p className='text-lg'>Error loading data</p>
					<p className='text-sm mt-2'>
						{designsError?.message || galleryError?.message}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='p-8 max-w-7xl mx-auto'>
			<h1 className='text-3xl font-bold text-gray-900 mb-8'>Admin Dashboard</h1>

			{/* All Designs Section */}
			<section className='mb-12'>
				<h2 className='text-2xl font-semibold text-gray-800 mb-6'>All Designs</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
					{designs.map((design) => {
						const inGallery = isDesignInGallery(design.id)
						const isAddingToGallery = addToGalleryMutation.isPending

						return (
							<div
								key={design.id}
								className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow'
							>
								<div className='aspect-square relative overflow-hidden w-24 h-24'>
									<img
										src={design.url}
										alt={`Design for ${design.customerName}`}
										className='w-24 h-24'
									/>
								</div>
								<div className='p-4'>
									<h3 className='font-semibold text-gray-900 mb-2'>
										{design.customerName}
									</h3>
									<p className='text-sm text-gray-600 mb-4 line-clamp-3'>
										{design.specifications}
									</p>
									<button
										onClick={() => addToGalleryMutation.mutate(design.id)}
										disabled={inGallery || isAddingToGallery}
										className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
											inGallery
												? 'bg-green-100 text-green-800 cursor-not-allowed'
												: isAddingToGallery
												? 'bg-gray-100 text-gray-400 cursor-not-allowed'
												: 'bg-blue-600 text-white hover:bg-blue-700'
										}`}
									>
										{inGallery ? 'In Gallery' : 'Add to Gallery'}
									</button>
								</div>
							</div>
						)
					})}
				</div>
				{designs.length === 0 && <p className='text-gray-500 text-center py-8'>No designs available</p>}
			</section>

			{/* Gallery Images Section */}
			<section>
				<h2 className='text-2xl font-semibold text-gray-800 mb-6'>Gallery Images</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
					{gallery.map((item) => {
						const isRemoving = removeFromGalleryMutation.isPending

						return (
							<div
								key={item.galleryId}
								className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow'
							>
								<div className='aspect-square relative overflow-hidden'>
									<img
										src={item.url}
										alt={`Gallery item for ${item.customerName}`}
										className='w-full h-full object-cover'
									/>
								</div>
								<div className='p-4'>
									<h3 className='font-semibold text-gray-900 mb-4'>
										{item.customerName}
									</h3>
									<button
										onClick={() => removeFromGalleryMutation.mutate(item.galleryId)}
										disabled={isRemoving}
										className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
											isRemoving
												? 'bg-gray-100 text-gray-400 cursor-not-allowed'
												: 'bg-red-600 text-white hover:bg-red-700'
										}`}
									>
										{isRemoving ? 'Removing...' : 'Remove'}
									</button>
								</div>
							</div>
						)
					})}
				</div>
				{gallery.length === 0 && <p className='text-gray-500 text-center py-8'>No items in gallery</p>}
			</section>
		</div>
	)
}
