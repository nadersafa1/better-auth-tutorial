'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authClient } from '@/lib/auth.client'
import EmialVerification from './components/email-verification'
import SignInTab from './components/sign-in.tab'
import SignUpTab from './components/sign-up.tab'

type SelectedTab = 'signin' | 'signup' | 'email-verification'

const LoginPage = () => {
	const [email, setEmail] = useState('')
	const [selectedTab, setSelectedTab] = useState<SelectedTab>('signin')

	const router = useRouter()

	useEffect(() => {
		authClient.getSession().then(session => {
			if (session?.data) {
				router.push('/')
			}
		})
	}, [router])

	const openEmailVerification = (email: string) => {
		setEmail(email)
		setSelectedTab('email-verification')
	}

	return (
		<Tabs
			className='max-auto w-full my-6 px-4'
			onValueChange={value => setSelectedTab(value as SelectedTab)}
			value={selectedTab}
		>
			{['signin', 'signup'].includes(selectedTab) && (
				<TabsList>
					<TabsTrigger value='signin'>Sign In</TabsTrigger>
					<TabsTrigger value='signup'>Sign Up</TabsTrigger>
				</TabsList>
			)}
			<TabsContent value='signin'>
				<Card>
					<CardHeader className='text-2xl font-bold'>
						<CardTitle>Sign In</CardTitle>
					</CardHeader>
					<CardContent>
						<SignInTab openEmailVerification={openEmailVerification} />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='signup'>
				<Card>
					<CardHeader className='text-2xl font-bold'>
						<CardTitle>Sign Up</CardTitle>
					</CardHeader>
					<CardContent>
						<SignUpTab openEmailVerification={openEmailVerification} />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='email-verification'>
				<Card>
					<CardHeader className='text-2xl font-bold'>
						<CardTitle>Verify Your Email</CardTitle>
					</CardHeader>
					<CardContent>
						<EmialVerification email={email} />
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}

export default LoginPage
