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
  @medusajs/cache-redis
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

Redis Cache Module for Medusa: stores cached data in Redis. **Deprecated since Medusa v2.11.0**: use the [Caching Module](../caching) with the [Redis Caching Module Provider](../providers/caching-redis) (`@medusajs/caching-redis`) instead. It ships with `@medusajs/medusa` and is registered from `@medusajs/medusa/cache-redis`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/cache-redis` |
| Type | Infrastructure Module (deprecated) |
| Module key | `Modules.CACHE` (`"cache"`) |
| Registered by default | No (the In-Memory Cache Module is the default) |
| Import from | `@medusajs/medusa/cache-redis` |

## Installation

No installation needed. The module ships with `@medusajs/medusa`, but you must register it in `medusa-config.ts`.

## Usage

```ts title="medusa-config.ts"
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.CACHE_REDIS_URL,
      },
    },
  ],
})
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `redisUrl` | `string` | Redis connection URL. | - |
| `redisOptions` | `RedisOptions` (from `ioredis`) | Options passed to the Redis client. | - |
| `ttl` | `number` | Time to keep data in the cache, in seconds. | `30` |
| `namespace` | `string` | Prefix added to cache keys. | `"medusa"` |

## Resources

- [Redis Cache Module](https://docs.medusajs.com/resources/infrastructure-modules/cache/redis)
- [Migrate from the Cache Module to the Caching Module](https://docs.medusajs.com/resources/infrastructure-modules/caching/migrate-cache)
