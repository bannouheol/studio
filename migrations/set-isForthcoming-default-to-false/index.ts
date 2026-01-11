import { at, defineMigration, patch, setIfMissing } from 'sanity/migrate'

export default defineMigration({
  title: 'Set isForthcoming default to false',
  documentTypes: ['product'],

  async *migrate(documents, context) {
    for await (const document of documents()) {
      yield patch(document._id, [at('defaultProductVariant.isForthcoming', setIfMissing(false))])
    }
  },
})
