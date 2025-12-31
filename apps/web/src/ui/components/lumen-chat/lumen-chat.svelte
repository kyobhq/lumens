<script lang="ts">
	import { fadeSlideBlur } from '$lib';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { getLumenStore } from '$lib/stores/lumen.svelte';
	import { messages } from '$lib/stores/messages.svelte';
	import { generateLumenMessage } from '$lib/utils/lumen_message';
	import { Editor, generateHTML, type JSONContent } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { Button } from 'bits-ui';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import RichInput from 'ui/components/rich-input/rich-input.svelte';
	import FilledPlus from 'ui/icons/filled-plus.svelte';

	const auth = getAuthStore();
	const lumenStore = getLumenStore();
	const lumen = $derived(lumenStore.lumen);
	let editorState: { editor: Editor | null } = $state({ editor: null });

	const passedTheOnboarding = $derived.by(() => {
		if (!auth.user) return true;
		return auth.user.lumen_created;
	});

	function sendMessage(payload: { content: string; rawContent: JSONContent }) {
		if (!passedTheOnboarding) return;

		messages.send(payload);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			event.stopPropagation();

			const ed = editorState.editor;
			if (!ed || ed.isEmpty) return false;

			const content = ed.getText();
			const rawContent: JSONContent = ed.getJSON();
			sendMessage({ content, rawContent });

			ed?.commands.clearContent();

			return true;
		}

		return false;
	}

	onMount(() => {
		messages.getAll();
	});
</script>

<div
	class="flex flex-col justify-between h-full w-md bg-lu-main-900 border border-lu-main-750 rounded-max-lg shadow-border overflow-auto relative"
>
	{#if lumen}
		<header
			class="flex flex-col items-center pt-6 sticky top-0"
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

	<div class="flex flex-col gap-y-4 flex-1 justify-end px-6 pb-4 pt-8">
		{#each messages.all as message (message.id)}
			{@const username = message.author_id === auth.user?.id ? 'You' : lumen?.name}
			{@const timestamp = DateTime.fromISO(message.timestamp!)}

			<div class="flex gap-x-2.5 w-full">
				{#if username === 'You'}
					<div class="size-10 bg-lu-main-600 rounded-xl shrink-0"></div>
				{:else if lumen}
					<img
						src={`http://localhost:3333${lumen.avatar}`}
						alt=""
						class="size-10 bg-lu-main-600 rounded-xl select-none shrink-0"
					/>
				{/if}

				<div class="flex flex-col flex-1 overflow-hidden">
					<div class="flex gap-x-1 items-baseline">
						<p class="text-lu-accent-100 text-sm font-lu-medium-lg">{username}</p>
						<p class="text-xs text-lu-main-500">- {timestamp.toFormat('hh:mm')}</p>
					</div>
					{#if username === 'You'}
						<div class="wrap-break-word overflow-hidden">
							{@html generateHTML(message.content, [StarterKit])}
						</div>
					{:else}
						<div class="wrap-break-word overflow-hidden lumen-message space-y-4">
							{@html generateLumenMessage(message.content)}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<div class="w-full px-3.5 pb-4 sticky bottom-0 bg-lu-main-900">
		<RichInput
			bind:editorState
			class="bg-lu-main-800 border border-lu-main-700 flex gap-x-3 px-3.25 py-3 rounded-[14px] text-[0.9375rem] items-center overflow-hidden ring-0 focus-within:ring-2 ring-lu-main-600 transition duration-75"
			onKeyDown={handleKeyDown}
			placeholder="Send a message"
		>
			{#snippet leftElements()}
				<Button.Root
					class="text-lu-main-400 h-fit self-start hover:text-lu-main-200 transition-colors duration-75"
				>
					<FilledPlus />
				</Button.Root>
			{/snippet}
		</RichInput>
	</div>
</div>
