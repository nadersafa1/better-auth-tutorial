'use client'
import type { Session } from 'better-auth'
import { useRouter } from 'next/navigation'
import BetterAuthActionButton from '@/components/auth/better-auth-action-button'
import { authClient } from '@/lib/auth.client'
import SessionCard from './session-card'

const SessionsManagement = ({
	currentSessionToken,
	sessions
}: {
	currentSessionToken: string
	sessions: Session[]
}) => {
	const currentSession = sessions.find(
		session => session.token === currentSessionToken
	)
	const otherSessions = sessions.filter(
		session => session.token !== currentSessionToken
	)

	const router = useRouter()

	const revokeOtherSessions = async () => {
		return await authClient.revokeOtherSessions(undefined, {
			onSuccess: () => router.refresh()
		})
	}

	if (!currentSession) {
		return <div>No current session found</div>
	}

	return (
		<div className='space-y-6'>
			{currentSession && (
				<SessionCard isCurrentSession={true} session={currentSession} />
			)}
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-medium'>Other Active Sessions</h2>
					{otherSessions.length > 0 && (
						<BetterAuthActionButton
							action={revokeOtherSessions}
							size='sm'
							successMessage='Other sessions revoked'
							variant='destructive'
						>
							Revoke Other Sessions
						</BetterAuthActionButton>
					)}
				</div>
			</div>
			{otherSessions.length > 0 ? (
				otherSessions.map(session => (
					<SessionCard key={session.token} session={session} />
				))
			) : (
				<p className='text-muted-foreground text-center'>
					No other active sessions
				</p>
			)}
		</div>
	)
}

export default SessionsManagement
