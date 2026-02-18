import { at, defineMigration, patch, set, unset } from 'sanity/migrate'

type ProductDocument = {
  _id: string
  dimensions?: string
}

/**
 * Parses a dimensions string like "21 x 15 cm" (Width x Length) into numeric values.
 * Supports decimal separators as either dot or comma.
 */
function parseDimensions(dimensions: string): { width: number | null; length: number | null } {
  const normalized = dimensions.replace(',', '.').trim()
  const match = normalized.match(/^(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)/)
  if (!match) return { width: null, length: null }
  return {
    width: parseFloat(match[1]),
    length: parseFloat(match[2]),
  }
}

export default defineMigration({
  title: 'Split dimensions string into width and length number fields',
  documentTypes: ['product'],
  filter: 'defined(dimensions)',

  migrate: {
    document(doc) {
      const product = doc as unknown as ProductDocument
      if (!product.dimensions) return

      const { width, length } = parseDimensions(product.dimensions)
      const ops: ReturnType<typeof at>[] = []

      if (width !== null) {
        ops.push(at('width', set(width)))
      }
      if (length !== null) {
        ops.push(at('length', set(length)))
      }

      // Always remove the old dimensions field
      ops.push(at('dimensions', unset()))

      return patch(doc._id, ops)
    },
  },
})
