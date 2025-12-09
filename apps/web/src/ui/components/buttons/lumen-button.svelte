<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from 'bits-ui';

	interface LumenButtonProps {
		name: string;
		description: string;
	}

	const { name, description }: LumenButtonProps = $props();
	const slug = $derived(name.toLowerCase().replaceAll(' ', '-'));
	const active = $derived(page.url.pathname.includes(`/c/${slug}`));
</script>

<Button.Root
	class={[
		'text-left flex items-center gap-x-2.5 p-2 rounded-xl w-full group transition-lu-colors',
		active ? 'bg-lu-main-800 hover:bg-lu-main-700/75' : 'hover:bg-lu-main-800'
	]}
	onmousedown={() => goto(resolve('/(app)/c/[slug]', { slug }))}
>
	<div class="aspect-square w-9 bg-lu-main-500 rounded-lg"></div>

	<div class="flex flex-col">
		<p class="text-sm text-lu-main-200">{name}</p>
		<span
			class={[
				'text-xs transition-lu-colors capitalize',
				active ? 'text-lu-main-300' : 'text-lu-main-400 group-hover:text-lu-main-300'
			]}
		>
			{description}
		</span>
	</div>
</Button.Root>
