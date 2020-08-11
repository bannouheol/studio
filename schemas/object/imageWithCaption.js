export default {
  title: 'Image with caption',
  name: 'imageWithCaption',
  type: 'image',
  options: {
    hotspot: true, // <-- Defaults to false
  },
  fields: [
    {
      name: 'caption',
      type: 'localeString',
      title: 'Caption',
      options: {
        isHighlighted: true, // <-- make this field easily accessible
      },
      //validation: (Rule) => Rule.required(),
    },
    {
      // Editing this field will be hidden behind an "Edit"-button
      name: 'attribution',
      type: 'localeString',
      title: 'Attribution',
    },
  ],
}
