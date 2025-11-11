'use client'

import { toast } from 'sonner'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { authClient } from '@/lib/auth.client'

const OrganizationSelect = () => {
	const { data: activeOrganization } = authClient.useActiveOrganization()
	const { data: organizations } = authClient.useListOrganizations()

	const handleOrganizationChange = (organizationId: string) => {
		authClient.organization.setActive(
			{ organizationId },
			{
				onError: error => {
					toast.error(error.error.message || 'Failed to switch organizations')
				}
			}
		)
	}

	if (!organizations || organizations.length === 0) {
		return null
	}

	return (
		<Select
			onValueChange={handleOrganizationChange}
			value={activeOrganization?.id ?? ''}
		>
			<SelectTrigger>
				<SelectValue placeholder='Select an organization' />
			</SelectTrigger>
			<SelectContent>
				{organizations.map(organization => (
					<SelectItem key={organization.id} value={organization.id}>
						{organization.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default OrganizationSelect
