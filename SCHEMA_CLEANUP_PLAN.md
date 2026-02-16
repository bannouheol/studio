# Plan de nettoyage des schémas

## Vue d'ensemble des chemins de données

| Donnée | Chemin actuel | Chemin cible |
|--------|---------------|--------------|
| Prix | `defaultProductVariant.price.value` | `price` |
| Images | `defaultProductVariant.images[]` | `images[]` |
| En stock | `defaultProductVariant.inStock` | `inStock` |
| Réappro | `defaultProductVariant.resupplyingDate` | `resupplyingDate` |
| À paraître | `defaultProductVariant.isForthcoming` | `isForthcoming` |
| Prévente | `defaultProductVariant.allowPreorder` | `allowPreorder` |
| Poids | `defaultProductVariant.weight` | `weight` |
| Dimensions | `defaultProductVariant.dimensions` | `dimensions` |
| Code-barres | `defaultProductVariant.barcode` | `barcode` |
| Traducteurs | `traductors[]` (tab dédié) | `traductors[]` (tab Général) |
| SEO | `seoTitle` (tab SEO) | `seoTitle` (tab Général) |

---

## Ordre d'exécution

| # | Action | Risque | Réversible |
|---|--------|--------|------------|
| 1 | Backup staging | Aucun | — |
| 2 | Migration `flatten-variants.ts` | Moyen | Oui (restore backup) |
| 3 | Vérification GROQ | Aucun | — |
| 4 | Réécrire `product.ts` | Faible | Oui (git revert) |
| 5 | Mettre à jour `schema.ts` | Faible | Oui (git revert) |
| 6 | Supprimer `price.ts` et `productVariant.ts` | Faible | Oui (git revert) |
| 7 | `pnpm run build` pour valider | Aucun | — |
| 8 | Mettre à jour les requêtes GROQ du frontend | Moyen | Oui |

---

## Étape 1 — Backup

```bash
pnpm run backup:staging
```

---

## Étape 2 — Migration des données : aplatir les variantes

Avant de toucher aux schémas, migrer les données pour que les documents aient déjà la nouvelle structure.

**Fichier** : `migrations/flatten-variants.ts`

```ts
// À exécuter via : npx sanity@latest exec migrations/flatten-variants.ts --with-user-token

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

async function migrate() {
  const products = await client.fetch(`
    *[_type == "product" && defined(defaultProductVariant)] {
      _id,
      _rev,
      defaultProductVariant,
      variants
    }
  `)

  console.log(`Found ${products.length} products to migrate`)

  for (const product of products) {
    const variant = product.defaultProductVariant
    if (!variant) continue

    const transaction = client.transaction()

    transaction.patch(product._id, {
      ifRevisionID: product._rev,
      set: {
        ...(variant.images && { images: variant.images }),
        ...(variant.price?.value != null && { price: variant.price.value }),
        ...(variant.inStock != null && { inStock: variant.inStock }),
        ...(variant.resupplyingDate && { resupplyingDate: variant.resupplyingDate }),
        ...(variant.isForthcoming != null && { isForthcoming: variant.isForthcoming }),
        ...(variant.allowPreorder != null && { allowPreorder: variant.allowPreorder }),
        ...(variant.weight != null && { weight: variant.weight }),
        ...(variant.dimensions && { dimensions: variant.dimensions }),
        ...(variant.barcode && { barcode: variant.barcode }),
      },
      unset: [
        'defaultProductVariant',
        'variants',
      ],
    })

    try {
      await transaction.commit()
      console.log(`✓ Migrated ${product._id}`)
    } catch (err) {
      console.error(`✗ Failed ${product._id}:`, err.message)
    }
  }
}

migrate().catch(console.error)
```

```bash
npx sanity@latest exec migrations/flatten-variants.ts --with-user-token
```

---

## Étape 3 — Vérification GROQ

Requêtes à exécuter dans Sanity Vision après les migrations :

```groq
// Aucun produit ne doit encore avoir defaultProductVariant
*[_type == "product" && defined(defaultProductVariant)] { _id }
// → Attendu : []

// Aucun produit ne doit encore avoir variants
*[_type == "product" && defined(variants)] { _id }
// → Attendu : []

// Tous les produits ont un prix
*[_type == "product" && !defined(price)] { _id, title }
// → Vérifier manuellement

// Structure complète d'un produit
*[_type == "product"][0] {
  _id, title, price, inStock, images,
  weight, dimensions, barcode, traductors,
  bookFeature { authors, illustrators, scriptwriters, numberOfPages },
  dvdFeature { duration, numbersOfDvd, numberOfEpisodes, bonus },
}
```

---

## Étape 4 — Réécrire `schemas/document/product.ts`

### Groupes (avant → après)

| Avant | Après |
|-------|-------|
| general, description, media, variants, bookFeatures, dvdFeatures, traductors, seo | general, description, media, pricing, physical, bookFeatures, dvdFeatures |

