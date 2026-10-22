# @medusajs/payment-stripe

Payment Module provider for Stripe, built on Payment Intents. One registration exposes the card provider plus Bancontact, BLIK, giropay, iDEAL, Przelewy24, PromptPay, and OXXO variants.

## Using this package

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
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`StripeOptions` in `src/types/index.ts`): `apiKey` (required), `webhookSecret`, `capture` (auto-capture, default `false` = manual capture), `automaticPaymentMethods`, `paymentMethodConfiguration` (PMC ID), `paymentDescription`, `oxxoExpiresDays` (default 3), `asyncPaymentMethodTypes`.
- Provider IDs are `pp_{identifier}_{id}`: `pp_stripe_stripe`, `pp_stripe-bancontact_stripe`, `pp_stripe-blik_stripe`, `pp_stripe-giropay_stripe`, `pp_stripe-ideal_stripe`, `pp_stripe-przelewy24_stripe`, `pp_stripe-promptpay_stripe`, `pp_stripe-oxxo_stripe`. Enable them per region.
- Webhooks: point Stripe at `{server_url}/hooks/payment/{identifier}_{id}`, e.g. `/hooks/payment/stripe_stripe` (one endpoint per variant you use).
- Per-session overrides go in the payment session `data` (e.g. `payment_method_types`, `capture_method`, `setup_future_usage`, `payment_method_options`, `payment_description`, `return_url`); see `normalizePaymentIntentParameters`.
- Docs: https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe.md
- Build a custom payment provider: https://docs.medusajs.com/resources/references/payment/provider.md

## Architecture

- `src/core/stripe-base.ts`: abstract `StripeBase extends AbstractPaymentProvider<StripeOptions>` with all logic. Each file in `src/services/` is a tiny subclass that sets `static identifier` (from `PaymentProviderKeys`) and a `paymentIntentOptions` getter (fixed `payment_method_types`, `capture_method: "automatic"` for redirect methods).
- Implements the full payment provider interface: `initiatePayment`, `authorizePayment`, `capturePayment`, `cancelPayment`, `deletePayment`, `refundPayment`, `retrievePayment`, `updatePayment`, `getPaymentStatus`, `getWebhookActionAndData`, account holders (`create/update/deleteAccountHolder`) and saved methods (`listPaymentMethods`, `savePaymentMethod`, `deletePaymentMethod`). The most complete reference for a custom payment provider.
- `src/utils/get-smallest-unit.ts`: Medusa amounts are major units; converted to/from Stripe's smallest unit (0-decimal and 3-decimal currencies handled).
- Errors from session creation are mapped in `handleStripeError`: card errors keep the failed intent; connection/rate-limit errors are retried by `executeWithRetry`.

## Development

- `yarn build`, `yarn test` (unit tests in `src/core/__tests__` and `src/utils/__tests__`; no integration tests).

## Gotchas

- Missing `webhookSecret` only warns once at boot, but webhook verification then fails, so async flows (3DS, redirects, async capture) leave orders pending.
- Webhook events for intents without `metadata.session_id` return `NOT_SUPPORTED`; intents created outside Medusa on the same Stripe account are ignored.
- `initiatePayment` sets the Stripe `customer` from `context.account_holder.data.id`, so saved cards require the customer's account holder to exist first.
- `paymentMethodConfiguration` is ignored whenever `payment_method_types` is set, so it never applies to the fixed-method variants (iDEAL, OXXO, ...).
- Methods in `asyncPaymentMethodTypes` turn `payment_intent.processing` into `PENDING_AUTHORIZATION`, letting orders be placed while Stripe is still `pending`.
- `deletePayment` tolerates already-succeeded intents; `cancelPayment` throws for them.
