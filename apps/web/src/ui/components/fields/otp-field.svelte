<script lang="ts">
	import type { FieldState } from '../forms';
	import { PinInput, type PinInputRootSnippetProps } from 'bits-ui';

	type CellProps = PinInputRootSnippetProps['cells'][0];

	type ErrorPlacement = 'below-input';

	interface OTPProps {
		field: FieldState;
		label?: string;
		errorPlacement?: ErrorPlacement;
		class?: string;
	}

	const {
		field,
		label = 'Verification code',
		errorPlacement = 'below-input',
		class: classes
	}: OTPProps = $props();

	const errorId = $derived(`${field.props.id}-error`);
</script>

<div class={['flex flex-col gap-y-1.5 items-center relative', classes]}>
	<label for={field.props.id} class="sr-only">{label}</label>
	<PinInput.Root
		class="group/pininput text-foreground has-disabled:opacity-30 flex items-center"
		maxlength={6}
		value={field.input}
		{...field.props}
		aria-describedby={field.errors && errorPlacement === 'below-input' ? errorId : undefined}
		autocomplete="off"
		autocorrect="off"
	>
		{#snippet children({ cells })}
			<div class="flex gap-x-1.5">
				{#each cells as cell, i (i)}
					{@render Cell(cell)}
				{/each}
			</div>
		{/snippet}
	</PinInput.Root>
	{#if field.errors && errorPlacement === 'below-input'}
		<span id={errorId} class="text-red-400 text-sm mt-1">{field.errors[0]}</span>
	{/if}
</div>

{#snippet Cell(cell: CellProps)}
	<PinInput.Cell
		{cell}
		class="rounded-lg relative h-14 w-11 text-xl flex items-center justify-center transition-all duration-75 bg-lu-main-800 text-lu-main-100 outline-0 data-active:bg-lu-main-700 uppercase"
	>
		{#if cell.char !== null}
			<div>
				{cell.char}
			</div>
		{/if}
	</PinInput.Cell>
{/snippet}
