import {defineType, defineField, defineArrayMember} from 'sanity'
import {MdLocalPostOffice, MdInfo, MdDescription, MdPermMedia, MdLink} from 'react-icons/md'
import {parseISO, format} from 'date-fns'

export default defineType({
  name: 'blogPost',
  title: 'Article de presse',
  type: 'document',
  icon: MdLocalPostOffice,
  groups: [
    {name: 'general', title: 'Général', icon: MdInfo, default: true},
    {name: 'content', title: 'Contenu', icon: MdDescription},
    {name: 'media', title: 'Médias', icon: MdPermMedia},
    {name: 'links', title: 'Liens', icon: MdLink},
  ],
  fields: [
    // === GÉNÉRAL ===
    defineField({
      title: 'Langue(s)',
      name: 'language',
      description: 'Langue(s) dans laquelle l\'article est rédigé',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [
          {title: 'Breton', value: 'br'},
          {title: 'Français', value: 'fr'},
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'date',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
      validation: (Rule) => Rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
      group: 'general',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL de l\'article (généré automatiquement)',
      type: 'localeSlug',
      group: 'general',
    }),
    defineField({
      name: 'author',
      title: 'Source',
      description: 'Journal, radio ou média source',
      type: 'reference',
      to: [{type: 'blogAuthor'}],
      group: 'general',
    }),
    defineField({
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'blogCategory'}],
        }),
      ],
      group: 'general',
    }),

    // === CONTENU ===
    defineField({
      name: 'excerpt',
      title: 'Extrait / Chapô',
      description: 'Résumé affiché dans les listes et aperçus',
      type: 'localeText',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Contenu principal',
      type: 'localeBlockContent',
      group: 'content',
    }),

    // === MÉDIAS ===
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image principale',
      description: 'Image affichée en tête d\'article et dans les aperçus',
      options: {
        hotspot: true,
      },
      group: 'media',
    }),
    defineField({
      name: 'imageCaption',
      title: 'Légende de l\'image',
      description: 'Texte affiché sous l\'image principale',
      type: 'localeText',
      group: 'media',
    }),
    defineField({
      title: 'Fichier audio',
      name: 'audio',
      description: 'Podcast ou enregistrement audio',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      group: 'media',
    }),
    defineField({
      title: 'Fichier vidéo',
      description: 'Uploader directement un fichier MP4',
      name: 'videoFile',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      group: 'media',
    }),
    defineField({
      title: 'Vidéo YouTube',
      name: 'video',
      description: 'Lien vers une vidéo YouTube',
      type: 'youtube',
      group: 'media',
    }),

    // === LIENS ===
    defineField({
      title: 'Profils mentionnés',
      name: 'featuredProfiles',
      description: 'Auteurs, artistes ou personnes mentionnés dans l\'article',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'profile'}],
        }),
      ],
      group: 'links',
    }),
    defineField({
      name: 'products',
      title: 'Produits associés',
      description: 'Livres ou produits mentionnés dans l\'article',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'product'}],
        }),
      ],
      group: 'links',
    }),
  ],
  preview: {
    select: {
      language: 'language',
      titleBr: 'title.br',
      titleFr: 'title.fr',
      media: 'image',
      date: 'publishedAt',
    },
    prepare(selection) {
      const {language, titleFr, titleBr, media, date} = selection
      const formattedDate =
        typeof date !== 'undefined' ? format(parseISO(date), 'dd/MM/yyyy') : ''
      const langs = language as string[] | undefined
      return {
        title: langs?.[0] === 'br' ? titleBr : titleFr,
        subtitle: formattedDate,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Date de publication, nouveaux',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
