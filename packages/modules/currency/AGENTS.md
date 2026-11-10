# @medusajs/currency

Currency Module (`Modules.CURRENCY`, container key `"currency"`). A read-mostly catalog of ISO currencies (code, symbol, name, decimal digits, rounding), seeded on every startup. Stores reference currencies from it via `currency_code`.

## Using this package

- Registered by default via `defineConfig` as `@medusajs/medusa/currency`. No module options.
- Resolve: `container.resolve(Modules.CURRENCY)` (`ICurrencyModuleService`).

```ts
const currencyModule = container.resolve(Modules.CURRENCY)

const usd = await currencyModule.retrieveCurrency("USD") // code is lowercased -> "usd"
const currencies = await currencyModule.listCurrencies({ code: ["eur", "USD"] })
```

### Data model

- `Currency` (`src/models/currency.ts`): primary key is `code` (not `id`), plus `symbol`, `symbol_native`, `name`, `decimal_digits` (default 0), `rounding` (bigNumber, default 0). `code` and `name` are searchable.

### Service methods

- Generated `MedusaService({ Currency })` methods (`createCurrencies`, `updateCurrencies`, `deleteCurrencies`, ...).
- Overridden: `retrieveCurrency(code)`, `listCurrencies`, `listAndCountCurrencies`, which lowercase `code` filters (including inside `$and` / `$or`).

### Events and links

- No event constants; generated mutations emit internal `currency.currency.<action>` events.
- Read-only link: `StoreCurrency.currency` (Store Module), joined on `currency_code` -> `code` (`link-modules/src/definitions/readonly/store-currency.ts`).

### Docs

- https://docs.medusajs.com/resources/commerce-modules/currency.md
- https://docs.medusajs.com/resources/commerce-modules/currency/links-to-other-modules.md

## Architecture

- `src/loaders/initial-data.ts`: on module load, upserts every entry from `defaultCurrencies` (`packages/core/utils/src/defaults/currencies.ts`) with lowercased codes. Failures are logged as a warning and do not stop startup.

## Development

```bash
yarn build
yarn test                  # src unit tests (only a noop)
yarn test:integration      # integration-tests/__tests__/currency-module-service.spec.ts (Postgres)
yarn test:integration -t "<test name>"
yarn migration:create      # after any change to src/models; never hand-write migrations
```

- To add or change a built-in currency, edit `defaultCurrencies` in `@medusajs/utils`, not this package.

## Gotchas

- Codes are stored and matched lowercase. Only `code` filters on the overridden read methods are normalized; other filters and generated mutation methods are not.
- The startup upsert overwrites `symbol`, `name`, `decimal_digits`, and `rounding` for built-in codes, so manual edits to those currencies are reset on restart.
- The primary key is `code`: use `code` (not `id`) in links, filters, and `retrieveCurrency`.
