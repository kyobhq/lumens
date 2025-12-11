import { configPackage } from '@lumens/eslint-config/package'

export default configPackage({
  languageOptions: {
    parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
  },
})
