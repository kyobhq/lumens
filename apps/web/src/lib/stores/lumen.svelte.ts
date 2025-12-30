import { tuyau } from '$lib/tuyau';
import type { LumenTransformer } from '@lumens/api/types';
import type { CreateLumen } from '@lumens/api/validators/lumens';
import { getContext, setContext } from 'svelte';
import type { AnyValidator, FormContext } from 'ui/components/forms';

class LumenStore {
	lumen = $state<LumenTransformer | null>(null);

	async get() {
		const res = await tuyau.lumens.$get();
		if (res.error) {
			console.error(res.error);
			return;
		}

		this.lumen = res.data;
	}

	async create(payload: CreateLumen, avatar: File | null, form: FormContext<AnyValidator>) {
		if (!avatar) {
			form.setErrors({ errors: [{ field: 'avatar', message: 'Your Lumen needs an avatar' }] });
			return true;
		}

		const res = await tuyau.lumens.create.$post({ ...payload, avatar });
		if (res.error) {
			form.setErrors(res.error.value);
			return true;
		}

		this.lumen = res.data;
		return false;
	}
}

const LUMEN_KEY = Symbol('LUMEN_STORE');

export function initLumenStore() {
	return setContext(LUMEN_KEY, new LumenStore());
}

export function getLumenStore() {
	return getContext<ReturnType<typeof initLumenStore>>(LUMEN_KEY);
}
