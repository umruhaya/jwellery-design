import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { CheckIcon, XIcon } from 'lucide-react'
import { Spinner } from './spinner'

type AudioRecorderProps = {
	onAccept: (audioBlob: Blob) => void
	onCancel: () => void
	isLoading: boolean
}

export const AudioRecorder = ({ onAccept, onCancel, isLoading = false }: AudioRecorderProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const wavesurferRef = useRef<WaveSurfer | null>(null)
	const recordRef = useRef<any>(null) // RecordPlugin type is not exported
	const [isRecording, setIsRecording] = useState(false)
	const [recordingTime, setRecordingTime] = useState('00:00')

	useEffect(() => {
		if (!containerRef.current) return

		// Create WaveSurfer instance
		const wavesurfer = WaveSurfer.create({
			container: containerRef.current,
			waveColor: '#4B5563', // gray-600
			progressColor: '#374151', // gray-700
			height: 40,
			cursorWidth: 0,
			interact: false,
			hideScrollbar: true,
			autoScroll: true,
			normalize: true,
			barWidth: 2,
			barGap: 1,
		})

		// Initialize Record plugin
		const record = wavesurfer.registerPlugin(
			RecordPlugin.create({
				renderRecordedAudio: false,
				scrollingWaveform: true,
			}),
		)

		// Update recording time
		record.on('record-progress', (time: number) => {
			const formattedTime = [
				Math.floor((time % 3600000) / 60000), // minutes
				Math.floor((time % 60000) / 1000), // seconds
			]
				.map((v) => (v < 10 ? '0' + v : v))
				.join(':')
			setRecordingTime(formattedTime)
		})

		wavesurferRef.current = wavesurfer
		recordRef.current = record

		// Start recording immediately
		RecordPlugin.getAvailableAudioDevices().then((devices) => {
			const deviceId = devices[0]?.deviceId
			record.startRecording({ deviceId }).then(() => {
				setIsRecording(true)
			})
		})

		return () => {
			if (record.isRecording()) {
				record.stopRecording()
			}
			wavesurfer.destroy()
		}
	}, [])

	const handleAccept = async () => {
		if (!recordRef.current) return

		recordRef.current.stopRecording()
		setIsRecording(false)

		// Get the recorded audio blob
		recordRef.current.on('record-end', (blob: Blob) => {
			onAccept(blob)
		})
	}

	const handleCancel = () => {
		if (recordRef.current?.isRecording()) {
			recordRef.current.stopRecording()
		}
		setIsRecording(false)
		onCancel()
	}

	return (
		<div className='flex items-center gap-2 w-full'>
			<div className='text-sm text-gray-500 min-w-[48px] text-center'>{recordingTime}</div>
			<div ref={containerRef} className='flex-1 h-[40px] bg-gray-100 rounded-2xl overflow-hidden' />
			<button
				onClick={handleCancel}
				disabled={isLoading}
				className='p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:opacity-50'
			>
				<XIcon className='w-5 h-5' />
			</button>
			<button
				onClick={handleAccept}
				disabled={isLoading}
				className='p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:bg-gray-200'
			>
				{isLoading
					? <Spinner className='w-5 h-5 text-gray-600' />
					: <CheckIcon className='w-5 h-5' />}
			</button>
		</div>
	)
}
