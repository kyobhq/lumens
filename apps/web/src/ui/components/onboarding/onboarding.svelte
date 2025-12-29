<script lang="ts">
	import { fade } from 'svelte/transition';
	import OnboardingFormLumen from './onboarding-form-lumen.svelte';
</script>

<div class="fixed inset-0 z-999" transition:fade={{ duration: 200 }}>
	<div class="absolute inset-0 bg-lu-main-950/80"></div>

	<OnboardingFormLumen />
</div>
