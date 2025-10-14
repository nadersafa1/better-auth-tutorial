import { headers } from 'next/headers'
import { Card, CardContent } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import AccountLinking from './account-linking'

const LinkedAccountsTab = async () => {
	const accounts = await auth.api.listUserAccounts({
		headers: await headers()
	})

	const nonCredentialAccounts = accounts?.filter(
		account => account.providerId !== 'credential'
	)
	return (
		<Card>
			<CardContent>
				<AccountLinking accounts={nonCredentialAccounts} />
			</CardContent>
		</Card>
	)
}

export default LinkedAccountsTab
