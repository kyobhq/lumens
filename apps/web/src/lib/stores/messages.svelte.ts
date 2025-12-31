import { tuyau } from '$lib/tuyau';
import type { ChatLumen } from '@lumens/api/validators/lumens';
import type { MessageTransformer } from '@lumens/api/types';

class MessageStore {
	all = $state<MessageTransformer[]>([]);

	async getAll() {
		const res = await tuyau.messages.$get();
		if (res.error) {
			console.error(res.error);
			return;
		}

		this.all = res.data;
	}

	async send(payload: ChatLumen) {
		const res = await tuyau.lumens.chat.$post(payload, { timeout: 45_000 });
		if (res.error) {
			console.error(res.error);
			return;
		}

		this.all.push(...res.data);
	}
}

export const messages = new MessageStore();
