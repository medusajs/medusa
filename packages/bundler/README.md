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
  @medusajs/bundler
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

Bundles the compiled backend of a Medusa application into a single file for faster boots. It is specific to Medusa's compiled output and is used through `medusa build --bundle` (or `MEDUSA_BUILD_BUNDLE=true`), not directly.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/bundler` |
| Type | Build tooling |
| Used by | `medusa build --bundle` in `@medusajs/medusa` |

## Features

- Bundles the compiled backend (`.medusa/server`) with esbuild into `medusa-bundle.main.js`, plus a launcher, `medusa-bundle.js`, that `medusa start` and `medusa db:migrate*` hand over to.
- Loads routes, middlewares, subscribers, workflows and re-export files lazily, so boot evaluates less code.
- Copies what the bundle still loads from disk (native addons, files read at runtime) next to it, traced with `@vercel/nft`.

## Installation

No separate installation is needed in a Medusa application. It's installed with `@medusajs/medusa`.

## Resources

- [Medusa documentation](https://docs.medusajs.com)
