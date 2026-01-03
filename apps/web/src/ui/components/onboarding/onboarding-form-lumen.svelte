<script lang="ts">
	import { createForm, Form } from '../forms';
	import { createLumenValidator, type CreateLumen } from '@lumens/api/validators/lumens';
	import Field from '../forms/field.svelte';
	import TextField from '../fields/text-field.svelte';
	import TextareaField from '../fields/textarea-field.svelte';
	import { getLumenStore } from '$lib/stores/lumen.svelte';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import type { FormContext } from '../forms';
	import { fadeSlideBlur } from '$lib';
	import Arrow from 'ui/icons/arrow.svelte';

	type Step = 'name' | 'personality' | 'avatar';

	const form = createForm(createLumenValidator);
	const auth = getAuthStore();
	const lumen = getLumenStore();

	let avatar = $state<File | null>(null);
	let avatarURL = $state<string | null>(null);
	let avatarError = $state<string | null>(null);
	let currentStep = $state<Step>('name');

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

<div
	class="w-full max-w-96 absolute bottom-34 left-1/2 -translate-x-1/2"
	transition:fadeSlideBlur={{ duration: 800, y: 20 }}
>
	<Form of={form} onsubmit={handleSubmit}>
		{#if form.formError}
			<p class="text-red-400 text-sm text-center">{form.formError}</p>
		{/if}

		{#if currentStep === 'name'}
			<div
				class="absolute w-full"
				in:fadeSlideBlur={{ duration: 800, y: 20, delay: 400 }}
				out:fadeSlideBlur={{ duration: 400, y: -20 }}
			>
				{@render nameStep()}
			</div>
		{:else if currentStep === 'personality'}
			<div
				class="absolute w-full"
				in:fadeSlideBlur={{ duration: 800, y: 20, delay: 400 }}
				out:fadeSlideBlur={{ duration: 400, y: -20 }}
			>
				{@render personalityStep()}
			</div>
		{:else if currentStep === 'avatar'}
			<div
				class="absolute w-full -top-10 flex flex-col"
				in:fadeSlideBlur={{ duration: 800, y: 20, delay: 400 }}
				out:fadeSlideBlur={{ duration: 400, y: -20 }}
			>
				{@render avatarStep()}
			</div>
		{/if}
	</Form>
</div>

{#snippet nameStep()}
	<Field of={form} name="name">
		{#snippet children(field)}
			<TextField
				{field}
				label="Lumen Name"
				placeholder="Markus"
				autocomplete="off"
				required
				hideLabel
				class="bg-transparent rounded-none mix-blend-plus-lighter placeholder:text-lu-main-100/55 font-crimson italic text-4xl! focus-visible:ring-0 text-center"
				data-1p-ignore
			/>
			{#if field.input.length > 0}
				<button
					type="button"
					class="absolute right-1.5 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center bg-lu-main-100/10 mix-blend-plus-lighter rounded-lg backdrop-blur-sm hover:bg-lu-main-100/25 transition-colors"
					aria-label="Next Step"
					onclick={() => (currentStep = 'personality')}
					in:fadeSlideBlur={{ duration: 350, y: 0 }}
					out:fadeSlideBlur={{ duration: 75, y: 0 }}
				>
					<Arrow />
				</button>
			{/if}
		{/snippet}
	</Field>
{/snippet}

{#snippet personalityStep()}
	<Field of={form} name="personality">
		{#snippet children(field)}
			<TextareaField
				{field}
				label="Lumen Personality"
				placeholder="What about their personality?"
				class="resize-none h-32 bg-lu-main-100/5 border border-lu-main-100/10 placeholder:text-lu-main-100/30 font-crimson text-lg focus-visible:ring-lu-main-100/10"
				hideLabel
				required
				data-1p-ignore
			/>

			{#if field.input.length > 0}
				<button
					type="button"
					class="absolute right-1.5 bottom-1.5 size-10 flex items-center justify-center bg-lu-main-100/10 mix-blend-plus-lighter rounded-lg backdrop-blur-sm hover:bg-lu-main-100/25 transition-colors"
					aria-label="Next Step"
					onclick={() => (currentStep = 'avatar')}
					in:fadeSlideBlur={{ duration: 350, y: 0 }}
					out:fadeSlideBlur={{ duration: 75, y: 0 }}
				>
					<Arrow />
				</button>
			{/if}
		{/snippet}
	</Field>
{/snippet}

{#snippet avatarStep()}
	<figure class="flex flex-col items-center mb-10">
		<div
			class={[
				'size-55 rounded-full bg-lu-main-100/10 border mx-auto relative overflow-hidden mix-blend-plus-lighter',
				avatarError ? 'border-red-400' : 'border-lu-main-100/10'
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
		{:else if !avatarURL}
			<span class="text-2xl text-lu-main-100/65 mix-blend-plus-lighter font-crimson mt-4">
				And what do they look like?
			</span>
		{/if}
	</figure>

	{#if avatarURL}
		<button
			type="submit"
			disabled={form.isSubmitting}
			aria-busy={form.isSubmitting}
			class="mx-auto bg-transparent mix-blend-plus-lighter text-lu-main-100/50 font-medium disabled:opacity-50 disabled:cursor-not-allowed font-crimson italic text-3xl hover:bg-lu-main-100/15 hover:text-lu-main-100/95 transition px-4.5 pt-2 pb-2.5 rounded-2xl"
			in:fadeSlideBlur={{ duration: 350, y: 20, delay: 100 }}
			out:fadeSlideBlur={{ duration: 75, y: 5 }}
		>
			Create your Lumen
		</button>
	{/if}
{/snippet}
