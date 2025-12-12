import { createTuyau } from '@tuyau/client';
import { api } from '@lumens/api/tuyau';

export const tuyau = createTuyau({
	api,
	baseUrl: 'http://localhost:3333'
});
