import { createTuyau } from '@tuyau/client';
import type { ApiDefinition } from '@lumens/api/tuyau';
import { superjson } from '@tuyau/superjson/plugin';

export const tuyau = createTuyau<{ definition: ApiDefinition }>({
	baseUrl: import.meta.env.VITE_PUBLIC_API_HOST.replace('/v1', ''),
	plugins: [superjson()],
	redirect: 'manual',
	credentials: 'include'
}).v1;
