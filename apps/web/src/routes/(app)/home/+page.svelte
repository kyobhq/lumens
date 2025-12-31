<script>
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import LumenChat from 'ui/components/lumen-chat/lumen-chat.svelte';
	import MasonryGrid from 'ui/components/masonry-grid/masonry-grid.svelte';
	import Navbar from 'ui/components/navbar/navbar.svelte';
	import Onboarding from 'ui/components/onboarding/onboarding.svelte';
	import ArtifactsSearchBar from 'ui/components/search-artifacts/artifacts-search-bar.svelte';

	const auth = getAuthStore();

	let newUser = $derived.by(() => {
		if (!auth.user) return undefined;

		return !auth.user.lumen_created;
	});
</script>

{#if newUser}
	<Onboarding />
{:else if !newUser && newUser !== undefined}
	<div class="w-screen h-screen overflow-hidden flex p-2 gap-2">
		<Navbar />
		<main class="flex-1 flex flex-col gap-y-2 h-full">
			<ArtifactsSearchBar />
			<MasonryGrid />
		</main>
		<LumenChat />
	</div>
{/if}
