import { headers } from 'next/headers'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { auth } from '@/lib/auth'
import TwoFactorAuth from './2FA/two-factor-auth'
import ChangePasswordForm from './change-password-form'
import SetPasswordButton from './set-password-button'
import PassKeyManagement from './pass-keys/pass-key-management'

const SecurityTab = async ({
	email,
	isTwoFactorEnabled
}: {
	email: string
	isTwoFactorEnabled: boolean
}) => {
	const [passKeys, accounts] = await Promise.all([
		auth.api.listPasskeys({
			headers: await headers()
		}),
		auth.api.listUserAccounts({
			headers: await headers()
		})
	])

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
			{hasPasswordAccount && (
				<Card>
					<CardHeader className='flex items-center justify-between gap-2'>
						<CardTitle>Two-Factor Authentication</CardTitle>
						<Badge variant={isTwoFactorEnabled ? 'default' : 'secondary'}>
							{isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
						</Badge>
					</CardHeader>
					<CardContent>
						<TwoFactorAuth isEnabled={isTwoFactorEnabled} />
					</CardContent>
				</Card>
			)}
			<Card>
				<CardHeader>
					<CardTitle>Passkeys</CardTitle>
				</CardHeader>
				<CardContent>
					<PassKeyManagement passKeys={passKeys} />
				</CardContent>
			</Card>
		</div>
	)
}

export default SecurityTab
