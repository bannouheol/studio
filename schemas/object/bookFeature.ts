import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  title: 'Caractéristiques du livre',
  name: 'bookFeature',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      title: 'Auteur(s)',
      name: 'authors',
      description: 'Auteur(s) du texte',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'profile'}],
        }),
      ],
    }),
    defineField({
      title: 'Illustrateur(s)',
      name: 'illustrators',
      description: 'Illustrateur(s) des images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'profile'}],
        }),
      ],
    }),
    defineField({
      title: 'Scénariste(s)',
      name: 'scriptwriters',
      description: 'Pour les BD et romans graphiques',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'profile'}],
        }),
      ],
    }),
    defineField({
      name: 'numberOfPages',
      type: 'number',
      title: 'Nombre de pages',
      validation: (Rule) => Rule.positive().integer(),
    }),
  ],
  preview: {
    select: {
      authors: 'authors',
      pages: 'numberOfPages',
    },
    prepare({authors, pages}) {
      const authorCount = authors?.length || 0
      return {
        title: `${authorCount} auteur(s)${pages ? ` · ${pages} pages` : ''}`,
      }
    },
  },
})
