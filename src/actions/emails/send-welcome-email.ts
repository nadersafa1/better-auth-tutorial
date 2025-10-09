import type { User } from 'better-auth'
import { sendEmailAction } from '../send-email.action'

export const sendWelcomeEmail = async ({ user }: { user: User }) => {
	await sendEmailAction({
		to: user.email,
		subject: 'Welcome to the platform',
		meta: {
			description: 'Click the link below to verify your email'
		}
	})
}
