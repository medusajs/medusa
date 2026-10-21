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
  @medusajs/payment-stripe
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

Stripe Payment Module Provider for Medusa: processes payments with Stripe Payment Intents, including cards and local payment methods such as iDEAL, Bancontact, BLIK, Przelewy24, PromptPay, giropay, and OXXO. Use it to accept payments through Stripe in your checkout. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/payment-stripe` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/payment-stripe` |
| Type | Module Provider (Payment Module) |
| Provider ID | One per payment method, see [Payment provider services](#payment-provider-services) |
| Registered by default | No |
| Import from | `@medusajs/medusa/payment-stripe` |

## Payment provider services

Registering the provider once adds all of the following payment providers. The registered ID has the format `pp_{identifier}_{id}`, where `{id}` is the `id` you set in `medusa-config.ts`. With `id: "stripe"`:

| Identifier | Payment method | Registered ID |
| --- | --- | --- |
| `stripe` | Cards and other methods enabled on the Payment Intent | `pp_stripe_stripe` |
| `stripe-bancontact` | Bancontact | `pp_stripe-bancontact_stripe` |
| `stripe-blik` | BLIK | `pp_stripe-blik_stripe` |
| `stripe-giropay` | giropay | `pp_stripe-giropay_stripe` |
| `stripe-ideal` | iDEAL | `pp_stripe-ideal_stripe` |
| `stripe-przelewy24` | Przelewy24 | `pp_stripe-przelewy24_stripe` |
| `stripe-promptpay` | PromptPay | `pp_stripe-promptpay_stripe` |
| `stripe-oxxo` | OXXO (always captured automatically) | `pp_stripe-oxxo_stripe` |

Enable the ones you want on each region, for example from the Medusa Admin.

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

In production, register a Stripe webhook pointing to `{server_url}/hooks/payment/{provider_id}`, where `{provider_id}` is the registered ID without the `pp_` prefix, such as `stripe_stripe`. Without `webhookSecret`, webhook signature verification fails and payment flows that depend on webhooks (such as 3D Secure or async capture) can't update orders.

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `apiKey` | `string` | Required. Your Stripe secret API key. | - |
| `webhookSecret` | `string` | The Stripe webhook signing secret. A warning is logged if it's missing. | - |
| `capture` | `boolean` | Capture payments immediately instead of only authorizing them. | `false` |
| `automaticPaymentMethods` | `boolean` | Set `automatic_payment_methods: { enabled: true }` on Payment Intents. | `false` |
| `paymentMethodConfiguration` | `string` | A Stripe payment method configuration ID applied to Payment Intents that don't set specific payment method types. | - |
| `paymentDescription` | `string` | Default Payment Intent description when the payment context doesn't provide one. | - |
| `oxxoExpiresDays` | `number` | Days before an OXXO payment expires. | `3` |
| `asyncPaymentMethodTypes` | `string[]` | Stripe payment method types treated as asynchronous, which can create an order while the payment is `pending`. | `[]` (all synchronous) |

| Environment variable | Description |
| --- | --- |
| `STRIPE_API_KEY` | Value for `apiKey`, as used in the example above. |
| `STRIPE_WEBHOOK_SECRET` | Value for `webhookSecret`, as used in the example above. |

## Resources

- [Stripe Payment Module Provider](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe)
- [Payment Module Provider](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider)
- [Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment)
