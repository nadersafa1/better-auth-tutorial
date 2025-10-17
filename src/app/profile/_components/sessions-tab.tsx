import { headers } from 'next/headers'
import { Card, CardContent } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import SessionsManagement from './sessions-management'

const SessionsTab = async ({
	currentSessionToken
}: {
	currentSessionToken: string
}) => {
	const sessions = await auth.api.listSessions({
		headers: await headers()
	})

	return (
		<Card>
			<CardContent>
				<SessionsManagement
					currentSessionToken={currentSessionToken}
					sessions={sessions}
				/>
			</CardContent>
		</Card>
	)
}

export default SessionsTab
