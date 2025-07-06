import { Storage } from '@google-cloud/storage'
import { SERVICE_ACCOUNT_KEY } from 'astro:env/server'

export interface PresignedPutUrlResult {
	signedUrl: string
	publicUrl: string
}

export abstract class StorageService {
	/**
	 * Generate a pre-signed URL for uploading (PUT) an object.
	 * @param bucket The bucket name.
	 * @param key The storage key (path/filename).
	 * @param expiresIn Expiry time in seconds.
	 * @returns Promise resolving to an object with signedUrl and publicUrl.
	 */
	abstract createPresignedPutUrl(
		bucket: string,
		key: string,
		expiresIn: number,
	): Promise<PresignedPutUrlResult>
}

// Google Cloud Storage implementation (singleton)
export class GCSStorageService extends StorageService {
	private static instance: GCSStorageService
	private storage: Storage

	private constructor() {
		super()
		const credentials = JSON.parse(SERVICE_ACCOUNT_KEY)
		this.storage = new Storage({ credentials })
	}

	static getInstance(): GCSStorageService {
		if (!GCSStorageService.instance) {
			GCSStorageService.instance = new GCSStorageService()
		}
		return GCSStorageService.instance
	}

	async createPresignedPutUrl(
		bucket: string,
		key: string,
		expiresIn: number,
	): Promise<PresignedPutUrlResult> {
		const file = this.storage.bucket(bucket).file(key)
		const [signedUrl] = await file.getSignedUrl({
			action: 'write',
			expires: Date.now() + expiresIn * 1000,
		})
		const publicUrl = `https://storage.googleapis.com/${bucket}/${encodeURIComponent(key)}`
		return { signedUrl, publicUrl }
	}
}
