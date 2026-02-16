import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'hk48qn3z',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'staging',
  },
})
