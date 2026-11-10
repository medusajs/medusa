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
  @medusajs/analytics-local
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

Local Analytics Module Provider for Medusa: logs analytics `track` and `identify` calls to the Medusa logger at debug level instead of sending them to a third-party service. Use it in development to see which analytics events your application emits. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/analytics-local` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/analytics-local` |
| Type | Module Provider (Analytics Module) |
| Provider ID | `analytics-local` |
| Registered by default | No |
| Import from | `@medusajs/medusa/analytics-local` |

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa`.

## Usage

Register the provider in the Analytics Module's `providers` array in `medusa-config.ts`. The Analytics Module accepts exactly one provider.

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/analytics-local",
            id: "local",
          },
        ],
      },
    },
  ],
})
```

Events are logged at the `debug` level, so set your log level accordingly to see them.

## Configuration

The provider has no options.

## Resources

- [Local Analytics Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/analytics/local)
- [Analytics Module](https://docs.medusajs.com/resources/infrastructure-modules/analytics)
