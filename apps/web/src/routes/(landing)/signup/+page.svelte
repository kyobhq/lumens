<script lang="ts">
	import { getAuthStore } from '$lib/stores/auth.svelte';
	import { createUserValidator } from '@lumens/api/validators/users';
	import OtpField from 'ui/components/fields/otp-field.svelte';
	import TextField from 'ui/components/fields/text-field.svelte';
	import { createForm } from 'ui/components/forms';
	import Field from 'ui/components/forms/field.svelte';
	import Form from 'ui/components/forms/form.svelte';
	import Lumens from 'ui/logos/lumens.svelte';

	let verify = $state(false);

	const form = createForm(createUserValidator);
	const auth = getAuthStore();

	async function handleVerifyEmail() {
		await auth.verifyEmail({ email: form.getValue('email') });
		verify = true;
	}
</script>

<main
	class="flex max-w-3xl w-full h-full max-h-115 fixed left-1/2 top-1/2 -translate-1/2 gap-x-8 items-center"
>
	<div class="w-3/5 relative">
		<Form of={form} onsubmit={(data) => void auth.signup(data)}>
			<div
				class="aspect-square w-11 bg-lu-accent-100 flex items-center justify-center text-lu-main-700 rounded-xl"
			>
				<Lumens class="text-current w-full" />
			</div>
			<h1 class="text-2xl font-semibold tracking-tighter flex flex-col gap-x-3 mt-4">
				Sign up to Lumens
			</h1>
			<p class="text-lu-main-400 mt-0.5">Welcome to your favorite AI-powered workspace</p>

			<div class="space-y-4 mt-5">
				{#if verify}
					<Field of={form} name="code" validate="onsubmit">
						{#snippet children(field)}
							<OtpField {field} class="py-13" />
						{/snippet}
					</Field>
				{:else}
					<Field of={form} name="email" validate="onsubmit">
						{#snippet children(field)}
							<TextField
								{field}
								type="email"
								label="Email"
								placeholder="john.doe@example.com"
								required
							/>
						{/snippet}
					</Field>
					<Field of={form} name="username" validate="onsubmit">
						{#snippet children(field)}
							<TextField {field} type="text" label="Username" placeholder="batman" required />
						{/snippet}
					</Field>
				{/if}
			</div>

			{#if verify}
				<button
					type="submit"
					class="w-full py-3 bg-lu-main-200 rounded-xl mt-8 text-lu-main-700 font-medium active:scale-[0.98] transition-transform"
				>
					Verify email
				</button>
			{:else}
				<button
					type="button"
					class="w-full py-3 bg-lu-main-200 rounded-xl mt-8 text-lu-main-700 font-medium active:scale-[0.98] transition-transform"
					onclick={() => handleVerifyEmail()}
				>
					Create your account
				</button>
			{/if}
		</Form>
	</div>

	<div class="h-full w-px bg-lu-main-700"></div>

	<figure class="w-2/5 h-full rounded-xl overflow-hidden">
		<img src="/signup-bg.png" class="w-full h-full object-cover" alt="A man looking at his phone" />
	</figure>
</main>
