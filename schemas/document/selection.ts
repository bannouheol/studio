import { defineType, defineField, defineArrayMember } from 'sanity'
import { MdStar } from 'react-icons/md'

export default defineType({
  name: 'selection',
  title: 'Sélection',
  type: 'document',
  icon: MdStar,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'localeSlug',
      validation: (Rule) => Rule.required(),
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
      name: 'isVisible',
      title: 'Visible sur le site',
      description: 'Afficher cette sélection sur le site',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Ordre de tri',
      description: "Ordre d'affichage (plus petit = plus haut)",
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      title: 'Produits',
      name: 'products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'product' }],
        }),
      ],
      validation: (Rule) => Rule.required().unique(),
    }),
  ],
  preview: {
    select: {
      title: 'title.br',
      subtitle: 'title.fr',
      media: 'image',
      isVisible: 'isVisible',
    },
    prepare({ title, subtitle, media, isVisible }) {
      return {
        title: `${isVisible === false ? '🔒 ' : ''}${title || 'Sans titre'}`,
        subtitle: subtitle,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Ordre de tri, Asc',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
})
