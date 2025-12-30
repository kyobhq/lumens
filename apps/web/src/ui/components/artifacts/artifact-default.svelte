<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import RichInput from '../rich-input/rich-input.svelte';
	import { Button } from 'bits-ui';
	import { fadeSlideBlur } from '$lib';
	import { PressedKeys, watch } from 'runed';
	import CommandApple from 'ui/icons/command-apple.svelte';
	import { getArtifactStore } from '$lib/stores/artifacts.svelte';
	import type { CreateArtifact } from '@lumens/api/validators/artifacts';

	let editorState: { editor: Editor | null } = $state({ editor: null });
	const keys = new PressedKeys();

	const artifact = getArtifactStore();
	const isEmpty = $derived(editorState.editor?.isEmpty ?? true);
	const isSaving = $derived(keys.has('Control', 'Enter'));

	watch(
		() => isSaving,
		() => {
			if (isSaving) saveNote();
		}
	);

	function saveNote() {
		const payload: CreateArtifact = {
			note: editorState.editor?.getText(),
			rawNote: editorState.editor?.getJSON()
		};

		artifact.create(payload);
		editorState.editor?.commands.clearContent();
	}
</script>

<div class="w-65 h-35 bg-lu-main-800 rounded-max-lg px-4 py-3 border border-lu-main-700 relative">
	<RichInput bind:editorState />

	{#if !isEmpty}
		<div
			class="absolute right-2 left-2 bottom-2"
			in:fadeSlideBlur={{ duration: 100 }}
			out:fadeSlideBlur={{ duration: 75, y: 2 }}
		>
			<Button.Root
				class="bg-lu-accent-100 px-2 py-1 rounded-md text-sm w-full flex items-baseline-last justify-center gap-x-1.5"
				onclick={saveNote}
			>
				Press <span class="inline-flex items-center"><CommandApple class="size-3" />+Enter</span> to
				save
			</Button.Root>
		</div>
	{/if}
</div>
