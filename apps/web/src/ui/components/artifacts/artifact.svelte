<script lang="ts" module>
	export interface ArtifactProps extends ArtifactTransformer {
		width: number;
		x: number;
		y: number;
	}
</script>

<script lang="ts">
	import ArtifactNote from './artifact-note.svelte';
	import ArtifactImage from './artifact-image.svelte';
	import type { ArtifactTransformer } from '@lumens/api/types';
	import ArtifactUnknown from './artifact-unknown.svelte';
	import ArtifactQuote from './artifact-quote.svelte';
	import ArtifactVideo from './artifact-video.svelte';
	import ArtifactArticle from './artifact-article.svelte';
	import ArtifactPdf from './artifact-pdf.svelte';

	const artifact: ArtifactProps = $props();
</script>

{#if artifact.type === 'note'}
	<ArtifactNote {...artifact} />
{:else if artifact.type === 'image'}
	<ArtifactImage {...artifact} />
{:else if artifact.type === 'article'}
	<ArtifactArticle {...artifact} />
{:else if artifact.type === 'pdf'}
	<ArtifactPdf {...artifact} />
{:else if artifact.type === 'video'}
	<ArtifactVideo {...artifact} />
{:else if artifact.type === 'quote'}
	<ArtifactQuote {...artifact} />
{:else if artifact.type === 'unknown'}
	<ArtifactUnknown {...artifact} />
{/if}
