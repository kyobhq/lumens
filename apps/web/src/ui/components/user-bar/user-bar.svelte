<script lang="ts">
	import { getAuthStore } from '$lib/stores/auth.svelte';

	const auth = getAuthStore();

	const avatar = $derived(auth.user?.avatar ?? 'https://avatar.vercel.sh/123');
	const username = $derived(auth.user?.username ?? 'Username');
</script>

<div class="p-3 flex items-center gap-x-2.5 border-t border-lu-main-800">
	<img src={avatar} alt="User's avatar" class="w-9 aspect-square rounded-max-lg bg-lu-main-500" />
	<div class="flex flex-col">
		<p class="text-sm text-lu-main-200">{username}</p>
		<p class="text-xs text-lu-main-500">Trial</p>
	</div>
</div>
