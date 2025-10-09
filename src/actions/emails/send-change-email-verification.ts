import type { User } from 'better-auth'
import { sendEmailAction } from '../send-email.action'

export const sendChangeEmailVerification = async ({
	url,
	newEmail
}: {
	user: User
	url: string
	newEmail: string
}) => {
	await sendEmailAction({
		to: newEmail,
		subject: 'Change Email Verification',
		meta: {
			description: `Click the link below to verify your new email: ${newEmail}`,
			link: url
		}
	})
}
