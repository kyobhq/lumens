<script lang="ts">
	import OnboardingBackground from './onboarding-background.svelte';
	import { fadeSlideBlur } from '$lib';
	import { onMount } from 'svelte';
	import OnboardingFormLumen from './onboarding-form-lumen.svelte';
	import { delay } from '$lib/utils/delay';

	type Phase = 'static' | 'lumen';

	let currentPhase = $state<Phase>('static');

	onMount(async () => {
		await delay(2000);
		currentPhase = 'lumen';
	});
</script>

<div
	id="onboarding"
	class="fixed inset-0 z-999 bg-zinc-950"
	in:fadeSlideBlur={{ duration: 2000, y: 0, delay: 1000 }}
	out:fadeSlideBlur={{ duration: 400, y: 0 }}
>
	<OnboardingBackground />

	{#if currentPhase === 'lumen'}
		<OnboardingFormLumen />
	{/if}
</div>
