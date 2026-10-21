# @medusajs/loyalty-plugin

An official Medusa plugin that adds gift cards and store credit. It ships two modules (`loyalty`, `store_credit`), module links, admin and store API routes, workflows, workflow hook handlers, a subscriber, and admin UI. It's published from `.medusa/server` only.

## Using this package

```bash
npm install @medusajs/loyalty-plugin
npx medusa db:migrate
```

```ts
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@medusajs/loyalty-plugin",
      options: {
        prefix: "GC", // gift card code prefix, default "GIFT"
        sections: 3, // 4-char code sections, default 4
      },
    },
  ],
})
```

- Resolve modules by name (`PluginModule` in `src/types/modules.ts`): `container.resolve("loyalty")` (model `GiftCard`, table `loyalty_gift_card`) and `container.resolve("store_credit")` (models `StoreCreditAccount`, `AccountTransaction`).
- Import workflows from `@medusajs/loyalty-plugin/workflows` and types from `@medusajs/loyalty-plugin/types`. Exported workflows include `createGiftCardsWorkflow`, `updateGiftCardsWorkflow`, `deleteGiftCardWorkflow`, `redeemGiftCardWorkflow`, `claimGiftCardWorkflow`, `createStoreCreditAccountsWorkflow`, `creditAccountsWorkflow`, `debitAccountsWorkflow`, `creditStoreCreditAccountWorkflow`, `debitStoreCreditAccountWorkflow`, `claimStoreCreditAccountWorkflow`, plus the cart workflows (`addGiftCardToCartWorkflow`, `removeGiftCardFromCartWorkflow`, `addStoreCreditsToCartWorkflow`, ...).
- Store-credit service extras: `creditAccounts`, `debitAccounts`, `retrieveAccountStats({ account_id })` (returns `balance`, `credits`, `debits`). `listStoreCreditAccounts` also fills these fields on each account.
- Routes:
  - Admin: `/admin/gift-cards`, `/admin/store-credit-accounts` (with `/:id/credit`, `/:id/debit`, `/:id/transactions`).
  - Store: `GET /store/gift-cards/:idOrCode`, `POST|DELETE /store/carts/:id/gift-cards` (`{ code }`), `POST /store/carts/:id/store-credits` (`{ amount? }`, customer auth), `/store/store-credit-accounts` (customer auth) and its `/claim`.
- Docs: https://docs.medusajs.com/resources/commerce-modules/loyalty.md, https://docs.medusajs.com/resources/commerce-modules/loyalty/module-options.md, https://docs.medusajs.com/resources/commerce-modules/loyalty/gift-cards.md, https://docs.medusajs.com/resources/commerce-modules/loyalty/workflows.md

## Architecture

- A gift card is backed by an anonymous store credit account. `createGiftCardsWorkflow` creates the cards, creates and links accounts (`links/gift-card-store-credit.ts`), credits them, and marks the cards `redeemed`. Balances are never stored: they're computed from the transaction ledger.
- `src/subscribers/create-gift-card.ts`: on `order.placed`, creates one gift card per unit of each line item whose product has `is_giftcard`.
- `src/workflows/hooks/`: handlers on core hooks: `completeCartWorkflow.hooks.orderCreated` and `.beforePaymentAuthorization`, `createOrderCreditLinesWorkflow.hooks.creditLinesCreated`, `refreshCartItemsWorkflow.hooks.beforeRefreshingPaymentCollection`.
- `src/links/`: cart and order to gift cards (list links), gift card to store credit account, plus read-only links (account `customer_id` to customer; gift card `line_item_id` to `OrderLineItem`).
- `src/api/middlewares.ts`: aggregates route middlewares and uses `allowFields` so `gift_cards.*` can be requested on core `/store/carts` and `/store/orders` routes.
- `src/admin/`: routes (Gift Cards, Gift Card Products, Store Credits) and widgets in `customer.details.side.after`, `order.details.side.after`, and `sales_channel.details.after`.

## Development

```bash
yarn build:plugin                    # medusa plugin:build -> .medusa/server
yarn dev                             # medusa plugin:develop
yarn test                            # jest over src
../../../node_modules/.bin/jest src/utils/__tests__/code-generator.spec.ts
npx medusa plugin:db:generate        # migrations for every src/modules/*; never hand-write them
```

- Integration tests live in `integration-tests/http/__tests__/loyalty/{admin,store}`; `integration-tests/http/medusa-config.js` registers the plugin. They load the built `.medusa/server` output, so run `yarn build:plugin` before running them.
- Plugin docs: https://docs.medusajs.com/learn/fundamentals/plugins.md

## Gotchas

- `jest.config.js` ignores `\\.medusa/` (escaped, because the repo path contains `medusa/`); otherwise the built output gets picked up as duplicate suites.
- The plugin owns the core hook handlers above. A workflow hook allows only one handler (`Cannot define multiple hook handlers`), so an app using this plugin can't register its own handlers for those hooks.
- `debitAccounts_` locks the account rows (`SELECT ... FOR UPDATE`, sorted ids) before the balance check to prevent double spend. It throws if called outside a transaction; keep debits inside `@InjectTransactionManager` methods.
- `deleteTransactions` is a forwarder to the generated `deleteAccountTransactions`. `MedusaService` names methods after the model, so the interface name doesn't exist unless you implement it.
- `updateStoreCreditAccounts` throws when a key is in its `["id", "metadata"]` whitelist (the check is inverted), so it currently rejects every update. Don't rely on it without fixing it.
- New store routes must define `allowed` fields in `query-config.ts` using `buildAllowedFields` from `@medusajs/medusa/api/store/utils/allowed-fields` (see `store/gift-cards/query-config.ts`).
- Source files mix semicolon and no-semicolon styles. Follow the repo prettier config in new code.
