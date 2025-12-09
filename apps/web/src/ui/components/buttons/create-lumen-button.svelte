<script lang="ts">
	import { Button } from 'bits-ui';
	import Plus from 'ui/icons/plus.svelte';
</script>

<Button.Root
	class="flex gap-x-2.5 text-lu-main-400 p-2 items-center text-sm group hover:bg-lu-main-800/65 rounded-xl transition-lu-colors hover:text-lu-main-300"
>
	<div
		class="aspect-square w-9 bg-lu-main-800 border border-lu-main-500 border-dashed rounded-lg flex justify-center items-center group-hover:border-lu-main-400 group-hover:text-lu-main-300 transition-lu-colors group-hover:bg-lu-main-700"
	>
		<Plus height={16} width={16} />
	</div>
	Create a Lumen
</Button.Root>
