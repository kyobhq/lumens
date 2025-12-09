<script lang="ts">
	import CreateLumenButton from '../buttons/create-lumen-button.svelte';
	import LumenButton from '../buttons/lumen-button.svelte';
	import LumensSearchBar from '../search-lumens/lumens-search-bar.svelte';
	import UserBar from '../user-bar/user-bar.svelte';
	import SidebarSection from './sidebar-section.svelte';
</script>

<aside class="h-full w-60 border-r border-lu-main-700 flex flex-col">
	<h2
		class="h-[calc(4rem-1px)] flex items-center w-full px-4 border-b border-lu-main-700 font-lu-semibold"
	>
		Conversations
	</h2>
	<div class="flex flex-col pt-2.5 px-1.5 flex-1">
		<LumensSearchBar />

		<SidebarSection title="Lumens">
			<LumenButton name="Markus" description="Copywriter" />
			<CreateLumenButton />
		</SidebarSection>
	</div>

	<UserBar />
</aside>
