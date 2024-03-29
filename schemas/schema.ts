// We import object and document schemas
import category from './document/category'
import product from './document/product'
import vendor from './document/vendor'
import collection from './document/collection'
import page from './document/page'
import blogPost from './document/blog/post'
import blogAuthor from './document/blog/author'
import blogCategory from './document/blog/category'
import profile from './document/profile'

import blockContent from './object/blockContent'
import productVariant from './object/productVariant'
import dvdFeature from './object/dvdFeature'
import bookFeature from './object/bookFeature'
import youtube from './object/youtube'
import price from './object/price'
import barcode from './object/barcode'
import imageWithCaption from './object/imageWithCaption'

import localeString from './locale/String'
import localeSlug from './locale/Slug'
import localeText from './locale/Text'
import localeBlockContent from './locale/BlockContent'

import siteSettings from './document/siteSettings'
import selectedProducts from './document/selectedProducts'

// Then we give our schema to the builder and provide the result to Sanity
export const schemaTypes = [
  // The following are document types which will appear
  // in the studio.
  product,
  collection,
  profile,
  category,
  vendor,
  dvdFeature,
  bookFeature,
  page,
  blogPost,
  blogAuthor,
  blogCategory,
  // When added to this list, object types can be used as
  // { type: 'typename' } in other document schemas
  blockContent,
  localeString,
  localeSlug,
  localeText,
  localeBlockContent,
  youtube,
  productVariant,
  price,
  imageWithCaption,
  siteSettings,
  selectedProducts,
  barcode,
]
