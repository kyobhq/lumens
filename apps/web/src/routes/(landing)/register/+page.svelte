<script lang="ts">
	import { createUserValidator } from '@lumens/api/validators/users';
	import { createForm } from 'ui/components/forms';
	import Field from 'ui/components/forms/field.svelte';
	import Form from 'ui/components/forms/form.svelte';

	const form = createForm(createUserValidator);
</script>

<h1>Register an account</h1>

<Form of={form} onsubmit={(data) => console.log(data)}>
	<Field of={form} name="email" validate="onsubmit">
		{#snippet children(field)}
			<input {...field.props} value={field.input} type="email" />
			{#if field.errors}
				<span>{field.errors[0]}</span>
			{/if}
		{/snippet}
	</Field>
	<button type="submit">Submit</button>
</Form>
