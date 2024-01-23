export default {
  name: 'selectedProducts',
  type: 'document',
  title: 'Sélection du moment',

  fields: [
    {
      title: 'Produits',
      name: 'products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: (Rule) => Rule.required().unique(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Sélection de produits',
      }
    },
  },
}
