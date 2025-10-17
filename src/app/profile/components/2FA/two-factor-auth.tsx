'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod/v3'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { PasswordInput } from '@/components/ui/password-input'
import { authClient } from '@/lib/auth.client'
import QRCodeVerify from './qr-code-verify'

const twoFactorAuthSchema = z.object({
	password: z.string().min(1)
})

type TwoFactorAuthSchema = z.infer<typeof twoFactorAuthSchema>
export type TwoFactorData = {
	totpURL: string
	backupCodes: string[]
}

const TwoFactorAuthForm = ({ isEnabled }: { isEnabled: boolean }) => {
	const router = useRouter()
	const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null)

	const form = useForm<TwoFactorAuthSchema>({
		resolver: zodResolver(twoFactorAuthSchema),
		defaultValues: {
			password: ''
		}
	})

	const handleDisable2FA = async (data: TwoFactorAuthSchema) => {
		await authClient.twoFactor.disable(
			{
				password: data.password
			},
			{
				onSuccess: () => {
					form.reset()
					router.refresh()
				},
				onError: error => {
					toast.error(error.error.message || 'Failed to disable 2FA')
				}
			}
		)
	}

	const handleEnable2FA = async (data: TwoFactorAuthSchema) => {
		const result = await authClient.twoFactor.enable({
			password: data.password
		})
		if (result.error) {
			toast.error(
				result.error.message || 'Failed to enable two-factor authentication'
			)
		} else {
			form.reset()
			setTwoFactorData({
				totpURL: result.data.totpURI,
				backupCodes: result.data.backupCodes
			})
		}
	}

	if (twoFactorData != null) {
		return (
			<QRCodeVerify
				{...twoFactorData}
				onDone={() => {
					setTwoFactorData(null)
				}}
			/>
		)
	}

	const { isSubmitting } = form.formState

	return (
		<Form {...form}>
			<form
				className='space-y-4'
				onSubmit={form.handleSubmit(
					isEnabled ? handleDisable2FA : handleEnable2FA
				)}
			>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<PasswordInput {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					className='w-full mt-2'
					disabled={isSubmitting}
					type='submit'
					variant={isEnabled ? 'destructive' : 'default'}
				>
					<LoadingSwap isLoading={isSubmitting}>
						{isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
					</LoadingSwap>
				</Button>
			</form>
		</Form>
	)
}

export default TwoFactorAuthForm
