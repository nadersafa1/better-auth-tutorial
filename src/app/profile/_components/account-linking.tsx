'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { auth } from '@/lib/auth'
import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/o-auth-provider'
import AccountCard from './account-card'

export type Account = Awaited<
	ReturnType<typeof auth.api.listUserAccounts>
>[number]

const AccountLinking = ({ accounts }: { accounts: Account[] }) => {
	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<h3 className='text-lg font-medium'>Linked Accounts</h3>

				{accounts.length === 0 ? (
					<Card>
						<CardContent className='py-8 text-center text-secondary-muted'>
							No linked accounts found
						</CardContent>
					</Card>
				) : (
					<div className='space-y-3'>
						{accounts.map(account => (
							<AccountCard
								account={account}
								key={account.id}
								provider={account.providerId}
							/>
						))}
					</div>
				)}
			</div>
			<div className='space-y-2'>
				<h3 className='text-lg font-medium'>Link Other Accounts</h3>
				<div className='grid gap-3'>
					{SUPPORTED_OAUTH_PROVIDERS.filter(
						provider => !accounts.find(acc => acc.providerId === provider)
					).map(provider => (
						<AccountCard key={provider} provider={provider} />
					))}
				</div>
			</div>
		</div>
	)
}

export default AccountLinking
