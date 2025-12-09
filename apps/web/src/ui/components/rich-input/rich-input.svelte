<script lang="ts">
	import { page } from '$app/state';
	import { Editor } from '@tiptap/core';
	import { Placeholder } from '@tiptap/extensions';
	import StarterKit from '@tiptap/starter-kit';
	import { Button } from 'bits-ui';
	import { onDestroy, onMount } from 'svelte';
	import FilledPlus from 'ui/icons/filled-plus.svelte';

	let element: HTMLElement | undefined = $state();
	let editorState: { editor: Editor | null } = $state({ editor: null });

	onMount(() => {
		editorState.editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Placeholder.configure({ placeholder: `Send a message to ${page.params.slug}` })
			],
			onTransaction: ({ editor }) => {
				editorState = { editor };
			}
		});
	});
	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div class="bg-lu-main-800 flex gap-x-3.5 px-3.5 py-3 rounded-xl text-[0.9375rem] items-center">
	<Button.Root class="text-lu-main-400 h-fit self-start">
		<FilledPlus />
	</Button.Root>
	<div bind:this={element} class="flex-1 overflow-hidden max-h-24"></div>
</div>
