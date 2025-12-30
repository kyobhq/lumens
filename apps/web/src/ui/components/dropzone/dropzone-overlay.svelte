<script lang="ts">
	import { fadeSlideBlur } from '$lib';
	import Upload from 'ui/icons/upload.svelte';

	interface Props {
		visible: boolean;
		message?: string;
		subtitle?: string;
	}

	let {
		visible,
		message = 'Drop your file here to add it to your library',
		subtitle = 'Supports images, videos, PDFs, and more'
	}: Props = $props();
</script>

{#if visible}
	<div
		class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-lu-main-900/90 backdrop-blur-sm border-2 border-dashed border-lu-accent-100 rounded-max-lg pointer-events-none"
		transition:fadeSlideBlur={{ duration: 200, y: 0 }}
		role="button"
		tabindex="-1"
	>
		<Upload class="w-12 h-12 mx-auto text-lu-accent-100 mb-3" />
		<p class="text-lg font-medium text-lu-main-100">{message}</p>
		{#if subtitle}
			<p class="text-sm text-lu-main-400 mt-1">{subtitle}</p>
		{/if}
	</div>
{/if}
