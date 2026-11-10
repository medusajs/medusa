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
  @medusajs/analytics
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

Analytics Module for Medusa: tracks events and identifies users by forwarding them to third-party analytics services such as PostHog. It uses a provider pattern, so the service you send data to is a pluggable Analytics Module Provider. It ships with `@medusajs/medusa` and is registered from `@medusajs/medusa/analytics`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/analytics` |
| Type | Infrastructure Module |
| Module key | `Modules.ANALYTICS` (`"analytics"`) |
| Registered by default | No |
| Import from | `@medusajs/medusa/analytics` |

## Features

- Track events (for example, order placed) and identify users from workflows, subscribers, or API routes.
- Pluggable providers. Official providers:
  - [`@medusajs/analytics-local`](../providers/analytics-local): logs events with the Medusa logger, for development.
  - [`@medusajs/analytics-posthog`](../providers/analytics-posthog): sends events to PostHog.

## Installation

No installation needed. The module ships with `@medusajs/medusa`, but you must register it in `medusa-config.ts`.

## Usage

```ts title="medusa-config.ts"
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

Then resolve the service with `container.resolve(Modules.ANALYTICS)` and call its `track` and `identify` methods.

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `providers` | `{ resolve: string, id: string, options?: Record<string, unknown> }[]` | Analytics Module Providers to register. `options` is passed to the provider. | `[]` |

## Resources

- [Analytics Module](https://docs.medusajs.com/resources/infrastructure-modules/analytics)
- [Local Analytics Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/analytics/local)
- [PostHog Analytics Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/analytics/posthog)
