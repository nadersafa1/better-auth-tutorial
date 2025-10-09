import { headers } from 'next/headers'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { auth } from '@/lib/auth'
import ChangePasswordForm from './change-password-form'
import SetPasswordButton from './set-password-button'

const SecurityTab = async ({ email }: { email: string }) => {
	const accounts = await auth.api.listUserAccounts({
		headers: await headers()
	})

	const hasPasswordAccount = accounts?.some(
		account => account.providerId === 'credential'
	)
	return (
		<div className='space-y-6'>
			{hasPasswordAccount ? (
				<Card>
					<CardHeader>
						<CardTitle>Change Password</CardTitle>
						<CardDescription>
							Update your password for improved security
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChangePasswordForm />
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Set Password</CardTitle>
						<CardDescription>
							We will send you a password reset email to create a new password
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SetPasswordButton email={email} />
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default SecurityTab
