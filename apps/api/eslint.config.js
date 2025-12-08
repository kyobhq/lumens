import { configAdonis } from '@lumens/eslint-config/adonis'

export default configAdonis({
  languageOptions: {
    parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
  },
})
