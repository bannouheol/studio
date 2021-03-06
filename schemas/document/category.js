import { FaLayerGroup } from 'react-icons/fa'

export default {
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: FaLayerGroup,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localeString',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'localeSlug',
    },
    {
      name: 'seoOptimizedTitle',
      title: 'SEO Optimized Title',
      type: 'localeString',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'localeBlockContent',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'menuOrder',
      title: 'Ordre dans le menu',
      type: 'number',
    },
    {
      name: 'parentCategory',
      title: 'Catégorie parente',
      type: 'reference',
      to: { type: 'category' },
    },
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
      by: [{ field: 'menuOrder', direction: 'asc' }],
    },
  ],
}
