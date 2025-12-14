import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { tuyau } from '$lib/tuyau';
import type { UserTransformer } from '@lumens/api/types';
import type { CreateUser, VerifyEmail } from '@lumens/api/validators/users';
import { getContext, setContext } from 'svelte';

class AuthStore {
	user = $state<UserTransformer | null>(null);

	async signup(payload: CreateUser) {
		const res = await tuyau.signup.$post(payload);
		if (res.error) {
			return res.error.value;
		}

		this.user = res.data;
		return goto(resolve('/(app)/c'));
	}

	async verifyEmail(payload: VerifyEmail) {
		const res = await tuyau['verify-email'].$post(payload);
		if (res.error) {
			console.error(res.error);
		}
	}
}

const AUTH_KEY = Symbol('AUTH_STORE');

export function initAuthStore() {
	return setContext(AUTH_KEY, new AuthStore());
}

export function getAuthStore() {
	return getContext<ReturnType<typeof initAuthStore>>(AUTH_KEY);
}
