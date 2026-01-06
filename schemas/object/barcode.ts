import {defineType, defineField} from 'sanity'
import {BarcodeInput} from '../../plugins/barcode-input/BarcodeInput'

export default defineType({
  name: 'barcode',
  type: 'object',
  title: 'Barcode',
  components: {
    input: BarcodeInput,
  },
  fields: [
    defineField({
      name: 'barcode',
      title: 'Barcode',
      type: 'string',
    }),
  ],
})
