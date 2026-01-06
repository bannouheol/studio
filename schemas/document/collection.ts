import {defineType, defineField} from 'sanity'
import {MdCollections} from 'react-icons/md'

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: MdCollections,
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
      name: 'linkedInFooter',
      title: 'Faire apparaître en pied de page',
      type: 'boolean',
    }),
  ],
  preview: {
    select: {
      title: 'title.br',
      subtitle: 'title.fr',
      media: 'image',
    },
  },
})
