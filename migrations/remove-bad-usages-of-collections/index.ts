import { at, defineMigration, setIfMissing, unset } from 'sanity/migrate'

export const collectionIds = [
  'ca137cf5-4998-4336-bdeb-afb10382f52b', // TES
  '69c8dc53-ae69-4987-a1a0-a3abcc32ba4f', // Puzzle
  '8f449c4c-5e49-4527-a135-333d2e61c7c3', // Jeu de 7 familles
  '968ba783-03c0-45c7-a913-e524ea839c56', // Ti Douar Alre
  'd95f0503-d38f-4b70-a072-7028e2ae1425', // Mémory
  'fc2bd27e-a684-4143-aeec-ce1639541f36', // Quiz
  'af13ef6f-98e4-442b-9f5e-fdbc1f0217d8', // Kalana
  'b1472df0-11eb-4987-8f64-32f2dd94a2ff', // Timilenn
  'c6418894-6fe2-4e04-a5f2-522de685fd39', // Portraits
  'e5f0d4f1-fd88-4854-ae09-2890c10d4606', // Nouvelles
  '500ad0a7-998d-4a02-924b-9c3e4597bcd3', // Al Lanv
  '57f4ee6f-251a-4c22-b784-e1e48443d259', // Paker Prod
  '5cf30835-0999-4048-97e3-f0fb174795b3', // Romans,
  'b85259c9-7b76-46a8-91bf-fd7bf6e893af', // Keit vimp bev
  'c6858d2a-df9b-4304-8559-423fccda3ac4', // France 3
  'd73c80a3-0608-40f1-ae06-f35c52ea4186', // Dizale
  '985cf9b4-5d16-46f0-bb60-752eea7b611f', // Le chant du monde
]

export default defineMigration({
  title: 'Remove bad usages of collections',
  documentTypes: ['product'],
  filter: `defined(collection) && collection._ref in ["${collectionIds.join('", "')}"]`,
  //filter: `defined(collection) && collection._ref == "ca137cf5-4998-4336-bdeb-afb10382f52b"`,
  migrate: {
    document(doc, context) {
      // this will be called for every document of the matching type
      // any patch returned will be applied to the document
      // you can also return mutations that touches other documents
      return at('collection', unset())
    },
  },
})
