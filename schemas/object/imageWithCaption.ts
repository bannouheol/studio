import {defineType, defineField} from 'sanity'

export default defineType({
  title: 'Image with caption',
  name: 'imageWithCaption',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'caption',
      type: 'localeString',
      title: 'Caption',
      options: {
        isHighlighted: true,
      },
    }),
    defineField({
      name: 'attribution',
      type: 'localeString',
      title: 'Attribution',
    }),
  ],
})
