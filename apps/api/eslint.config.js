import { configAdonis } from '@monorepo/eslint-config/adonis'

export default configAdonis({
  languageOptions: {
    parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
  },
})
