'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth.client'

export default function Home() {
	const { data: session, isPending: loading } = authClient.useSession()

	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		authClient.admin
			.hasPermission({ permission: { user: ['list'] } })
			.then(({ data }) => {
				setIsAdmin(data?.success ?? false)
			})
	}, [])

	if (loading) {
		return <p> Loading... </p>
	}

	return (
		<div className='my-6 px-4 max-w-md mx-auto'>
			<div className='text-center space-y-6'>
				<h1 className='text-3xl font-bold'>Welcome to Better Auth Tutorial</h1>
				<p className='text-lg text-gray-600'>
					This is a tutorial for Better Auth
				</p>
				{/* TODO: Add a loading states */}
				{session ? (
					<>
						<p>Welcome {session.user?.name}</p>
						<div className='flex gap-2 justify-center'>
							<Button asChild={true}>
								<Link href='/profile'>Profile</Link>
							</Button>
							{isAdmin && (
								<Button asChild={true}>
									<Link href='/admin'>Admin</Link>
								</Button>
							)}
							<Button
								onClick={() => authClient.signOut()}
								variant='destructive'
							>
								Logout
							</Button>
						</div>
					</>
				) : (
					<Button asChild={true} size='lg'>
						<Link href='/auth/login'>Login</Link>
					</Button>
				)}
			</div>
		</div>
	)
}
