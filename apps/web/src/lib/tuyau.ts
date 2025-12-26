import { createTuyau } from '@tuyau/client';
import type { ApiDefinition } from '@lumens/api/tuyau';

export const tuyau = createTuyau<{ definition: ApiDefinition }>({
	baseUrl: import.meta.env.VITE_PUBLIC_API_HOST.replace('/v1', ''),
	redirect: 'manual',
	credentials: 'include'
}).v1;
