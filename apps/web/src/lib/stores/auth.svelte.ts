import type { UserTransformer } from '@lumens/api/types';
import { getContext, setContext } from 'svelte';

class AuthStore {
	user = $state<UserTransformer | null>(null);
}

const AUTH_KEY = Symbol('AUTH_STORE');

export function initAuthStore() {
	return setContext(AUTH_KEY, new AuthStore());
}

export function getAuthStore() {
	return getContext<ReturnType<typeof initAuthStore>>(AUTH_KEY);
}
