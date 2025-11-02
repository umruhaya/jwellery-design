import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_S3_ENDPOINT, AWS_SECRET_ACCESS_KEY } from 'astro:env/server'

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

// AWS S3-compatible implementation (singleton)
export class S3StorageService extends StorageService {
	private static instance: S3StorageService
	private s3: S3Client
	private baseUrl: string

	private constructor() {
		super()
		const endpointInput = AWS_S3_ENDPOINT
		const normalizedEndpoint = endpointInput.startsWith('http')
			? endpointInput
			: `https://${endpointInput}`
		this.s3 = new S3Client({
			region: AWS_REGION,
			credentials: {
				accessKeyId: AWS_ACCESS_KEY_ID,
				secretAccessKey: AWS_SECRET_ACCESS_KEY,
			},
			endpoint: normalizedEndpoint,
			forcePathStyle: true,
		})
		this.baseUrl = normalizedEndpoint.replace(/\/+$/, '')
	}

	static getInstance(): S3StorageService {
		if (!S3StorageService.instance) {
			S3StorageService.instance = new S3StorageService()
		}
		return S3StorageService.instance
	}

	async createPresignedPutUrl(
		bucket: string,
		key: string,
		expiresIn: number,
	): Promise<PresignedPutUrlResult> {
		const command = new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			ContentType: 'application/octet-stream',
		})
		const signedUrl = await getSignedUrl(this.s3, command, { expiresIn })

		const base = this.baseUrl
		const path = `${bucket}/${encodeURIComponent(key)}`
		const publicUrl = base ? `${base}/${path}` : `/${path}`
		return { signedUrl, publicUrl }
	}
}
