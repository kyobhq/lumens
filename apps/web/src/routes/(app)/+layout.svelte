<script lang="ts">
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { getLumenStore } from '$lib/stores/lumen.svelte';
	import { onMount } from 'svelte';
	import LumenChat from 'ui/components/lumen-chat/lumen-chat.svelte';
	import Navbar from 'ui/components/navbar/navbar.svelte';

	const { children } = $props();

	const auth = getAuthStore();
	const lumen = getLumenStore();

	onMount(async () => {
		await auth.check();
		if (auth.user?.lumen_created) lumen.get();
	});
</script>

<div class="w-screen h-screen overflow-hidden flex p-2 gap-2">
	<Navbar />
	{@render children()}
	<LumenChat />
</div>
