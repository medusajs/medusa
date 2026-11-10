# @medusajs/fulfillment

Fulfillment Module (`Modules.FULFILLMENT`): stores where/how you ship (fulfillment sets, service zones, geo zones, shipping options and profiles) and records fulfillments, delegating the carrier work to fulfillment providers.

## Using this package

- Consumers import it as `@medusajs/medusa/fulfillment`; it is registered by default with the manual provider (`@medusajs/medusa/fulfillment-manual`, id `manual`).
- Resolve: `container.resolve(Modules.FULFILLMENT)` (type `IFulfillmentModuleService` from `@medusajs/framework/types`). Prefer `@medusajs/core-flows` workflows for mutations so links (orders, stock locations, prices) stay in sync.

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
            options: {},
          },
        ],
      },
    },
  ],
})
```

- Options (`FulfillmentModuleOptions` in `src/types/index.ts`): `providers[]` of `{ resolve, id, options? }`. Nothing else.
- Provider ID stored in DB and used as `provider_id` is `` `${ProviderClass.identifier}_${id}` `` (e.g. `manual_manual`). A provider class without a static `identifier` throws on registration.

**Data models** (`src/models`): `FulfillmentSet` -> `ServiceZone` -> `GeoZone` (`type`: country / province / city / zip); `ServiceZone` -> `ShippingOption` (`price_type`: flat / calculated, `rules` -> `ShippingOptionRule`, `type` -> `ShippingOptionType`, `shipping_profile` -> `ShippingProfile`, `provider` -> `FulfillmentProvider`); `Fulfillment` with `FulfillmentItem`, `FulfillmentLabel`, `FulfillmentAddress`.

**Custom (non-generated) service methods** in `src/services/fulfillment-module-service.ts`:

- `listShippingOptionsForContext(filters, config)`: filters options by `context` / `address` against their rules. `listShippingOptions` reroutes here when `filters.context` or `filters.address` is set.
- `validateShippingOption(id, context)`, `validateShippingOptionsForPriceCalculation(options)`, `calculateShippingOptionsPrices(data)`.
- `createFulfillment(data)`, `createReturnFulfillment(data)`, `updateFulfillment`, `cancelFulfillment(id)`, `deleteFulfillment(id)`.
- Provider passthroughs: `retrieveFulfillmentOptions(providerId)`, `validateFulfillmentData(...)`, `validateFulfillmentOption(...)`.
- Everything else (`create/update/upsert/list/delete/softDelete/restore` for each model) comes from `MedusaService`.

**Events** (`src/utils/events.ts`, names from `FulfillmentEvents`, format `fulfillment.<kebab-entity>.<action>`): created/updated/deleted for `fulfillment-set`, `service-zone`, `geo-zone`, `shipping-option-type`, `shipping-option-rule`; created/updated for `shipping-option`, `fulfillment`; created for `shipping-profile`, `fulfillment-address`, `fulfillment-item`; created/updated/deleted for `fulfillment-label`.

**Module links** (defined in `packages/modules/link-modules`):

- `location_fulfillment_set` (stock location <-> fulfillment set, cascade-deletes the set), `location_fulfillment_provider`.
- `order_fulfillment`, `return_fulfillment` (order module).
- `product_shipping_profile` (one profile per product).
- `shipping_option_price_set` (pricing; deleting the option cascades to its price set).
- Read-only: cart and order `shipping_option_id` -> `ShippingOption`.

Docs: https://docs.medusajs.com/resources/commerce-modules/fulfillment.md, https://docs.medusajs.com/resources/commerce-modules/fulfillment/module-options.md, https://docs.medusajs.com/resources/commerce-modules/fulfillment/fulfillment-provider.md, https://docs.medusajs.com/resources/commerce-modules/fulfillment/links-to-other-modules.md

## Architecture

- `src/loaders/providers.ts`: registers each provider in the module container as `fp_<identifier>_<id>`, then syncs the `fulfillment_provider` table: new IDs are inserted, configured ones set `is_enabled: true`, rows no longer configured set `is_enabled: false` (never deleted). Sync errors are only logged.
- `src/services/fulfillment-provider.ts` (`FulfillmentProviderService`) resolves `fp_<provider_id>` and forwards to the provider (`createFulfillment`, `createReturn`, `cancelFulfillment`, `calculatePrice`, `canCalculate`, ...).
- `src/joiner-config.ts` + `src/schema`: linkable keys `fulfillment_id`, `fulfillment_set_id`, `shipping_option_id`, `shipping_option_rule_id`, `fulfillment_provider_id`.
- `src/utils/utils.ts`: `isContextValid` rule evaluation used for shipping option rules.

## Development

```bash
cd packages/modules/fulfillment
yarn build
yarn test                       # unit tests under src (e.g. src/utils/__tests__)
yarn test:integration           # needs Postgres (DB_HOST, DB_USERNAME, DB_PASSWORD)
../../../node_modules/.bin/jest integration-tests/__tests__/fulfillment-module-service/shipping-option.spec.ts
yarn migration:create           # after any change in src/models
```

- Integration tests: `integration-tests/__tests__/fulfillment-module-service/*.spec.ts`, using `moduleIntegrationTestRunner` with a fixture provider from `integration-tests/__fixtures__/providers/default-provider` (provider id `fixtures-fulfillment-provider_test-provider`).

## Gotchas

- `createFulfillment` / `createReturnFulfillment` persist the fulfillment first, then call the provider; if the provider throws, the row is deleted and the error rethrown. Provider `data` and `labels` are written back after.
- `cancelFulfillment` throws if `shipped_at` or `delivered_at` is set; it is idempotent when `canceled_at` is already set. `deleteFulfillment` throws unless the fulfillment was canceled first.
- Deleting / soft-deleting a shipping profile throws while it still has shipping options.
- Nested updates replace: `updateFulfillmentSets` with `service_zones`, `updateServiceZones` with `geo_zones`, and `updateShippingOptions` with `rules` delete the existing children that are missing from the payload.
- `validateShippingOptionsForPriceCalculation` throws if any option is not `price_type: "calculated"`.
