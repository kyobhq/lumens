<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FieldState } from '../forms';

	type ErrorPlacement = 'below-input' | 'beside-label';

	interface TextFieldProps extends Omit<HTMLInputAttributes, 'id' | 'name' | 'value'> {
		field: FieldState;
		label: string;
		errorPlacement?: ErrorPlacement;
	}

	const {
		field,
		label,
		errorPlacement = 'beside-label',
		required = false,
		type = 'text',
		class: classes,
		...restProps
	}: TextFieldProps = $props();

	const errorId = $derived(`${field.props.id}-error`);
</script>

<div class="flex flex-col gap-y-1.5">
	<label
		for={field.props.id}
		class={[
			'text-sm ml-2.5 flex items-baseline gap-x-1',
			field.errors && errorPlacement === 'beside-label' ? 'text-red-400' : 'text-lu-main-400'
		]}
	>
		{label}
		{#if (required && !field.errors?.length) || (required && errorPlacement === 'below-input')}
			<span class="text-lu-accent-100">*</span>
		{/if}

		{#if field.errors && errorPlacement === 'beside-label'}
			<span id={errorId} class="text-red-400">- {field.errors[0]}</span>
		{/if}
	</label>
	<input
		{...field.props}
		aria-describedby={field.errors && errorPlacement === 'below-input' ? errorId : undefined}
		{...restProps}
		value={field.input}
		{type}
		{required}
		class={[
			'bg-lu-main-800 flex gap-x-3.5 px-3.5 py-3 rounded-xl text-[0.9375rem] items-center overflow-hidden placeholder:text-lu-main-500 w-full focus-visible:outline-none focus-visible:ring-2 transition-shadow duration-100',
			field.errors
				? 'inset-shadow-error placeholder:text-red-400/60 ring-red-400/45'
				: 'ring-lu-main-600',
			classes
		]}
	/>
	{#if field.errors && errorPlacement === 'below-input'}
		<span id={errorId} class="text-red-400 text-sm ml-2.5">{field.errors[0]}</span>
	{/if}
</div>
