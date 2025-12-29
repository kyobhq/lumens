<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import '@fontsource-variable/inter';
	import '@fontsource/crimson-pro/400-italic.css';
	import { initAuthStore } from '$lib/stores/auth.svelte';
	import { initLumenStore } from '$lib/stores/lumen.svelte';

	let { children } = $props();

	initAuthStore();
	initLumenStore();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Lumens</title>
</svelte:head>

{@render children()}
