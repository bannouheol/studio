# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sanity Studio for Bannoù-heol, a Breton publishing house. This is a TypeScript-based Sanity v5 content management studio for managing products (books, DVDs), blog posts, profiles, and related content.

## Commands

```bash
pnpm run start     # Start development server
pnpm run build     # Build for production
pnpm run test      # Run sanity check (schema validation)

# Database backups
pnpm run backup:production   # Export production dataset
pnpm run backup:staging      # Export staging dataset
```

## Architecture

### Schema Structure

All schemas use TypeScript with Sanity's `defineType`, `defineField`, `defineArrayMember` helpers.

```
schemas/
├── document/           # Document types (appear in studio sidebar)
│   ├── product.ts      # Main product (books, DVDs) with groups/tabs
│   ├── collection.ts   # Product collections
│   ├── category.ts     # Product categories
│   ├── publisher.ts    # Publishers (renamed from vendor)
│   ├── profile.ts      # Authors, illustrators, translators
│   ├── page.ts         # Static pages
│   └── blog/           # Blog-related documents
│       ├── post.ts
│       ├── author.ts   # Media sources (journals, radios)
│       └── category.ts
├── object/             # Reusable object types
│   ├── productVariant.ts  # Price, stock, images per variant
│   ├── bookFeature.ts     # Authors, illustrators, pages
│   ├── dvdFeature.ts      # Duration, episodes, bonus
│   ├── barcode.ts         # Custom barcode with visual preview
│   └── ...
├── locale/             # i18n types (Breton 'br' + French 'fr')
│   ├── languages.ts    # SUPPORTED_LANGUAGES definition
│   ├── String.ts       # localeString
│   ├── Slug.ts         # localeSlug with auto-generation
│   ├── Text.ts         # localeText
│   └── BlockContent.ts # localeBlockContent
└── schema.ts           # Schema aggregation and export
```

### Custom Components

```
components/
├── AutoSlugInput.tsx       # Auto-generates localeSlug from title on keypress
├── SimpleAutoSlugInput.tsx # Auto-generates simple slug from title
plugins/
└── barcode-input/
    ├── BarcodeInput.tsx    # Visual barcode preview component
    └── BarcodeInput.module.css
```

### Key Patterns

**Locale Fields**: All user-facing text uses locale types (`localeString`, `localeSlug`, `localeText`, `localeBlockContent`) with `br` (Breton) and `fr` (French) variants.

**Document Groups/Tabs**: Complex documents (product, blogPost) use `groups` to organize fields into tabs for better UX.

**Auto-Slug Generation**: Slugs auto-generate from titles as users type. The `createAutoSlugInput(lang)` factory creates language-specific slug inputs.

**Fieldsets in Objects**: Object types like `productVariant` use collapsible fieldsets to organize fields (media, pricing, physical).

### Configuration

- `sanity.config.ts` - Main studio configuration with structure tool customization
- `sanity.cli.ts` - CLI configuration (projectId, dataset)
- Dataset: `staging` (configurable)
- Project ID: `hk48qn3z`
