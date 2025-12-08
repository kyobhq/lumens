<script lang="ts">
	import Navbar from 'ui/components/navbar/navbar.svelte';
	import Sidebar from 'ui/components/sidebar/sidebar.svelte';

	let { children } = $props();
</script>

<div class="w-screen h-screen overflow-hidden flex">
	<Navbar />
	<Sidebar />
	<main class="flex-1 h-full overflow-hidden">
		{@render children()}
	</main>
</div>
