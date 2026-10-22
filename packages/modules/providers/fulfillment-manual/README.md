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
  @medusajs/fulfillment-manual
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

Manual Fulfillment Module Provider for Medusa: a fulfillment provider for orders you ship yourself, without integrating a third-party shipping service. It provides flat-rate fulfillment options and doesn't calculate prices or send data anywhere. It's registered by default and ships with `@medusajs/medusa`, registered through the `@medusajs/medusa/fulfillment-manual` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/fulfillment-manual` |
| Type | Module Provider (Fulfillment Module) |
| Provider ID | `manual`, registered as `fp_manual_manual` by default |
| Registered by default | Yes, with `id: "manual"` |
| Import from | `@medusajs/medusa/fulfillment-manual` |

## Features

- Two fulfillment options: `manual-fulfillment` and `manual-fulfillment-return` (for returns).
- Flat-rate shipping only: calculated pricing isn't supported.

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa` and is registered by default.

## Usage

You only need to register the provider yourself when you override the Fulfillment Module's `providers` array, for example to add another provider. Keep `manual` in the list in that case:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
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

## Configuration

The provider has no options.

## Resources

- [Fulfillment Module Provider](https://docs.medusajs.com/resources/commerce-modules/fulfillment/fulfillment-provider)
- [Fulfillment Module](https://docs.medusajs.com/resources/commerce-modules/fulfillment)
