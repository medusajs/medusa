# @medusajs/stock-location

Commerce module for stock locations (warehouses, stores) and their addresses. Inventory levels, fulfillment sets, fulfillment providers, and sales channels attach to locations through module links. Registered as `Modules.STOCK_LOCATION` (`"stock_location"`).

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/stock-location`). No module options, no providers.
- In apps, prefer the core-flows workflows: `createStockLocationsWorkflow`, `updateStockLocationsWorkflow`, `deleteStockLocationsWorkflow`, `linkSalesChannelsToStockLocationWorkflow`, `createLocationFulfillmentSetWorkflow`.

```ts
import { Modules } from "@medusajs/framework/utils"
import type { IStockLocationService } from "@medusajs/framework/types"

const stockLocationModuleService: IStockLocationService =
  container.resolve(Modules.STOCK_LOCATION)

const location = await stockLocationModuleService.createStockLocations({
  name: "Main Warehouse",
  address: { address_1: "Main St 1", country_code: "us" },
})
```

### Data models (`src/models`)

- `StockLocation` (`sloc_`): `name`, `metadata`, nullable `address`.
- `StockLocationAddress` (`laddr_`): `address_1`, `address_2`, `company`, `city`, `country_code`, `phone`, `province`, `postal_code`, `metadata`. Deleting an address cascades to its stock location.

### Service methods (`src/services/stock-location-module.ts`)

Generated CRUD for both models, with overrides for `createStockLocations`, `updateStockLocations` (by id or selector), `upsertStockLocations`, `updateStockLocationAddresses`, and `upsertStockLocationAddresses`. Location inputs accept either `address_id` or a nested `address` object.

### Events and links

- Emits internal CRUD events (`stock_location.<model>.created|updated|deleted|restored`) through `MedusaService`.
- Linkable keys: `stock_location_id` and `location_id` both resolve to `StockLocation` (`src/joiner-config.ts`).
- Module links (`packages/modules/link-modules/src/definitions`):
  - `fulfillment-set-location` (`location_fulfillment_set`)
  - `fulfillment-provider-location` (`location_fulfillment_provider`)
  - `sales-channel-location` (`sales_channel_stock_location`)
  - read-only `inventory-level-stock-location`

Docs: https://docs.medusajs.com/resources/commerce-modules/stock-location.md, https://docs.medusajs.com/resources/commerce-modules/stock-location/links-to-other-modules.md

## Architecture

- The joiner config uses the hand-written GraphQL schema in `src/schema/index.ts`; update it together with the models.
- Linkable configuration exports `stockLocation` and `stockLocationAddress` (asserted by the integration test).

## Development

```bash
cd packages/modules/stock-location
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__/stock-location-module-service.spec.ts (needs Postgres, DB_* env vars)
yarn migration:create           # after any change in src/models
```

## Gotchas

- `updateStockLocations(selector, data)` returns `serialized[0]` whenever `data` is a single object, so the selector form returns only the first updated location despite its `StockLocationDTO[]` signature.
- `upsertStockLocations` splits input by presence of `id`: entries with `id` are updated, the rest created.
- The service interface is `IStockLocationService` (not `IStockLocationModuleService`).
