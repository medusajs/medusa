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
  @medusajs/rbac
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

RBAC (role-based access control) Module for Medusa: manages roles, policies, role-policy assignments, and role inheritance. Use it to control which admin users can perform which operations on which resources. It ships with `@medusajs/medusa` but is disabled unless the `rbac` feature flag is enabled.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/rbac` |
| Type | Commerce Module |
| Module key | `Modules.RBAC` (`"rbac"`) |
| Registered by default | No (only when the `rbac` feature flag is enabled) |
| Import from | `@medusajs/medusa/rbac` |

## Features

- Define policies as a resource and operation pair, such as `product:read`.
- Group policies into roles, and let roles inherit from other roles.
- Seeds a Super Admin role with a wildcard policy that grants full access.
- Powers the Admin API routes under `/admin/rbac`, which are also gated by the `rbac` feature flag.

## Installation

No installation needed. The module is included in `@medusajs/medusa`. Enable the `rbac` feature flag to register it.

## Usage

Enable the feature flag in `medusa-config.ts`:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  featureFlags: {
    rbac: true,
  },
})
```

Or set the environment variable:

```bash
MEDUSA_FF_RBAC=true
```

Then run migrations with `npx medusa db:migrate`.

## Resources

- [Feature flags](https://docs.medusajs.com/learn/debugging-and-testing/feature-flags)
- [Modules](https://docs.medusajs.com/learn/fundamentals/modules)
