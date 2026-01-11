import { at, defineMigration, delete_ } from 'sanity/migrate'
import { collectionIds } from '../remove-bad-usages-of-collections/index'

export default defineMigration({
  title: 'Remove unused collections',
  documentTypes: ['collection'],
  filter: `_id in ["${collectionIds.join('", "')}"]`,
  migrate: {
    document(doc) {
      return delete_(doc._id)
    },
  },
})
