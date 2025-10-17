'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { DialogDescription } from '@radix-ui/react-dialog'
import type { Passkey } from 'better-auth/plugins/passkey'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod/v3'
import BetterAuthActionButton from '@/components/auth/better-auth-action-button'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
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

const passkeyManagementSchema = z.object({
	name: z.string().min(1)
})

type PassKeyManagementSchema = z.infer<typeof passkeyManagementSchema>

const PassKeyManagement = ({ passKeys }: { passKeys: Passkey[] }) => {
	const router = useRouter()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const form = useForm<PassKeyManagementSchema>({
		resolver: zodResolver(passkeyManagementSchema),
		defaultValues: {
			name: ''
		}
	})

	const handleAddPassKey = async (data: PassKeyManagementSchema) => {
		await authClient.passkey.addPasskey(data, {
			onError: error => {
				toast.error(error.error.message || 'Failed to add passkey')
			},
			onSuccess: () => {
				router.refresh()
				setIsDialogOpen(false)
			}
		})
	}

	const handleDeletePassKey = async (passKeyId: string) => {
		return await authClient.passkey.deletePasskey(
			{ id: passKeyId },
			{
				onSuccess: () => router.refresh()
			}
		)
	}

	const { isSubmitting } = form.formState

	return (
		<div className='space-y-6'>
			{passKeys.length === 0 ? (
				<Card>
					<CardHeader>
						<CardTitle>No passkeys yet</CardTitle>
						<CardDescription>
							Add your first passkey for secure, passwordless login.
						</CardDescription>
					</CardHeader>
				</Card>
			) : (
				<div className='space-y-4'>
					{passKeys.map(passKey => (
						<Card key={passKey.id}>
							<CardHeader className='flex items-center justify-between gap-2'>
								<div className='space-y-1'>
									<CardTitle>{passKey.name}</CardTitle>
									<CardDescription>
										Created {new Date(passKey.createdAt).toLocaleDateString()}
									</CardDescription>
								</div>
								<BetterAuthActionButton
									action={() => handleDeletePassKey(passKey.id)}
									requireAreYouSure={true}
									size='icon'
									variant='destructive'
								>
									<Trash2 />
								</BetterAuthActionButton>
							</CardHeader>
						</Card>
					))}
				</div>
			)}
			<Dialog
				onOpenChange={open => {
					if (open) {
						form.reset()
					}
					setIsDialogOpen(open)
				}}
				open={isDialogOpen}
			>
				<DialogTrigger asChild={true}>
					<Button>New Passkey</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Passkey</DialogTitle>
						<DialogDescription>
							Create a new passkey for secure, passwordless login.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							className='space-y-4'
							onSubmit={form.handleSubmit(handleAddPassKey)}
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

							<Button
								className='w-full mt-2'
								disabled={isSubmitting}
								type='submit'
							>
								<LoadingSwap isLoading={isSubmitting}>Submit</LoadingSwap>
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default PassKeyManagement
