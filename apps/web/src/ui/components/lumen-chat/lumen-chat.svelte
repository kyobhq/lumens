<script lang="ts">
	import { fadeSlideBlur } from '$lib';
	import { getLumenStore } from '$lib/stores/lumen.svelte';
	import { messages } from '$lib/stores/messages.svelte';
	import { generateHTML } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import RichInput from 'ui/components/rich-input/rich-input.svelte';

	const lumenStore = getLumenStore();
	const lumen = $derived(lumenStore.lumen);
</script>

<div
	class="flex flex-col justify-between h-full w-md bg-lu-main-900 border border-lu-main-800 rounded-max-lg"
>
	{#if lumen}
		<header
			class="flex flex-col items-center pt-6"
			transition:fadeSlideBlur={{ blur: 4, duration: 500, y: 0 }}
		>
			<img
				src={`http://localhost:3333${lumen.avatar}`}
				alt=""
				class="rounded-full aspect-square w-12 bg-lu-accent-100 select-none"
			/>
			<p
				class="text-lu-main-200 bg-lu-main-700 rounded-full px-3 py-0.75 -my-2.5 text-xs border-[0.5px] border-lu-main-600 select-none"
			>
				{lumen.name ?? 'Lumen'}
			</p>
		</header>
	{/if}

	<div class="flex flex-col gap-y-4 flex-1 justify-end px-6">
		{#each messages.all as message (message.id)}
			<div class="flex gap-x-2.5">
				<div class="size-10 bg-lu-main-600 rounded-xl"></div>
				<div class=" flex flex-col">
					<div class="flex gap-x-1 items-baseline">
						<p class="text-lu-accent-100 text-sm font-lu-medium-lg">{message.username}</p>
						<p class="text-xs text-lu-main-500">- {message.timestamp.toFormat('hh:mm')}</p>
					</div>
					{@html generateHTML(message.content, [StarterKit])}
				</div>
			</div>
		{/each}
	</div>

	<div class="w-full px-3.5 py-4">
		<RichInput />
	</div>
</div>
