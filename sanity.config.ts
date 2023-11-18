// sanity.config.js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas/schema'

export default defineConfig({
  name: 'bannouheol',
  title: 'Bannoù-heol',
  projectId: 'hk48qn3z',
  dataset: 'production',
  plugins: [
    deskTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})