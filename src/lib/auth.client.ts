import { twoFactorClient } from 'better-auth/plugins'
import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
	plugins: [
		twoFactorClient({
			onTwoFactorRedirect: () => {
				window.location.href = '/auth/2fa'
			}
		})
	]
}) // did not add a base url because client and server are on the same URL;
