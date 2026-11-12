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
  @medusajs/audit
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


Audit Module for Medusa: records who did what, on which resource, and how it ended, and reads those audit logs back. Audit logs are only inserted and read, never updated, and only deleted when a retention period is set. Recording is buffered and written in batches through a provider, so it never delays or fails the caller. It ships with `@medusajs/medusa`, requires a Medusa license that covers the `audit` feature, and is registered by adding it to the `modules` of your `medusa-config.ts`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/audit` |
| Type | Infrastructure Module |
| Module key | `Modules.AUDIT` (`"audit"`) |
| Registered by default | No |
| Import from | `@medusajs/medusa/audit` |
| License | Medusa Enterprise (`audit` license feature) |

## Features

- `createAuditLogs()` validates, buffers, and batch-writes audit logs without waiting for storage or throwing.
- `listAuditLogs()`, `listAndCountAuditLogs()`, and `retrieveAuditLog()` read audit logs back, filtered by actor, action, resource, outcome, and time.
- Built-in storage: the application's PostgreSQL database by default, with an optional `retention_days`, or Medusa Cloud when the `cloud` option is set. Custom providers can replace both.
- An `enabled` option turns auditing off for the whole application without changing callers.

## Installation

No installation needed. The module is included in `@medusajs/medusa`. Register it in `medusa-config.ts`.

## Usage

Register the module. Audit logs are stored in the application's database:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/audit",
      // optional: delete audit logs older than a year
      options: { retention_days: 365 },
    },
  ],
})
```

Then run migrations with `npx medusa db:migrate`.

Record an audit log from a job, subscriber, workflow step, or script:

```ts
import { Modules } from "@medusajs/framework/utils"

const auditModuleService = container.resolve(Modules.AUDIT)

auditModuleService.createAuditLogs({
  actor_type: "system",
  action: "inventory.sync",
  resource_type: "inventory_item",
  resource_id: "iitem_123",
})
```

## Resources

- [Modules](https://docs.medusajs.com/learn/fundamentals/modules)
