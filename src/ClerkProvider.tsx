import { ClerkProp, ClerkProvider, ClerkProviderProps } from '@clerk/clerk-react'
import { PropsWithChildren } from 'react'
import { getClerkInstance } from './clerk/instance'

export const HubClerkProvider = ({ children }: PropsWithChildren) => {
	const clerkProps: Partial<ClerkProviderProps> = {
		publishableKey: `${import.meta.env.VITE_CLERK_PUBLIC_KEY}`,
	}

    clerkProps.Clerk = getClerkInstance({ publishableKey: import.meta.env.VITE_CLERK_PUBLIC_KEY }) as unknown as ClerkProp

	return <ClerkProvider {...(clerkProps as ClerkProviderProps)}>{children}</ClerkProvider>
}