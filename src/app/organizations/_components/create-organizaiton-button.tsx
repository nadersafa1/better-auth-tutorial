'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { authClient } from '@/lib/auth.client'

const createOrganizationSchema = z.object({
	name: z.string().min(1)
})

type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>

const CreateOrganizaitonButton = () => {
	const router = useRouter()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const form = useForm<CreateOrganizationSchema>({
		resolver: zodResolver(createOrganizationSchema),
		defaultValues: {
			name: ''
		}
	})

	const { isSubmitting } = form.formState

	async function handleCreateOrganization(data: CreateOrganizationSchema) {
		const res = await authClient.organization.create({
			name: data.name,
			slug: data.name
				.trim()
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
		})

		if (res.error) {
			toast.error(res.error.message || 'Failed to create organization')
		} else {
			form.reset()
			setIsDialogOpen(false)
			await authClient.organization.setActive({ organizationId: res.data.id })
			router.refresh()
		}
	}

	return (
		<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
			<DialogTrigger asChild={true}>
				<Button>Create Organization</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Organization</DialogTitle>
					<DialogDescription>
						Create a new organization to collaborate with your team
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						className='space-y-4'
						onSubmit={form.handleSubmit(handleCreateOrganization)}
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className='flex flex-wrap gap-2'>
							<Button className='w-full' disabled={isSubmitting} type='submit'>
								<LoadingSwap isLoading={isSubmitting}>Create</LoadingSwap>
							</Button>
							<Button
								className='w-full'
								onClick={() => setIsDialogOpen(false)}
								type='button'
								variant='outline'
							>
								Cancel
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default CreateOrganizaitonButton
