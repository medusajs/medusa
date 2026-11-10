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
  @medusajs/modules-sdk
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

Modules SDK for Medusa: loads, registers, and links Medusa modules, and builds the Medusa application's module layer, including Query and module links. Medusa uses it internally at startup; in your own code you mostly need its `MedusaModule` helpers, such as checking whether a module is installed. Import it through `@medusajs/framework/modules-sdk`, which re-exports this package; importing `@medusajs/modules-sdk` directly is discouraged.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/modules-sdk` |
| Type | Core library |
| Import from | `@medusajs/framework/modules-sdk` |

## Features

- `MedusaModule` to bootstrap modules and inspect loaded modules, for example with `MedusaModule.isInstalled(moduleKey)`.
- `MedusaApp` and the `MedusaAppMigrateUp`, `MedusaAppMigrateDown`, and `MedusaAppMigrateGenerate` functions to load all modules and run their migrations.
- `ModulesDefinition` with the definitions of Medusa's built-in modules.
- `moduleProviderLoader` to load a module's providers.
- `Link` and `createQuery` to manage module links and query data across modules.

## Installation

No separate installation is needed in a Medusa application. It's installed with `@medusajs/framework`.

## Usage

Check that a module is installed before using it, for example in a data migration script:

```ts
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ExecArgs } from "@medusajs/framework/types"
import { BLOG_MODULE } from "../modules/blog"

export default async function migrateBlogData({ container }: ExecArgs) {
  if (!MedusaModule.isInstalled(BLOG_MODULE)) {
    return
  }

  // ...
}
```

## Resources

- [Modules](https://docs.medusajs.com/learn/fundamentals/modules)
- [Module links](https://docs.medusajs.com/learn/fundamentals/module-links)
- [Data migration scripts](https://docs.medusajs.com/learn/fundamentals/data-models/write-migration)
