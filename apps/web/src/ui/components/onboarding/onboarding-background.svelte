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
					filePath: '/unicorn-studio/onboarding-background.json',
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
				filePath: '/unicorn-studio/onboarding-background.json',
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

<div id="onboarding-background" class="absolute inset-0 pointer-events-none opacity-75"></div>
