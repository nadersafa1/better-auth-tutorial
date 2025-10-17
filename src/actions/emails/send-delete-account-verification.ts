import type { User } from 'better-auth'
import { sendEmailAction } from '../send-email.action'

export const sendDeleteAccountVerification = async ({
	user,
	url
}: {
	user: User
	url: string
}) => {
	await sendEmailAction({
		to: user.email,
		subject: 'Delete Account Verification',
		meta: {
			description: 'Click the link below to delete your account',
			link: url
		}
	})
}
