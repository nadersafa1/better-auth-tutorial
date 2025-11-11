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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { authClient } from '@/lib/auth.client'

const createInviteSchema = z.object({
	email: z.email().min(1).trim(),
	role: z.enum(['admin', 'member', 'coach', 'player']).default('member').optional()
})

type CreateInviteSchema = z.infer<typeof createInviteSchema>

const CreateInviteButton = () => {
	const router = useRouter()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const form = useForm<CreateInviteSchema>({
		resolver: zodResolver(createInviteSchema),
		defaultValues: {
			email: '',
			role: 'member'
		}
	})

	const { isSubmitting } = form.formState

	async function handleCreateInvite(data: CreateInviteSchema) {
		await authClient.organization.inviteMember(
			{
				email: data.email,
				role: data.role ?? 'member'
			},
			{
				onSuccess: () => {
					form.reset()
					setIsDialogOpen(false)
					router.refresh()
				},
				onError: error => {
					toast.error(error.error.message || 'Failed to invite member')
				}
			}
		)
	}

	return (
		<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
			<DialogTrigger asChild={true}>
				<Button>Invite Member</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite New Member</DialogTitle>
					<DialogDescription>
						Invite a new member to your organization
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						className='space-y-4'
						onSubmit={form.handleSubmit(handleCreateInvite)}
					>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type='email' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='role'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select a role' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='admin'>Admin</SelectItem>
											<SelectItem value='member'>Member</SelectItem>
											<SelectItem value='coach'>Coach</SelectItem>
											<SelectItem value='player'>Player</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className='flex flex-wrap gap-2'>
							<Button className='w-full' disabled={isSubmitting} type='submit'>
								<LoadingSwap isLoading={isSubmitting}>Invite</LoadingSwap>
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

export default CreateInviteButton
