import { cubicOut } from 'svelte/easing';

export interface MaskInParams {
	duration?: number;
	easing?: (t: number) => number;
	scale?: number;
}

const defaults: Required<MaskInParams> = {
	duration: 300,
	easing: cubicOut,
	scale: 1000
};

export function maskIn(node: Element, params: MaskInParams) {
	const resolved = { ...defaults, ...params };

	return {
		duration: resolved.duration,
		easing: resolved.easing,
		css: (t: number) => {
			const eased = resolved.easing(t);
			const size = eased * resolved.scale;

			return `
				mask-image: radial-gradient(ellipse ${size}% ${size}% at 50% 50%, #000000 50%, transparent 100%);
				mask-size: 100% 100%;
			`;
		}
	};
}
