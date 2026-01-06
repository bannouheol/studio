import {defineType, defineField} from 'sanity'
import {IoMdPerson} from 'react-icons/io'

interface LocaleSlug {
  br?: {current?: string}
  fr?: {current?: string}
}

export default defineType({
  name: 'profile',
  title: 'Profil',
  type: 'document',
  icon: IoMdPerson,
  fields: [
    defineField({
      name: 'title',
      title: 'Nom',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'localeSlug',
      validation: (Rule) =>
        Rule.custom((slugs: LocaleSlug | undefined) => {
          if (!slugs) return 'Les deux slugs doivent être indiqués'
          return slugs.br?.current && slugs.fr?.current
            ? true
            : {message: 'Les deux slugs doivent être indiqués'}
        }),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'localeBlockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title.br',
      subtitle: 'title.fr',
      media: 'avatar',
    },
  },
})
