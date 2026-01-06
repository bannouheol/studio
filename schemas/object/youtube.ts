import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'youtube',
  type: 'object',
  title: 'YouTube Embed',
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'URL de la vidéo YouTube',
    }),
  ],
})
