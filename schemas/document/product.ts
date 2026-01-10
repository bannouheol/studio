import { defineType, defineField, defineArrayMember } from 'sanity'
import { GiBookCover } from 'react-icons/gi'
import { MdInfo, MdDescription, MdInventory, MdPeople, MdSettings, MdSearch, MdPermMedia } from 'react-icons/md'

export default defineType({
  name: 'product',
  title: 'Produit',
  type: 'document',
  icon: GiBookCover,
  groups: [
    { name: 'general', title: 'Général', icon: MdInfo, default: true },
    { name: 'description', title: 'Description', icon: MdDescription },
    { name: 'media', title: 'Médias', icon: MdPermMedia },
    { name: 'variants', title: 'Images, Prix & Stock', icon: MdInventory },
    { name: 'bookFeatures', title: 'Caractéristiques du livre', icon: GiBookCover },
    { name: 'dvdFeatures', title: 'Caractéristiques du DVD', icon: MdSettings },
    { name: 'traductors', title: 'Traducteur(s)', icon: MdPeople },
    { name: 'seo', title: 'SEO', icon: MdSearch },
  ],
  fields: [
    // === GÉNÉRAL ===
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL du produit (généré automatiquement à partir du titre)',
      type: 'localeSlug',
      group: 'general',
    }),
    defineField({
      name: 'ref',
      title: 'Référence',
      description: 'Code de référence interne du produit',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
      group: 'general',
    }),
    defineField({
      name: 'categories',
      title: 'Catégories',
      description: 'Catégories pour le filtrage sur le site',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'category' }],
        }),
      ],
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publisher',
      title: 'Éditeur',
      description: "Maison d'édition du produit",
      type: 'reference',
      to: [{ type: 'publisher' }],
      group: 'general',
    }),
    defineField({
      title: 'Date de sortie',
      name: 'releaseDate',
      type: 'date',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
      group: 'general',
    }),
    defineField({
      title: 'Âge minimum',
      name: 'minimumAge',
      description: 'Âge minimum recommandé (en années)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(18),
      group: 'general',
    }),

    // === DESCRIPTION ===
    defineField({
      name: 'body',
      title: 'Description du produit',
      description: 'Texte de présentation affiché sur la page produit',
      type: 'localeBlockContent',
      group: 'description',
    }),

    // === MÉDIAS ===
    defineField({
      title: 'Vidéos YouTube',
      name: 'youtubeVideos',
      description: 'Vidéos de présentation ou bandes-annonces',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Vidéo Youtube',
          type: 'youtube',
        }),
      ],
      group: 'media',
    }),
    defineField({
      title: 'Fichiers audio',
      name: 'audioFiles',
      description: 'Extraits audio, podcasts ou enregistrements',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'file',
          options: {
            accept: 'audio/*',
          },
        }),
      ],
      group: 'media',
    }),

    // === VARIANTES & STOCK ===
    defineField({
      title: 'Variante principale',
      name: 'defaultProductVariant',
      description: 'Prix, stock et images du produit principal',
      type: 'productVariant',
      group: 'variants',
    }),
    defineField({
      title: 'Variantes supplémentaires',
      name: 'variants',
      description: 'Autres formats disponibles (ex: broché, relié, numérique)',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Variante',
          type: 'productVariant',
        }),
      ],
      group: 'variants',
    }),

    // === CARACTÉRISTIQUES DU LIVRE ===
    defineField({
      title: 'Caractéristiques du livre',
      name: 'bookFeature',
      description: 'Auteurs, illustrateurs et autres contributeurs',
      type: 'bookFeature',
      group: 'bookFeatures',
    }),
    // === CARACTÉRISTIQUES DU DVD ===
    defineField({
      title: 'Caractéristiques du DVD',
      name: 'dvdFeature',
      description: 'Durée, nombre de DVD, épisodes et bonus',
      type: 'dvdFeature',
      group: 'dvdFeatures',
    }),
    // === TRADUCTEUR(S) ===
    defineField({
      title: 'Traducteur(s)',
      name: 'traductors',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'profile' }],
        }),
      ],
      group: 'traductors',
    }),

    // === SEO ===
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      description: "Titre optimisé pour les moteurs de recherche (s'affiche dans l'onglet du navigateur)",
      type: 'localeString',
      group: 'seo',
    }),
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
      const formattedDate = date ? new Intl.DateTimeFormat('fr-FR').format(new Date(date)) : ''
      return {
        title: titleBr,
        subtitle: `${titleFr || ''}, ${collection || ''}, ${formattedDate}`,
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
})
