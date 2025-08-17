import { GiBookCover } from 'react-icons/gi'

export default {
  name: 'product',
  title: 'Produit',
  type: 'document',
  icon: GiBookCover,
  fields: [
    {
      name: 'ref',
      title: 'Référence',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Titre',
      type: 'localeString',
    },
    {
      name: 'seoTitle',
      title: 'Titre SEO',
      description: "[Référencement] Titre qui s'affiche dans la barre d'adresse",
      type: 'localeString',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'localeSlug',
      /*
      validation: (Rule) =>
        Rule.custom((slugs) => {
          return slugs.br && slugs.br.current && slugs.fr && slugs.fr.current
            ? true
            : {
                message: "Les deux slugs doivent être indiqués",
              };
        }),
        */
    },
    {
      name: 'previousPath',
      title: 'Adresse ancien site',
      type: 'string',
    },
    {
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'category' },
        },
      ],
    },
    {
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: { type: 'collection' },
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Default variant',
      name: 'defaultProductVariant',
      type: 'productVariant',
    },
    {
      title: 'Variants',
      name: 'variants',
      type: 'array',
      of: [
        {
          title: 'Variant',
          type: 'productVariant',
        },
      ],
    },
    {
      name: 'vendor',
      title: 'Editeur',
      type: 'reference',
      to: { type: 'vendor' },
    },
    {
      name: 'body',
      title: 'Body',
      type: 'localeBlockContent',
    },
    {
      title: 'Traducteur(s)',
      name: 'traductors',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'profile' },
        },
      ],
    },
    {
      title: 'Age minimum',
      name: 'minimumAge',
      type: 'number',
    },
    {
      title: 'Date de sortie',
      name: 'releaseDate',
      type: 'date',
    },
    {
      title: 'Caractéristiques du livre',
      name: 'bookFeature',
      type: 'bookFeature',
    },
    {
      title: 'Caractéristiques du DVD',
      name: 'dvdFeature',
      type: 'dvdFeature',
    },
    {
      title: 'Vidéos YouTube',
      name: 'youtubeVideos',
      type: 'array',
      of: [
        {
          title: 'Vidéo Youtube',
          type: 'youtube',
        },
      ],
    },
    /*
    {
      title: 'Tags',
      name: 'tags',
      type: 'array',
      of: [
        {
          type: 'string'
        }
      ],
      options: {
        layout: 'tags'
      }
    },
    */
  ],
  preview: {
    select: {
      titleBr: 'title.br',
      titleFr: 'title.fr',
      collection: 'collection.title.br',
      media: 'defaultProductVariant.images[0]',
      date: 'releaseDate',
    },
    prepare(selection) {
      const { titleBr, titleFr, collection, date, media } = selection
      const formattedDate = new Intl.DateTimeFormat('fr-FR').format(new Date(date))
      return {
        title: titleBr,
        subtitle: `${titleFr}, ${collection}, ${formattedDate}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Date de sortie, nouveaux',
      name: 'releaseDateDesc',
      by: [{ field: 'releaseDate', direction: 'desc' }],
    },
  ],
}
