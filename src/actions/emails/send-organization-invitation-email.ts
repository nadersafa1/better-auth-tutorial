import type { User } from 'better-auth'
import type { Invitation, Organization } from 'better-auth/plugins/organization'
import { sendEmailAction } from '../send-email.action'

export const sendOrganizationInvitationEmail = async ({
	email,
	organization,
	inviter,
	invitation
}: {
	email: string
	organization: Organization
	inviter: User
	invitation: Invitation
}) => {
	await sendEmailAction({
		to: email,
		subject: 'Organization Invitation',
		meta: {
			description: `You have been invited to join ${organization.name} by ${inviter.name} as ${invitation.role}. Click the link below to accept the invitation`,
			link: `${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}`,
			linkText: 'Accept Invitation'
		}
	})
}
