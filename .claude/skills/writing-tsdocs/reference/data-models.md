# TSDoc: Data Models

Data model files live under `packages/modules/*/src/models/`. They define DML (Data Model Language) entities using `model.define(...)`.

## Rules

- Document the model-level `const` with a 1-sentence description of the entity
- Document each property with a brief description
- Use `@since <version>` (from the prompt) on properties or models that are **new in the commit diff**
- Use `@example` for non-obvious string formats (e.g. locale codes, currency codes)
- Do NOT document `id` if it is the primary key — this is implied by convention
- Relationship properties (`.belongsTo`, `.hasMany`, `.manyToMany`) use: "The associated [related model]."

## Model-Level Description

```typescript
// ✅ correct
/**
 * A locale supported by a store.
 */
const StoreLocale = model.define("StoreLocale", {
```

```typescript
// ✅ also fine — brief phrase
/**
 * A product variant's image.
 */
const ProductVariantProductImage = model.define("ProductVariantProductImage", {
```

## Property Descriptions

```typescript
const ProductVariant = model.define("ProductVariant", {
  // id: omit — it's the primary key

  /**
   * The variant's stock keeping unit.
   */
  sku: model.text().nullable(),

  /**
   * The variant's display name.
   */
  title: model.text(),

  /**
   * The variant's position in the product's variants list.
   */
  variant_rank: model.number().default(0),

  /**
   * Whether inventory is tracked for this variant.
   */
  manage_inventory: model.boolean().default(true),

  /**
   * The associated product.
   */
  product: model.belongsTo(() => Product, {
    mappedBy: "variants",
  }),
})
```

## @since Tag — New Properties

Add `@since <version>` only on properties that are **new in this commit's diff** (appear in added lines only):

```typescript
const ProductVariant = model.define("ProductVariant", {
  // ... existing properties (no @since)

  /**
   * The variant's thumbnail image URL.
   * @since 2.14.0
   */
  thumbnail: model.text().nullable(),

  /**
   * The variant's images.
   * @since 2.14.0
   */
  images: model.manyToMany(() => ProductImage, {
    mappedBy: "variants",
    pivotEntity: () => ProductVariantProductImage,
  }),
})
```

When the entire model is new in the diff, add `@since` at the model level:

```typescript
/**
 * A locale supported by a store.
 * @since 2.14.0
 */
const StoreLocale = model.define("StoreLocale", {
  /**
   * The BCP 47 language tag code of the locale.
   * @example "en-US"
   */
  locale_code: model.text().searchable(),

  /**
   * The associated store.
   */
  store: model.belongsTo(() => Store, { mappedBy: "supported_locales" }).nullable(),
})
```

## @example for Non-Obvious Values

Use `@example` when the expected value format isn't obvious from the field name:

```typescript
/**
 * The BCP 47 language tag code of the locale.
 * @example "en-US"
 */
locale_code: model.text(),

/**
 * The ISO 4217 currency code.
 * @example "usd"
 */
currency_code: model.text(),

/**
 * The IANA timezone identifier.
 * @example "America/New_York"
 */
timezone: model.text().nullable(),
```

## Relationship Properties

```typescript
/**
 * The associated store.
 */
store: model.belongsTo(() => Store, { mappedBy: "supported_locales" }),

/**
 * The product's variants.
 */
variants: model.hasMany(() => ProductVariant, { mappedBy: "product" }),

/**
 * The variant's images.
 */
images: model.manyToMany(() => ProductImage, { mappedBy: "variants" }),
```

## What NOT to Document

```typescript
// ❌ Don't document id (primary key — always implied)
id: model.id({ prefix: "pv" }).primaryKey(),

// ❌ Don't add @since to properties that existed before this commit
sku: model.text(),
```
