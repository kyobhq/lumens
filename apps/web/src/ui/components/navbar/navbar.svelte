<script lang="ts">
	import { Button } from 'bits-ui';
	import Gear from 'ui/icons/gear.svelte';
	import Lumens from 'ui/logos/lumens.svelte';
</script>

<nav class="h-full w-16 flex flex-col gap-y-2">
	<div
		class="aspect-square w-full flex items-center bg-lu-main-900 justify-center text-lu-main-100 hover:text-lu-main-50 transition-lu-colors border rounded-max-lg border-lu-main-750 shadow-border"
	>
		<Lumens class="text-current" width={28} height={14} />
	</div>

	<div
		role="presentation"
		class="p-2 flex flex-col justify-between flex-1 bg-lu-main-900 border border-lu-main-750 rounded-max-lg shadow-border"
	></div>

	<Button.Root
		class="aspect-square w-full flex items-center bg-lu-main-900 justify-center text-lu-main-400 hover:text-lu-main-200 transition-lu-colors border rounded-max-lg border-lu-main-750 shadow-border"
		aria-label="Settings"
	>
		<Gear height={24} width={24} />
	</Button.Root>
</nav>
