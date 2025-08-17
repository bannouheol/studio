import { GiFoldedPaper } from 'react-icons/gi'

export default {
  name: 'vendor',
  title: 'Editeur',
  type: 'document',
  icon: GiFoldedPaper,
  fields: [
    {
      name: 'title',
      title: 'Nom',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'website',
      title: 'Site internet',
      type: 'url',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
    },
  },
}
