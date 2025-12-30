<script lang="ts">
	import type { ArtifactProps } from './artifact.svelte';

	const { url }: ArtifactProps = $props();
</script>

<div class="w-full rounded-max-lg overflow-hidden border border-lu-main-700">
	{#if url}
		<img src={url} alt="" class="w-full h-full object-cover" />
	{/if}
</div>
