<script lang="ts">
	import type { ArtifactTransformer } from '@lumens/api/types';

	const { url }: ArtifactTransformer = $props();
</script>

<div class="w-full rounded-max-lg overflow-hidden border border-lu-main-700 bg-lu-main-800">
	{#if url}
		<video src={url} class="w-full h-full object-cover" controls></video>
	{:else}
		<div class="aspect-video flex items-center justify-center">
			<span class="text-lu-main-500 text-sm uppercase tracking-wide font-lu-medium-lg">Video</span>
		</div>
	{/if}
</div>
