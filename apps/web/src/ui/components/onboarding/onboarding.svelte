<script lang="ts">
	import OnboardingBackground from './onboarding-background.svelte';
	import { fadeSlideBlur } from '$lib';
	import { onMount } from 'svelte';
	import OnboardingFormLumen from './onboarding-form-lumen.svelte';
	import { delay } from '$lib/utils/delay';

	type Phase = 'static' | 'welcome' | 'lumen';

	let currentPhase = $state<Phase>('static');

	onMount(async () => {
		await delay(2000);
		currentPhase = 'welcome';
		await delay(1200);
		currentPhase = 'static';
		await delay(500);
		currentPhase = 'lumen';
	});
</script>

<div
	id="onboarding"
	class="fixed inset-0 z-999"
	in:fadeSlideBlur={{ duration: 2000, y: 0, delay: 1000 }}
	out:fadeSlideBlur={{ duration: 400, y: 0 }}
>
	<div class="absolute inset-0 bg-lu-main-950/80"></div>

	<OnboardingBackground />

	{#if currentPhase === 'welcome'}
		<h1
			class="onboarding-title absolute top-1/2 left-1/2 -translate-1/2 font-crimson italic text-8xl text-nowrap mix-blend-overlay text-lu-main-100 select-none"
			in:fadeSlideBlur={{ duration: 1200, y: 20 }}
			out:fadeSlideBlur={{ duration: 300, y: -20 }}
		>
			Welcome to Lumens !
		</h1>
		<span
			role="presentation"
			class="onboarding-title absolute top-1/2 left-1/2 -translate-1/2 font-crimson italic text-8xl text-nowrap mix-blend-overlay text-lu-main-100/50 select-none"
			in:fadeSlideBlur={{ duration: 1200, y: 20 }}
			out:fadeSlideBlur={{ duration: 300, y: -20 }}
		>
			Welcome to Lumens !
		</span>
	{/if}

	{#if currentPhase === 'lumen'}
		<OnboardingFormLumen />
	{/if}
</div>
