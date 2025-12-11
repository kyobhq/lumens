import type { Message } from '$lib/types';

class MessageStore {
	all = $state<Array<Message>>([]);

	add(message: Message) {
		this.all.push(message);
	}

	remove(messageId: string) {
		const idx = this.all.findIndex((m) => m.id === messageId);
		if (idx > -1) this.all.splice(idx, 1);
	}
}

export const messages = new MessageStore();
