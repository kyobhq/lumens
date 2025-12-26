<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import type { FieldState } from '../forms';

	interface TextFieldProps extends Omit<HTMLTextareaAttributes, 'id' | 'name' | 'value'> {
		field: FieldState;
		label: string;
	}

	const { field, label, required = false, class: classes, ...restProps }: TextFieldProps = $props();
</script>

<div class="flex flex-col gap-y-1.5">
	<label for={field.props.id} class="text-sm text-lu-main-400 ml-2.5 flex items-baseline gap-x-1">
		{label}
		{#if required && !field.errors?.length}
			<span class="text-lu-accent-100">*</span>
		{/if}

		{#if field.errors}
			<span class="text-red-400">- {field.errors[0]}</span>
		{/if}
	</label>
	<textarea
		{...field.props}
		{...restProps}
		value={field.input}
		{required}
		class={[
			'bg-lu-main-800 flex gap-x-3.5 px-3.5 py-3 rounded-xl text-[0.9375rem] items-center overflow-hidden placeholder:text-lu-main-500 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lu-main-600 transition-shadow duration-100',
			classes
		]}
	></textarea>
</div>
