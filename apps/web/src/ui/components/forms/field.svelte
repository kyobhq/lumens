<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type {
		AnyValidator,
		FieldState,
		FieldValidationMode,
		FormContext,
		InferOutput
	} from './form-utils.svelte';

	export type FieldProps<V extends AnyValidator> = {
		of: FormContext<V>;
		name: keyof InferOutput<V>;
		validate?: FieldValidationMode;
		debounce?: number;
		children: Snippet<[FieldState]>;
	};
</script>

<script lang="ts" generics="V extends AnyValidator">
	import { onMount, onDestroy } from 'svelte';

	let { of: form, name, validate: validateMode, debounce: debounceMs = 0, children }: FieldProps<V> = $props();

	// Debounce timer
	let debounceTimer: ReturnType<typeof setTimeout> | undefined = $state();

	// Set field-specific validation mode if provided
	onMount(() => {
		if (validateMode) {
			form.setFieldMode(name, validateMode);
		}
	});

	onDestroy(() => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
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
		if (mode !== 'onchange') return;

		if (debounceMs > 0) {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			debounceTimer = setTimeout(() => {
				form.validateField(name);
			}, debounceMs);
		} else {
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
				oninput: handleInput
			}
		};
	});
</script>

{@render children(fieldState)}
