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
  @medusajs/medusa
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

`@medusajs/medusa` is the core Medusa application package: the commerce server with its Store, Admin, and Auth API routes, the implementations of the `medusa` CLI commands, and all default commerce and infrastructure modules. Every Medusa application depends on it, and modules are registered from it by their `@medusajs/medusa/<module>` path (for example, `@medusajs/medusa/cart`).

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/medusa` |
| Type | Core library |
| Import from | `@medusajs/medusa/<module>` for modules and providers, `@medusajs/medusa/core-flows` for workflows |
| Entry points | `./<module>`, `./core-flows`, `./api/*`, `./commands/*`, `./subscribers/*`, `./jobs/*`, `./loaders/*`, `./feature-flags/*`, `./types`, `./utils` |

## Features

- **Commerce server**: Express-based HTTP server with the Store API (`/store`), Admin API (`/admin`), Auth API (`/auth`), and webhook routes (`/hooks`).
- **CLI commands**: implementations of `develop`, `start`, `build`, `exec`, `user`, `lint`, `db:*`, and `plugin:*`, run through the `medusa` binary from `@medusajs/cli`.
- **Default modules**: re-exports every official module and provider (Cart, Product, Order, Payment, Auth, File, Event Bus, Workflow Engine, and more) at `@medusajs/medusa/<name>`, so they need no separate install.
- **Workflows**: re-exports `@medusajs/core-flows` at `@medusajs/medusa/core-flows`.

## Installation

Create a new Medusa application, which installs this package along with `@medusajs/framework` and `@medusajs/cli`:

```bash
npx create-medusa-app@latest my-medusa-store
```

Requires Node.js `>=22.22.0`.

## Usage

Register a module or provider shipped with this package by its `@medusajs/medusa/<name>` path in `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              // ...
            },
          },
        ],
      },
    },
  ],
})
```

Run the server with the Medusa CLI:

```bash
npx medusa develop
```

## Resources

- [Installation](https://docs.medusajs.com/learn/installation)
- [Architecture](https://docs.medusajs.com/learn/introduction/architecture)
- [Medusa configuration](https://docs.medusajs.com/learn/configurations/medusa-config)
- [Medusa CLI reference](https://docs.medusajs.com/resources/medusa-cli)
- [Commerce Modules](https://docs.medusajs.com/resources/commerce-modules)
- [Infrastructure Modules](https://docs.medusajs.com/resources/infrastructure-modules)
- [Workflows reference](https://docs.medusajs.com/resources/medusa-workflows-reference)
- [Upgrade guides](https://docs.medusajs.com/learn/update)
