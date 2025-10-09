import {
	ArrowLeftIcon,
	Key,
	LinkIcon,
	Shield,
	Trash,
	User,
	UserCircle
} from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@/lib/auth'
import ProfileUpdateForm from './components/profile-update-form'

const ProfilePage = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) {
		return redirect('/auth/login')
	}

	return (
		<div className='max-w-4xl mx-auto my-6 px-4'>
			<div className='mb-8'>
				<Link className='text-sm font-medium flex items-center gap-2' href='/'>
					<ArrowLeftIcon className='w-4 h-4' />
					Back to Home
				</Link>
			</div>
			<div className='flex flex-col gap-4'>
				<div className='flex items-center gap-2'>
					{session.user?.image ? (
						<Image
							alt={session.user?.name}
							height={32}
							src={session.user?.image ?? '/placeholder.svg'}
							width={32}
						/>
					) : (
						<UserCircle className='size-16 text-muted-foreground' />
					)}
					<div className='flex-1'>
						<div className='flex gap-1 justify-between items-start flex-col'>
							<h1 className='text-3xl font-bold'>
								{session.user?.name ?? 'User Profile'}
							</h1>
							{/* TODO: Add Role Badge */}
							{/* <Badge>{session.user?.role}</Badge> */}
							<p className='text-sm text-muted-foreground'>
								{session.user?.email}
							</p>
						</div>
					</div>
				</div>
				<Tabs className='space-y-2' defaultValue='profile'>
					<TabsList className='grid w-full grid-cols-5'>
						<TabsTrigger value='profile'>
							<User />
							<span className='max-sm:hidden'>Profile</span>
						</TabsTrigger>
						<TabsTrigger value='security'>
							<Shield />
							<span className='max-sm:hidden'>Security</span>
						</TabsTrigger>
						<TabsTrigger value='sessions'>
							<Key />
							<span className='max-sm:hidden'>Sessions</span>
						</TabsTrigger>
						<TabsTrigger value='accounts'>
							<LinkIcon />
							<span className='max-sm:hidden'>Accounts</span>
						</TabsTrigger>
						<TabsTrigger value='danger'>
							<Trash />
							<span className='max-sm:hidden'>Danger</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value='profile'>
						<Card>
							<CardContent>
								<ProfileUpdateForm user={session.user} />
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export default ProfilePage
