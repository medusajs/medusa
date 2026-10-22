# @medusajs/pricing

Pricing Module (`Modules.PRICING`): price sets with rule-based and quantity-based prices, price lists (sales / overrides), tax-inclusive price preferences, and the price calculation used for products and shipping options.

## Using this package

- Registered by default; consumers import it as `@medusajs/medusa/pricing`. No module options.
- Resolve: `container.resolve(Modules.PRICING)` (`IPricingModuleService`). Prefer core-flows workflows (price lists, product variants, shipping options) for writes so links stay in sync.

```ts
const [price] = await pricingModuleService.calculatePrices(
  { id: [priceSetId] },
  { context: { currency_code: "eur", region_id: "reg_123", quantity: 2 } }
)
// price.calculated_amount, price.original_amount, price.is_calculated_price_tax_inclusive
```

- Through Query, request the virtual `calculated_price` relation with a `context` filter; `listPriceSets` strips it from `relations` and fills it via `calculatePrices`.

**Data models** (`src/models`): `PriceSet` (`pset_`) -> `Price` (`price_`: `currency_code`, `amount`, `min_quantity`, `max_quantity`, `rules_count`, optional `price_list`) -> `PriceRule` (`attribute`, `value`, `operator` eq/gt/gte/lt/lte, `priority`). `PriceList` (`plist_`: `status` draft/active, `type` sale/override, `starts_at`, `ends_at`, `rules_count`) -> `PriceListRule` (`attribute`, JSON `value`). `PricePreference` (`attribute` `region_id` or `currency_code`, `value`, `is_tax_inclusive`).

**Custom service methods** (`src/services/pricing-module.ts`): `calculatePrices`, `addPrices`, `removePrices`, `createPriceLists`, `updatePriceLists`, `addPriceListPrices`, `updatePriceListPrices`, `setPriceListRules`, `removePriceListRules`, `create/upsert/updatePricePreferences`; `create/update/upsertPriceSets` and `listPriceSets` / `retrievePriceSet` are overridden. Price rules are passed as an object: `prices: [{ amount, currency_code, rules: { region_id: "reg_123" } }]`.

**Events**: no custom builders; `MedusaService` emits `pricing.<kebab-entity>.<action>` (e.g. `pricing.price-set.created`, `pricing.price.updated`) from ORM hooks. The Index Module listens to the `pricing.price.*` events.

**Module links** (in `packages/modules/link-modules`): `product_variant_price_set` and `shipping_option_price_set`; deleting the variant or shipping option cascades to its price set.

Docs: https://docs.medusajs.com/resources/commerce-modules/pricing.md, https://docs.medusajs.com/resources/commerce-modules/pricing/concepts.md, https://docs.medusajs.com/resources/commerce-modules/pricing/price-rules.md, https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation.md, https://docs.medusajs.com/resources/commerce-modules/pricing/tax-inclusive-pricing.md, https://docs.medusajs.com/resources/commerce-modules/pricing/links-to-other-modules.md

## Architecture

- `src/repositories/pricing.ts` (`PricingRepository.calculatePrices`): one SQL query. Removes `currency_code` and `quantity` from the context, matches a price when all its rules (`rules_count`) match the context, and joins only active price lists within `starts_at` / `ends_at` whose list rules all match. Ordering: price-list prices first, then more rules first, then lowest amount.
- `calculatePrices` in the service picks per price set: `override` list price always wins; `sale` list price is used only if lower than the default price. `original_amount` is the override price if any, else the default price. Tax-inclusiveness comes from price rules / `PricePreference` for `region_id` or `currency_code`.
- `src/utils/validate-price-list-dates.ts` validates `starts_at` / `ends_at` input.

## Development

```bash
cd packages/modules/pricing
yarn build
yarn test                      # src/services/__tests__
yarn test:integration          # needs Postgres
../../../node_modules/.bin/jest integration-tests/__tests__/services/pricing-module/calculate-price.spec.ts
yarn migration:create          # after any change in src/models
```

- Integration tests: `integration-tests/__tests__/services/pricing-module/` (`calculate-price`, `price-list`, `price-list-rule`, `price-rule`, `price-set`, `index`).

## Gotchas

- `calculatePrices` throws `INVALID_DATA` without `context.currency_code`.
- A price with rules only matches when every rule matches the context; extra context keys are ignored. With more than 10 context keys, keys not used by any `price_rule` / `price_list_rule` attribute are dropped using an in-process cache that is only cleared by `create/updatePriceRules` and `create/updatePriceListRules` on this instance.
- Price sets without a matching price are omitted from the `calculatePrices` result (not returned as null).
- `updatePriceSets` with `prices` replaces the set's prices: existing prices whose IDs are not in the payload are deleted.
- A price list only applies when `status: "active"`, not soft-deleted, and `now()` (database time) is within `starts_at` / `ends_at`; lists default to `draft`.
