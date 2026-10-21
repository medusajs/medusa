# @medusajs/product

Product Module (`Modules.PRODUCT`): products, variants, options and option values, images, tags, types, collections and the category tree.

## Using this package

- Registered by default; consumers import it as `@medusajs/medusa/product`. No module options.
- Resolve: `container.resolve(Modules.PRODUCT)` (`IProductModuleService`). Use `@medusajs/core-flows` workflows (`createProductsWorkflow`, `updateProductsWorkflow`, ...) for writes: they also create price sets, inventory items, sales channel and shipping profile links.
- Prices, stock and sales channels are not on the product; they come from linked modules through Query (`variants.calculated_price`, `variants.inventory_items`, `sales_channels`).

```ts
await productModuleService.createProducts({
  title: "Shirt",
  options: [{ title: "Color", values: ["Red", "Blue"] }],
  variants: [{ title: "Red shirt", sku: "SHIRT-RED", options: { Color: "Red" } }],
})
```

**Data models** (`src/models`):

- `Product` (`prod_`, `handle`, `status`, `discountable`, customs fields) -> `ProductVariant` (`variant_`, `sku`/`barcode`/`ean`/`upc`, `manage_inventory`, `allow_backorder`, `variant_rank`), `ProductImage` (`img_`, `rank`), many-to-many `ProductTag`, `ProductCategory`, belongs-to `ProductType`, `ProductCollection`.
- Options (since 2.16.0): `ProductOption` (`opt_`, `is_exclusive`) is linked to products through `ProductProductOption` (`prodopt_`), which selects a subset of the option's `ProductOptionValue`s via `ProductProductOptionValue`. Global options (`is_exclusive: false`) are shared across products; options created inline in `createProducts` default to exclusive.
- Variants link to option values (many-to-many) and to images via `ProductVariantProductImage`.
- `ProductCategory` (`pcat_`): tree with `parent_category`, `mpath`, sibling `rank`, `is_active`, `is_internal`.

**Custom service methods** (`src/services/product-module-service.ts`): `addProductOptionToProduct`, `removeProductOptionFromProduct`, `updateProductOptionValuesOnProduct`, `updateProductOptionValues`, `addImageToVariant`, `removeImageFromVariant`; `create/update/upsert` for products, variants, options, tags, types, collections, categories and `list/retrieve` for products and variants are overridden with extra validation and relation handling.

**Events**: `ProductEvents` from `@medusajs/framework/utils`. Category events (`product.product-category.created/updated/deleted`) are built explicitly in `src/utils/events.ts`; the rest (`product.product.*`, `product.product-variant.*`, ...) are emitted by `MedusaService` from ORM hooks. The Index Module's default schema listens to product and variant events.

**Module links** (in `packages/modules/link-modules`): `product_sales_channel`, `product_shipping_profile` (one profile per product), `product_variant_inventory_item` (with `required_quantity`), `product_variant_price_set` (deleting the variant cascades to the price set). Read-only: cart / order line items -> `product` / `variant`, and product translations.

Docs: https://docs.medusajs.com/resources/commerce-modules/product.md, https://docs.medusajs.com/resources/commerce-modules/product/links-to-other-modules.md, https://docs.medusajs.com/resources/commerce-modules/product/variant-inventory.md, https://docs.medusajs.com/resources/commerce-modules/product/guides/price.md, https://docs.medusajs.com/resources/commerce-modules/product/extend.md

## Architecture

- `src/joiner-config.ts`: primary keys `id` and `handle`; aliases `variant(s)` / `product_variant(s)` -> `ProductVariant`; extra linkable key `variant_id`.
- `src/repositories/product-category.ts` builds the tree from `mpath` (`include_descendants_tree` / `include_ancestors_tree` filters) and reranks siblings on create/update/delete. `src/services/product-category.ts` wraps it.
- `src/utils/published-products-context.ts`: when filters carry the published-products query context, `products` relations are populated with published products only.
- `src/utils/compute-option-link-changes.ts`, `resolve-allowed-option-values.ts`, `build-option-value-filter-query.ts`: option/value linking and filtering by option values.

## Development

```bash
cd packages/modules/product
yarn build
yarn test                      # src/services/__tests__, src/utils/__tests__
yarn test:integration          # needs Postgres
../../../node_modules/.bin/jest integration-tests/__tests__/product-module-service/product-options.spec.ts
yarn migration:create          # after any change in src/models
```

- Integration tests: `integration-tests/__tests__/product-module-service/` (products, variants, options, categories, collections, tags, types, events) plus `integration-tests/__tests__/product.spec.ts` and `product-category.spec.ts`.

## Gotchas

- Missing `handle` is generated from `title` (`toHandle`); a handle with non URL-safe characters throws. Category and collection handles default to `kebabCase(name/title)`.
- Variant `options` is `{ [optionTitle]: value }` and must cover every product option; duplicate option combinations across variants throw.
- An option cannot be changed from global to exclusive. Removing an exclusive option from its last product soft-deletes it. Unassigning options or values used by variants (or that would make variants collide) throws.
- Tags must exist before being associated with a product (`Tag with id ... not found`).
- Deleting a category with children throws `NOT_ALLOWED`.
- `variants.images` is computed after loading (`assignImagesToVariants`): each variant gets the product's general images (not assigned to any variant) plus its own assigned ones; the raw m:n relation only holds explicit assignments.
- `options.values` on a product is filtered to the values that product links through `ProductProductOption`, not every value of a shared option (`filterOptionValues`).
