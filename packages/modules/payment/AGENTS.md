# @medusajs/payment

Payment Module (`Modules.PAYMENT`): payment collections, sessions, payments, captures and refunds, with the provider-specific work delegated to payment providers (Stripe lives in `packages/modules/providers/payment-stripe`).

## Using this package

- Registered by default as `@medusajs/medusa/payment`; it always registers the system provider (`pp_system_default`, no external calls).
- Options (`PaymentModuleOptions` in `src/types/index.ts`): `providers[]` of `{ resolve, id, options? }`. `packages/core/types/src/payment/service.ts` also types `webhook_delay` and `webhook_retries`. A private `cloud` object (`api_key`, `endpoint`, `webhook_secret`, `payment_accounts`, `environment_handle` / `sandbox_handle`) is injected by `defineConfig` on Medusa Cloud.

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: { apiKey: process.env.STRIPE_API_KEY },
          },
        ],
      },
    },
  ],
})
```

- Provider IDs stored and used as `provider_id` are `pp_<identifier>_<id>` (e.g. `pp_stripe_stripe`). A provider class without a static `identifier` throws on registration.
- Resolve: `container.resolve(Modules.PAYMENT)` (`IPaymentModuleService`). Checkout and order payment flows should use `@medusajs/core-flows` workflows (`createPaymentSessionsWorkflow`, `capturePaymentWorkflow`, `refundPaymentWorkflow`, `processPaymentWorkflow`).

**Data models** (`src/models`): `PaymentCollection` (`pay_col_`, `amount`, `authorized_amount`, `captured_amount`, `refunded_amount`, `status`, many-to-many `payment_providers`) -> `PaymentSession` (`payses_`, `status`, `data`, `context`, `authorized_at`) -> `Payment` (`pay_`, `captured_at`, `canceled_at`) -> `Capture` (`capt_`) / `Refund` (`ref_`, `status`, `idempotency_key`, optional `RefundReason`). `AccountHolder` (`acchld_`, unique per `provider_id` + `external_id`) stores a customer's account at a provider. `PaymentProvider` (`id`, `is_enabled`). `PaymentMethod` is not a table: `listPaymentMethods` / `createPaymentMethods` proxy to the provider.

**Custom service methods** (`src/services/payment-module.ts`): `createPaymentSession`, `updatePaymentSession`, `deletePaymentSession`, `authorizePaymentSession`, `capturePayment`, `refundPayment`, `cancelPayment`, `updatePayment`, `completePaymentCollections`, `create/update/deleteAccountHolder`, `list[AndCount]PaymentMethods`, `createPaymentMethods`, `deletePaymentMethods`, `list[AndCount]PaymentProviders`, `getWebhookActionAndData`.

**Events**: `PaymentEvents.CAPTURED` (`payment.captured`) and `PaymentEvents.REFUNDED` (`payment.refunded`) are emitted by core-flows; `POST /hooks/payment/:provider` (`packages/medusa/src/api/hooks/payment/[provider]/route.ts`) emits `payment.webhook_received` (5s delay, 3 attempts by default), handled through `getWebhookActionAndData` + `processPaymentWorkflow`.

**Module links** (in `packages/modules/link-modules`): `cart_payment_collection`, `order_payment_collection` (deleting the order cascades to the collection), `region_payment_provider`, `customer_account_holder`. `order_claim_payment_collection` / `order_exchange_payment_collection` definitions exist but are not exported, so they are not loaded.

Docs: https://docs.medusajs.com/resources/commerce-modules/payment.md, https://docs.medusajs.com/resources/commerce-modules/payment/module-options.md, https://docs.medusajs.com/resources/commerce-modules/payment/payment-flow.md, https://docs.medusajs.com/resources/commerce-modules/payment/payment-session.md, https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider.md, https://docs.medusajs.com/resources/commerce-modules/payment/webhook-events.md, https://docs.medusajs.com/resources/commerce-modules/payment/account-holder.md

## Architecture

- `src/loaders/providers.ts`: registers the system provider (`id: "default"`), one Medusa Payments provider (`src/providers/payment-medusa`) per `cloud.payment_accounts` entry when all cloud options are set, then configured providers as `pp_<identifier>_<id>`; upserts all registered IDs into `payment_provider` with `is_enabled: true`.
- `src/services/payment-provider.ts` resolves `pp_*` from the container and calls the `AbstractPaymentProvider` methods.

## Development

```bash
cd packages/modules/payment
yarn build
yarn test
yarn test:integration          # needs Postgres
../../../node_modules/.bin/jest integration-tests/__tests__/services/payment-module/index.spec.ts -t "refund"
yarn migration:create          # after any change in src/models
```

- Integration tests: `integration-tests/__tests__/services/payment-module/` (`index.spec.ts`, `medusa-payments.ts`) and `integration-tests/__tests__/loaders/providers.spec.ts`.

## Gotchas

- `createPaymentSession` creates the row, then calls the provider with `session_id` in `data` and `idempotency_key` = session ID; on failure it deletes the provider session and the row.
- `authorizePaymentSession` is idempotent (returns the existing payment if `authorized_at` is set); returns `null` for `pending` authorization; throws `NOT_ALLOWED` for other non-authorized statuses; a provider `captured` status creates the payment and captures it immediately.
- `capturePayment` / `refundPayment` lock the payment row (`FOR UPDATE`) and throw `UNEXPECTED_STATE` if not run inside a transaction. Amounts must be > 0; refunds cannot exceed captured minus refunded (within currency epsilon); capture of a canceled payment throws.
- Refund `idempotency_key`: same key + same amount replays a succeeded refund or retries a failed one, different amount throws, a recent `pending` one throws `CONFLICT` (a stale pending one is retried). Failed provider refunds are marked `failed` and soft-deleted.
- Providers removed from config are not disabled: the loader only lists rows whose IDs are currently registered, so stale `payment_provider` rows keep their `is_enabled` value.
- `getWebhookActionAndData` prefixes `pp_` to `provider` if missing.
