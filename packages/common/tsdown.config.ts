import { defineConfig } from 'tsdown/config'
import { mapKeys } from 'radashi'

const isDeployBuild = !!process.env.BUILD_ENV
export default defineConfig({
  entry: [
    './src/apis/!(*.test).ts',
    './src/types.ts',
  ],
  dts: isDeployBuild,
  unbundle: true,
  platform: 'node',
  exports: {
    devExports: !isDeployBuild,
    customExports(pkg) {
      pkg = mapKeys(pkg, (key) => (key.endsWith('/index') ? key.slice(0, -6) : key))
      return pkg
    },
  },
})
