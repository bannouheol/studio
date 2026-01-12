import { at, defineMigration, patch, replace, setIfMissing, set } from 'sanity/migrate'

export const categoryToDeleteIds = [
  '36c30db8-6d00-4463-a52c-880f5ff305ab', //Oanig
  '64beba13-7219-480f-af74-dbd688874b68', //Globi ha Benoni
  '6d92ae9b-e23a-442f-ba5e-88f48d6c8aa6', //Arzhig Du
  '0c67525a-f1d6-4a96-8df9-f5d85a1d90fc', //Jakez Vras
  '1e47dc73-3c4c-4ffb-acd0-23fc21d7bc69', //Ar Schtroumpfed
  '4f1d7980-1d36-4c50-8526-642669845266', //Boulig & Billig
  '51d7c663-72b9-456d-8ae5-16d1f6d5bb6c', //Bleiz Droch
  '52c13573-4b8a-4e19-8d89-da0184521ca0', //Diaoulez Aelez
  '715af3a1-8dbe-4362-bcc5-59d64bd151ae', //Harry Potter
  '767f0210-8833-4627-979c-ba5f5053e19d', //Leo ha Popi
  '84118a3c-71ca-40ba-9b0e-19a28922cdfa', //Tintin
  '85f7794a-4ea8-48b7-901d-e192520eaa85', //Thorgal
  'da971190-000a-4f3b-9d06-3359977c554e', //Titeuf
  'e01e0d1d-eaf2-4deb-bc63-bcb400cc8ed7', //Tom-Tom ha Nana
  'e044794b-046b-4249-8a92-5c11fdcba165', //Bob & Marley
  'e7d77049-0605-4e1b-83c9-16b2b716ce00', //T'choupi
  'ffae789f-d0d2-4f3b-a531-5dade12370b7', //Spot
]

export default defineMigration({
  title: 'Remove bad usages of categories',
  documentTypes: ['product'],
  filter: `defined(categories)`,
  migrate: {
    document(product) {
      const categories = (product.categories as Array<{ _ref: string }>) || []
      const validDeleteIds = categoryToDeleteIds.filter((id) => id)
      const newCategories = categories.filter((c) => c._ref && !validDeleteIds.includes(c._ref))

      if (newCategories.length !== categories.length) {
        return patch(product._id, at(['categories'], set(newCategories)))
      }
    },
  },
})
