import {defineType, defineField, defineArrayMember} from 'sanity'
import {IoIosSettings} from 'react-icons/io'

export default defineType({
  name: 'siteSettings',
  type: 'document',
  title: 'Paramètres',
  icon: IoIosSettings,
  fields: [
    defineField({
      name: 'title',
      type: 'localeString',
      title: 'Title',
    }),
    defineField({
      name: 'url',
      type: 'string',
      title: 'URL',
    }),
    defineField({
      name: 'mail',
      type: 'string',
      title: 'Mail',
    }),
    defineField({
      name: 'description',
      type: 'localeString',
      title: 'Description',
      description: 'Describe your website for search engines and social media.',
    }),
    defineField({
      name: 'keywords',
      type: 'array',
      title: 'Keywords',
      description: 'Add keywords that describes your portfolio.',
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'instagram',
      type: 'string',
      title: 'Instagram',
      description: 'username',
    }),
    defineField({
      name: 'facebook',
      type: 'string',
      title: 'Facebook',
      description: 'username',
    }),
    defineField({
      name: 'youtube',
      type: 'string',
      title: 'YouTube',
      description: 'username',
    }),
    defineField({
      name: 'twitter',
      type: 'string',
      title: 'Twitter',
      description: 'username',
    }),
    defineField({
      name: 'spotify',
      type: 'string',
      title: 'Spotify',
      description: 'username',
    }),
  ],
})
