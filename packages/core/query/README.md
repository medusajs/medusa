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
  @medusajs/query
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

Query and Remote Joiner for Medusa: the engine behind Query, which retrieves data across modules and their links in a single call. You don't import this package directly in a Medusa application; resolve Query from the Medusa container with `ContainerRegistrationKeys.QUERY` (`"query"`), or use `useQueryGraphStep` from `@medusajs/medusa/core-flows` inside workflows.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/query` |
| Type | Core library |
| Import from | Resolved from the container as `ContainerRegistrationKeys.QUERY` (`"query"`) |

## Features

- `query.graph()` to retrieve records of a data model and their linked records from other modules.
- `query.index()` to filter across linked modules using the Index Module.
- `query.search()` to run search queries through the Search Module.
- `RemoteJoiner`, which resolves and joins data across module services.

## Installation

No separate installation is needed in a Medusa application. It's installed with `@medusajs/framework` through `@medusajs/modules-sdk`.

## Usage

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "variants.*"],
  })

  res.json({ products })
}
```

## Resources

- [Query](https://docs.medusajs.com/learn/fundamentals/query)
- [Query with the Index Module](https://docs.medusajs.com/learn/fundamentals/query/index-module)
- [Query search](https://docs.medusajs.com/learn/fundamentals/query/search)
