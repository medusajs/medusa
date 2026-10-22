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
  @medusajs/index
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

Index Module for Medusa: ingests data from multiple modules (by default products, variants, prices, and sales channels, plus linked models marked `filterable`) into a single Postgres-backed store so you can filter data by its linked records. Use it through Query's `index` method when `query.graph` can't filter across module links. It ships with `@medusajs/medusa` but is not registered by default, and the `/store/products` and `/admin/products` routes only use it when the `index_engine` feature flag is enabled.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/index` |
| Type | Infrastructure Module |
| Module key | `Modules.INDEX` (`"index"`) |
| Registered by default | No |
| Feature flag | `index_engine` (env `MEDUSA_FF_INDEX_ENGINE`), off by default |

## Installation

No separate installation needed when you use `@medusajs/medusa`. Register the module, then run migrations:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/index-module",
    },
  ],
})
```

```bash
npx medusa db:migrate
```

To make the core product API routes use the index, set `MEDUSA_FF_INDEX_ENGINE=true`. Data is ingested when the application starts. Keeping the index in sync with changes as they happen requires the [Redis Event Module](https://docs.medusajs.com/resources/infrastructure-modules/event/redis).

## Usage

```ts
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const query = container.resolve(ContainerRegistrationKeys.QUERY)

const { data: products } = await query.index({
  entity: "product",
  fields: ["id", "title", "sales_channels.id"],
  filters: {
    sales_channels: {
      id: "sc_123",
    },
  },
})
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `schema` | `string` | GraphQL schema of the entities and fields to ingest. Replaces the default schema. | Product, ProductVariant, Price, and SalesChannel |

## Resources

- [Index Module](https://docs.medusajs.com/learn/fundamentals/query/index-module)
- [Query](https://docs.medusajs.com/learn/fundamentals/query)
- [Feature Flags](https://docs.medusajs.com/learn/debugging-and-testing/feature-flags)
