import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  title: 'Variante produit',
  name: 'productVariant',
  type: 'object',
  fieldsets: [
    {
      name: 'media',
      title: 'Médias',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'pricing',
      title: 'Prix & Disponibilité',
      options: { collapsible: true, collapsed: false },
    },
    {
      name: 'physical',
      title: 'Caractéristiques physiques',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    // Basic info
    defineField({
      title: 'Titre de la variante',
      name: 'title',
      description: 'Laisser vide pour utiliser le titre du produit',
      type: 'string',
    }),

    // Media
    defineField({
      name: 'images',
      title: 'Images',
      description: 'La première image sera utilisée comme image principale',
      type: 'array',
      fieldset: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),

    // Pricing & availability
    defineField({
      title: 'Prix',
      name: 'price',
      type: 'price',
      fieldset: 'pricing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'En stock',
      name: 'inStock',
      type: 'boolean',
      fieldset: 'pricing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Date de réapprovisionnement',
      description: 'Date approximative à laquelle le client pourra être livré',
      name: 'resupplyingDate',
      type: 'date',
      fieldset: 'pricing',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
      hidden: ({ parent }) => {
        const variant = parent as { inStock?: boolean } | undefined
        return variant?.inStock ?? false
      },
    }),
    defineField({
      title: 'À paraître',
      name: 'isForthcoming',
      description: "Cocher si le produit n'est pas encore sorti",
      type: 'boolean',
      fieldset: 'pricing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Autoriser la prévente',
      name: 'allowPreorder',
      description: 'Permettre aux clients de commander avant la sortie',
      type: 'boolean',
      fieldset: 'pricing',
      hidden: ({ parent }) => {
        const variant = parent as { isForthcoming?: boolean } | undefined
        return !variant?.isForthcoming
      },
    }),

    // Physical characteristics
    defineField({
      title: 'Poids (grammes)',
      name: 'weight',
      type: 'number',
      fieldset: 'physical',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      title: 'Dimensions',
      name: 'dimensions',
      description: 'Ex: 21 x 15 cm',
      type: 'string',
      fieldset: 'physical',
    }),
    defineField({
      title: 'Code-barres',
      name: 'barcode',
      type: 'barcode',
      fieldset: 'physical',
    }),
  ],
  initialValue: {
    inStock: true,
    isForthcoming: false,
  },
  preview: {
    select: {
      title: 'title',
      price: 'price.value',
      inStock: 'inStock',
      media: 'images.0',
    },
    prepare({ title, price, inStock, media }) {
      const stockStatus = inStock ? '✓ En stock' : '✗ Rupture'
      const priceText = price ? `${price} €` : 'Prix non défini'
      return {
        title: title || 'Variante principale',
        subtitle: `${priceText} · ${stockStatus}`,
        media,
      }
    },
  },
})
