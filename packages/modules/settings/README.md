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
  @medusajs/settings
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

Settings Module for Medusa: manages view configurations, layout configurations, property labels, and user preferences. Use it to store admin dashboard personalization, such as data-table views, page layouts, and per-user preferences. It ships with `@medusajs/medusa` and is registered by default, so Medusa applications don't install it directly.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/settings` |
| Type | Commerce Module |
| Module key | `Modules.SETTINGS` (`"settings"`) |
| Registered by default | Yes |
| Import from | `@medusajs/medusa/settings` |

## Features

- Store data-table view configurations per entity, personal to a user or as a shared system default.
- Store per-zone layout configurations for a user or as a system default.
- Set custom labels and descriptions for an entity's properties.
- Store arbitrary user preferences as key-value pairs.

The Admin API routes for view configurations require the `view_configurations` feature flag (`MEDUSA_FF_VIEW_CONFIGURATIONS`), which is disabled by default.

## Installation

No installation needed. The module is included in `@medusajs/medusa` and registered by default.

## Usage

Resolve the module's service from the container, for example in a workflow step:

```ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

const setPreferenceStep = createStep(
  "set-preference",
  async ({}, { container }) => {
    const settingsModuleService = container.resolve(Modules.SETTINGS)

    const preference = await settingsModuleService
      .setUserPreference("user_123", "theme", {
        mode: "dark",
      })

    return new StepResponse({ preference })
  }
)
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `entityOverrides` | `Record<string, EntityOverride>` | Overrides for how an entity's columns appear in data tables, such as default visible fields, field ordering, and computed columns, keyed by entity name. Merged with the built-in overrides, and your values take precedence. | `{}` |

## Resources

- [Settings Module](https://docs.medusajs.com/resources/commerce-modules/settings)
- [Configure view configurations](https://docs.medusajs.com/resources/commerce-modules/settings/configure-view-configurations)
- [View configurations](https://docs.medusajs.com/resources/commerce-modules/settings/view-configurations)
- [User preferences](https://docs.medusajs.com/resources/commerce-modules/settings/user-preferences)
