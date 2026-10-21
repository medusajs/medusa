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
  @medusajs/notification
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

Notification Module for Medusa: sends notifications through channels such as email, SMS, or an in-app feed, and stores a record of each notification and the providers that send them. Each channel is handled by a Notification Module Provider, and only one provider can be configured per channel. It ships with `@medusajs/medusa` and is registered by default; resolve it in your code with `container.resolve(Modules.NOTIFICATION)`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/notification` |
| Type | Infrastructure Module |
| Module key | `Modules.NOTIFICATION` (`"notification"`) |
| Registered by default | Yes (with the Local provider on the `feed` channel) |

## Providers

Official providers:

| Package | Register with |
| --- | --- |
| [`@medusajs/notification-local`](../providers/notification-local) | `@medusajs/medusa/notification-local` |
| [`@medusajs/notification-sendgrid`](../providers/notification-sendgrid) | `@medusajs/medusa/notification-sendgrid` |

On Medusa Cloud, a built-in Medusa Cloud email provider is registered automatically when no provider handles the `email` channel.

## Installation

No installation needed. The module ships with `@medusajs/medusa`.

## Usage

Register providers in `medusa-config.ts`. Overriding `providers` replaces the default list:

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
            resolve: "@medusajs/medusa/notification-sendgrid",
            id: "sendgrid",
            options: {
              channels: ["email"],
              api_key: process.env.SENDGRID_API_KEY,
              from: process.env.SENDGRID_FROM,
            },
          },
        ],
      },
    },
  ],
})
```

Then send a notification:

```ts
import { Modules } from "@medusajs/framework/utils"

const notificationModuleService = container.resolve(Modules.NOTIFICATION)

await notificationModuleService.createNotifications({
  to: "customer@example.com",
  channel: "email",
  template: "order-placed",
  data: { order_id: "order_123" },
})
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `providers` | `{ resolve: string, id: string, options: { channels: string[], ... } }[]` | Notification providers to register. `options.channels` lists the channels the provider handles; two providers can't share a channel. | Local provider (`id: "local"`, `channels: ["feed"]`) |

## Resources

- [Notification Module](https://docs.medusajs.com/resources/infrastructure-modules/notification)
- [Send a Notification](https://docs.medusajs.com/resources/infrastructure-modules/notification/send-notification)
- [Local Notification Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/notification/local)
- [SendGrid Notification Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/notification/sendgrid)
