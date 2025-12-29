<script lang="ts">
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { getLumenStore } from '$lib/stores/lumen.svelte';
	import { onMount } from 'svelte';

	const { children } = $props();

	const auth = getAuthStore();
	const lumen = getLumenStore();

	onMount(async () => {
		await auth.check();
		if (auth.user?.lumen_created) lumen.get();
	});
</script>

{@render children()}
