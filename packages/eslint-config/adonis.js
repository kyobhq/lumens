import { PLUGINS_LIST, GLOBAL_IGNORE_LIST, RULES_LIST, INCLUDE_LIST } from './globals.js'
import adonisJSPlugin from '@adonisjs/eslint-plugin'
import tseslint from 'typescript-eslint'

export const ADONIS_IGNORE_LIST = [
  'public/assets/**',
  '__snapshots__/**',
  '**/__snapshots__/**',
  '**/*.snap',
  '**/*.cjs',
  'resources/**',
  '.adonisjs/**',
  'ace.js',
]

export function configAdonis(...configBlocksToMerge) {
  return tseslint.config(
    {
      ignores: [...GLOBAL_IGNORE_LIST, ...ADONIS_IGNORE_LIST],
    },
    tseslint.configs.base,
    {
      name: 'Plugins list',
      plugins: {
        ...PLUGINS_LIST,
        '@adonisjs': adonisJSPlugin,
      },
    },
    {
      name: 'AdonisJS app defaults',
      files: INCLUDE_LIST,
      rules: {
        ...RULES_LIST,
        '@adonisjs/prefer-lazy-controller-import': ['error'],
        '@adonisjs/prefer-lazy-listener-import': ['error'],

        /**
         * Disabled because common pattern for module augmentation in AdonisJS
         * config files.
         */
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
    {
      files: ['./inertia/**/*'],
      rules: {
        '@unicorn/filename-case': 'off',
      },
    },
    ...configBlocksToMerge
  )
}
