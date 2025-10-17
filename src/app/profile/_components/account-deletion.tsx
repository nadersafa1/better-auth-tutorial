'use client'

import BetterAuthActionButton from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth.client'

const AccountDeletion = () => {
	return (
		<BetterAuthActionButton
			action={() => authClient.deleteUser({ callbackURL: '/' })}
			className='w-full'
			requireAreYouSure={true}
			successMessage='Account deletion initiated. Please check your email for a confirmation link.'
			variant='destructive'
		>
			Delete Account Permenantly
		</BetterAuthActionButton>
	)
}

export default AccountDeletion
