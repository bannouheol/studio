import { at, defineMigration, patch, set, unset } from 'sanity/migrate'

type Price = { value?: number }

type ProductVariant = {
  images?: unknown[]
  price?: Price
  inStock?: boolean
  resupplyingDate?: string
  isForthcoming?: boolean
  allowPreorder?: boolean
  weight?: number
  dimensions?: string
  barcode?: unknown
  title?: string
}

type ProductDocument = {
  _id: string
  defaultProductVariant?: ProductVariant
  variants?: ProductVariant[]
}

export default defineMigration({
  title: 'Flatten variants into product-level fields',
  documentTypes: ['product'],
  filter: 'defined(defaultProductVariant)',

  migrate: {
    document(doc) {
      const product = doc as unknown as ProductDocument
      const variant = product.defaultProductVariant
      if (!variant) return

      const ops: ReturnType<typeof at>[] = []

      // Copy fields from defaultProductVariant to product root
      if (variant.images) {
        ops.push(at('images', set(variant.images)))
      }
      if (variant.price?.value != null) {
        ops.push(at('price', set(variant.price.value)))
      }
      if (variant.inStock != null) {
        ops.push(at('inStock', set(variant.inStock)))
      }
      if (variant.resupplyingDate) {
        ops.push(at('resupplyingDate', set(variant.resupplyingDate)))
      }
      if (variant.isForthcoming != null) {
        ops.push(at('isForthcoming', set(variant.isForthcoming)))
      }
      if (variant.allowPreorder != null) {
        ops.push(at('allowPreorder', set(variant.allowPreorder)))
      }
      if (variant.weight != null) {
        ops.push(at('weight', set(variant.weight)))
      }
      if (variant.dimensions) {
        ops.push(at('dimensions', set(variant.dimensions)))
      }
      if (variant.barcode) {
        ops.push(at('barcode', set(variant.barcode)))
      }

      // Remove old fields
      ops.push(at('defaultProductVariant', unset()))
      ops.push(at('variants', unset()))

      return patch(doc._id, ops)
    },
  },
})
