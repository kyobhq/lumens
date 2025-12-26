<script lang="ts">
	import { resolve } from '$app/paths';
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { createUserValidator } from '@lumens/api/validators/users';
	import OtpField from 'ui/components/fields/otp-field.svelte';
	import TextField from 'ui/components/fields/text-field.svelte';
	import { createForm } from 'ui/components/forms';
	import Field from 'ui/components/forms/field.svelte';
	import Form from 'ui/components/forms/form.svelte';
	import Lumens from 'ui/logos/lumens.svelte';

	let verify = $state(false);
	let isSendingCode = $state(false);

	const form = createForm(createUserValidator);
	const auth = getAuthStore();

	async function handleVerifyEmail() {
		isSendingCode = true;
		try {
			const success = await auth.verifyEmail({ email: form.getValue('email') }, form);
			if (success) verify = true;
		} finally {
			isSendingCode = false;
		}
	}
</script>

<main
	class="flex flex-col fixed left-1/2 top-[25%] -translate-x-1/2 gap-y-5 items-center w-full max-w-sm"
>
	<Form of={form} onsubmit={auth.signup} class=" w-full">
		<div
			class="aspect-square w-11 bg-lu-accent-100 flex items-center justify-center text-lu-main-700 rounded-xl"
		>
			<Lumens class="text-current w-full" />
		</div>
		<h1 class="text-2xl font-semibold tracking-tighter flex flex-col gap-x-3 mt-4 select-none">
			Sign up to Lumens
		</h1>
		<p class="text-lu-main-400 mt-0.5 select-none">Welcome to your favorite AI-powered workspace</p>

		{#if form.formError}
			<p class="text-red-400 text-sm mt-3">{form.formError}</p>
		{/if}

		<div class="space-y-3 mt-5">
			{#if verify}
				<Field of={form} name="code" validate="onsubmit">
					{#snippet children(field)}
						<OtpField {field} class="py-13" />
					{/snippet}
				</Field>
			{:else}
				<Field of={form} name="email" validate="onchange" debounce={300}>
					{#snippet children(field)}
						<TextField
							{field}
							type="email"
							autocomplete="email"
							label="Email"
							placeholder="john.doe@example.com"
							required
						/>
					{/snippet}
				</Field>
				<Field of={form} name="username" validate="onchange" debounce={300}>
					{#snippet children(field)}
						<TextField
							{field}
							type="text"
							autocomplete="off"
							label="Username"
							placeholder="batman"
							errorPlacement="below-input"
							required
						/>
					{/snippet}
				</Field>
			{/if}
		</div>

		{#if verify}
			<button
				type="submit"
				disabled={form.isSubmitting}
				aria-busy={form.isSubmitting}
				class="w-full py-3 bg-lu-main-200 rounded-xl mt-7.5 text-lu-main-700 font-medium active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
			>
				{form.isSubmitting ? 'Verifying...' : 'Verify email'}
			</button>
		{:else}
			<button
				type="button"
				disabled={isSendingCode}
				aria-busy={isSendingCode}
				class="w-full py-3 bg-lu-main-200 rounded-xl text-lu-main-700 font-medium active:scale-[0.98] transition mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
				onclick={() => handleVerifyEmail()}
			>
				Create your account
			</button>
		{/if}
	</Form>

	<p class="text-sm text-lu-main-400">
		Already have an account? <a
			href={resolve('/(landing)/signin')}
			class="text-lu-accent-100 hover:underline">Sign in</a
		>
	</p>
</main>
