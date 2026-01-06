import {defineType, defineField} from 'sanity'
import {FaLayerGroup} from 'react-icons/fa'

export default defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: FaLayerGroup,
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
      name: 'seoOptimizedTitle',
      title: 'SEO Optimized Title',
      type: 'localeString',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'menuOrder',
      title: 'Ordre dans le menu',
      type: 'number',
    }),
    defineField({
      name: 'parentCategory',
      title: 'Catégorie parente',
      type: 'reference',
      to: [{type: 'category'}],
    }),
  ],
  preview: {
    select: {
      title: 'title.br',
      subtitle: 'title.fr',
      media: 'image',
    },
  },
  orderings: [
    {
      title: 'Menu Order, Asc',
      name: 'menuOrderAsc',
      by: [{field: 'menuOrder', direction: 'asc'}],
    },
  ],
})
