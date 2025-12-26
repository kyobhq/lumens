import { tuyau } from '$lib/tuyau';
import type { LumenTransformer } from '@lumens/api/types';
import type { CreateLumen } from '@lumens/api/validators/lumens';
import { getContext, setContext } from 'svelte';

class LumenStore {
	lumen = $state<LumenTransformer | null>(null);

	async get() {
		const res = await tuyau.lumens.$get();
		if (res.error) {
			return res.error.value;
		}

		this.lumen = res.data;
	}

	async create(payload: CreateLumen, avatar?: File | null) {
		if (!avatar) return 'Missing avatar for you Lumen';

		const res = await tuyau.lumens.create.$post({ ...payload, avatar });
		if (res.error) {
			return res.error.value;
		}

		this.lumen = res.data;
	}
}

const LUMEN_KEY = Symbol('LUMEN_STORE');

export function initLumenStore() {
	return setContext(LUMEN_KEY, new LumenStore());
}

export function getLumenStore() {
	return getContext<ReturnType<typeof initLumenStore>>(LUMEN_KEY);
}
