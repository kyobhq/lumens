<script lang="ts">
	import { getArtifactStore } from '$lib/stores/artifacts.svelte';
	import type { ArtifactTransformer } from '@lumens/api/types';
	import ArtifactDefault from '../artifacts/artifact-default.svelte';
	import Artifact from '../artifacts/artifact.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { createArtifactDropzone } from '$lib/composables/dropzone.svelte';
	import DropzoneOverlay from '../dropzone/dropzone-overlay.svelte';

	const GAP = 12;
	const OUTER_GAPS = 24;
	const BREAKPOINTS = [
		{ minWidth: 1350, columns: 6 },
		{ minWidth: 1280, columns: 5 },
		{ minWidth: 1024, columns: 4 },
		{ minWidth: 768, columns: 3 },
		{ minWidth: 0, columns: 2 }
	];

	const artifactStore = getArtifactStore();

	const dropzone = createArtifactDropzone();

	let containerWidth = $state(0);
	let imageAspectRatios = new SvelteMap<string, number>();

	const columnCount = $derived(BREAKPOINTS.find((b) => containerWidth >= b.minWidth)?.columns ?? 2);
	const columnWidth = $derived(
		(containerWidth - (columnCount - 1) * GAP - OUTER_GAPS) / columnCount
	);

	interface PositionedItem {
		id: string;
		x: number;
		y: number;
		width: number;
		height: number;
		artifact?: ArtifactTransformer;
		isDefault?: boolean;
	}

	function getAspectRatio(artifact: ArtifactTransformer | null): number {
		if (!artifact) return 65 / 45; // ArtifactDefault aspect ratio

		switch (artifact.type) {
			case 'image':
			case 'video':
				return imageAspectRatios.get(artifact.id) ?? 1;
			case 'note':
				return 65 / 45;
			case 'quote':
			case 'article':
			case 'pdf':
			case 'unknown':
			default:
				return 1; // Square
		}
	}

	function getColumnSpan(artifact: ArtifactTransformer | null, cols: number): number {
		if (!artifact) return 1; // ArtifactDefault always 1 column

		if (artifact.type === 'image' || artifact.type === 'video') {
			const aspectRatio = imageAspectRatios.get(artifact.id) ?? 1;
			// Landscape (aspect ratio > 1) spans 2 columns, but only if we have at least 3 columns
			if (aspectRatio > 1.1 && cols >= 3) {
				return 2;
			}
		}

		return 1;
	}

	const layout = $derived.by(() => {
		if (containerWidth === 0) return { items: [] as PositionedItem[], totalHeight: 0 };

		const columnHeights = Array(columnCount).fill(0);
		const items: PositionedItem[] = [];

		// All items: ArtifactDefault first, then artifacts
		const allItems: Array<{ artifact: ArtifactTransformer | null; isDefault: boolean }> = [
			{ artifact: null, isDefault: true },
			...artifactStore.artifacts.map((a) => ({ artifact: a, isDefault: false }))
		];

		for (const { artifact, isDefault } of allItems) {
			const colSpan = getColumnSpan(artifact, columnCount);
			const itemWidth = colSpan * columnWidth + (colSpan - 1) * GAP;
			const aspectRatio = getAspectRatio(artifact);
			const height = itemWidth / aspectRatio;

			// Find best column(s) for this item
			let bestCol = 0;
			if (colSpan === 1) {
				// Find shortest column
				let minHeight = columnHeights[0];
				for (let i = 1; i < columnCount; i++) {
					if (columnHeights[i] < minHeight) {
						minHeight = columnHeights[i];
						bestCol = i;
					}
				}
			} else {
				// Find best pair of adjacent columns (lowest max height)
				let minMaxHeight = Infinity;
				for (let i = 0; i <= columnCount - colSpan; i++) {
					const maxHeight = Math.max(...columnHeights.slice(i, i + colSpan));
					if (maxHeight < minMaxHeight) {
						minMaxHeight = maxHeight;
						bestCol = i;
					}
				}
			}

			const x = bestCol * columnWidth + bestCol * GAP;
			const y =
				colSpan === 1
					? columnHeights[bestCol]
					: Math.max(...columnHeights.slice(bestCol, bestCol + colSpan));

			items.push({
				id: isDefault ? '__default__' : artifact!.id,
				x,
				y,
				width: itemWidth,
				height,
				artifact: artifact ?? undefined,
				isDefault
			});

			// Update column heights
			for (let i = bestCol; i < bestCol + colSpan; i++) {
				columnHeights[i] = y + height + GAP;
			}
		}

		const totalHeight = Math.max(...columnHeights) - GAP; // Remove trailing gap

		return { items, totalHeight };
	});

	function loadImageDimensions(artifact: ArtifactTransformer) {
		if (!artifact.url || imageAspectRatios.has(artifact.id)) return;

		const img = new Image();
		img.onload = () => {
			const aspectRatio = img.naturalWidth / img.naturalHeight;
			imageAspectRatios.set(artifact.id, aspectRatio);
		};
		img.src = artifact.url;
	}

	$effect(() => {
		for (const artifact of artifactStore.artifacts) {
			if ((artifact.type === 'image' || artifact.type === 'video') && artifact.url) {
				loadImageDimensions(artifact);
			}
		}
	});
</script>

<div
	class="flex-1 bg-lu-main-900 border border-lu-main-800 rounded-max-lg p-3 relative"
	bind:clientWidth={containerWidth}
	style="height: {layout.totalHeight + 24}px;"
	ondragenter={(e) => dropzone.handleDragEnter(e)}
	ondragleave={(e) => dropzone.handleDragLeave(e)}
	ondragover={(e) => dropzone.handleDragOver(e)}
	ondrop={(e) => dropzone.handleDrop(e)}
	role="region"
	aria-label="Artifacts dropzone"
>
	<DropzoneOverlay visible={dropzone.isDraggingOver} />
	{#each layout.items as item (item.id)}
		<div
			class="absolute transition-none"
			class:pointer-events-none={dropzone.isDraggingOver}
			style="transform: translate({item.x}px, {item.y}px); width: {item.width}px;"
		>
			{#if item.isDefault}
				<ArtifactDefault />
			{:else if item.artifact}
				<Artifact {...item.artifact} width={item.width} x={item.x} y={item.y} />
			{/if}
		</div>
	{/each}
</div>
