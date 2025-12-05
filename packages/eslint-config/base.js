import eslintConfigPrettier from "eslint-config-prettier";
import tsEslint from "typescript-eslint";
import js from "@eslint/js";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tsEslint.configs.recommended,
  {
    ignores: [
      "dist/**",
      "build/**",
      "out/**",
      "**/vite.config.*.timestamp*",
      "**/vitest.config.*.timestamp*",
    ],
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
    ],
  },
];
