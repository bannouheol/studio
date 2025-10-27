import { SUPPORTED_LANGUAGES } from './languages'
import { format, parseISO } from 'date-fns'
import slugify from 'slugify'
/* 
function slugify(text) {
  const a = "àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·_,:;";
  const b = "aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh-----";
  const p = new RegExp(a.split("").join("|"), "g");

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special chars
    .replace(/&/g, "-ha-") // Replace & with 'and'
    .replace(/[^\w\-\/]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
} */

function blogPostFormat(text) {
  const regex = /([0-9]{4})\/([0-9]{2})\/(.+)/gm
  const match = regex.exec(text)
  return match
}

function customSlugify(text) {
  return slugify(text, { strict: true, lower: true })
}

function toSlug(text) {
  const post = blogPostFormat(text)
  if (post) {
    post.shift() // remove the 1st element : 2023/10/ijdeijdeockekceolk to let the match array ["2023", "10", "ijdeijdeockekceolk"]
    const postSlug = customSlugify(post.pop()) // slugify only the last element, the post slug without 2023/10
    return [...post, postSlug].join('/') // join everything together
  } else {
    return customSlugify(text) // if it's not a blog post, just slugify the whole text
  }
}

export default {
  type: 'object',
  name: 'localeSlug',
  fields: SUPPORTED_LANGUAGES.map((lang) => ({
    name: lang.id,
    type: 'slug',
    title: lang.title,
    options: {
      source: (document) => {
        const date = document.publishedAt ? format(parseISO(document.publishedAt), 'yyyy/MM/') : ''
        const title = document.title && document.title[lang.id]
        return date + title
      },
      maxLength: 96,
      auto: true,
      slugify: (input) => toSlug(input, { lower: true }),
    },
    validation: (Rule) => Rule.required(),
  })),
}
