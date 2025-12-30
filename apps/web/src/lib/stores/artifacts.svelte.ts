import { tuyau } from '$lib/tuyau';
import type { ArtifactTransformer } from '@lumens/api/types';
import type { CreateArtifact } from '@lumens/api/validators/artifacts';
import { getContext, setContext } from 'svelte';

class ArtifactStore {
	artifacts = $state<Array<ArtifactTransformer>>([]);

	async get() {
		const res = await tuyau.artifacts.$get();
		if (res.error) {
			console.error(res.error);
			return;
		}

		this.artifacts = res.data;
	}

	async create(payload: CreateArtifact, files?: File[] | null) {
		const res = await tuyau.artifacts.create.$post({ ...payload, files: files as any });
		if (res.error) {
			console.error(res.error);
			return;
		}

		this.artifacts.unshift(res.data);
	}
}

const ARTIFACT_KEY = Symbol('ARTIFACT_STORE');

export function initArtifactStore() {
	return setContext(ARTIFACT_KEY, new ArtifactStore());
}

export function getArtifactStore() {
	return getContext<ReturnType<typeof initArtifactStore>>(ARTIFACT_KEY);
}
