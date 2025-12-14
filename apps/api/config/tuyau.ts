import { defineConfig } from '@tuyau/core'

const tuyauConfig = defineConfig({
  codegen: {
    routes: {
      only: [/^\/v1./],
    },
    definitions: {
      only: [/^\/v1./],
    },
  },
})

export default tuyauConfig

