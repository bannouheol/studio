import {defineType, defineField} from 'sanity'

export default defineType({
  title: 'Caractéristiques du DVD',
  name: 'dvdFeature',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'duration',
      type: 'number',
      title: 'Durée totale',
      description: 'Durée en minutes',
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: 'numbersOfDvd',
      type: 'number',
      title: 'Nombre de DVD',
      description: 'Nombre de disques dans le coffret',
      validation: (Rule) => Rule.positive().integer(),
      initialValue: 1,
    }),
    defineField({
      name: 'numberOfEpisodes',
      type: 'number',
      title: `Nombre d'épisodes`,
      description: 'Pour les séries',
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: 'bonus',
      type: 'boolean',
      title: 'Bonus inclus',
      description: 'Making-of, interviews, etc.',
    }),
  ],
  preview: {
    select: {
      duration: 'duration',
      dvds: 'numbersOfDvd',
      bonus: 'bonus',
    },
    prepare({duration, dvds, bonus}) {
      const parts = []
      if (duration) parts.push(`${duration} min`)
      if (dvds) parts.push(`${dvds} DVD`)
      if (bonus) parts.push('+ Bonus')
      return {
        title: parts.join(' · ') || 'DVD',
      }
    },
  },
})
