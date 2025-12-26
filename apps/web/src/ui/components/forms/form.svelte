<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { AnyValidator, FormContext, InferOutput } from './form-utils.svelte';

	export type FormProps<V extends AnyValidator> = {
		of: FormContext<V>;
		onsubmit: (data: InferOutput<V>, form: FormContext<V>) => void | Promise<void>;
		children: Snippet;
	} & Omit<HTMLFormAttributes, 'onsubmit'>;
</script>

<script lang="ts" generics="V extends AnyValidator">
	let { of: form, onsubmit, children, ...rest }: FormProps<V> = $props();

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const result = await form.validate();
		if (result.success) {
			form.setSubmitting(true);
			try {
				await onsubmit(result.data, form);
			} finally {
				form.setSubmitting(false);
			}
		}
	}
</script>

<form onsubmit={handleSubmit} {...rest}>
	{@render children()}
</form>
