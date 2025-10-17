'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '@/components/ui/button'
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
import type { TwoFactorData } from './two-factor-auth'

const qrSchema = z.object({
	code: z.string().length(6)
})

type QRSchema = z.infer<typeof qrSchema>

export default function QRCodeVerify({
	totpURL,
	backupCodes,
	onDone
}: TwoFactorData & { onDone: () => void }) {
	const router = useRouter()
	const [successfullyVerified, setSuccessfullyVerified] = useState(false)
	const form = useForm<QRSchema>({
		resolver: zodResolver(qrSchema),
		defaultValues: {
			code: ''
		}
	})

	const handleVerify = async (data: QRSchema) => {
		await authClient.twoFactor.verifyTotp(
			{
				code: data.code
			},
			{
				onSuccess: () => {
					setSuccessfullyVerified(true)
					router.refresh()
				},
				onError: error => {
					toast.error(error.error.message || 'Failed to verify code')
				}
			}
		)
	}

	const { isSubmitting } = form.formState

	if (successfullyVerified) {
		return (
			<>
				<p className='text-sm text-muted-foreground mb-2'>
					Save these backup codes for emergency access
				</p>
				<div className='grid grid-cols-2 gap-2 mb-4'>
					{backupCodes.map(code => (
						<div className='text-sm font-mono' key={code}>
							{code}
						</div>
					))}
				</div>
				<Button className='w-full mt-2' onClick={onDone}>
					Done
				</Button>
			</>
		)
	}

	return (
		<div className='space-y-4'>
			<p className='text-muted-foreground'>
				Scan the QR code with your authenticator app and enter the code here
			</p>
			<Form {...form}>
				<form className='space-y-4' onSubmit={form.handleSubmit(handleVerify)}>
					<FormField
						control={form.control}
						name='code'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Code</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button className='w-full mt-2' disabled={isSubmitting} type='submit'>
						<LoadingSwap isLoading={isSubmitting}>Submit Code</LoadingSwap>
					</Button>
				</form>
			</Form>
			<div>
				<QRCode size={256} value={totpURL} />
			</div>
		</div>
	)
}
