import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createAuthMiddleware } from 'better-auth/api'
import { nextCookies } from 'better-auth/next-js'
import { sendPasswordResetEmail } from '@/actions/emails/send-password-reset-email'
import { sendVerificationEmail } from '@/actions/emails/send-verification-email'
import { sendWelcomeEmail } from '@/actions/emails/send-welcome-email'
import { db } from '@/drizzle/db'
import * as schema from '@/drizzle/schema'

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		requireEmailVerification: true,
		sendResetPassword: sendPasswordResetEmail
	},
	emailVerification: {
		autoSignInAfterVerification: true,
		expiresIn: 60 * 60 * 24, // 1 day
		sendOnSignUp: true,
		sendVerificationEmail: sendVerificationEmail
	},
	session: {
		// cookieCache is used to enable caching of user sessions
		cookieCache: {
			enabled: true,
			maxAge: 60 // 1minute
		}
	},
	plugins: [
		// nextCookies makes sure that the application knows how to set cookies inside of next js on server side. so its required for nextjs
		nextCookies()
	],
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema
	}),
	hooks: {
		after: createAuthMiddleware(async ctx => {
			if (ctx.path.startsWith('signup')) {
				const user = ctx.context.newSession?.user ?? {
					name: ctx.body.name,
					email: ctx.body.email
				}
				if (user) {
					await sendWelcomeEmail(user.email)
				}
			}
		})
	}
})
