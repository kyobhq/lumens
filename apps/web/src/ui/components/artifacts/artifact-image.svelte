<script lang="ts">
	import type { ArtifactTransformer } from '@lumens/api/types';

	const { url }: ArtifactTransformer = $props();
</script>

<div class="w-full rounded-max-lg overflow-hidden border border-lu-main-700">
	{#if url}
		<img src={url} alt="" class="w-full h-full object-cover" />
	{/if}
</div>
