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
  @medusajs/fulfillment
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

Fulfillment Module for Medusa: manages fulfillment sets, service zones, geo zones, shipping options and their rules and types, shipping profiles, and fulfillments with their items, labels, and addresses. Fulfillment and shipping-rate logic is delegated to Fulfillment Module Providers, so you can integrate third-party carriers. It ships with `@medusajs/medusa` and is registered by default; resolve it in your code with `container.resolve(Modules.FULFILLMENT)`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/fulfillment` |
| Type | Commerce Module |
| Module key | `Modules.FULFILLMENT` (`"fulfillment"`) |
| Registered by default | Yes (with the Manual provider) |

## Providers

The module accepts multiple providers. Official providers:

| Package | Register with |
| --- | --- |
| [`@medusajs/fulfillment-manual`](../providers/fulfillment-manual) | `@medusajs/medusa/fulfillment-manual` |

## Installation

No installation needed. The module ships with `@medusajs/medusa`.

## Usage

To add providers, register the module in `medusa-config.ts`. Overriding `providers` replaces the default list, so keep the Manual provider if you still need it:

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

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `providers` | `{ resolve: string, id: string, options?: Record<string, unknown> }[]` | Fulfillment providers to register. Providers removed from this list are disabled in the database on startup. | Manual provider (`id: "manual"`) |

## Resources

- [Fulfillment Module](https://docs.medusajs.com/resources/commerce-modules/fulfillment)
- [Fulfillment Concepts](https://docs.medusajs.com/resources/commerce-modules/fulfillment/concepts)
- [Fulfillment Module Provider](https://docs.medusajs.com/resources/commerce-modules/fulfillment/fulfillment-provider)
- [Fulfillment Module Options](https://docs.medusajs.com/resources/commerce-modules/fulfillment/module-options)
