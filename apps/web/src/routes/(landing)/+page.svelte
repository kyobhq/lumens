<script lang="ts">
	import landingBg from '$lib/assets/landing_bg.avif';
	import Lumens from 'ui/logos/lumens.svelte';
</script>

<img class="fixed top-0 left-0 bottom-0 right-0" src={landingBg} alt="" />

<main class="relative z-1 flex flex-col justify-between h-screen pt-12 px-16 pb-16">
	<Lumens width={28} height={16} />
	<h1 class="sr-only">Lumens</h1>

	<section class="space-y-6">
		<h2
			class="text-[4rem] leading-none max-w-220 font-crimson font-light text-lu-main-100/95 mix-blend-plus-lighter"
		>
			Save anything, discuss everything. A personal library that talks back.
		</h2>
		<p class="max-w-210 text-lg leading-7 text-lu-main-100/85 mix-blend-plus-lighter">
			Articles, images, notes, links, save anything into your personal library. Then chat with your
			Lumen about your collection, or anything else on your mind. One companion, one conversation,
			always learning what matters to you.
		</p>
	</section>
</main>
