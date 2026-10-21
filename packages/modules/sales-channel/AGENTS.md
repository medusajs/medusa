# @medusajs/sales-channel

Commerce module for sales channels (web store, POS, marketplace, ...). The module itself only stores channels; product availability, stock locations, and publishable API key scoping come from module links. Registered as `Modules.SALES_CHANNEL` (`"sales_channel"`).

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/sales-channel`). No module options, no providers.
- In apps, prefer the core-flows workflows: `createSalesChannelsWorkflow`, `updateSalesChannelsWorkflow`, `deleteSalesChannelsWorkflow`, `linkProductsToSalesChannelWorkflow`, `linkSalesChannelsToApiKeyWorkflow`.

```ts
import { Modules } from "@medusajs/framework/utils"
import type { ISalesChannelModuleService } from "@medusajs/framework/types"

const salesChannelModuleService: ISalesChannelModuleService =
  container.resolve(Modules.SALES_CHANNEL)

const channel = await salesChannelModuleService.createSalesChannels({
  name: "B2B",
  is_disabled: false,
})
```

### Data model (`src/models/sales-channel.ts`)

- `SalesChannel` (`sc_`): `name`, `description`, `is_disabled` (default `false`), `metadata`.

### Service methods (`src/services/sales-channel-module.ts`)

Generated CRUD for `SalesChannel`, with `createSalesChannels`, `updateSalesChannels` (by id or by selector), and `upsertSalesChannels` overridden.

### Events and links

- Emits internal CRUD events (`sales_channel.sales_channel.created|updated|deleted|restored`) through `MedusaService`. Workflow events (`sales-channel.created`, `sales-channel.updated`, `sales-channel.deleted`) are `SalesChannelWorkflowEvents` in core-flows.
- Module links (`packages/modules/link-modules/src/definitions`):
  - `product-sales-channel` (`product_sales_channel`)
  - `publishable-api-key-sales-channel` (`publishable_api_key_sales_channel`)
  - `sales-channel-location` (`sales_channel_stock_location`, SalesChannel -> StockLocation)
  - read-only `cart-sales-channel` and `order-sales-channel`

Docs: https://docs.medusajs.com/resources/commerce-modules/sales-channel.md, https://docs.medusajs.com/resources/commerce-modules/sales-channel/publishable-api-keys.md, https://docs.medusajs.com/resources/commerce-modules/sales-channel/links-to-other-modules.md

## Architecture

- The joiner config lives in `src/joinfer-config.ts` (misspelled file name, imported by the service) and uses the hand-written GraphQL schema in `src/schema/index.ts`. Adding a field to the model requires updating that schema too.
- The default "Default Sales Channel" is created by `createDefaultsWorkflow` in core-flows, not by this module.

## Development

```bash
cd packages/modules/sales-channel
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__/services/sales-channel-module.spec.ts (needs Postgres, DB_* env vars)
yarn migration:create           # after any change in src/models
```

## Gotchas

- `updateSalesChannels(selector, data)` returns `result[0]` whenever `data` is a single object, so the selector form returns only the first updated channel despite its `SalesChannelDTO[]` signature.
- `upsertSalesChannels` splits input by presence of `id`: entries with `id` are updated, the rest created.
