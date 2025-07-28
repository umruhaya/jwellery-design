import React, { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import GalleryCarousel from './gallery-carousel'

// Helper to get auth header
const getAuthHeader = (basicAuthString: string) => ({
	Authorization: 'Basic ' + btoa(basicAuthString),
	'Content-Type': 'application/json',
})

// Fetch all designs
const fetchDesigns = async (basicAuthString: string) => {
	const res = await fetch('/api/admin/designs', { headers: getAuthHeader(basicAuthString) })
	if (!res.ok) throw new Error('Failed to fetch designs')
	return res.json()
}

// Fetch gallery
const fetchGallery = async (basicAuthString: string) => {
	const res = await fetch('/api/admin/gallery', { headers: getAuthHeader(basicAuthString) })
	if (!res.ok) throw new Error('Failed to fetch gallery')
	return res.json()
}

type AdminDashboardProps = {
	basicAuthString: string
}

export default function AdminDashboard({ basicAuthString }: AdminDashboardProps) {
	const queryClient = useQueryClient()
	const { data: designs = [], isLoading: loadingDesigns } = useQuery({
		queryKey: ['designs'],
		queryFn: () => fetchDesigns(basicAuthString),
	}, queryClient)
	const { data: gallery = [], isLoading: loadingGallery } = useQuery({
		queryKey: ['gallery'],
		queryFn: () => fetchGallery(basicAuthString),
	}, queryClient)

	// Add to gallery mutation
	const addToGallery = useMutation({
		mutationFn: async (designId: number) => {
			const rank = Math.max(0, ...gallery.map((g: any) => g.rank)) + 1
			const res = await fetch('/api/admin/gallery', {
				method: 'POST',
				headers: getAuthHeader(basicAuthString),
				body: JSON.stringify({ designId, rank }),
			})
			if (!res.ok) throw new Error('Failed to add to gallery')
			return res.json()
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
	}, queryClient)

	// Remove from gallery mutation
	const removeFromGallery = useMutation({
		mutationFn: async (galleryId: number) => {
			const res = await fetch(`/api/admin/gallery?id=${galleryId}`, {
				method: 'DELETE',
				headers: getAuthHeader(basicAuthString),
			})
			if (!res.ok) throw new Error('Failed to remove from gallery')
			return res.json()
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery'] }),
	}, queryClient)

	if (loadingDesigns || loadingGallery) return <div>Loading...</div>

	return (
		<div className='max-w-7xl mx-auto p-8'>
			<h1 className='text-2xl font-bold'>Admin Dashboard</h1>

			<h2 className='mt-4 mb-2 text-lg font-semibold'>Gallery Carousel Preview</h2>
			<GalleryCarousel items={gallery} />

			<h2 className='text-xl font-semibold mt-8'>All Designs</h2>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
				{designs.map((design: any) => (
					<div key={design.id} className='border border-gray-200 p-4 rounded-lg'>
						<img src={design.url} alt={design.customerName} className='w-full h-48 object-cover rounded' />
						<h3 className='font-medium mt-2'>{design.customerName}</h3>
						<p className='text-sm text-gray-600'>{design.specifications}</p>
						<button
							className='mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
							onClick={() => addToGallery.mutate(design.id)}
							disabled={addToGallery.isPending || gallery.some((g: any) => g.designId === design.id)}
						>
							{gallery.some((g: any) => g.designId === design.id) ? 'In Gallery' : 'Add to Gallery'}
						</button>
					</div>
				))}
			</div>

			<div className='mt-8 pt-8 border-t border-gray-200'>
				<h2 className='text-xl font-semibold'>Gallery Images</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
					{gallery.map((item: any) => (
						<div key={item.galleryId} className='border border-gray-200 p-4 rounded-lg'>
							<img src={item.url} alt={item.customerName} className='w-full h-48 object-cover rounded' />
							<h3 className='font-medium mt-2'>{item.customerName}</h3>
							<button
								className='mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
								onClick={() =>
									removeFromGallery.mutate(item.galleryId)}
								disabled={removeFromGallery.isPending}
							>
								Remove
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
