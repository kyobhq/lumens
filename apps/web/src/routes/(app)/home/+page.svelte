<script>
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import MansoryGrid from 'ui/components/mansory-grid/mansory-grid.svelte';
	import Onboarding from 'ui/components/onboarding/onboarding.svelte';
	import ArtifactsSearchBar from 'ui/components/search-artifacts/artifacts-search-bar.svelte';

	const auth = getAuthStore();
	const newUser = $derived(!auth.user?.lumen_created);
</script>

{#if newUser}
	<Onboarding />
{/if}

<main class="flex-1 flex flex-col gap-y-2 h-full">
	<ArtifactsSearchBar />
	<MansoryGrid />
</main>
