<script lang="ts">
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { onMount } from 'svelte';

	const { children } = $props();

	const auth = getAuthStore();

	onMount(async () => {
		await auth.check();
	});
</script>

{@render children()}
