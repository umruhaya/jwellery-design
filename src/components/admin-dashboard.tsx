import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { queryClient } from '~/lib/query-client'

interface GalleryItem {
	id: string
	chatId: string | null
	prompt: string
	imageUrl: string
	firstName: string
	lastName: string
	email: string
	phone: string
	city: string
	country: string
	createdAt: string
	updatedAt: string
}

interface PaginationInfo {
	page: number
	limit: number
	total: number
	totalPages: number
	hasNextPage: boolean
	hasPreviousPage: boolean
}

interface GalleryResponse {
	items: GalleryItem[]
	pagination: PaginationInfo
}

async function fetchGalleryItems(page: number, limit: number, authString: string): Promise<GalleryResponse> {
	const response = await fetch(`/api/admin/gallery?page=${page}&limit=${limit}`, {
		headers: {
			'Authorization': `Basic ${btoa(authString)}`,
		},
	})

	if (!response.ok) {
		throw new Error('Failed to fetch gallery items')
	}

	return response.json()
}

function GalleryGrid({ authString }: { authString: string }) {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 12

	const { data, isLoading, error } = useQuery({
		queryKey: ['gallery', currentPage, itemsPerPage],
		queryFn: () => fetchGalleryItems(currentPage, itemsPerPage, authString),
		staleTime: 5 * 60 * 1000, // 5 minutes
	}, queryClient)

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-96'>
				<div className='animate-pulse text-lg'>Loading gallery items...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-96'>
				<div className='text-red-600 text-lg'>
					Error loading gallery items: {error instanceof Error ? error.message : 'Unknown error'}
				</div>
			</div>
		)
	}

	if (!data || data.items.length === 0) {
		return (
			<div className='flex items-center justify-center min-h-96'>
				<div className='text-gray-500 text-lg'>No gallery items found</div>
			</div>
		)
	}

	const { items, pagination } = data

	return (
		<div className='space-y-6'>
			{/* Gallery Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{items.map((item) => (
					<Card key={item.id} className='overflow-hidden'>
						<CardHeader className='p-0'>
							<div className='aspect-square relative'>
								<img
									src={item.imageUrl}
									alt={item.prompt}
									className='w-full h-full object-cover'
									loading='lazy'
								/>
							</div>
						</CardHeader>
						<CardContent className='p-4'>
							<CardTitle className='text-sm font-medium mb-2 line-clamp-2'>
								{item.prompt}
							</CardTitle>
							<div className='space-y-1 text-xs text-gray-600'>
								<p>
									<span className='font-medium'>Name:</span> {item.firstName} {item.lastName}
								</p>
								<p>
									<span className='font-medium'>Email:</span> {item.email}
								</p>
								<p>
									<span className='font-medium'>Phone:</span> {item.phone}
								</p>
								<p>
									<span className='font-medium'>Location:</span> {item.city}, {item.country}
								</p>
								<p>
									<span className='font-medium'>Created:</span>{' '}
									{new Date(item.createdAt).toLocaleDateString()}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Pagination */}
			<div className='flex items-center justify-between'>
				<div className='text-sm text-gray-600'>
					Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
					{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
				</div>

				<div className='flex items-center space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
						disabled={!pagination.hasPreviousPage}
					>
						Previous
					</Button>

					<div className='flex items-center space-x-1'>
						{Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
							const page = i + 1
							const isCurrentPage = page === pagination.page

							return (
								<Button
									key={page}
									variant={isCurrentPage ? 'default' : 'outline'}
									size='sm'
									onClick={() => setCurrentPage(page)}
									className='w-8 h-8 p-0'
								>
									{page}
								</Button>
							)
						})}

						{pagination.totalPages > 5 && (
							<>
								<span className='text-gray-400'>...</span>
								<Button
									variant='outline'
									size='sm'
									onClick={() => setCurrentPage(pagination.totalPages)}
									className='w-8 h-8 p-0'
								>
									{pagination.totalPages}
								</Button>
							</>
						)}
					</div>

					<Button
						variant='outline'
						size='sm'
						onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
						disabled={!pagination.hasNextPage}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}

interface AdminDashboardProps {
	basicAuthString: string
}

export function AdminDashboard({ basicAuthString }: AdminDashboardProps) {
	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='container mx-auto px-4 py-8'>
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						CYO Design Admin Dashboard
					</h1>
					<p className='text-gray-600'>
						Manage and view all gallery submissions
					</p>
				</div>

				<GalleryGrid authString={basicAuthString} />
			</div>
		</div>
	)
}
