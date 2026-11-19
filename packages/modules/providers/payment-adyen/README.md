<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  @medusajs/payment-adyen
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

Adyen Payment Module Provider for Medusa: processes card payments, including 3D Secure, with Adyen's Checkout API (Advanced flow). Use it with Adyen's Drop-in or Components in your storefront. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/payment-adyen` path.

## At a glance

|                       |                                               |
| --------------------- | --------------------------------------------- |
| Package               | `@medusajs/payment-adyen`                     |
| Type                  | Module Provider (Payment Module)              |
| Provider ID           | `pp_adyen_{id}`, for example `pp_adyen_adyen` |
| Registered by default | No                                            |
| Import from           | `@medusajs/medusa/payment-adyen`              |

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa`.

## Usage

Register the provider in the Payment Module's `providers` array in `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
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

Then enable the provider in a region, for example from the Medusa Admin.

In the Adyen Customer Area, create a standard webhook pointing to `{server_url}/hooks/payment/{provider_id}`, where `{provider_id}` is the registered ID without the `pp_` prefix, such as `adyen_adyen`. Generate its HMAC key and set it as `hmacKey`.

### Storefront flow

1. Initialize a payment session with the provider. The session's `data.payment_methods` holds the response of Adyen's `/paymentMethods`, which you pass to Drop-in.
2. In Drop-in's `onSubmit`, pass `state.data.paymentMethod` and `state.data.browserInfo` to the session with `sdk.store.payment.updatePaymentSession`, as `client_data.payment_method` and `client_data.browser_info`. Optionally pass `origin` and `return_url`.
3. Complete the cart. If the session's status is `requires_more`, pass its `data.action` to Drop-in.
4. In Drop-in's `onAdditionalDetails`, pass `state.data.details` as `client_data.details`, then complete the cart again.

If a payment is refused, the session's status is `error`. Pass a new `client_data.payment_method` to the same session to retry.

### Saved cards

For logged-in customers, the customer's account holder ID is sent to Adyen as the `shopperReference`:

- `data.payment_methods.storedPaymentMethods` lists the customer's saved cards, which Drop-in shows. Paying with one works like any other payment method.
- To save the card used in a payment, pass Drop-in's `state.data.storePaymentMethod` as `client_data.store_payment_method`. Enable Drop-in's `enableStoreDetails` option to show the checkbox.
- The Payment Module's `listPaymentMethods`, `createPaymentMethods`, and `deletePaymentMethods` methods list, save, and delete the customer's saved cards. Saving a card without a payment takes Drop-in's `state.data.paymentMethod`, including a `holderName`, as `data.payment_method`, and requires the "API tokenise payment details" role on your API credential.
- Deleting the account holder deletes the customer's saved cards.

### Off-session payments

Your backend can charge a saved card without the shopper present, for example to pay for an order once it's approved. Create the payment session with the customer's account holder in its context and `data: { payment_method: <saved card ID>, off_session: true }`, then authorize it. To save a card for this, pass `usage: "off_session"` in `createPaymentMethods`' `data`.

Off-session payments skip the shopper's authentication, such as 3D Secure. As with the Stripe provider, storefronts can also pass these fields in a payment session's `data`, which lets logged-in customers charge their own saved cards this way. Adyen rejects cards saved for another shopper.

### Limitations

- Only cards (including 3D Secure), Apple Pay, and Google Pay are supported, so Drop-in only shows these even if other payment methods are enabled on your merchant account. Payment methods that redirect the shopper or are confirmed asynchronously by webhook, such as iDEAL, PayPal, or bank transfers, aren't supported yet.
- Captures, refunds, and cancellations are recorded in Medusa when they're requested. Adyen confirms them asynchronously, and failures (for example, a refund rejected for insufficient funds) are only logged.
- Medusa doesn't pass capture amounts to providers, so the first capture captures the full authorized amount.
- Captures and refunds made in the Adyen Customer Area aren't synced to Medusa.

## Configuration

| Option                  | Type               | Description                                                                                | Default  |
| ----------------------- | ------------------ | ------------------------------------------------------------------------------------------ | -------- |
| `apiKey`                | `string`           | Required. The API key of your Adyen API credential.                                        | -        |
| `merchantAccount`       | `string`           | Required. The merchant account to process payments with.                                   | -        |
| `hmacKey`               | `string`           | The HMAC key of the standard webhook. Webhooks are rejected without it.                    | -        |
| `environment`           | `"TEST" \| "LIVE"` | The Adyen environment.                                                                     | `"TEST"` |
| `liveEndpointUrlPrefix` | `string`           | Required in `LIVE`. Find it in the Customer Area under Developers > API URLs.              | -        |
| `capture`               | `boolean`          | Capture payments immediately instead of only authorizing them.                             | `false`  |
| `returnUrl`             | `string`           | The URL to return shoppers to after a redirect, unless the storefront passes `return_url`. | -        |

## Resources

- [Payment Module Provider](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider)
- [Payment Session](https://docs.medusajs.com/resources/commerce-modules/payment/payment-session)
- [Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment)
