import type { FapiRequestInit, FapiResponse } from '@clerk/clerk-js/dist/types/core/fapiClient'
import { Clerk } from '@clerk/clerk-js/headless'
import SecureStorageTokenCache from './cache';
import { BuildClerkOptions } from './types';

const KEY = '__clerk_client_jwt';

let __internal_clerk: Clerk | undefined

export function createClerkInstance(ClerkClass: typeof Clerk) {
	return (options?: BuildClerkOptions): Clerk => {
		const {
			publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
			tokenCache = SecureStorageTokenCache,
		} = options || {}

		if (!__internal_clerk && !publishableKey) {
			throw new Error('Missing Publishable Key')
		}

		// Support "hot-swapping" the Clerk instance at runtime. See JS-598 for additional details.
		const hasKeyChanged = __internal_clerk && !!publishableKey && publishableKey !== __internal_clerk.publishableKey

		if (!__internal_clerk || hasKeyChanged) {
			if (hasKeyChanged) {
				tokenCache.clearToken?.(KEY)
			}

			const getToken = tokenCache.getToken
			const saveToken = tokenCache.saveToken
			__internal_clerk = new ClerkClass(publishableKey)

			__internal_clerk.__unstable__onBeforeRequest(async (requestInit: FapiRequestInit) => {
				// Instructs the backend to parse the api token from the Authorization header.
				requestInit.url?.searchParams.append('_is_native', '1')

				try {
					const jwt = await getToken(KEY);
					console.log('Retrieved JWT:', jwt);
					(requestInit.headers as Headers).set('authorization', jwt || '')
				} catch (error) {
					console.error('Error retrieving token:', error);
				}
			})

			__internal_clerk.__unstable__onAfterResponse(async (_: FapiRequestInit, response: FapiResponse<unknown>) => {
				const authHeader = response.headers.get('authorization')
				if (authHeader) {
					try {
						await saveToken(KEY, authHeader)
						console.log('Saved JWT:', authHeader);
					} catch (error) {
						console.error('Error saving token:', error);
					}
				}
			})
		}
		return __internal_clerk!
	}
}

export const getClerkInstance = createClerkInstance(Clerk)