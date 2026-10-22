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
  @medusajs/deps
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

`@medusajs/deps` pins and re-exports the third-party dependencies Medusa shares across its packages: MikroORM, OpenTelemetry, `awilix`, `pg`, and `zod`. It's an internal dependency of `@medusajs/framework`, which re-exports the same entry points, so apps should import from `@medusajs/framework/*` (for example, `@medusajs/framework/zod`) instead of this package.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/deps` |
| Type | Internal tooling |
| Import from | `@medusajs/framework/<subpath>` |

## Entry points

| `@medusajs/deps` subpath | Re-exports | `@medusajs/framework` equivalent |
| --- | --- | --- |
| `./mikro-orm/core` | `@mikro-orm/core` | `@medusajs/framework/mikro-orm/core` |
| `./mikro-orm/knex` | `@mikro-orm/knex` | `@medusajs/framework/mikro-orm/knex` |
| `./mikro-orm/postgresql` | `@mikro-orm/postgresql` | `@medusajs/framework/mikro-orm/postgresql` |
| `./mikro-orm/migrations` | `@mikro-orm/migrations` | `@medusajs/framework/mikro-orm/migrations` |
| `./mikro-orm/cli` | `@mikro-orm/cli` | `@medusajs/framework/mikro-orm/cli` |
| `./opentelemetry/api` | `@opentelemetry/api` | `@medusajs/framework/opentelemetry/api` |
| `./opentelemetry/resources` | `@opentelemetry/resources` | `@medusajs/framework/opentelemetry/resources` |
| `./opentelemetry/sdk-node` | `@opentelemetry/sdk-node` | `@medusajs/framework/opentelemetry/sdk-node` |
| `./opentelemetry/sdk-trace-node` | `@opentelemetry/sdk-trace-node` | `@medusajs/framework/opentelemetry/sdk-trace-node` |
| `./opentelemetry/instrumentation-pg` | `@opentelemetry/instrumentation-pg` | `@medusajs/framework/opentelemetry/instrumentation-pg` |
| `./awilix` | `awilix` | `@medusajs/framework/awilix` |
| `./pg` | `pg` | `@medusajs/framework/pg` |
| `./zod` | `zod` | `@medusajs/framework/zod` |

There is no root (`@medusajs/deps`) import; use a subpath.
