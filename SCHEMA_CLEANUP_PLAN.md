# Plan de nettoyage des schémas

## 1. Supprimer l'objet `price` (wrapper inutile)

`schemas/object/price.ts` encapsule un seul champ `number`. Cela ajoute un niveau d'imbrication inutile (`defaultProductVariant.price.value` au lieu de `product.price`).

**Action** : Remplacer par un champ `number` directement sur le produit.

---

## 2. Aplatir les variantes

Le pattern `defaultProductVariant` (objet unique) + `variants` (tableau) est surdimensionné pour une maison d'édition. Un livre/DVD n'a qu'un seul prix et un seul stock.

**Action** : Supprimer `productVariant` et remonter les champs directement sur le produit :
- `images` → tab "Médias"
- `price` (number) → tab "Prix & Stock"
- `inStock`, `resupplyingDate`, `isForthcoming`, `allowPreorder` → tab "Prix & Stock"

---

## 3. Remonter les caractéristiques physiques au niveau produit

`weight`, `dimensions` et `barcode` sont des propriétés du produit physique, pas d'une variante de prix. Un livre ne change pas de poids selon la variante.

**Action** : Déplacer vers un tab "Caractéristiques physiques" sur le produit.

---

## 4. Fusionner `traductors` dans `bookFeature`

Les traducteurs sont des contributeurs du livre, comme les auteurs et illustrateurs. Un tab dédié pour un seul champ est inutile.

**Action** : Ajouter `traductors` dans `bookFeature` et renommer le tab en "Livre" ou "Contributeurs".

---

## 5. Ajouter un champ `productType` et conditionner les tabs

Chaque produit affiche actuellement les tabs "Livre" ET "DVD", même si c'est l'un ou l'autre.

**Action** :
- Ajouter un champ `productType` (`'book' | 'dvd'`) dans "Général"
- Utiliser `hidden` pour n'afficher que le tab pertinent

---

## 6. Fusionner le tab SEO

`seoTitle` est seul dans son tab. Soit le fusionner dans "Général", soit ajouter d'autres champs SEO (meta description, OG image...).

**Action** : Fusionner `seoTitle` dans "Général" (sauf si d'autres champs SEO sont prévus).

---

## Structure cible du produit

```
product
├── Général : title, slug, ref, productType, collection, categories, publisher, releaseDate, minimumAge, seoTitle
├── Description : body
├── Médias : images[], youtubeVideos[], audioFiles[]
├── Prix & Stock : price (number), inStock, resupplyingDate, isForthcoming, allowPreorder
├── Caractéristiques physiques : weight, dimensions, barcode
├── Livre (masqué si DVD) : authors[], illustrators[], scriptwriters[], traductors[], numberOfPages
├── DVD (masqué si livre) : duration, numbersOfDvd, numberOfEpisodes, bonus
```

## Fichiers à supprimer

- `schemas/object/productVariant.ts`
- `schemas/object/price.ts`

## Fichiers à modifier

- `schemas/document/product.ts` — restructuration complète
- `schemas/object/bookFeature.ts` — ajout de `traductors`
- `schemas/schema.ts` — retirer les imports de `productVariant` et `price`

## Impact sur le frontend / les requêtes GROQ

Les requêtes actuelles du type `product.defaultProductVariant.price.value` devront être mises à jour en `product.price`. Prévoir une migration des données existantes via un script ou une migration GROQ.
