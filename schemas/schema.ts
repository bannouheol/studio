// Document schemas
import category from './document/category'
import product from './document/product'
import publisher from './document/publisher'
import collection from './document/collection'
import selection from './document/selection'
import page from './document/page'
import blogPost from './document/blog/post'
import blogAuthor from './document/blog/author'
import blogCategory from './document/blog/category'
import profile from './document/profile'
import siteSettings from './document/siteSettings'
import selectedProducts from './document/selectedProducts'
import announcement from './document/announcement'

// Object schemas
import blockContent from './object/blockContent'
import productVariant from './object/productVariant'
import dvdFeature from './object/dvdFeature'
import bookFeature from './object/bookFeature'
import youtube from './object/youtube'
import price from './object/price'
import barcode from './object/barcode'
import imageWithCaption from './object/imageWithCaption'

// Locale schemas
import localeString from './locale/String'
import localeSlug from './locale/Slug'
import localeText from './locale/Text'
import localeBlockContent from './locale/BlockContent'

export const schemaTypes = [
  // Document types
  product,
  collection,
  selection,
  profile,
  category,
  publisher,
  page,
  blogPost,
  blogAuthor,
  blogCategory,
  siteSettings,
  selectedProducts,
  announcement,
  // Object types
  blockContent,
  productVariant,
  dvdFeature,
  bookFeature,
  youtube,
  price,
  barcode,
  imageWithCaption,
  // Locale types
  localeString,
  localeSlug,
  localeText,
  localeBlockContent,
]
