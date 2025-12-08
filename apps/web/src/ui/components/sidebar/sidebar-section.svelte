<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SidebarSectionProps {
		title: string;
		children: Snippet;
	}

	const { title, children }: SidebarSectionProps = $props();
</script>

<section class="mt-4.5 w-full flex flex-col">
	<h3 class="text-xs font-semibold text-lu-main-500 px-2">{title}</h3>
	<div class="flex flex-col gap-y-0.5 mt-2">
		{@render children()}
	</div>
</section>
