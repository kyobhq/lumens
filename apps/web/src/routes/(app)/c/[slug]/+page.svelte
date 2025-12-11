<script lang="ts">
	import { messages } from '$lib/stores/messages.svelte';
	import { generateHTML } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import RichInput from 'ui/components/rich-input/rich-input.svelte';
</script>

<div class="flex flex-col justify-between h-full">
	<header class="h-[calc(4rem-1px)] border-b border-lu-main-700 flex items-center px-4 gap-x-3">
		<div class="rounded-xl aspect-square w-8 bg-lu-main-500"></div>
		<p class="text-lu-main-200">Markus</p>
	</header>

	<div class="flex flex-col gap-y-4 flex-1 justify-end px-8">
		{#each messages.all as message (message.id)}
			<div class="flex gap-x-2.5">
				<div class="size-10 bg-lu-main-600 rounded-xl"></div>
				<div class=" flex flex-col">
					<div class="flex gap-x-1 items-center">
						<p class="text-lu-accent-100">{message.username}</p>
						<p class="text-sm text-lu-main-500">- {message.timestamp.toFormat('hh:mm')}</p>
					</div>
					{@html generateHTML(message.content, [StarterKit])}
				</div>
			</div>
		{/each}
	</div>

	<div class="w-full p-4">
		<RichInput />
	</div>
</div>
