<script lang="ts">
	import { Button } from 'bits-ui';
	import CommandApple from 'ui/icons/command-apple.svelte';
	import MagnifyingGlass from 'ui/icons/magnifying-glass.svelte';
</script>

<Button.Root
	class="group text-left bg-lu-main-800 pl-2.5 pr-3 py-2 text-sm text-lu-main-500 rounded-lg font-lu-medium flex justify-between items-center hover:bg-lu-main-700 hover:text-lu-main-400 transition-lu-colors"
	aria-keyshortcuts="Meta+K"
>
	<div class="flex items-center gap-x-2.5">
		<MagnifyingGlass height={14} width={14} />
		Search
	</div>

	<div
		class="flex gap-x-0.5 items-center text-lu-main-400 group-hover:text-lu-main-200 transition-lu-colors"
	>
		<kbd class="leading-none h-fit">
			<CommandApple height={12} width={12} />
		</kbd>
		<kbd class="leading-none h-3 text-[0.95rem]">K</kbd>
	</div>
</Button.Root>
