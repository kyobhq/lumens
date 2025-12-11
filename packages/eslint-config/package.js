import { PLUGINS_LIST, GLOBAL_IGNORE_LIST, RULES_LIST, INCLUDE_LIST } from './globals.js'
import tseslint from 'typescript-eslint'

export function configPackage(...configBlocksToMerge) {
  return tseslint.config(
    {
      ignores: GLOBAL_IGNORE_LIST,
    },
    tseslint.configs.base,
    {
      name: 'Plugins list',
      plugins: PLUGINS_LIST,
    },
    {
      name: 'Package defaults',
      files: INCLUDE_LIST,
      rules: RULES_LIST,
    },
    ...configBlocksToMerge
  )
}
