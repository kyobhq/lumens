<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import { Button } from 'bits-ui';
	import type { Component } from 'svelte';
	import ChatBubble from 'ui/icons/chat-bubble.svelte';
	import Gear from 'ui/icons/gear.svelte';
	import Picture from 'ui/icons/picture.svelte';
	import Lumens from 'ui/logos/lumens.svelte';
</script>

<nav class="h-full w-16 border-r border-r-lu-main-700 flex flex-col">
	<div class="aspect-square w-full flex items-center justify-center border-b border-lu-main-700">
		<Lumens class="text-lu-main-100" width={28} height={14} />
	</div>

	<div class="p-2 flex flex-col justify-between flex-1">
		<div class="p-1 bg-lu-main-800 rounded-lg flex flex-col gap-y-0.5">
			{@render navButton(ChatBubble, '/c')}
			{@render navButton(Picture, '/g')}
		</div>

		<Button.Root
			class="w-full aspect-square flex justify-center items-center text-lu-main-400 transition-lu-colors hover:text-lu-main-200"
		>
			<Gear height={24} width={24} />
		</Button.Root>
	</div>
</nav>

{#snippet navButton(Icon: Component, path: Pathname)}
	<Button.Root
		class={[
			'aspect-square w-full flex items-center justify-center rounded-md transition-lu-colors',
			page.url.pathname === path
				? 'bg-lu-main-600 text-lu-main-200'
				: 'text-lu-main-400 hover:text-lu-main-300'
		]}
		onmousedown={() => goto(resolve(path))}
	>
		<Icon width={20} height={20} />
	</Button.Root>
{/snippet}
