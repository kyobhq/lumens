<script lang="ts">
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { messages } from '$lib/stores/messages.svelte';
	import type { JSONContent } from '@tiptap/core';
	import { Editor } from '@tiptap/core';
	import { Placeholder } from '@tiptap/extensions';
	import StarterKit from '@tiptap/starter-kit';
	import { Button } from 'bits-ui';
	import { DateTime } from 'luxon';
	import { onDestroy, onMount } from 'svelte';
	import FilledPlus from 'ui/icons/filled-plus.svelte';

	let element: HTMLElement | undefined = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	const auth = getAuthStore();

	const passedTheOnboarding = $derived.by(() => {
		if (!auth.user) return true;
		return !auth.user.lumen_created;
	});

	function sendMessage(content: JSONContent) {
		if (!passedTheOnboarding) return;

		messages.add({
			id: crypto.randomUUID(),
			type: 'human',
			username: 'You',
			content,
			timestamp: DateTime.now()
		});
	}

	onMount(() => {
		editorState.editor = new Editor({
			element: element,
			extensions: [StarterKit, Placeholder.configure({ placeholder: 'Send a message' })],
			onTransaction: ({ editor }) => {
				editorState = { editor };
			},
			editorProps: {
				handleKeyDown: (_, event) => {
					if (event.key === 'Enter' && !event.shiftKey) {
						event.preventDefault();
						event.stopPropagation();

						const ed = editorState.editor;
						if (!ed || ed.isEmpty) return false;

						const content: JSONContent = ed.getJSON();
						sendMessage(content);
						editorState.editor?.commands.clearContent();

						return true;
					}

					return false;
				}
			}
		});
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div
	class="bg-lu-main-800 border border-lu-main-700 flex gap-x-3 px-3.25 py-3 rounded-[14px] text-[0.9375rem] items-center overflow-hidden ring-0 focus-within:ring-2 ring-lu-main-600 transition duration-75"
>
	<Button.Root
		class="text-lu-main-400 h-fit self-start hover:text-lu-main-200 transition-colors duration-75"
	>
		<FilledPlus />
	</Button.Root>
	<div bind:this={element} class="flex-1 overflow-hidden max-h-24 duration-100"></div>
</div>
