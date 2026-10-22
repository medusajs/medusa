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
  @medusajs/link-modules
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

Link Modules for Medusa: creates and manages the tables that store module links, the relationships between data models of different modules (for example, a product and its sales channels). It contains Medusa's built-in link definitions and also loads the links you define with `defineLink`. Medusa loads it automatically; apps don't install, register, or call this package directly, and instead manage links with the `Link` tool (`ContainerRegistrationKeys.LINK`) and retrieve linked data with Query.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/link-modules` |
| Type | Infrastructure Module |
| Module key | `Modules.LINK` (`"link_modules"`) |
| Registered by default | Yes (always loaded by the Medusa application) |

## Installation

No installation needed. The package ships with `@medusajs/medusa`.

## Usage

Define a link in your application, then run `npx medusa db:migrate` to create its table:

```ts
import BrandModule from "../modules/brand"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  BrandModule.linkable.brand
)
```

## Resources

- [Module Links](https://docs.medusajs.com/learn/fundamentals/module-links)
- [Link](https://docs.medusajs.com/learn/fundamentals/module-links/link)
- [Query](https://docs.medusajs.com/learn/fundamentals/query)
