import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { CheckIcon, XIcon } from 'lucide-react'

type AudioRecorderProps = {
	onAccept: (audioBlob: Blob) => void
	onCancel: () => void
}

export const AudioRecorder = ({ onAccept, onCancel }: AudioRecorderProps) => {
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
			waveColor: 'rgb(200, 0, 200)',
			progressColor: 'rgb(100, 0, 100)',
			height: 50,
		})

		// Initialize Record plugin
		const record = wavesurfer.registerPlugin(
			RecordPlugin.create({
				renderRecordedAudio: false,
				scrollingWaveform: true,
				continuousWaveform: true,
				scrollingWaveformWindow: 2,
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
		<div className='flex flex-col gap-4 w-full'>
			<div className='text-sm text-gray-500 text-center'>{recordingTime}</div>
			<div ref={containerRef} className='w-full h-[50px] border rounded-lg overflow-hidden' />
			<div className='flex justify-center gap-4'>
				<button
					onClick={handleCancel}
					className='p-2 bg-red-500 text-white rounded-full hover:bg-red-600'
				>
					<XIcon className='w-5 h-5' />
				</button>
				<button
					onClick={handleAccept}
					className='p-2 bg-green-500 text-white rounded-full hover:bg-green-600'
				>
					<CheckIcon className='w-5 h-5' />
				</button>
			</div>
		</div>
	)
}
