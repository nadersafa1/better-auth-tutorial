'use client'

import { Shield, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BetterAuthActionButton from '@/components/auth/better-auth-action-button'
import { Card, CardContent } from '@/components/ui/card'
import { authClient } from '@/lib/auth.client'
import {
	SUPPORTED_OAUTH_PROVIDERS_DETAILS,
	type SupportedOAuthProvider
} from '@/lib/o-auth-provider'
import type { Account } from './account-linking'

const AccountCard = ({
	account,
	provider
}: {
	account?: Account
	provider: string
}) => {
	const providerDetails = SUPPORTED_OAUTH_PROVIDERS_DETAILS[
		provider as SupportedOAuthProvider
	] ?? { name: provider, icon: <Shield /> }

	const router = useRouter()

	const linkAccount = async () => {
		return await authClient.linkSocial({
			provider,
			callbackURL: '/profile'
		})
	}

	const unlinkAccount = async () => {
		if (!account) {
			return Promise.resolve({ error: { message: 'Account not found' } })
		}
		return await authClient.unlinkAccount(
			{
				accountId: account.accountId,
				providerId: provider
			},
			{
				onSuccess: () => {
					router.refresh()
				}
			}
		)
	}

	return (
		<Card>
			<CardContent>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						{<providerDetails.icon className='size-5' />}
						{account == null ? (
							<p className='text-smallint text-muted-foreground'>
								Connect your {providerDetails.name} account for easier sign in
							</p>
						) : (
							<p className='text-smallint text-muted-foreground'>
								Linked on {new Date(account.createdAt).toLocaleDateString()}
							</p>
						)}
					</div>
					{account == null ? (
						<BetterAuthActionButton
							action={linkAccount}
							size='sm'
							variant='outline'
						>
							Link
						</BetterAuthActionButton>
					) : (
						<BetterAuthActionButton
							action={unlinkAccount}
							size='sm'
							variant='destructive'
						>
							<Trash2 />
							Unlink
						</BetterAuthActionButton>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

export default AccountCard
