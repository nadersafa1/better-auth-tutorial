'use client'
import type { Session } from 'better-auth'
import { Monitor, Smartphone, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UAParser } from 'ua-parser-js'
import BetterAuthActionButton from '@/components/auth/better-auth-action-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/auth.client'

const SessionCard = ({
	session,
	isCurrentSession = false
}: {
	session: Session
	isCurrentSession?: boolean
}) => {
	const router = useRouter()
	const ua = session.userAgent ? UAParser(session.userAgent) : null

	const getBrowserInformation = () => {
		if (!ua) {
			return 'Unkown Device'
		}

		const browser = ua.browser
		const os = ua.os

		if (!(browser.name || os.name)) {
			return 'Unkown Device'
		}

		if (!browser.name) {
			return `${os.name}`
		}

		if (!os.name) {
			return `${browser.name}`
		}

		return `${browser.name} on ${os.name}`
	}

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(date))
	}

	const revokeSession = async () => {
		return await authClient.revokeSession(
			{ token: session.token },
			{
				onSuccess: () => {
					router.refresh()
					toast.success('Session revoked')
				}
			}
		)
	}

	return (
		<Card>
			<CardHeader className='flex flex-row justify-between items-center'>
				<CardTitle>{getBrowserInformation()}</CardTitle>
				{isCurrentSession && <Badge>Current Session</Badge>}
			</CardHeader>
			<CardContent>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						{ua?.device.type === 'mobile' ? <Smartphone /> : <Monitor />}
						<div>
							<p className='text-sm text-muted-foreground'>
								Created: {formatDate(new Date(session.createdAt))}
							</p>
							<p className='text-sm text-muted-foreground'>
								Expires: {formatDate(new Date(session.expiresAt))}
							</p>
						</div>
					</div>
					{!isCurrentSession && (
						<BetterAuthActionButton
							action={revokeSession}
							size='sm'
							successMessage='Session revoked'
							variant='destructive'
						>
							<Trash />
						</BetterAuthActionButton>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

export default SessionCard
