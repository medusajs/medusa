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
  @medusajs/currency
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

Currency Module for Medusa: manages the currencies available in your store, such as their codes, symbols, and decimal digits. It loads Medusa's list of default currencies when the application starts. It ships with `@medusajs/medusa` and is registered by default, so you normally use it through the Medusa application rather than installing it directly.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/currency` |
| Type | Commerce Module |
| Module key | `Modules.CURRENCY` (`"currency"`) |
| Registered by default | Yes |
| Import from | `@medusajs/medusa/currency` |

## Installation

No installation needed. The module ships with `@medusajs/medusa` and is registered by default.

## Usage

Resolve the module's service from the container, for example in a workflow step:

```ts
import { Modules } from "@medusajs/framework/utils"

const currencyModuleService = container.resolve(Modules.CURRENCY)
```

## Resources

- [Currency Module](https://docs.medusajs.com/resources/commerce-modules/currency)
- [Currency Module links to other modules](https://docs.medusajs.com/resources/commerce-modules/currency/links-to-other-modules)
