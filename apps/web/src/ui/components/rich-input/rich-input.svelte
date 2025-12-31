<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { Placeholder } from '@tiptap/extensions';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount, type Snippet } from 'svelte';

	interface RichInputProps {
		editorState: { editor: Editor | null };
		class?: string;
		leftElements?: Snippet;
		rightElements?: Snippet;
		onKeyDown?: (event: KeyboardEvent) => boolean;
		placeholder?: string;
	}

	let {
		leftElements,
		rightElements,
		onKeyDown,
		placeholder = 'Create a note here...',
		class: classes,
		editorState = $bindable()
	}: RichInputProps = $props();

	let element: HTMLElement | undefined = $state();

	onMount(() => {
		editorState.editor = new Editor({
			element: element,
			extensions: [StarterKit, Placeholder.configure({ placeholder })],
			onTransaction: ({ editor }) => {
				editorState = { editor };
			},
			editorProps: {
				handleKeyDown: (_, event) => onKeyDown?.(event)
			}
		});
	});

	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div class={classes}>
	{#if leftElements}
		{@render leftElements()}
	{/if}

	<div bind:this={element} class="flex-1 overflow-hidden max-h-24"></div>

	{#if rightElements}
		{@render rightElements()}
	{/if}
</div>
