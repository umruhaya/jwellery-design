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
	debug: false,
	// tls: { rejectUnauthorized: false }, // Uncomment if CERT errors (while debugging only!)
})

export type SendEmailArgs = {
	subject: string
	firstName: string
	lastName: string
	email: string
	phone: string
	city: string
	country: string
}

type SendEmailAlertArgs = SendEmailArgs & {
	imageUrls: string[]
}

export const sendAlert = async (
	{ subject, firstName, lastName, email, phone, city, country, imageUrls }: SendEmailAlertArgs,
) => {
	const attachments = imageUrls.map((url, index) => ({
		path: url,
		filename: `image-${index + 1}.jpg`,
		cid: `image-${index + 1}`,
	}))

	const htmlBody = `
		<p>First Name: ${firstName}</p>
		<p>Last Name: ${lastName}</p>
		<p>Email: ${email}</p>
		<p>Phone: ${phone}</p>
		<p>City: ${city}</p>
		<p>Country: ${country}</p>
		<strong>Designs:</strong>
		${attachments.map(att => `<br><img src="cid:${att.cid}" style="max-width: 100%;">`).join('\n')}
	`

	let body = `
		First Name: ${firstName}
		Last Name: ${lastName}
		Email: ${email}
		Phone: ${phone}
		City: ${city}
		Country: ${country}

		\n\nDesigns: ${imageUrls.join('\n')}
	`

	RECIPIENT_EMAIL.split(',').forEach(async email => {
		const info = await transporter.sendMail({
			from: '"CYO Design" <alerts@cyodesign.com>',
			to: email,
			subject,
			text: body,
			html: htmlBody,
			attachments,
		})
		console.log('Alert sent: %s to %s', info.messageId, email)
	})
}

export const sendEmailLead = async (leadEmail: string) => {
	RECIPIENT_EMAIL.split(',').forEach(async recipientEmail => {
		const info = await transporter.sendMail({
			from: '"CYO Design" <alerts@cyodesign.com>',
			to: recipientEmail,
			subject: 'Lead Submitted',
			text: `Lead Submitted: ${leadEmail}`,
			html: `<p>Lead Submitted: ${leadEmail}</p>`,
		})
		console.log('Lead sent: %s to %s', info.messageId, recipientEmail)
	})
}
