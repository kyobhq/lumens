import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { config as svelteConfig } from '@lumens/eslint-config/svelte';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(includeIgnoreFile(gitignorePath), ...svelteConfig, {
	languageOptions: {
		globals: { ...globals.browser, ...globals.node }
	}
});
