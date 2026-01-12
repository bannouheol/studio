// sanity.config.js
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas/schema'
import { vercelDeployTool } from 'sanity-plugin-vercel-deploy'
import { FaHotjar } from 'react-icons/fa'

export default defineConfig({
  name: 'bannouheol',
  title: 'Bannoù-heol',
  projectId: 'hk48qn3z',
  dataset: 'staging',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Regular document types
            S.documentTypeListItem('product').title('Produits'),
            S.documentTypeListItem('collection').title('Collection'),
            S.documentTypeListItem('category').title('Catégories'),
            S.documentTypeListItem('selection').title('Sélections'),
            S.documentTypeListItem('profile').title('Profiles'),
            S.documentTypeListItem('publisher').title('Editeurs'),
            S.documentTypeListItem('page').title('Pages'),
            S.documentTypeListItem('blogPost').title('Articles de presse'),
            S.documentTypeListItem('blogAuthor').title('Journal, Radio, ...'),
            S.documentTypeListItem('blogCategory').title('Catégorie de post'),
            // Our singleton type has a list item with a custom child
            S.listItem().icon(FaHotjar).title('Selection de produits').id('selectedProducts').child(
              // Instead of rendering a list of documents, we render a single
              // document, specifying the `documentId` manually to ensure
              // that we're editing the single instance of the document
              S.document().schemaType('selectedProducts').documentId('selectedProducts')
            ),
          ]),
    }),
    visionTool(),
    vercelDeployTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
