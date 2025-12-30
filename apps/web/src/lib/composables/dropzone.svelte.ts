import { getArtifactStore } from '$lib/stores/artifacts.svelte';

interface DropzoneCallbacks {
	onDrop?: (files: File[]) => void;
	onDragEnter?: (event: DragEvent) => void;
	onDragLeave?: (event: DragEvent) => void;
	onDropZoneActive?: (active: boolean) => void;
}

interface DropzoneOptions {
	accept?: string[];
	maxSize?: number; // in bytes
	multiple?: boolean;
	disabled?: boolean;
}

/**
 * Composable for handling drag-and-drop file uploads.
 * Provides reactive state and event handlers for dropzone interactions.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 * 	const dropzone = createDropzone({
 * 		onDrop: (files) => console.log('Dropped:', files),
 * 		onDropZoneActive: (active) => console.log('Active:', active),
 * 	});
 * </script>
 *
 * <div
 * 	ondragenter={dropzone.handleDragEnter}
 * 	ondragleave={dropzone.handleDragLeave}
 * 	ondragover={dropzone.handleDragOver}
 * 	ondrop={dropzone.handleDrop}
 * >
 * 	Content
 * </div>
 * ```
 */
export function createDropzone(callbacks: DropzoneCallbacks = {}, options: DropzoneOptions = {}) {
	const { onDrop, onDragEnter, onDragLeave, onDropZoneActive } = callbacks;

	const { accept, maxSize, multiple = false, disabled = false } = options;

	let dragCounter = $state(0);
	let isDraggingOver = $derived(dragCounter > 0);
	let isSupported = $derived(
		typeof window !== 'undefined' &&
			typeof DragEvent !== 'undefined' &&
			typeof FileList !== 'undefined'
	);

	function validateFiles(files: FileList | null): File[] {
		if (!files || files.length === 0) return [];

		const fileArray = Array.from(files);

		// Check multiple constraint
		if (!multiple && fileArray.length > 1) {
			return [fileArray[0]];
		}

		// Check accept constraint
		if (accept && accept.length > 0) {
			const acceptedTypes = accept.flatMap((type) => {
				if (type.includes('/')) {
					return [type.toLowerCase()];
				}
				// Handle extension patterns like ".jpg"
				if (type.startsWith('.')) {
					const ext = type.slice(1).toLowerCase();
					return [`.${ext}`, ext];
				}
				return [type.toLowerCase()];
			});

			return fileArray.filter((file) => {
				const fileName = file.name.toLowerCase();
				const mimeType = file.type.toLowerCase();

				return acceptedTypes.some((accepted) => {
					if (accepted.endsWith('/*')) {
						return mimeType.startsWith(accepted.slice(0, -1));
					}

					if (accepted.startsWith('.')) {
						return fileName.endsWith(accepted);
					}

					return mimeType === accepted;
				});
			});
		}

		// Check size constraint
		if (maxSize) {
			return fileArray.filter((file) => file.size <= maxSize);
		}

		return fileArray;
	}

	function handleDragEnter(event: DragEvent) {
		if (disabled || !isSupported) return;

		event.preventDefault();
		dragCounter++;

		if (dragCounter === 1) {
			onDropZoneActive?.(true);
		}

		onDragEnter?.(event);
	}

	function handleDragLeave(event: DragEvent) {
		if (disabled || !isSupported) return;

		event.preventDefault();
		dragCounter--;

		if (dragCounter === 0) {
			onDropZoneActive?.(false);
		}

		onDragLeave?.(event);
	}

	function handleDragOver(event: DragEvent) {
		if (disabled || !isSupported) return;

		event.preventDefault();
		event.dataTransfer!.dropEffect = 'copy';
	}

	async function handleDrop(event: DragEvent) {
		if (disabled || !isSupported) return;

		event.preventDefault();
		dragCounter = 0;
		onDropZoneActive?.(false);

		const files = validateFiles(event.dataTransfer?.files ?? null);

		if (files.length > 0) {
			onDrop?.(files);
		}
	}

	function reset() {
		dragCounter = 0;
		onDropZoneActive?.(false);
	}

	return {
		get isDraggingOver() {
			return isDraggingOver;
		},
		get isSupported() {
			return isSupported;
		},
		get dragCounter() {
			return dragCounter;
		},
		handleDragEnter,
		handleDragLeave,
		handleDragOver,
		handleDrop,
		reset,
		validateFiles
	};
}

/**
 * Simple dropzone factory for quick integration.
 * Creates a dropzone with default options and artifact upload.
 */
export function createArtifactDropzone() {
	const artifacts = getArtifactStore();

	return createDropzone(
		{
			onDrop: (files) => {
				artifacts.create({}, files);
			}
		},
		{
			accept: ['image/*', 'video/*', 'application/pdf', '.md', '.txt', '.json'],
			maxSize: 100 * 1024 * 1024, // 100MB
			multiple: true
		}
	);
}
