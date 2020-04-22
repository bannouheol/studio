import { GiNewspaper } from "react-icons/gi";

export default {
  name: "blogAuthor",
  title: "Journal, radio, ...",
  type: "document",
  icon: GiNewspaper,
  fields: [
    {
      name: "title",
      title: "Nom",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "website",
      title: "Site internet",
      type: "url",
    },
    {
      name: "logo",
      title: "logo",
      type: "image",
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "logo",
    },
  },
};
