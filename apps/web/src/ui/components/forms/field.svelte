<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { AnyValidator, FieldState, FieldValidationMode, FormContext, InferOutput } from './form-utils.js';

	export type FieldProps<V extends AnyValidator> = {
		of: FormContext<V>;
		name: keyof InferOutput<V>;
		validate?: FieldValidationMode;
		children: Snippet<[FieldState]>;
	};
</script>

<script lang="ts" generics="V extends AnyValidator">
	import { onMount } from 'svelte';

	let { of: form, name, validate: validateMode, children }: FieldProps<V> = $props();

	// Set field-specific validation mode if provided
	onMount(() => {
		if (validateMode) {
			form.setFieldMode(name, validateMode);
		}
	});

	const fieldId = $derived(`${form._formId}-${String(name)}`);
	const errorId = $derived(`${fieldId}-error`);

	function handleBlur() {
		form.touch(name);
		const mode = form.getFieldMode(name);
		if (mode === 'onblur') {
			form.validateField(name);
		}
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		form.setValue(name, target.value);

		const mode = form.getFieldMode(name);
		if (mode === 'onchange') {
			form.validateField(name);
		}
	}

	const fieldState: FieldState = $derived.by(() => {
		const errors = form.getErrors(name);
		const hasErrors = errors !== undefined && errors.length > 0;

		return {
			input: form.getValue(name),
			errors,
			touched: form.isTouched(name),
			props: {
				id: fieldId,
				name: String(name),
				'aria-invalid': hasErrors,
				'aria-describedby': hasErrors ? errorId : undefined,
				onblur: handleBlur,
				oninput: handleInput,
			},
		};
	});
</script>

{@render children(fieldState)}

{#if fieldState.errors}
	<div id={errorId} aria-live="polite" class="sr-only">
		{fieldState.errors.join(', ')}
	</div>
{/if}
