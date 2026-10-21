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
  @medusajs/inventory
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

Inventory Module for Medusa: manages inventory items, their stock levels per location, and reservations. Use it to track stocked quantities, reserve stock for orders and carts, and check availability across locations. It ships with `@medusajs/medusa` and is registered by default; resolve it in your code with `container.resolve(Modules.INVENTORY)`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/inventory` |
| Type | Commerce Module |
| Module key | `Modules.INVENTORY` (`"inventory"`) |
| Registered by default | Yes |

## Installation

No installation needed. The module ships with `@medusajs/medusa`.

## Usage

```ts
import { Modules } from "@medusajs/framework/utils"

const inventoryModuleService = container.resolve(Modules.INVENTORY)

const [inventoryItems, count] =
  await inventoryModuleService.listAndCountInventoryItems({})
```

## Resources

- [Inventory Module](https://docs.medusajs.com/resources/commerce-modules/inventory)
- [Inventory Concepts](https://docs.medusajs.com/resources/commerce-modules/inventory/concepts)
- [Inventory Kits](https://docs.medusajs.com/resources/commerce-modules/inventory/inventory-kit)
- [Reservations Lifecycle](https://docs.medusajs.com/resources/commerce-modules/inventory/reservations-lifecycle)
- [Links to Other Modules](https://docs.medusajs.com/resources/commerce-modules/inventory/links-to-other-modules)
