# @medusajs/payment-adyen

Payment Module provider for Adyen, built on the Checkout API Advanced flow (`/paymentMethods`, `/payments`, `/payments/details`). Supports cards with 3D Secure.

## Using this package

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-adyen",
            id: "adyen",
            options: {
              apiKey: process.env.ADYEN_API_KEY,
              merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
              hmacKey: process.env.ADYEN_WEBHOOK_HMAC_KEY,
              returnUrl: process.env.ADYEN_RETURN_URL,
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`AdyenOptions` in `src/types/index.ts`): `apiKey` and `merchantAccount` (required), `hmacKey`, `environment` (`TEST` or `LIVE`, default `TEST`), `liveEndpointUrlPrefix` (required in `LIVE`), `capture` (default `false` = manual capture), `returnUrl`.
- Provider ID is `pp_adyen_{id}`. Register one instance per merchant account, for example `id: "eu"` and `id: "us"`.
- Webhooks: point a standard Adyen webhook at `{server_url}/hooks/payment/adyen_{id}`.
- The storefront passes Drop-in's `paymentMethod`, `browserInfo`, and `details` through `sdk.store.payment.updatePaymentSession` as `client_data.payment_method`, `client_data.browser_info`, and `client_data.details`, then completes the cart. `client_data.origin` and `client_data.return_url` are optional.
- Docs: https://docs.medusajs.com/resources/commerce-modules/payment/payment-session.md
- Build a custom payment provider: https://docs.medusajs.com/resources/references/payment/provider.md

## Architecture

- `src/services/adyen-provider.ts`: `AdyenProviderService` (identifier `adyen`) with all logic.
  - `initiatePayment` calls `/paymentMethods` and stores the response in `data.payment_methods` for Drop-in.
  - `authorizePayment` submits `data.client.details` to `/payments/details`, or `data.client.payment_method` to `/payments`, then nulls them in the session.
  - Capture, refund, and cancel use the Modifications API with the idempotency key Medusa passes in `context`.
  - Account holders use the customer ID as Adyen's `shopperReference`, with no Adyen call. `initiatePayment` stores it in `data.shopper_reference` and sends it to `/paymentMethods`, which returns the shopper's saved cards.
  - Saved cards: `/payments` sends `storePaymentMethod` when `data.client.store_payment_method` is set, and `listPaymentMethods`, `savePaymentMethod`, and `deletePaymentMethod` use the Checkout `/storedPaymentMethods` endpoints.
- `src/utils/amounts.ts`: converts Medusa's major units with Adyen's currency exponents, which differ from ISO 4217 for some currencies.

## Development

- `yarn build`, `yarn test` (unit tests in `src/services/__tests__` and `src/utils/__tests__`, with the Adyen client mocked).

## Gotchas

- `data.client` is written by the storefront, so amounts, currency, references, and the payment state are read only from provider-owned keys. `initiatePayment` sets all of them explicitly so data passed when initializing the session can't take their place.
- Adyen has no API to retrieve a payment, so `getPaymentStatus` and `retrievePayment` return the last stored state.
- Captures, refunds, and cancellations are confirmed asynchronously by webhooks, but Medusa records them when it requests them. Failed captures and refunds (`CAPTURE_FAILED`, `REFUND_FAILED`) are only logged.
- `CAPTURE` and `REFUND` webhooks return `NOT_SUPPORTED`, so captures and refunds made in the Customer Area aren't synced to Medusa.
- With `capture: true`, an authorized payment returns `captured`, and `cancelPayment` reverses (refunds) it instead of canceling. Each `/payments` request sets `captureDelayHours: 0` or `manualCapture`, as the merchant account's capture delay can't be relied on.
- Medusa doesn't pass the capture amount to providers, so the first capture captures the full amount at Adyen. Later partial captures in Medusa only record the amount and don't call Adyen.
- `/payments` idempotency keys are `{session_id}-{attempt}`, and `updatePayment` increments `attempt` whenever the storefront submits a payment method. Retrying the same submission is safe, and resubmitting the same card (for example, a saved card without a CVC) after a refusal is a new payment.
- Only cards (`scheme`), Apple Pay (`applepay`), and Google Pay (`googlepay`) are offered by `/paymentMethods` and accepted by `/payments`. Redirect and asynchronous methods could authorize without the storefront's details call, which the provider can't reconcile yet.
- `data.payment_methods` (the `/paymentMethods` response) is cleared once the payment is authorized, so it isn't copied into the payment's data.
- Async payment methods that are only confirmed by the `AUTHORISATION` webhook aren't supported yet.
- Saved cards are only used and stored with the provider-set `data.shopper_reference`, never one from `data.client`, so shoppers can't reach each other's cards (Adyen rejects another shopper's token with `Contract not found`). Guests get no `shopperReference`, so `store_payment_method` is ignored for them.
- `savePaymentMethod` (`POST /storedPaymentMethods`) needs the "API tokenise payment details" credential role and a `holderName` in the payment method. Storing a card during a payment only needs the "Merchant Recurring" role. `data.usage: "off_session"` saves it as `UnscheduledCardOnFile`.
- Off-session payments: `initiatePayment` stores `data.payment_method` (a saved card ID) as `off_session_payment_method` when `data.off_session` is `true` and the session has an account holder. `authorizePayment` charges it with `ContAuth` and `UnscheduledCardOnFile` when the storefront submitted no `data.client`. Session `data` can also come from storefronts, so logged-in customers can charge their own saved cards this way, as with the Stripe provider.
- `/payments` and modification requests send a hard-coded `applicationInfo.externalPlatform` (`APPLICATION_INFO` in `src/services/adyen-provider.ts`) that Adyen uses to attribute payments to Medusa for partner revenue sharing. Adyen matches the exact name, so don't change it or make it configurable.
