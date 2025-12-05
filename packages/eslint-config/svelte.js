import eslintConfigPrettier from "eslint-config-prettier";
import tsEslint from "typescript-eslint";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";

/**
 * A shared ESLint configuration for Svelte/SvelteKit projects.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  ...svelte.configs.recommended,
  eslintConfigPrettier,
  ...svelte.configs.prettier,
  {
    ignores: [
      "dist/**",
      "build/**",
      "out/**",
      ".svelte-kit/**",
      "**/vite.config.*.timestamp*",
      "**/vitest.config.*.timestamp*",
    ],
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tsEslint.parser,
      },
    },
  },
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
      "**/*.svelte",
    ],
  },
];
