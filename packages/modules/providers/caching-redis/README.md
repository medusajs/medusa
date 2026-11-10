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
  @medusajs/caching-redis
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

Redis Caching Module Provider for Medusa: stores the Caching Module's cached data in Redis, with tag-based invalidation and compression of large values. Use it in production so cached data is shared across Medusa instances. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/caching-redis` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/caching-redis` |
| Type | Module Provider (Caching Module) |
| Provider ID | `cache-redis` |
| Registered by default | No (on Medusa Cloud, registered when `CACHE_REDIS_URL` is set) |
| Import from | `@medusajs/medusa/caching-redis` |

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa`. You need a running Redis server.

## Usage

The Caching Module is behind the `caching` feature flag. Enable it with `MEDUSA_FF_CACHING=true`, then register the provider in the Caching Module's `providers` array in `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/caching-redis",
            id: "caching-redis",
            // makes this the default caching provider
            is_default: true,
            options: {
              redisUrl: process.env.CACHE_REDIS_URL,
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
| `redisUrl` | `string` | Required. The Redis connection URL. | - |
| `redisOptions` | `RedisOptions` | Options passed to the `ioredis` client. Passing them at the top level of `options` is deprecated. | - |
| `ttl` | `number` | Default time-to-live of cached entries, in seconds. | `3600` |
| `prefix` | `string` | Prefix added to all cache keys. | `"mc:"` |
| `compressionThreshold` | `number` | Minimum size in bytes of a value before it's compressed. | `2048` |

| Environment variable | Description |
| --- | --- |
| `MEDUSA_FF_CACHING` | Set to `true` to enable the Caching Module. |
| `CACHE_REDIS_URL` | Value for `redisUrl`, as used in the example above. |

## Resources

- [Redis Caching Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/caching/providers/redis)
- [Caching Module Providers](https://docs.medusajs.com/resources/infrastructure-modules/caching/providers)
- [Caching Module](https://docs.medusajs.com/resources/infrastructure-modules/caching)
