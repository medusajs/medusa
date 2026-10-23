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
  @medusajs/caching
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

Caching Module for Medusa: caches data such as Query and Index Module results in a pluggable caching service like Redis. It replaces the deprecated Cache Modules (`@medusajs/cache-inmemory`, `@medusajs/cache-redis`) and uses a provider pattern, so the underlying store is a Caching Module Provider. It ships with `@medusajs/medusa` and is registered from `@medusajs/medusa/caching`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/caching` |
| Type | Infrastructure Module |
| Module key | `Modules.CACHING` (`"caching"`) |
| Registered by default | No |
| Import from | `@medusajs/medusa/caching` |

## Features

- Cache Query and Index Module results, or cache any data directly through the module's service.
- Pluggable providers, with a default provider selected by `is_default` (or the only registered provider). Official provider:
  - [`@medusajs/caching-redis`](../providers/caching-redis): stores cached data in Redis.

## Installation

No installation needed. The module ships with `@medusajs/medusa`. To use it:

1. Enable the caching feature flag by setting `MEDUSA_FF_CACHING=true` in your environment.
2. Register the module with at least one provider in `medusa-config.ts`. The module throws on startup if no provider is configured.

## Usage

```ts title="medusa-config.ts"
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            resolve: "@medusajs/caching-redis",
            id: "caching-redis",
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

Then resolve the service with `container.resolve(Modules.CACHING)`.

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `providers` | `{ resolve: string, id: string, is_default?: boolean, options?: Record<string, unknown> }[]` | Caching Module Providers to register. | - |
| `ttl` | `number` | Time to keep data in the cache, in seconds. | `3600` |

## Resources

- [Caching Module](https://docs.medusajs.com/resources/infrastructure-modules/caching)
- [Caching Module concepts](https://docs.medusajs.com/resources/infrastructure-modules/caching/concepts)
- [Redis Caching Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/caching/providers/redis)
- [Migrate from the Cache Module](https://docs.medusajs.com/resources/infrastructure-modules/caching/migrate-cache)
