<script lang="ts">
	import { createForm, Form } from '../forms';
	import { createLumenValidator, type CreateLumen } from '@lumens/api/validators/lumens';
	import Field from '../forms/field.svelte';
	import TextField from '../fields/text-field.svelte';
	import TextareaField from '../fields/textarea-field.svelte';
	import { getLumenStore } from '$lib/stores/lumen.svelte';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import type { FormContext } from '../forms';

	const form = createForm(createLumenValidator);
	const auth = getAuthStore();
	const lumen = getLumenStore();

	let avatar = $state<File | null>(null);
	let avatarURL = $state<string | null>(null);
	let avatarError = $state<string | null>(null);

	function handleFile(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		avatarError = null;
		avatar = file;

		const reader = new FileReader();
		reader.onload = (e) => {
			avatarURL = e.target?.result as string;
		};

		reader.readAsDataURL(file);
	}

	async function handleSubmit(data: CreateLumen, form: FormContext<typeof createLumenValidator>) {
		avatarError = null;
		const hasError = await lumen.create(data, avatar, form);
		if (hasError) {
			const errors = form.getErrors('avatar' as keyof CreateLumen);
			if (errors?.length) avatarError = errors[0];
			return;
		}
		if (!auth.user) return;
		auth.user.lumen_created = true;
	}
</script>

<div class="w-full max-w-[24rem] absolute top-1/2 left-1/2 -translate-1/2">
	<Form of={form} onsubmit={handleSubmit} class="space-y-4 flex flex-col">
		{#if form.formError}
			<p class="text-red-400 text-sm text-center">{form.formError}</p>
		{/if}

		<figure class="flex flex-col items-center mb-10">
			<div
				class={[
					'size-16 rounded-full bg-lu-main-800 border mx-auto relative overflow-hidden',
					avatarError ? 'border-red-400' : 'border-lu-main-700'
				]}
			>
				{#if avatarURL}
					<img src={avatarURL} alt="" class="w-full h-full object-cover" />
				{/if}
				<input
					type="file"
					accept="image/png,image/jpeg,image/jpg,image/avif,image/webp"
					class="absolute top-0 left-0 inset-0 opacity-0 cursor-pointer"
					onchange={handleFile}
				/>
			</div>
			{#if avatarError}
				<span class="text-red-400 text-sm mt-2">{avatarError}</span>
			{/if}
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
