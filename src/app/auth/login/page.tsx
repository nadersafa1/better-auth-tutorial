import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SignInTab from './components/sign-in.tab'
import SignUpTab from './components/sign-up.tab'

const LoginPage = () => {
	return (
		<Tabs className='max-auto w-full my-6 px-4' defaultValue='signin'>
			<TabsList>
				<TabsTrigger value='signin'>Sign In</TabsTrigger>
				<TabsTrigger value='signup'>Sign Up</TabsTrigger>
			</TabsList>
			<TabsContent value='signin'>
				<Card>
					<CardHeader className='text-2xl font-bold'>
						<CardTitle>Sign In</CardTitle>
					</CardHeader>
					<CardContent>
						<SignInTab />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='signup'>
				<Card>
					<CardHeader className='text-2xl font-bold'>
						<CardTitle>Sign Up</CardTitle>
					</CardHeader>
					<CardContent>
						<SignUpTab />
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}

export default LoginPage
