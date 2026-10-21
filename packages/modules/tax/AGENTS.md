# @medusajs/tax

Commerce module for tax regions, tax rates, and rate rules, and for computing tax lines for cart/order items and shipping methods through a tax provider. Registered as `Modules.TAX` (`"tax"`).

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/tax`) with only the built-in `system` provider (`src/providers/system.ts`, DB id `tp_system`).
- Option: `providers` (`{ resolve, id, options }[]`). Register a custom provider:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/tax",
      options: {
        providers: [
          {
            resolve: "./src/modules/my-tax",
            id: "my-tax",
            options: {},
          },
        ],
      },
    },
  ],
})
```

- A provider implements `ITaxProvider` from `@medusajs/framework/types` (`static identifier`, `getIdentifier()`, `getTaxLines(itemLines, shippingLines, context)`). It is registered as `tp_<identifier>_<id>`; that string is the `provider_id` set on a tax region.
- In apps, prefer the core-flows tax workflows (`createTaxRegionsWorkflow`, `createTaxRatesWorkflow`, `updateTaxRatesWorkflow`, `setTaxRateRulesWorkflow`, ...). Tax lines for carts are computed by core-flows steps calling `getTaxLines`.

```ts
import { Modules } from "@medusajs/framework/utils"
import type { ITaxModuleService } from "@medusajs/framework/types"

const taxModuleService: ITaxModuleService = container.resolve(Modules.TAX)
const taxLines = await taxModuleService.getTaxLines(items, {
  address: { country_code: "us", province_code: "ca" },
})
```

### Data models (`src/models`)

- `TaxRegion` (`txreg_`): `country_code`, `province_code`, `provider`, `parent` / `children`, `tax_rates`. Unique per `(country_code, province_code)` and one country-level region per country.
- `TaxRate` (`txr_`): `rate`, `code`, `name` (translatable), `is_default` (one default per region), `is_combinable`, `rules`.
- `TaxRateRule` (`txrule_`): `reference` (`product`, `product_type`, `shipping_option`) and `reference_id`, unique per rate.
- `TaxProvider`: `id` (`tp_...`), `is_enabled`.

### Service methods (`src/services/tax-module-service.ts`)

Generated CRUD for all models, plus:

- `getTaxLines(items, calculationContext)`: finds the country and province regions, picks the best rate per item, and delegates line creation to the parent region's provider.
- `getProvider(providerId)`.
- Overridden `createTaxRegions` (accepts `default_tax_rate`), `createTaxRates`, `updateTaxRates` / `upsertTaxRates` (accept `rules`), `createTaxRateRules`.

### Events and links

- Emits internal CRUD events (`tax.<model>.created|updated|deleted|restored`) through `MedusaService`. No module links.

Docs: https://docs.medusajs.com/resources/commerce-modules/tax.md, https://docs.medusajs.com/resources/commerce-modules/tax/tax-provider.md, https://docs.medusajs.com/resources/commerce-modules/tax/tax-rates-and-rules.md, https://docs.medusajs.com/resources/commerce-modules/tax/tax-calculation-with-provider.md, https://docs.medusajs.com/resources/commerce-modules/tax/module-options.md

## Architecture

- `src/loaders/providers.ts` registers local providers, then configured ones, then upserts every registered provider into `tax_provider` with `is_enabled: true`.
- `src/services/tax-provider.ts` (`TaxProviderService`) resolves a provider from the container by its `tp_...` key.
- Rate priority in `prioritizeRates` (lower wins): province product/shipping-option rule, province product-type rule, province default, then the same three at country level. If the winning rate `is_combinable` and belongs to a province, the parent region's best rate is added too.

## Development

```bash
cd packages/modules/tax
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__ (needs Postgres, DB_* env vars)
yarn test:integration integration-tests/__tests__/local-providers.spec.ts
yarn migration:create           # after any change in src/models
```

- Integration tests: `index.spec.ts` (regions, rates, `getTaxLines`), `local-providers.spec.ts`; shared setup in `integration-tests/utils/setup-tax-structure.ts`.

## Gotchas

- `getTaxLines` returns `[]` when no country-level region exists for the address; province-only setups produce no tax lines.
- Country and province codes are lowercased on create and in the calculation context.
- A province region needs a `parent_id` with the same `country_code` (`INVALID_DATA`); DB checks forbid a `provider_id` on child regions and a child without `province_code`. The provider always comes from the country-level region, and the module applies no default: set `provider_id` (e.g. `tp_system`) on it or provider resolution fails in `getTaxLines`.
- Passing `rules` to `updateTaxRates` soft-deletes all existing rules of the matched rates and recreates them (full replace).
- A provider without a static `identifier` makes the loader throw `INVALID_ARGUMENT`. Providers removed from config are not disabled in `tax_provider`: the loader only lists existing rows whose id is already registered.
