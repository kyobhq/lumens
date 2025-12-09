<script lang="ts">
	import RichInput from 'ui/components/rich-input/rich-input.svelte';
</script>

<div class="flex flex-col justify-between h-full">
	<header class="h-[calc(4rem-1px)] border-b border-lu-main-700 flex items-center px-4 gap-x-3">
		<div class="rounded-xl aspect-square w-8 bg-lu-main-500"></div>
		<p class="text-lu-main-200">Markus</p>
	</header>

	<div class="w-full p-4">
		<RichInput />
	</div>
</div>
