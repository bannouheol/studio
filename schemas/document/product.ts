import { defineType, defineField, defineArrayMember } from 'sanity'
import { GiBookCover } from 'react-icons/gi'
import { MdInfo, MdDescription, MdInventory, MdPermMedia, MdStraighten } from 'react-icons/md'
import { BiMoviePlay } from 'react-icons/bi'

export default defineType({
  name: 'product',
  title: 'Produit',
  type: 'document',
  icon: GiBookCover,
  groups: [
    { name: 'general', title: 'Général', icon: MdInfo, default: true },
    { name: 'description', title: 'Description', icon: MdDescription },
    { name: 'media', title: 'Médias', icon: MdPermMedia },
    { name: 'pricing', title: 'Prix & Stock', icon: MdInventory },
    { name: 'physical', title: 'Caractéristiques physiques', icon: MdStraighten },
    { name: 'bookFeatures', title: 'Livre', icon: GiBookCover },
    { name: 'dvdFeatures', title: 'DVD', icon: BiMoviePlay },
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
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
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
      options: { dateFormat: 'DD/MM/YYYY' },
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
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      description: "Titre optimisé pour les moteurs de recherche (s'affiche dans l'onglet du navigateur)",
      type: 'localeString',
      group: 'general',
    }),
    defineField({
      title: 'Traducteur(s)',
      name: 'traductors',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'profile' }] })],
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
      name: 'images',
      title: 'Images',
      description: 'La première image sera utilisée comme image principale',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      group: 'media',
    }),
    defineField({
      title: 'Vidéos YouTube',
      name: 'youtubeVideos',
      description: 'Vidéos de présentation ou bandes-annonces',
      type: 'array',
      of: [defineArrayMember({ title: 'Vidéo Youtube', type: 'youtube' })],
      group: 'media',
    }),
    defineField({
      title: 'Fichiers audio',
      name: 'audioFiles',
      description: 'Extraits audio, podcasts ou enregistrements',
      type: 'array',
      of: [defineArrayMember({ type: 'file', options: { accept: 'audio/*' } })],
      group: 'media',
    }),

    // === PRIX & STOCK ===
    defineField({
      title: 'Prix (€)',
      name: 'price',
      type: 'number',
      group: 'pricing',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      title: 'En stock',
      name: 'inStock',
      type: 'boolean',
      group: 'pricing',
      validation: (Rule) => Rule.required(),
      initialValue: true,
    }),
    defineField({
      title: 'Date de réapprovisionnement',
      description: 'Date approximative à laquelle le client pourra être livré',
      name: 'resupplyingDate',
      type: 'date',
      group: 'pricing',
      options: { dateFormat: 'DD/MM/YYYY' },
      hidden: ({ document }) => (document?.inStock as boolean) ?? false,
    }),
    defineField({
      title: 'À paraître',
      name: 'isForthcoming',
      description: "Cocher si le produit n'est pas encore sorti",
      type: 'boolean',
      group: 'pricing',
      validation: (Rule) => Rule.required(),
      initialValue: false,
    }),
    defineField({
      title: 'Autoriser la prévente',
      name: 'allowPreorder',
      description: 'Permettre aux clients de commander avant la sortie',
      type: 'boolean',
      group: 'pricing',
      hidden: ({ document }) => !(document?.isForthcoming as boolean),
    }),

    // === CARACTÉRISTIQUES PHYSIQUES ===
    defineField({
      title: 'Poids (grammes)',
      name: 'weight',
      type: 'number',
      group: 'physical',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      title: 'Largeur (cm)',
      name: 'width',
      description: 'Largeur du produit en centimètres',
      type: 'number',
      group: 'physical',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      title: 'Longueur (cm)',
      name: 'length',
      description: 'Longueur du produit en centimètres',
      type: 'number',
      group: 'physical',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      title: 'Hauteur (cm)',
      name: 'height',
      description: 'Hauteur du produit en centimètres',
      type: 'number',
      group: 'physical',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      title: 'Code-barres',
      name: 'barcode',
      type: 'barcode',
      group: 'physical',
    }),

    // === LIVRE ===
    defineField({
      title: 'Caractéristiques du livre',
      name: 'bookFeature',
      description: 'Auteurs, illustrateurs et autres contributeurs',
      type: 'bookFeature',
      group: 'bookFeatures',
    }),

    // === DVD ===
    defineField({
      title: 'Caractéristiques du DVD',
      name: 'dvdFeature',
      description: 'Durée, nombre de DVD, épisodes et bonus',
      type: 'dvdFeature',
      group: 'dvdFeatures',
    }),
  ],

  initialValue: {
    inStock: true,
    isForthcoming: false,
  },

  preview: {
    select: {
      titleBr: 'title.br',
      titleFr: 'title.fr',
      collection: 'collection.title.br',
      media: 'images.0.asset',
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