`traductors` reste au niveau produit (pas dans `bookFeature`) car les DVD peuvent aussi avoir des traducteurs. Le champ passe du tab dédié au tab Général.

### Changements clés

| # | Changement | Détail |
|---|-----------|--------|
| 1 | `seoTitle` → groupe `general` | Suppression du tab SEO dédié |
| 2 | `traductors` → groupe `general` | Suppression du tab dédié (applicable à tous les types de produits) |
| 3 | `images` remonté | De `defaultProductVariant.images` vers `product.images`, groupe `media` |
| 4 | `price` = number direct | Plus de wrapper objet, juste `number`, groupe `pricing` |
| 5 | Stock remonté | `inStock`, `resupplyingDate`, `isForthcoming`, `allowPreorder` dans groupe `pricing` |
| 6 | Physique remonté | `weight`, `dimensions`, `barcode` dans nouveau groupe `physical` |
| 7 | Suppression | Plus de `defaultProductVariant` ni `variants` |
| 8 | `hidden` utilise `document` | Au lieu de `parent` (champs maintenant au niveau document) |

### Code cible complet

```ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { GiBookCover } from 'react-icons/gi'
import {
  MdInfo, MdDescription, MdInventory, MdPermMedia,
  MdStraighten,
} from 'react-icons/md'
import { BiMoviePlay } from 'react-icons/bi'

export default defineType({
  name: 'product',
  title: 'Produit',
  type: 'document',
  icon: GiBookCover,
  groups: [
    { name: 'general', title: 'Général', icon: MdInfo, default: true },
    { name: 'description', title: 'Description', icon: MdDescription },
    { name: 'media', title: 'Médias', icon: MdPermMedia },
    { name: 'pricing', title: 'Prix & Stock', icon: MdInventory },
    { name: 'physical', title: 'Caractéristiques physiques', icon: MdStraighten },
    { name: 'bookFeatures', title: 'Livre', icon: GiBookCover },
    { name: 'dvdFeatures', title: 'DVD', icon: BiMoviePlay },
  ],
  fields: [
    // === GÉNÉRAL ===
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL du produit (généré automatiquement à partir du titre)',
      type: 'localeSlug',
      group: 'general',
    }),
    defineField({
      name: 'ref',
      title: 'Référence',
      description: 'Code de référence interne du produit',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
      group: 'general',
    }),
    defineField({
      name: 'categories',
      title: 'Catégories',
      description: 'Catégories pour le filtrage sur le site',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publisher',
      title: 'Éditeur',
      description: "Maison d'édition du produit",
      type: 'reference',
      to: [{ type: 'publisher' }],
      group: 'general',
    }),
    defineField({
      title: 'Date de sortie',
      name: 'releaseDate',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      group: 'general',
    }),
    defineField({
      title: 'Âge minimum',
      name: 'minimumAge',
      description: 'Âge minimum recommandé (en années)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(18),
      group: 'general',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      description:
        "Titre optimisé pour les moteurs de recherche (s'affiche dans l'onglet du navigateur)",
      type: 'localeString',
      group: 'general',
    }),
    defineField({
      title: 'Traducteur(s)',
      name: 'traductors',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'profile' }] })],
      group: 'general',
    }),

    // === DESCRIPTION ===
    defineField({
      name: 'body',
      title: 'Description du produit',
      description: 'Texte de présentation affiché sur la page produit',
      type: 'localeBlockContent',
      group: 'description',
    }),

    // === MÉDIAS ===
    defineField({
      name: 'images',
      title: 'Images',
      description: 'La première image sera utilisée comme image principale',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      group: 'media',
    }),
    defineField({
      title: 'Vidéos YouTube',
      name: 'youtubeVideos',
      description: 'Vidéos de présentation ou bandes-annonces',
      type: 'array',
      of: [defineArrayMember({ title: 'Vidéo Youtube', type: 'youtube' })],
      group: 'media',
    }),
    defineField({
      title: 'Fichiers audio',
      name: 'audioFiles',
      description: 'Extraits audio, podcasts ou enregistrements',
      type: 'array',
      of: [defineArrayMember({ type: 'file', options: { accept: 'audio/*' } })],
      group: 'media',
    }),

    // === PRIX & STOCK ===
    defineField({
      title: 'Prix (€)',
      name: 'price',
      type: 'number',
      group: 'pricing',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      title: 'En stock',
      name: 'inStock',
      type: 'boolean',
      group: 'pricing',
      validation: (Rule) => Rule.required(),
      initialValue: true,
    }),
    defineField({
      title: 'Date de réapprovisionnement',
      description: 'Date approximative à laquelle le client pourra être livré',
      name: 'resupplyingDate',
      type: 'date',
      group: 'pricing',
      options: { dateFormat: 'DD/MM/YYYY' },
      hidden: ({ document }) => (document?.inStock as boolean) ?? false,
    }),
    defineField({
      title: 'À paraître',
      name: 'isForthcoming',
      description: "Cocher si le produit n'est pas encore sorti",
      type: 'boolean',
      group: 'pricing',
      validation: (Rule) => Rule.required(),
      initialValue: false,
    }),
    defineField({
      title: 'Autoriser la prévente',
      name: 'allowPreorder',
      description: 'Permettre aux clients de commander avant la sortie',
      type: 'boolean',
      group: 'pricing',
      hidden: ({ document }) => !(document?.isForthcoming as boolean),
    }),

    // === CARACTÉRISTIQUES PHYSIQUES ===
    defineField({
      title: 'Poids (grammes)',
      name: 'weight',
      type: 'number',
      group: 'physical',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      title: 'Dimensions',
      name: 'dimensions',
      description: 'Ex: 21 x 15 cm',
      type: 'string',
      group: 'physical',
    }),
    defineField({
      title: 'Code-barres',
      name: 'barcode',
      type: 'barcode',
      group: 'physical',
    }),

    // === LIVRE ===
    defineField({
      title: 'Caractéristiques du livre',
      name: 'bookFeature',
      description: 'Auteurs, illustrateurs et autres contributeurs',
      type: 'bookFeature',
      group: 'bookFeatures',
    }),

    // === DVD ===
    defineField({
      title: 'Caractéristiques du DVD',
      name: 'dvdFeature',
      description: 'Durée, nombre de DVD, épisodes et bonus',
      type: 'dvdFeature',
      group: 'dvdFeatures',
    }),
  ],

  initialValue: {
    inStock: true,
    isForthcoming: false,
  },

  preview: {
    select: {
      titleBr: 'title.br',
      titleFr: 'title.fr',
      collection: 'collection.title.br',
      media: 'images.0',
      date: 'releaseDate',
    },
    prepare(selection) {
      const { titleBr, titleFr, collection, date, media } = selection
      const formattedDate = date
        ? new Intl.DateTimeFormat('fr-FR').format(new Date(date))
        : ''
      return {
        title: titleBr,
        subtitle: `${titleFr || ''}, ${collection || ''}, ${formattedDate}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Date de sortie, nouveaux',
      name: 'releaseDateDesc',
      by: [{ field: 'releaseDate', direction: 'desc' }],
    },
  ],
})
```

---

## Étape 5 — Mettre à jour `schemas/schema.ts`

```diff
- import productVariant from './object/productVariant'
- import price from './object/price'

  export const schemaTypes = [
    // ...
-   productVariant,
    // ...
-   price,
    // ...
  ]
