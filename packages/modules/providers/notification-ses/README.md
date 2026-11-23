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
  @medusajs/notification-ses
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

AWS SES Notification Module Provider for Medusa: sends email notifications through Amazon SES, using SES templates or raw HTML and text content. Use it to send transactional emails, such as order confirmations or password resets, from an AWS account you already run. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/notification-ses` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/notification-ses` |
| Type | Module Provider (Notification Module) |
| Provider ID | `notification-ses` |
| Registered by default | No |
| Import from | `@medusajs/medusa/notification-ses` |

## Features

- Sends a notification's `template` as an SES template name, with the notification's `data` as the template data.
- Sends a notification's `content` (`subject`, `html`, and `text`) instead of a template when it's set.
- Supports a per-notification `from` address, `cc` and `bcc` through `provider_data`, an SES configuration set, and reply-to addresses.
- Authenticates with the AWS SDK's default credential chain, or with explicit credentials from the provider's options.

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
            resolve: "@medusajs/medusa/notification-ses",
            id: "ses",
            options: {
              channels: ["email"],
              from: process.env.SES_FROM,
              region: process.env.SES_REGION,
            },
          },
        ],
      },
    },
  ],
})
```

The sender address, and every address the provider sends to, must be verified in SES, or belong to a verified domain, in the configured region.

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `channels` | `string[]` | Read by the Notification Module. The channels this provider handles; use `["email"]`. | `[]` |
| `from` | `string` | Required. The default sender email address. | - |
| `region` | `string` | The AWS region of the SES endpoint. | The region resolved by the AWS SDK |
| `configuration_set_name` | `string` | The SES configuration set used for the sent emails. | - |
| `reply_to_addresses` | `string[]` | The reply-to addresses added to the sent emails. | - |
| `credentials` | `{ access_key_id: string, secret_access_key: string, session_token?: string }` | Explicit AWS credentials. | The AWS SDK's default credential chain |

| Environment variable | Description |
| --- | --- |
| `SES_FROM` | Value for `from`, as used in the example above. |
| `SES_REGION` | Value for `region`, as used in the example above. |
| `AWS_REGION` | The region used when `region` isn't set. |
| `AWS_ACCESS_KEY_ID` | The access key ID used when `credentials` isn't set. |
| `AWS_SECRET_ACCESS_KEY` | The secret access key used when `credentials` isn't set. |
| `AWS_SESSION_TOKEN` | The session token used when `credentials` isn't set, for temporary credentials. |

## Limitations

- Attachments aren't supported: SES's simple email content can't carry them.

## Resources

- [Send Notifications](https://docs.medusajs.com/resources/infrastructure-modules/notification/send-notification)
- [Notification Module](https://docs.medusajs.com/resources/infrastructure-modules/notification)
- [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/Welcome.html)
