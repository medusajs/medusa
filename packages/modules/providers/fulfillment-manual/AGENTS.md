# @medusajs/fulfillment-manual

Fulfillment Module provider for merchants who fulfill orders themselves: it records fulfillments without calling any external service. Registered by default by `defineConfig`.

## Using this package

Default registration:

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
          },
        ],
      },
    },
  ],
})
```

- No options.
- Provider ID is `{identifier}_{id}` = `manual_manual` (container key `fp_manual_manual`). Use `manual_manual` as `provider_id` when creating shipping options, and enable it on stock locations (link the location to the `manual_manual` fulfillment provider).
- Docs: https://docs.medusajs.com/resources/commerce-modules/fulfillment/fulfillment-provider.md
- Build a custom fulfillment provider: https://docs.medusajs.com/resources/references/fulfillment/provider.md

## Architecture

- `src/services/manual-fulfillment.ts`: `ManualFulfillmentService extends AbstractFulfillmentProviderService` (from `@medusajs/framework/utils`), `static identifier = "manual"`.
- Implements every method as a no-op or pass-through: `getFulfillmentOptions` (returns `manual-fulfillment` and `manual-fulfillment-return` with `is_return: true`), `validateFulfillmentData` (returns `data`), `validateOption` (`true`), `canCalculate` (`false`), `calculatePrice` (throws), `createFulfillment` / `createReturnFulfillment` (`{ data: {}, labels: [] }`), `cancelFulfillment` (`{}`).
- Minimal skeleton to copy when writing a custom fulfillment provider; see the method list above for what the Fulfillment Module calls.

## Development

- `yarn build`, `yarn test` (no tests in this package).

## Gotchas

- Only flat-rate shipping options work: `canCalculate` returns `false` and `calculatePrice` throws `"Manual fulfillment does not support price calculation"`, so `price_type: "calculated"` options with this provider fail.
- If you change `id`, the provider ID changes too (e.g. `id: "local"` gives `manual_local`), and existing shipping options keep pointing at the old one.
