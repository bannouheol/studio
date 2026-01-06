import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'selectedProducts',
  type: 'document',
  title: 'Sélection du moment',
  fields: [
    defineField({
      title: 'Produits',
      name: 'products',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'product'}],
        }),
      ],
      validation: (Rule) => Rule.required().unique(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Sélection de produits',
      }
    },
  },
})
