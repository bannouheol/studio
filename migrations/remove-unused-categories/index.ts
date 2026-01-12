import { at, defineMigration, delete_ } from 'sanity/migrate'
import { categoryToDeleteIds } from '../remove-bad-usages-of-categories/index'

export default defineMigration({
  title: 'Remove unused categories',
  documentTypes: ['category'],
  filter: `_id in ["${categoryToDeleteIds.join('", "')}"]`,
  migrate: {
    document(doc) {
      return delete_(doc._id)
    },
  },
})
