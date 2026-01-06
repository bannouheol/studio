import {defineType, defineField} from 'sanity'
import {MdContentPaste} from 'react-icons/md'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: MdContentPaste,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'localeSlug',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Titre en H1 pour le référencement',
      type: 'localeString',
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'localeBlockContent',
    }),
    defineField({
      name: 'createPage',
      title: 'Créer une page dédiée',
      type: 'boolean',
    }),
  ],
  preview: {
    select: {
      title: 'title.br',
      subtitle: 'title.fr',
    },
  },
})
