import { cubicOut } from 'svelte/easing';

export interface FadeSlideBlurParams {
	duration?: number;
	easing?: (t: number) => number;
	y?: number;
	blur?: number;
	opacity?: number;
}

const defaults: Required<FadeSlideBlurParams> = {
	duration: 300,
	easing: cubicOut,
	y: 20,
	blur: 8,
	opacity: 0
};

/**
 * Custom transition that combines fade, vertical slide, and blur effects.
 * Useful for smooth, modern entrance/exit animations.
 *
 * @param params - Configuration options for the transition
 * @returns Transition function compatible with Svelte's transition directive
 *
 * @example
 * ```svelte
 * <div transition:fadeSlideBlur={{ y: 30, blur: 10, duration: 400 }}>
 *   Content
 * </div>
 * ```
 */
export function fadeSlideBlur(node: Element, params: FadeSlideBlurParams) {
	const resolved = { ...defaults, ...params };

	return {
		duration: resolved.duration,
		easing: resolved.easing,
		css: (t: number) => {
			const eased = resolved.easing(t);
			const reversed = 1 - eased;

			return `
				opacity: ${resolved.opacity + (1 - resolved.opacity) * eased};
				filter: blur(${resolved.blur * reversed}px);
				transform: translateY(${resolved.y * reversed}px);
			`;
		}
	};
}
