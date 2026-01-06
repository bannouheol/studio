import {defineType, defineField} from 'sanity'
import {SUPPORTED_LANGUAGES} from './languages'

export default defineType({
  name: 'localeBlockContent',
  type: 'object',
  fields: SUPPORTED_LANGUAGES.map((lang) =>
    defineField({
      title: lang.title,
      name: lang.id,
      type: 'blockContent',
    })
  ),
})
