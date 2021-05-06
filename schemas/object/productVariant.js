export default {
  title: 'Product variant',
  name: 'productVariant',
  type: 'object',
  fields: [
    {
      title: 'Titre',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Poids (g)',
      name: 'weight',
      type: 'number',
    },
    {
      title: 'Dimensions',
      name: 'dimensions',
      type: 'string',
    },
    {
      title: 'Price',
      name: 'price',
      type: 'price',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'En vente',
      name: 'forSale',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'En stock',
      name: 'inStock',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'A paraître',
      name: 'isForthcoming',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Date de sortie ou de réapprovisionnement',
      //description: 'Indiquer la date approximative à laquelle le client pourra être livré',
      name: 'resupplyingDate',
      type: 'date',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      title: 'Bar code',
      name: 'barcode',
      type: 'barcode',
    },
  ],
  initialValue: {
    onSale: true,
    inStock: true,
    isForthcoming: false,
  },
}
