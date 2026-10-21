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
  @medusajs/loyalty-plugin
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

Loyalty Plugin for Medusa: adds gift cards and store credit to a Medusa application, including gift card products, redeeming gift cards and store credit at checkout, and store credit accounts for customers. It provides the Loyalty Module and Store Credit Module, Admin and Store API routes, workflows, and Medusa Admin pages. It isn't registered by default: install it and add it to `plugins` in `medusa-config.ts` (Medusa v2.14.0+).

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/loyalty-plugin` |
| Type | Plugin |
| Modules | Loyalty Module (`"loyalty"`), Store Credit Module (`"store_credit"`) |
| Registered by default | No |
| Import from | `@medusajs/loyalty-plugin/workflows`, `@medusajs/loyalty-plugin/types` |

## Features

- **Gift card products**: sell physical or digital gift cards; a gift card with a generated code is created for each one purchased when the order is placed.
- **Checkout**: apply gift cards and store credit to a cart as payment (`POST /store/carts/:id/gift-cards`, `POST /store/carts/:id/store-credits`).
- **Store credit accounts**: credit, debit, and view transactions (`/admin/store-credit-accounts`), and let customers view and claim accounts (`/store/store-credit-accounts`).
- **Admin API routes**: manage gift cards under `/admin/gift-cards`. **Store API routes**: look up a gift card with `GET /store/gift-cards/:idOrCode`.
- **Workflows** such as `createGiftCardsWorkflow`, `addGiftCardToCartWorkflow`, and `creditStoreCreditAccountWorkflow`, plus hooks into Medusa's cart completion, payment refresh, and order credit line flows.
- **Medusa Admin**: Gift Cards, Gift Card Products, and Store Credits pages, and widgets on the customer, order, and sales channel details pages.

## Installation

```bash
npm install @medusajs/loyalty-plugin
```

## Usage

Register the plugin in `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  plugins: [
    {
      resolve: "@medusajs/loyalty-plugin",
      options: {},
    },
  ],
})
```

Then run the migrations:

```bash
npx medusa db:migrate
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `prefix` | `string` | Prefix of generated gift card codes. For example, `"GC"` generates `GC-XXXX-XXXX-XXXX-XXXX`. | `"GIFT"` |
| `sections` | `number` | Number of 4-character sections in generated gift card codes. For example, `3` generates `GIFT-XXXX-XXXX-XXXX`. | `4` |

## Resources

- [Loyalty Module](https://docs.medusajs.com/resources/commerce-modules/loyalty)
- [Store Credit Module](https://docs.medusajs.com/resources/commerce-modules/store-credit)
- [Loyalty Plugin options](https://docs.medusajs.com/resources/commerce-modules/loyalty/module-options)
- [Gift cards](https://docs.medusajs.com/resources/commerce-modules/loyalty/gift-cards)
- [Loyalty workflows](https://docs.medusajs.com/resources/commerce-modules/loyalty/workflows)
- [Loyalty user guide](https://docs.medusajs.com/user-guide/loyalty)
