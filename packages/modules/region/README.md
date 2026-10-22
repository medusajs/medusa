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
  @medusajs/region
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

Region Module for Medusa: manages regions and the countries that belong to them. Use it to define the markets you sell in, each with its own currency and set of countries. It ships with `@medusajs/medusa` and is registered by default, so Medusa applications don't install it directly.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/region` |
| Type | Commerce Module |
| Module key | `Modules.REGION` (`"region"`) |
| Registered by default | Yes |
| Import from | `@medusajs/medusa/region` |

## Features

- Create regions with a currency and a list of countries.
- Toggle automatic tax calculation per region.
- Loads the list of countries into the database when the application starts.

## Installation

No installation needed. The module is included in `@medusajs/medusa` and registered by default.

## Usage

Resolve the module's service from the container, for example in a workflow step:

```ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

const createRegionStep = createStep(
  "create-region",
  async ({}, { container }) => {
    const regionModuleService = container.resolve(Modules.REGION)

    const region = await regionModuleService.createRegions({
      name: "Europe",
      currency_code: "eur",
    })

    return new StepResponse({ region }, region.id)
  }
)
```

## Resources

- [Region Module](https://docs.medusajs.com/resources/commerce-modules/region)
- [Region Module workflows](https://docs.medusajs.com/resources/commerce-modules/region/workflows)
