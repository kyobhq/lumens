<script lang="ts">
	import { getArtifactStore } from '$lib/stores/artifacts.svelte';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { getLumenStore } from '$lib/stores/lumen.svelte';
	import { onMount } from 'svelte';

	const { children } = $props();

	const auth = getAuthStore();
	const lumen = getLumenStore();
	const artifacts = getArtifactStore();

	onMount(async () => {
		await auth.check();

		const passedOnboarding = auth.user?.lumen_created;
		if (!passedOnboarding) return;

		lumen.get();
		artifacts.get();
	});
</script>

{@render children()}
