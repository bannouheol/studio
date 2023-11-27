// sanity.config.js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas/schema'
import { vercelDeployTool } from 'sanity-plugin-vercel-deploy'

export default defineConfig({
  name: 'bannouheol',
  title: 'Bannoù-heol',
  projectId: 'hk48qn3z',
  dataset: 'production',
  plugins: [
    deskTool(),
    vercelDeployTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})