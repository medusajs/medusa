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
  @medusajs/payment
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

Payment Module for Medusa: manages payment collections, payment sessions, payments, captures, refunds, refund reasons, account holders, and payment providers. Use it to process payments for carts, orders, or any resource through pluggable payment providers. It ships with `@medusajs/medusa` and is registered by default, so Medusa applications don't install it directly.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/payment` |
| Type | Commerce Module |
| Module key | `Modules.PAYMENT` (`"payment"`) |
| Registered by default | Yes |
| Import from | `@medusajs/medusa/payment` |

## Features

- Group payment sessions and payments for a resource in a payment collection.
- Authorize, capture, and refund payments, with refund reasons.
- Store account holders to save customers' payment methods with a provider.
- Handle provider webhook events.

## Payment providers

The module delegates payment processing to Payment Module Providers, registered through the `providers` option. A system provider (`pp_system_default`) is always registered for manual payments.

Official providers in this repository:

- [`@medusajs/payment-stripe`](../providers/payment-stripe) (Stripe)

## Installation

No installation needed. The module is included in `@medusajs/medusa` and registered by default.

## Usage

Register payment providers in `medusa-config.ts`:

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
            },
          },
        ],
      },
    },
  ],
})
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `providers` | `{ resolve: string, id: string, options?: Record<string, unknown> }[]` | Payment Module Providers to register. | `[]` |

## Resources

- [Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment)
- [Payment Module options](https://docs.medusajs.com/resources/commerce-modules/payment/module-options)
- [Payment Module Providers](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider)
- [Stripe Module Provider](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe)
