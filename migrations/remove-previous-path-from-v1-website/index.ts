import { at, defineMigration, setIfMissing, unset } from 'sanity/migrate'

export default defineMigration({
  title: 'Remove previous path (from V1 Website)',
  documentTypes: ['product', 'blogPost'],

  migrate: {
    document(doc, context) {
      // this will be called for every document of the matching type
      // any patch returned will be applied to the document
      // you can also return mutations that touches other documents

      return at('previousPath', unset())
    },
  },
})
