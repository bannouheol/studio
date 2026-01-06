import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'price',
  type: 'object',
  title: 'Prix',
  fields: [
    defineField({
      name: 'value',
      type: 'number',
      title: 'Valeur',
    }),
  ],
})
