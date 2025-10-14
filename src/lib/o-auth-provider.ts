import type { ComponentProps, ElementType } from 'react'
import { FcGoogle } from 'react-icons/fc'

// biome-ignore lint/style/useNamingConvention: this is a constant
export const SUPPORTED_OAUTH_PROVIDERS = ['google']

export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

// biome-ignore lint/style/useNamingConvention: this is a constant
export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<
	SupportedOAuthProvider,
	{ name: string; icon: ElementType<ComponentProps<'svg'>> }
> = {
	google: {
		name: 'Google',
		icon: FcGoogle
	}
}
