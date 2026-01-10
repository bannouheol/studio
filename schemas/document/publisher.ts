import { defineType, defineField } from 'sanity'
import { GiFoldedPaper } from 'react-icons/gi'
import { SimpleAutoSlugInput } from '../../components/SimpleAutoSlugInput'

export default defineType({
  name: 'publisher',
  title: 'Éditeur',
  type: 'document',
  icon: GiFoldedPaper,
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Site internet',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
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
