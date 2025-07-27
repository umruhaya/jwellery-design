import nodemailer from 'nodemailer'
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_USER, RECIPIENT_EMAIL } from 'astro:env/server'

const transporter = nodemailer.createTransport({
	host: EMAIL_HOST, // smtp server
	port: 587, // or 587, ask your host/plesk admin which one is supported. 465 is SSL, 587 is TLS
	secure: false, // true for port 465, false for 587
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASSWORD,
	},
	connectionTimeout: 30_000,
	greetingTimeout: 10_000,
	socketTimeout: 30_000,
	logger: process.env.NODE_ENV !== 'production',
	debug: process.env.NODE_ENV !== 'production',
	// tls: { rejectUnauthorized: false }, // Uncomment if CERT errors (while debugging only!)
})

export const sendAlert = async (
	{ subject, body, imageUrls }: { subject: string; body: string; imageUrls?: string[] },
) => {
	const attachments = imageUrls?.map((url, index) => ({
		path: url,
		filename: `image-${index + 1}.jpg`,
		cid: `image-${index + 1}`,
	})) || []

	const htmlBody = `
		${body.split('\n').map(line => `<p>${line}</p>`).join('\n')}
		${attachments.map(att => `<br><img src="cid:${att.cid}" style="max-width: 100%;">`).join('\n')}
	`

	const info = await transporter.sendMail({
		from: '"New Lead From CYO Design" <alerts@cyodesign.com>',
		to: RECIPIENT_EMAIL,
		subject,
		text: body,
		html: htmlBody,
		attachments,
	})
	console.log('Alert sent: %s', info.messageId)
}
