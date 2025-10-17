'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import BetterAuthActionButton from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth.client'

const PassKeyButton = () => {
	const router = useRouter()
	const { refetch } = authClient.useSession()

	useEffect(() => {
		authClient.signIn.passkey(
			{ autoFill: true },
			{
				onSuccess() {
					refetch()
					router.push('/')
				}
			}
		)
	}, [router, refetch])

	return (
		<BetterAuthActionButton
			action={() =>
				authClient.signIn.passkey(undefined, {
					onSuccess() {
						refetch()
						router.push('/')
					},
					onError(error) {
						toast.error(error.error.message)
					}
				})
			}
			className='w-full'
			variant='outline'
		>
			Use Passkey
		</BetterAuthActionButton>
	)
}

export default PassKeyButton
