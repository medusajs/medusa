# @medusajs/translation

Commerce module for multi-language content: locales, per-entity translations stored as JSON, and per-entity translatable-field settings. Registered as `Modules.TRANSLATION` (`"translation"`).

## Using this package

- Included in `defineConfig` (`@medusajs/medusa/translation`) but disabled unless the `translation` feature flag is on (`MEDUSA_FF_TRANSLATION=true`, default `false`). The read-only links to it are skipped without the flag too.
- No providers. `TranslationModuleOptions` declares an `entities` option, but the module source never reads it.
- Make a field of a custom data model translatable with `.translatable()` in the DML; translatable entities are discovered from `DmlEntity.getTranslatableEntities()`:

```ts
const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text().translatable(),
})
```

- In apps, prefer the core-flows workflows: `createTranslationsWorkflow`, `updateTranslationsWorkflow`, `deleteTranslationsWorkflow`, `batchTranslationsWorkflow`, `batchTranslationSettingsWorkflow`. Their events are `translation.created`, `translation.updated`, `translation.deleted` (`TranslationWorkflowEvents`).

```ts
import { Modules } from "@medusajs/framework/utils"
import type { ITranslationModuleService } from "@medusajs/framework/types"

const translationModuleService: ITranslationModuleService =
  container.resolve(Modules.TRANSLATION)

await translationModuleService.createTranslations({
  reference: "product",
  reference_id: "prod_123",
  locale_code: "fr-FR",
  translations: { title: "Chemise" },
})
```

### Data models (`src/models`)

- `Translation` (`trans_`): `reference` (snake_case entity type, e.g. `product`, `product_variant`), `reference_id`, `locale_code`, `translations` JSON (`{ field: value }`), `translated_field_count`. Unique `(reference_id, locale_code)`.
- `Locale` (`loc_`): `code` (BCP 47, unique), `name`.
- `Settings` (table `translation_settings`, `trset_`): `entity_type` (unique), `fields` JSON array, `is_active`.

### Service methods (`src/services/translation-module.ts`)

Generated CRUD for the three models (settings methods are `*TranslationSettings`), with overrides plus:

- `listTranslations` / `listAndCountTranslations`: support a `q` filter (`translations::text ILIKE`).
- `createTranslations` / `updateTranslations`: normalize `locale_code` and compute `translated_field_count`.
- `createLocales`: normalizes `code`.
- `createTranslationSettings` / `updateTranslationSettings`: validated against translatable entities and fields; updating settings recomputes `translated_field_count` for that entity's translations.
- `getTranslatableFields(entityType?)`, `getInactiveTranslatableFields(entityType?)`, `getStatistics({ locales, entities })`.

### Links

Read-only links: `product-translation` (Product, ProductVariant, ProductCategory, ProductCollection, ProductTag, ProductType, ProductOption, ProductOptionValue -> `Translation.reference_id`, alias `translations`) and `store-locale` (`StoreLocale.locale_code` -> `Locale.code`).

Docs: https://docs.medusajs.com/resources/commerce-modules/translation.md, https://docs.medusajs.com/resources/commerce-modules/translation/concepts.md, https://docs.medusajs.com/resources/commerce-modules/translation/custom-data-models.md, https://docs.medusajs.com/resources/commerce-modules/translation/storefront.md

## Architecture

- `src/loaders/defaults.ts` upserts a built-in list of BCP 47 locales on every load (failures are logged and skipped).
- `__hooks.onApplicationStart` syncs `translation_settings`: creates settings for newly translatable entities and sets `is_active: false` for entities no longer translatable. Existing `fields` are not overwritten.
- `src/services/` has no index file; `src/index.ts` imports `@services/translation-module` directly.

## Development

```bash
cd packages/modules/translation
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__/translation-module-service.spec.ts (needs Postgres, DB_* env vars)
yarn migration:create           # after any change in src/models
```

## Gotchas

- `translated_field_count` only counts fields active in the entity's settings with a non-empty value; inactive settings yield `[]` fields and a count of `0`.
- `reference` is the snake_case entity name (`toSnakeCase` of the DML entity), not the table or module name.
- `getStatistics` throws `INVALID_DATA` without at least one locale and one entity type.
- Settings for an unknown entity, or fields not marked `.translatable()`, throw `INVALID_DATA`.
