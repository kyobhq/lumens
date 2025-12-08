<script lang="ts">
	import type { IconProps } from '$lib/types';

	const { height = 11, width = 24, class: classes }: IconProps = $props();
</script>

<svg
	{width}
	{height}
	class={classes}
	viewBox="0 0 24 11"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
>
	<path
		d="M10.0654 3.85V0L0 11H19.0125C20.685 10.7454 24.0241 9.24611 23.9999 5.28611C23.9757 1.32611 20.6649 0.112037 19.0125 0H13.3601V2.62778C13.3601 2.62778 18.1661 2.50556 19.0125 2.62778C19.8588 2.75 21.485 3.48333 21.4608 5.31667C21.4367 7.15 19.7984 8.21944 19.0125 8.21944H6.10576L10.0654 3.85Z"
		fill="currentColor"
	/>
</svg>
