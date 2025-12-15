<script lang="ts">
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { loginUserValidator } from '@lumens/api/validators/users';
	import OtpField from 'ui/components/fields/otp-field.svelte';
	import TextField from 'ui/components/fields/text-field.svelte';
	import { createForm } from 'ui/components/forms';
	import Field from 'ui/components/forms/field.svelte';
	import Form from 'ui/components/forms/form.svelte';
	import Lumens from 'ui/logos/lumens.svelte';

	let verify = $state(false);

	const form = createForm(loginUserValidator);
	const auth = getAuthStore();

	async function handleVerifyEmail() {
		await auth.verifyEmail({
			username_or_email: form.getValue('username_or_email'),
			type: 'signin'
		});
		verify = true;
	}
</script>

<main
	class="flex max-w-3xl w-full h-full max-h-115 fixed left-1/2 top-1/2 -translate-1/2 gap-x-8 items-center"
>
	<div class="w-3/5 relative">
		<Form of={form} onsubmit={(data) => void auth.signin(data)}>
			<div
				class="aspect-square w-11 bg-lu-accent-100 flex items-center justify-center text-lu-main-700 rounded-xl"
			>
				<Lumens class="text-current w-full" />
			</div>
			<h1 class="text-2xl font-semibold tracking-tighter flex flex-col gap-x-3 mt-4">
				Sign in to Lumens
			</h1>
			<p class="text-lu-main-400 mt-0.5">Welcome to your favorite AI-powered workspace</p>

			<div class={['space-y-4', verify ? 'mt-8.5' : 'mt-5']}>
				{#if verify}
					<Field of={form} name="code" validate="onsubmit">
						{#snippet children(field)}
							<OtpField {field} />
						{/snippet}
					</Field>
				{:else}
					<Field of={form} name="username_or_email" validate="onsubmit">
						{#snippet children(field)}
							<TextField
								{field}
								type="text"
								label="Email or username"
								placeholder="john.doe@example.com or batman"
								required
							/>
						{/snippet}
					</Field>
				{/if}
			</div>

			{#if verify}
				<button
					type="submit"
					class="w-full py-3 bg-lu-main-200 rounded-xl mt-8.5 text-lu-main-700 font-medium active:scale-[0.98] transition-transform"
				>
					Verify email
				</button>
			{:else}
				<button
					type="button"
					class="w-full py-3 bg-lu-main-200 rounded-xl text-lu-main-700 font-medium active:scale-[0.98] transition-transform mt-8"
					onclick={() => handleVerifyEmail()}
				>
					Sign in
				</button>
			{/if}
		</Form>
	</div>

	<div class="h-full w-px bg-lu-main-700"></div>

	<figure class="w-2/5 h-full rounded-xl overflow-hidden">
		<img src="/signup-bg.png" class="w-full h-full object-cover" alt="A man looking at his phone" />
	</figure>
</main>
