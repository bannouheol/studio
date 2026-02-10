import { defineType, defineField } from 'sanity'
import { MdCampaign } from 'react-icons/md'

export default defineType({
  name: 'announcement',
  title: 'Annonce',
  type: 'document',
  icon: MdCampaign,
  fields: [
    defineField({
      name: 'message',
      title: 'Message',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Actif',
      description: 'Afficher cette annonce sur le site',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'link',
      title: 'Lien (URL)',
      type: 'url',
    }),
    defineField({
      name: 'linkLabel',
      title: 'Texte du lien',
      type: 'localeString',
    }),
    defineField({
      name: 'order',
      title: 'Ordre',
      description: "Ordre d'affichage (plus petit = plus haut)",
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'message.fr',
      subtitle: 'message.br',
      isActive: 'isActive',
    },
    prepare({ title, subtitle, isActive }) {
      return {
        title: `${isActive === false ? '🔇 ' : '📢 '}${title || 'Sans titre'}`,
        subtitle: subtitle,
      }
    },
  },
  orderings: [
    {
      title: 'Ordre, Asc',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
