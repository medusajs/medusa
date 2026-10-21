# @medusajs/region

Commerce module for regions: a region groups countries under one currency and drives tax and payment provider selection for carts and orders. Registered as `Modules.REGION` (`"region"`).

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/region`). No module options, no providers.
- Use the workflows in `@medusajs/core-flows` (`createRegionsWorkflow`, `updateRegionsWorkflow`, `deleteRegionsWorkflow`) in apps; they also manage the region's payment providers link.

```ts
import { Modules } from "@medusajs/framework/utils"
import type { IRegionModuleService } from "@medusajs/framework/types"

const regionModuleService: IRegionModuleService =
  container.resolve(Modules.REGION)

const [region] = await regionModuleService.createRegions([
  { name: "Europe", currency_code: "eur", countries: ["de", "fr"] },
])
```

### Data models (`src/models`)

- `Region` (`reg_`): `name` (searchable, translatable), `currency_code`, `automatic_taxes` (default `true`), `countries`, `metadata`.
- `Country` (table `region_country`): primary key is `iso_2` (lowercase), plus `iso_3`, `num_code`, `name` (uppercase), `display_name`, nullable `region`. Unique on `(region_id, iso_2)`.

### Service methods (`src/services/region-module.ts`)

Generated CRUD for `Region` and `Country`, with overrides:

- `createRegions`, `updateRegions`, `upsertRegions`: accept `countries` as an array of ISO-2 codes and assign them to the region.
- `softDeleteRegions`: also sets `region_id` to `null` on the region's countries.

### Events and links

- Emits internal CRUD events (`region.<model>.created|updated|deleted|restored`) through `MedusaService`. Workflow events (`region.created`, `region.updated`, `region.deleted`) are `RegionWorkflowEvents` in core-flows.
- Module links: `region-payment-provider` (`region_payment_provider`, Region -> Payment provider), read-only `cart-region` and `order-region`.

Docs: https://docs.medusajs.com/resources/commerce-modules/region.md, https://docs.medusajs.com/resources/commerce-modules/region/links-to-other-modules.md

## Architecture

- `src/loaders/defaults.ts` upserts every country from `DefaultsUtils.defaultCountries` on each module load. Failures are logged with `logger.warn` and skipped, not thrown.
- Linkable keys are `region` and `country` (asserted by the integration test).

## Development

```bash
cd packages/modules/region
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__/region-module.spec.ts (needs Postgres, DB_* env vars)
yarn migration:create           # after any change in src/models
```

## Gotchas

- Input normalization: `currency_code` and country codes are lowercased, `name` is trimmed.
- Updating `countries` first unassigns all current countries of that region, then reassigns: passing `countries` is a full replace, not an append.
- A country can belong to only one region. Assigning a country already owned by another region, an unknown code, or the same code twice throws `INVALID_DATA`.
- Restoring a soft-deleted region does not restore its countries; the association is lost on delete.
- Countries are seeded rows, not user-created: don't create `Country` records in app code, assign existing ISO-2 codes.
