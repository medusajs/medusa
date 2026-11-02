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
  @medusajs/event-bus-local
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

Local Event Bus Module for Medusa: an in-process event bus built on Node's `EventEmitter` that emits events and runs subscribers within a single process. It's the default Event Module in Medusa applications and is meant for development and testing. For production, use [`@medusajs/event-bus-redis`](../event-bus-redis) instead.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/event-bus-local` |
| Type | Infrastructure Module |
| Module key | `Modules.EVENT_BUS` (`"event_bus"`) |
| Registered by default | Yes |

## Installation

No installation needed. The module ships with `@medusajs/medusa` and is registered by default through `defineConfig`.

## Configuration

The module has no options. It logs a warning on startup because it isn't recommended for production.

## Resources

- [Event Module](https://docs.medusajs.com/resources/infrastructure-modules/event)
- [Local Event Module](https://docs.medusajs.com/resources/infrastructure-modules/event/local)
- [Events and Subscribers](https://docs.medusajs.com/learn/fundamentals/events-and-subscribers)
