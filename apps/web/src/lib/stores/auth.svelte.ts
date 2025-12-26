import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { page } from '$app/state';
import { tuyau } from '$lib/tuyau';
import type { UserTransformer } from '@lumens/api/types';
import type { CreateUser, LoginUser, VerifyEmail } from '@lumens/api/validators/users';
import { getContext, setContext } from 'svelte';
import { delay } from '$lib/utils/delay';
import type { AnyValidator, FormContext } from 'ui/components/forms';

const MIN_SUBMIT_DELAY = 500;

class AuthStore {
	user = $state<UserTransformer | null>(null);

	async signup(payload: CreateUser, form: FormContext<AnyValidator>) {
		const [res] = await Promise.all([tuyau.signup.$post(payload), delay(MIN_SUBMIT_DELAY)]);

		if (res.error) {
			form.setErrors(res.error.value);
			return;
		}

		this.user = res.data;
		return goto(resolve('/(app)/home'));
	}

	async signin(payload: LoginUser, form: FormContext<AnyValidator>) {
		const [res] = await Promise.all([tuyau.signin.$post(payload), delay(MIN_SUBMIT_DELAY)]);

		if (res.error) {
			form.setErrors(res.error.value);
			return;
		}

		this.user = res.data;
		return goto(resolve('/(app)/home'));
	}

	async check() {
		const onLandingPage = page.route.id?.includes('(landing)');

		const res = await tuyau.check.$get();
		if (res.error) {
			if (!onLandingPage) return goto(resolve('/(landing)/signin'));
			return;
		}

		this.user = res.data;
		return goto(resolve('/home'));
	}

	async verifyEmail(payload: VerifyEmail, form: FormContext<AnyValidator>) {
		const res = await tuyau['verify-email'].$post(payload);
		if (res.error) {
			form.setErrors(res.error.value);
			return false;
		}
		return true;
	}
}

const AUTH_KEY = Symbol('AUTH_STORE');

export function initAuthStore() {
	return setContext(AUTH_KEY, new AuthStore());
}

export function getAuthStore() {
	return getContext<ReturnType<typeof initAuthStore>>(AUTH_KEY);
}
