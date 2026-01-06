import {defineType, defineField} from 'sanity'
import {GiNewspaper} from 'react-icons/gi'
import {SimpleAutoSlugInput} from '../../../components/SimpleAutoSlugInput'

export default defineType({
  name: 'blogAuthor',
  title: 'Journal, radio, ...',
  type: 'document',
  icon: GiNewspaper,
  fields: [
    defineField({
      name: 'title',
      title: 'Nom',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      components: {
        input: SimpleAutoSlugInput,
      },
    }),
    defineField({
      name: 'website',
      title: 'Site internet',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'logo',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
    },
  },
})