```

---

## Étape 6 — Supprimer les fichiers obsolètes

- `schemas/object/productVariant.ts`
- `schemas/object/price.ts`

---

## Étape 7 — Valider le build

```bash
pnpm run build
```

---

## Étape 8 — Mettre à jour le frontend

### 8a. Requêtes GROQ (`frontend/lib/queries.ts`)

Remplacement global dans toutes les requêtes :

| Pattern ancien | Pattern nouveau |
|----------------|-----------------|
| `defaultProductVariant.inStock` | `inStock` |
| `defaultProductVariant.isForthcoming` | `isForthcoming` |
| `defaultProductVariant.price.value` | `price` |
| `defaultProductVariant { ..., images[] { asset->{..., metadata} } }` | `images[] { ..., asset->{..., metadata} }` |
| `order(defaultProductVariant.inStock desc, ...)` | `order(inStock desc, ...)` |

Fonctions impactées :

| Fonction | Ligne(s) | Changement |
|----------|----------|------------|
| `getProductsByCategory` | ~290 | `order(inStock desc, ...)`, supprimer projection `defaultProductVariant` |
| `getLatestProducts` | ~430 | idem |
| `getForthcomingProducts` | ~448 | filtre `isForthcoming == true` au lieu de `defaultProductVariant.isForthcoming == true` |
| `getProductsByPublisher` | ~493 | filtre `inStock == true` au lieu de `defaultProductVariant.inStock == true` |
| `getProductsCountByPublisher` | ~527 | idem |
| `getPublishers` | ~566 | idem (sous-requête count) |
| `getProduct` | ~615 | supprimer projection `defaultProductVariant`, ajouter `images[] { ..., asset->{..., metadata, dimensions} }` |
| `getProfileFeaturedProducts` | ~702 | `order(inStock desc, ...)`, supprimer projection |
| `getProducts` | ~840 | idem |
| `getProductsByCollection` | ~937 | idem |
| `getSelection` | ~1036 | supprimer projection `defaultProductVariant` |
| `getProductsBySelection` | ~1117 | idem |
| `getProductsSlugs` | ~1261 | `order(inStock desc, ...)` |

### 8b. Types TypeScript (`frontend/types/index.ts`)

```diff
  type Product = {
    // ...
-   defaultProductVariant: ProductVariant;
+   images: SanityImage[] | null;
+   price: number;
+   inStock: boolean;
+   isForthcoming: boolean;
+   allowPreorder: boolean;
+   resupplyingDate: string;
+   weight: number;
+   dimensions: string;
+   barcode: { barcode: string | null };
  }

