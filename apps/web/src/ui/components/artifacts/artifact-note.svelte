<script lang="ts">
	import { generateHTML } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import type { ArtifactTransformer } from '@lumens/api/types';

	const { note }: ArtifactTransformer = $props();
</script>

<div
	class="w-full aspect-65/45 bg-lu-main-800 rounded-max-lg px-4 py-3 border border-lu-main-700 relative overflow-hidden"
>
	{#if note}
		{@html generateHTML(note, [StarterKit])}
	{:else}
		<span class="text-lu-main-500 text-sm uppercase tracking-wide font-lu-medium-lg">Empty</span>
	{/if}
</div>
