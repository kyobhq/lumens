<script lang="ts">
	import type { ArtifactTransformer } from '@lumens/api/types';

	const { title, url }: ArtifactTransformer = $props();
</script>

<div
	class="w-full aspect-square bg-lu-main-800 rounded-max-lg px-4 py-3 border border-lu-main-700 relative overflow-hidden flex flex-col"
>
	{#if title}
		<h3 class="text-lu-main-100 font-lu-medium-lg text-sm line-clamp-2">{title}</h3>
	{/if}
	{#if url}
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			class="text-lu-accent-100 text-xs mt-auto">View PDF</a
		>
	{:else}
		<span class="text-lu-main-500 text-sm uppercase tracking-wide font-lu-medium-lg">PDF</span>
	{/if}
</div>
