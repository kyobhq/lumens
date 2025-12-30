import type { ArtifactTransformer } from '@lumens/api/types';
import type { CreateArtifact } from '@lumens/api/validators/artifacts';
import { getContext, setContext } from 'svelte';

class ArtifactStore {
	artifacts = $state<Array<ArtifactTransformer>>([]);

	async create(payload: CreateArtifact, file?: File | null) {
		console.log(payload);
	}
}

const ARTIFACT_KEY = Symbol('ARTIFACT_STORE');

export function initArtifactStore() {
	return setContext(ARTIFACT_KEY, new ArtifactStore());
}

export function getArtifactStore() {
	return getContext<ReturnType<typeof initArtifactStore>>(ARTIFACT_KEY);
}
