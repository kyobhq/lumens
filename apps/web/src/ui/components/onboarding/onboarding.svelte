<script lang="ts">
	import { createForm, Form } from '../forms';
	import { createLumenValidator, type CreateLumen } from '@lumens/api/validators/lumens';
	import Field from '../forms/field.svelte';
	import TextField from '../fields/text-field.svelte';
	import TextareaField from '../fields/textarea-field.svelte';
	import { getLumenStore } from '$lib/stores/lumen.svelte';
	import { getAuthStore } from '$lib/stores/auth.svelte';

	const form = createForm(createLumenValidator);
	const auth = getAuthStore();
	const lumen = getLumenStore();

	let avatar = $state<File | null>(null);
	let avatarURL = $state<string | null>(null);

	function handleFile(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		avatar = file;

		const reader = new FileReader();
		reader.onload = (e) => {
			avatarURL = e.target?.result as string;
		};

		reader.readAsDataURL(file);
	}

	async function handleSubmit(data: CreateLumen) {
		const error = await lumen.create(data, avatar);
		if (error || !auth.user) return;
		auth.user.lumen_created = true;
	}
</script>

<div
	class="fixed top-0 left-0 w-screen h-screen bg-lu-main-950/80 z-999 flex items-center justify-center"
>
	<div class="w-full max-w-[24rem]">
		<Form of={form} onsubmit={handleSubmit} class="space-y-4 flex flex-col">
			<figure
				class="size-16 rounded-full bg-lu-main-800 border border-lu-main-700 mx-auto relative mb-10 overflow-hidden"
			>
				{#if avatarURL}
					<img src={avatarURL} alt="" class="w-full h-full object-cover" />
				{/if}
				<input type="file" class="absolute top-0 left-0 inset-0 opacity-0" onchange={handleFile} />
			</figure>

			<Field of={form} name="name">
				{#snippet children(field)}
					<TextField {field} label="Lumen Name" placeholder="Bob" autocomplete="off" required />
				{/snippet}
			</Field>

			<Field of={form} name="personality">
				{#snippet children(field)}
					<TextareaField
						{field}
						label="Lumen Personality"
						placeholder="Funny"
						class="resize-none h-32"
						required
					/>
				{/snippet}
			</Field>

			<button
				type="submit"
				disabled={form.isSubmitting}
				aria-busy={form.isSubmitting}
				class="w-full py-3 bg-lu-main-200 rounded-xl mt-5 text-lu-main-700 font-medium active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
			>
				Create your Lumen
			</button>
		</Form>
	</div>
</div>
