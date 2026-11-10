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
  @medusajs/locking-postgres
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

PostgreSQL Locking Module Provider for Medusa: implements the Locking Module's locks with PostgreSQL advisory locks, using the application's existing database. Use it in production when you don't have Redis; the Redis provider is recommended when available. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/locking-postgres` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/locking-postgres` |
| Type | Module Provider (Locking Module) |
| Provider ID | `locking-postgres` |
| Registered by default | No (the Locking Module uses an in-memory provider by default) |
| Import from | `@medusajs/medusa/locking-postgres` |

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa`.

## Usage

Register the provider in the Locking Module's `providers` array in `medusa-config.ts`, then run `npx medusa db:migrate` to create the provider's table.

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-postgres",
            id: "locking-postgres",
            // makes this the default locking provider
            is_default: true,
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

- [PostgreSQL Locking Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/locking/postgres)
- [Locking Module](https://docs.medusajs.com/resources/infrastructure-modules/locking)
