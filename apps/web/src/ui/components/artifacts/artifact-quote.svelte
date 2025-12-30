<script lang="ts">
	import type { ArtifactTransformer } from '@lumens/api/types';

	const { note }: ArtifactTransformer = $props();
</script>

<div
	class="w-full aspect-square bg-lu-main-800 rounded-max-lg px-4 py-3 border border-lu-main-700 relative overflow-hidden"
>
	{#if note}
		<blockquote class="text-lu-main-100 italic">{note}</blockquote>
	{:else}
		<span class="text-lu-main-500 text-sm uppercase tracking-wide font-lu-medium-lg">Quote</span>
	{/if}
</div>
