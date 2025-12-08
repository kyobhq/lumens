<script lang="ts">
	import { Button } from 'bits-ui';

	interface LumenButtonProps {
		name: string;
		description: string;
	}

	const { name, description }: LumenButtonProps = $props();
</script>

<Button.Root
	class="text-left flex items-center gap-x-2.5 p-1 rounded-xl w-full group hover:bg-lu-main-700 transition-lu-colors"
>
	<div class="aspect-square w-9 bg-lu-main-500 rounded-lg"></div>

	<div class="flex flex-col">
		<p class="text-sm text-lu-main-200">{name}</p>
		<span
			class="text-xs text-lu-main-400 group-hover:text-lu-main-300 transition-lu-colors capitalize"
		>
			{description}
		</span>
	</div>
</Button.Root>