- type ProductVariant = {
-   dimensions: string;
-   inStock: boolean;
-   barcode: { barcode: string | null };
-   images: SanityImage[] | null;
-   weight: number;
-   allowPreorder: boolean;
-   isForthcoming: boolean;
-   price: { value: number };
-   resupplyingDate: string;
- }
```

### 8c. Composants frontend

Tous les destructurings `product.defaultProductVariant` → accès direct sur `product`.

| Fichier | Changement |
|---------|------------|
| `components/product-card/product-card.tsx` | `{ inStock, resupplyingDate, isForthcoming, allowPreorder, images, price: variantPrice }` → destructurer depuis `product` directement, `price` est un `number` (plus de `.value`) |
| `components/product-view/body/index.tsx` | idem |
| `components/product-view/gallery/index.tsx` | `product.defaultProductVariant` → `product` |
| `components/product-view/gallery/product-images-carousel.tsx` | `defaultProductVariant: { images }` → `{ images }` |
| `components/product-view/details/index.tsx` | `defaultProductVariant: { weight, dimensions, barcode }` → `{ weight, dimensions, barcode }` |
| `components/json-ld/product.tsx` | `product.defaultProductVariant.price?.value` → `product.price`, `product.defaultProductVariant.images` → `product.images`, etc. |
| `app/[locale]/(shop)/product/[slug]/page.tsx` | `product.defaultProductVariant.images` → `product.images` |

### 8d. Algolia (`frontend/lib/algolia-indexer.ts` + `algolia-transform.ts`)

**algolia-indexer.ts** — requête GROQ :
```diff
- defaultProductVariant {
-   inStock, isForthcoming, price,
-   images[] { _key, asset-> { _id, url } }
- }
+ inStock, isForthcoming, price,
+ images[] { _key, asset-> { _id, url } }
```

**algolia-transform.ts** :
```diff
- const variant = product.defaultProductVariant;
- const image = variant.images?.[0];
- price: variant.price?.value,
- inStock: variant.inStock,
- isForthcoming: variant.isForthcoming,
+ const image = product.images?.[0];
+ price: product.price,
+ inStock: product.inStock,
+ isForthcoming: product.isForthcoming,
```

### 8e. Feeds produit

**`frontend/app/api/feed/google/route.ts`** et **`frontend/app/api/feed/facebook/route.ts`** :
```diff
- defaultProductVariant {
-   price, inStock, barcode, isForthcoming,
-   allowPreorder, resupplyingDate,
-   images[] { asset->{ _id, url } }
- }
+ price, inStock, barcode, isForthcoming,
+ allowPreorder, resupplyingDate,
+ images[] { asset->{ _id, url } }
```

Les accès dans le code de ces routes changent aussi : `product.defaultProductVariant.price.value` → `product.price`, etc.

### 8f. Snipcart (`frontend/lib/get-snipcart-product.ts`)

```diff
- defaultProductVariant: { price, images },
- // ...
- price: price.value,
+ const { price, images } = product;
+ // ...
+ price: price,
```

---

## Récapitulatif des fichiers

### Studio — à supprimer

- `schemas/object/productVariant.ts`
- `schemas/object/price.ts`

### Studio — à modifier

- `schemas/document/product.ts` — restructuration complète
- `schemas/schema.ts` — retirer les imports de `productVariant` et `price`

### Studio — à créer

- `migrations/flatten-variants.ts` — migration des données

### Frontend — à modifier

- `lib/queries.ts` — toutes les requêtes GROQ (13 fonctions)
- `types/index.ts` — supprimer `ProductVariant`, aplatir dans `Product`
- `lib/algolia-indexer.ts` — requête GROQ
- `lib/algolia-transform.ts` — accès aux champs
- `lib/get-snipcart-product.ts` — accès prix et images
- `components/product-card/product-card.tsx` — destructuring
- `components/product-view/body/index.tsx` — destructuring
- `components/product-view/gallery/index.tsx` — destructuring
- `components/product-view/gallery/product-images-carousel.tsx` — destructuring
- `components/product-view/details/index.tsx` — destructuring
- `components/json-ld/product.tsx` — accès aux champs
- `app/[locale]/(shop)/product/[slug]/page.tsx` — accès images
- `app/api/feed/google/route.ts` — requête GROQ + accès champs
- `app/api/feed/facebook/route.ts` — requête GROQ + accès champs
