// Document schemas
import category from './document/category'
import product from './document/product'
import vendor from './document/vendor'
import collection from './document/collection'
import page from './document/page'
import blogPost from './document/blog/post'
import blogAuthor from './document/blog/author'
import blogCategory from './document/blog/category'
import profile from './document/profile'
import siteSettings from './document/siteSettings'
import selectedProducts from './document/selectedProducts'

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
  profile,
  category,
  vendor,
  page,
  blogPost,
  blogAuthor,
  blogCategory,
  siteSettings,
  selectedProducts,
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
