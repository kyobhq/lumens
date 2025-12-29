<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { FieldState } from '../forms';
	import { cn } from 'tailwind-variants';

	type ErrorPlacement = 'below-input' | 'beside-label';

	interface TextFieldProps extends Omit<HTMLTextareaAttributes, 'id' | 'name' | 'value'> {
		field: FieldState;
		label: string;
		errorPlacement?: ErrorPlacement;
		hideLabel?: boolean;
	}

	const {
		field,
		label,
		errorPlacement = 'beside-label',
		required = false,
		hideLabel = false,
		class: classes,
		...restProps
	}: TextFieldProps = $props();

	const errorId = $derived(`${field.props.id}-error`);
</script>

<div class="flex flex-col gap-y-1.5">
	<label
		for={field.props.id}
		class={cn(
			'text-sm ml-2.5 flex items-baseline gap-x-1',
			field.errors ? 'text-red-400' : 'text-lu-main-400',
			hideLabel && 'sr-only!'
		)}
	>
		{label}
		{#if required && !field.errors?.length}
			<span class="text-lu-accent-100">*</span>
		{/if}

		{#if field.errors && errorPlacement === 'beside-label'}
			<span id={errorId} class="text-red-400">- {field.errors[0]}</span>
		{/if}
	</label>
	<textarea
		{...field.props}
		aria-describedby={field.errors && errorPlacement === 'below-input' ? errorId : undefined}
		{...restProps}
		value={field.input}
		{required}
		class={cn(
			'bg-lu-main-800 flex gap-x-3.5 px-3.5 py-3 rounded-xl text-[0.9375rem] items-center overflow-hidden placeholder:text-lu-main-500 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lu-main-600 transition-shadow duration-100 resize-none',
			field.errors ? 'border border-red-400' : '',
			classes
		)}
	></textarea>
	{#if field.errors && errorPlacement === 'below-input'}
		<span id={errorId} class="text-red-400 text-sm ml-2.5">{field.errors[0]}</span>
	{/if}
</div>
