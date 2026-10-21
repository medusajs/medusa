# @medusajs/store

Commerce module for the store record: name, supported currencies and locales, and the default sales channel, region, and stock location IDs. Registered as `Modules.STORE` (`"store"`).

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/store`). No module options, no providers.
- The default store is created by `createDefaultsWorkflow` (`createDefaultStoreStep`) in core-flows. In apps, prefer `createStoresWorkflow`, `updateStoresWorkflow`, `deleteStoresWorkflow`.

```ts
import { Modules } from "@medusajs/framework/utils"
import type { IStoreModuleService } from "@medusajs/framework/types"

const storeModuleService: IStoreModuleService = container.resolve(Modules.STORE)

const [store] = await storeModuleService.listStores(
  {},
  { relations: ["supported_currencies", "supported_locales"] }
)
```

### Data models (`src/models`)

- `Store` (`store_`): `name` (default `"Medusa Store"`), `default_sales_channel_id`, `default_region_id`, `default_location_id`, `metadata`, `supported_currencies`, `supported_locales`. Deleting a store cascades to both child models.
- `StoreCurrency` (`stocur_`): `currency_code`, `is_default`.
- `StoreLocale` (`stloc_`): `locale_code` (BCP 47, e.g. `en-US`). Since 2.12.3.

### Service methods (`src/services/store-module-service.ts`)

Generated CRUD for the three models, with `createStores`, `updateStores` (by id or selector), and `upsertStores` overridden to validate and replace nested currencies and locales.

### Events and links

- Emits internal CRUD events (`store.<model>.created|updated|deleted|restored`) through `MedusaService`.
- The `default_*_id` columns are plain text, not module links.
- Read-only links (`packages/modules/link-modules/src/definitions/readonly`):
  - `store-currency`: `StoreCurrency.currency_code` -> Currency `code` (alias `currency`).
  - `store-locale`: `StoreLocale.locale_code` -> Translation `Locale.code` (alias `locale`); only loaded when the `translation` feature flag is on.

Docs: https://docs.medusajs.com/resources/commerce-modules/store.md, https://docs.medusajs.com/resources/commerce-modules/store/locales.md, https://docs.medusajs.com/resources/commerce-modules/store/links-to-other-modules.md

## Development

```bash
cd packages/modules/store
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__/store-module-service.spec.ts (needs Postgres, DB_* env vars)
yarn migration:create           # after any change in src/models
```

## Gotchas

- Create and update go through `upsertWithReplace` on `supported_currencies` and `supported_locales`: passing either array replaces the whole set, so include existing entries you want to keep.
- When `supported_currencies` is passed, exactly one must have `is_default: true`, and codes must be unique; otherwise `INVALID_DATA`. Locale codes must be unique too.
- Currency codes are lowercased and `name` is trimmed before saving.
