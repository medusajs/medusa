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
  @medusajs/notification-local
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

Local Notification Module Provider for Medusa: simulates sending notifications by logging their recipient, channel, template, and data with the Medusa logger. Use it in development and tests, or to audit notifications without a real delivery service. It's registered by default for the `feed` channel and ships with `@medusajs/medusa`, registered through the `@medusajs/medusa/notification-local` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/notification-local` |
| Type | Module Provider (Notification Module) |
| Provider ID | `notification-local` |
| Registered by default | Yes, with `id: "local"` and `channels: ["feed"]` |
| Import from | `@medusajs/medusa/notification-local` |

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa` and is registered by default.

## Usage

Register it yourself to use it for other channels, such as `email`. Each channel can be handled by only one provider.

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: {
              channels: ["email"],
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
| `channels` | `string[]` | Read by the Notification Module. The channels this provider handles; it isn't used for other channels. | `[]` |

## Resources

- [Local Notification Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/notification/local)
- [Notification Module](https://docs.medusajs.com/resources/infrastructure-modules/notification)
