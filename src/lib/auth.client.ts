import { ac, admin, coach, member, owner, player } from '@/components/auth/permissions'
import {
	adminClient,
	organizationClient,
	passkeyClient
} from 'better-auth/client/plugins'
import { twoFactorClient } from 'better-auth/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
	plugins: [
		twoFactorClient({
			onTwoFactorRedirect: () => {
				window.location.href = '/auth/2fa'
			}
		}),
		passkeyClient(),
		adminClient(),
		organizationClient(
			{ac,
			roles: {
				  admin,
					owner,
					coach,
					player,
					member
			}}
		)
	]
}) // did not add a base url because client and server are on the same URL;
