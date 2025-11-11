'use client'

import { useRouter } from 'next/navigation'
import BetterAuthActionButton from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth.client'

const InviteInformation = ({
	invitation
}: {
	invitation: { id: string; organizationId: string }
}) => {
	const router = useRouter()

	const acceptInvitation = async () => {
		return await authClient.organization.acceptInvitation(
			{
				invitationId: invitation.id
			},
			{
				onSuccess: async () => {
					await authClient.organization.setActive({
						organizationId: invitation.organizationId
					})
					router.push('/organizations')
				}
			}
		)
	}

	const rejectInvitation = async () => {
		return await authClient.organization.rejectInvitation(
			{
				invitationId: invitation.id
			},
			{ onSuccess: () => router.push('/') }
		)
	}

	return (
		<div className='flex gap-4'>
			<BetterAuthActionButton
				action={acceptInvitation}
				className='flex-grow'
				variant='outline'
			>
				Accept
			</BetterAuthActionButton>
			<BetterAuthActionButton
				action={rejectInvitation}
				className='flex-grow'
				variant='destructive'
			>
				Reject
			</BetterAuthActionButton>
		</div>
	)
}

export default InviteInformation
