<script lang="ts">
	import type { ArtifactTransformer } from '@lumens/api/types';

	const { title }: ArtifactTransformer = $props();
</script>

<div
	class="w-full aspect-square bg-lu-main-800 rounded-max-lg px-4 py-3 border border-lu-main-700 relative overflow-hidden flex items-center justify-center"
>
	{#if title}
		<span class="text-lu-main-300 text-sm">{title}</span>
	{:else}
		<span class="text-lu-main-500 text-sm uppercase tracking-wide font-lu-medium-lg">Unknown</span>
	{/if}
</div>
