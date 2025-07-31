import type { APIRoute } from 'astro'
import { openai } from '~/services/openai'

export const POST: APIRoute = async ({ request }) => {
	try {
		const formData = await request.formData()
		const audioFile = formData.get('audio') as File

		if (!audioFile) {
			return new Response(JSON.stringify({ error: 'No audio file provided' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const transcription = await openai.audio.transcriptions.create({
			file: audioFile,
			model: 'whisper-1',
		})

		return new Response(JSON.stringify({ text: transcription.text }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.error('Transcription error:', error)
		return new Response(
			JSON.stringify({ error: 'Failed to transcribe audio' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	}
}
