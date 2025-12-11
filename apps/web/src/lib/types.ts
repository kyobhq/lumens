import type { JSONContent } from '@tiptap/core';
import type { DateTime } from 'luxon';

export interface IconProps {
	height?: number;
	width?: number;
	class?: string;
}

export interface Message {
	id: string;
	type: 'ai' | 'human';
	username: string;
	content: JSONContent;
	timestamp: DateTime;
}
