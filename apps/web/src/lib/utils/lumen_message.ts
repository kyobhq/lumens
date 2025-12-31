import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function generateLumenMessage(messageObj: { content: string }) {
	return DOMPurify.sanitize(marked.parse(messageObj.content, { async: false }));
}
