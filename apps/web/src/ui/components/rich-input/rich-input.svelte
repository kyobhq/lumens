<script lang="ts">
	import { page } from '$app/state';
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

	function sendMessage(content: JSONContent) {
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
			extensions: [
				StarterKit,
				Placeholder.configure({ placeholder: `Send a message to ${page.params.slug}` })
			],
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
	class="bg-lu-main-800 flex gap-x-3.5 px-3.5 py-3 rounded-xl text-[0.9375rem] items-center overflow-hidden"
>
	<Button.Root class="text-lu-main-400 h-fit self-start">
		<FilledPlus />
	</Button.Root>
	<div bind:this={element} class="flex-1 overflow-hidden max-h-24 duration-100"></div>
</div>
