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
  @medusajs/audit-postgres
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


PostgreSQL provider for the Medusa Audit Module. It stores audit logs in an `audit_log` table in the application's database, and can delete audit logs past a retention period.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/audit-postgres` |
| Type | Audit Module Provider |
| Provider identifier | `audit-postgres` |
| Registered by default | No |
| Import from | `@medusajs/medusa/audit-postgres` |
| License | Medusa Enterprise, used with the Audit Module |

## Features

- Batched inserts into one `audit_log` table, indexed for reads by time, by actor, and by resource.
- Filtered, paginated reads, newest first, with a free-text `q` over the action, resource, and actor.
- Optional retention: with `retention_days`, older audit logs are deleted, at most once an hour, while new audit logs are being written. Without it, audit logs are kept forever.

## Installation

No installation needed. The provider is included in `@medusajs/medusa`.

## Usage

Register it as a provider of the Audit Module in `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/audit",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/audit-postgres",
            id: "postgres",
            options: {
              // Optional. Omit to keep audit logs forever.
              retention_days: 365,
            },
          },
        ],
      },
    },
  ],
})
```

Then run migrations with `npx medusa db:migrate` to create the `audit_log` table.

## Resources

- [Modules](https://docs.medusajs.com/learn/fundamentals/modules)
