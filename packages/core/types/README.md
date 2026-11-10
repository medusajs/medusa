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
  @medusajs/types
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

`@medusajs/types` contains the shared TypeScript type definitions for Medusa: module service interfaces (for example, `ICartModuleService`), DTOs, data model and DAL types, workflow types, and the `HttpTypes` namespace for API request and response shapes. Applications, plugins, and modules should import it through `@medusajs/framework/types`, which re-exports this package; import `@medusajs/types` directly only when you can't depend on `@medusajs/framework`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/types` |
| Type | Core library |
| Import from | `@medusajs/framework/types` |

## Features

- Module service interfaces and DTOs for every commerce and infrastructure module.
- `HttpTypes` namespace with Store and Admin API request and response types, also used by `@medusajs/js-sdk`.
- Namespaced groups such as `CartTypes`, `ProductTypes`, `OrderTypes`, `DAL`, and `WorkflowTypes`.
- `MedusaContainer`, `ConfigModule`, and other framework-level types.

## Usage

```ts
import type { HttpTypes, ICartModuleService } from "@medusajs/framework/types"
```

## Resources

- [Service factory reference](https://docs.medusajs.com/resources/service-factory-reference)
- [Commerce Modules](https://docs.medusajs.com/resources/commerce-modules)
