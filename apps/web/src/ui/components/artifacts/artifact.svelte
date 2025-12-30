<script lang="ts">
	import { type ArtifactType } from '@lumens/api/validators/artifacts';
	import ArtifactDefault from './artifact-default.svelte';

	interface ArtifactProps {
		type: ArtifactType;
	}

	const { type }: ArtifactProps = $props();
</script>

{#if type === 'default'}
	<ArtifactDefault />
{/if}
