import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'blogCategory',
  title: 'Catégorie de post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'localeSlug',
    }),
    defineField({
      name: 'parents',
      title: 'Parent categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'blogCategory'}],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.br',
      subtitle: 'title.fr',
    },
  },
})
