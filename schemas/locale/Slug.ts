import {defineType, defineField} from 'sanity'
import {SUPPORTED_LANGUAGES} from './languages'
import {createAutoSlugInput} from '../../components/AutoSlugInput'

export default defineType({
  type: 'object',
  name: 'localeSlug',
  fields: SUPPORTED_LANGUAGES.map((lang) =>
    defineField({
      name: lang.id,
      type: 'slug',
      title: lang.title,
      components: {
        input: createAutoSlugInput(lang.id),
      },
      validation: (Rule) => Rule.required(),
    })
  ),
})
