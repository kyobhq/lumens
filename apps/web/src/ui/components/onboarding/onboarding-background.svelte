<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	onMount(() => {
		if (typeof window === 'undefined') return;

		if (!window.UnicornStudio) {
			const script = document.createElement('script');
			script.src =
				'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.3/dist/unicornStudio.umd.js';
			script.onload = () => {
				window.UnicornStudio.addScene({
					elementId: 'onboarding-background',
					filePath: '/unicorn-studio/onboarding-background-v2.json',
					scale: 1,
					dpi: 1.5,
					altText: 'Background scene',
					ariaLabel: 'Unicorn Studio Hero Scene',
					production: false
				});
			};
			document.head.appendChild(script);
		} else {
			window.UnicornStudio.addScene({
				elementId: 'onboarding-background',
				filePath: '/unicorn-studio/onboarding-background-v2.json',
				scale: 1,
				dpi: 1.5,
				altText: 'Background scene',
				ariaLabel: 'Unicorn Studio Hero Scene',
				production: false
			});
		}
	});

	onDestroy(() => {
		if (typeof window === 'undefined') return;
		if (!window.UnicornStudio) return;
		window.UnicornStudio.destroy();
	});
</script>

<div
	id="onboarding-background"
	class="absolute left-1/2 top-1/2 -translate-1/2 size-96 rounded-full"
></div>
