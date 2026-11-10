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
  @medusajs/locking
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

Locking Module for Medusa: acquires and releases locks on shared resources so that only one process runs a critical section at a time, preventing race conditions such as overselling inventory. Locks are handled by Locking Module Providers: an in-memory provider is built in, and Postgres or Redis providers coordinate locks across multiple instances. It ships with `@medusajs/medusa` and is registered by default; use it with the `acquireLockStep` and `releaseLockStep` workflow steps, or resolve it with `container.resolve(Modules.LOCKING)`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/locking` |
| Type | Infrastructure Module |
| Module key | `Modules.LOCKING` (`"locking"`) |
| Registered by default | Yes (in-memory provider; Redis provider on Medusa Cloud when `REDIS_URL` is set) |

## Providers

The module accepts multiple providers. The built-in in-memory provider (`in-memory`) is always registered and is the default when you don't register others. Official providers:

| Package | Register with |
| --- | --- |
| [`@medusajs/locking-postgres`](../providers/locking-postgres) | `@medusajs/medusa/locking-postgres` |
| [`@medusajs/locking-redis`](../providers/locking-redis) | `@medusajs/medusa/locking-redis` |

## Installation

No installation needed. The module ships with `@medusajs/medusa`.

## Usage

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
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: {
              redisUrl: process.env.LOCKING_REDIS_URL,
            },
          },
        ],
      },
    },
  ],
})
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `providers` | `{ resolve: string, id: string, is_default?: boolean, options?: Record<string, unknown> }[]` | Locking providers to register. When only one provider is registered, or one sets `is_default: true`, it becomes the default. | `[]` (in-memory provider is used) |

## Resources

- [Locking Module](https://docs.medusajs.com/resources/infrastructure-modules/locking)
- [Postgres Locking Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/locking/postgres)
- [Redis Locking Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/locking/redis)
