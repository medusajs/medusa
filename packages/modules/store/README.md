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
  @medusajs/store
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

Store Module for Medusa: manages stores and their supported currencies and locales. It's installed and registered by default with `@medusajs/medusa`, so Medusa applications use it through the `Modules.STORE` service rather than installing this package directly.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/store` |
| Type | Commerce Module |
| Module key | `Modules.STORE` (`"store"`) |
| Registered by default | Yes |
| Import from | `@medusajs/medusa/store` |

## Installation

No installation needed. The module ships with `@medusajs/medusa` and is registered by `defineConfig`.

## Usage

Resolve the module's service from the Medusa container, for example in a workflow step:

```ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

const createStoreStep = createStep(
  "create-store",
  async ({}, { container }) => {
    const storeModuleService = container.resolve(Modules.STORE)

    const store = await storeModuleService.createStores({
      name: "My Store",
      supported_currencies: [{
        currency_code: "usd",
        is_default: true,
      }],
    })

    return new StepResponse({ store }, store.id)
  }
)
```

## Resources

- [Store Module](https://docs.medusajs.com/resources/commerce-modules/store)
- [Store Locales](https://docs.medusajs.com/resources/commerce-modules/store/locales)
- [Links to Other Modules](https://docs.medusajs.com/resources/commerce-modules/store/links-to-other-modules)
