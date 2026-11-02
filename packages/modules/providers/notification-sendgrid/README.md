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
  @medusajs/notification-sendgrid
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

SendGrid Notification Module Provider for Medusa: sends email notifications through SendGrid, using SendGrid dynamic templates or raw HTML content. Use it to send transactional emails, such as order confirmations or password resets. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/notification-sendgrid` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/notification-sendgrid` |
| Type | Module Provider (Notification Module) |
| Provider ID | `notification-sendgrid` |
| Registered by default | No |
| Import from | `@medusajs/medusa/notification-sendgrid` |

## Features

- Sends a notification's `template` as a SendGrid dynamic template ID, with the notification's `data` as the template data.
- Sends a notification's `content` (`subject` and `html`) instead of a template when it's set.
- Supports attachments, a per-notification `from` address, and SendGrid `personalizations` through `provider_data`.

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa`.

## Usage

Register the provider in the Notification Module's `providers` array in `medusa-config.ts` for the `email` channel. Each channel can be handled by only one provider.

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

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `channels` | `string[]` | Read by the Notification Module. The channels this provider handles; use `["email"]`. | `[]` |
| `api_key` | `string` | Required. Your SendGrid API key. | - |
| `from` | `string` | Required. The default sender email address. | - |

| Environment variable | Description |
| --- | --- |
| `SENDGRID_API_KEY` | Value for `api_key`, as used in the example above. |
| `SENDGRID_FROM` | Value for `from`, as used in the example above. |

## Resources

- [SendGrid Notification Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/notification/sendgrid)
- [Send Notifications](https://docs.medusajs.com/resources/infrastructure-modules/notification/send-notification)
- [Notification Module](https://docs.medusajs.com/resources/infrastructure-modules/notification)
