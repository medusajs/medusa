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
  @medusajs/admin-vite-plugin
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

Vite plugin for the Medusa Admin dashboard: finds admin extensions (widgets, UI routes, custom fields, layouts, translations, and more) under `src/admin` in a Medusa application or plugin and loads them into the dashboard. It's internal plumbing used by `@medusajs/admin-bundler` and the `@medusajs/dashboard` dev server, so you don't need to install or configure it in a Medusa application.

## At a glance

| | |
|---|---|
| Package | `@medusajs/admin-vite-plugin` |
| Type | Internal tooling |
| Import from | `@medusajs/admin-vite-plugin` (default export) |

## Configuration

| Option | Type | Description | Default |
|---|---|---|---|
| `sources` | `string[]` | Paths of the Medusa application or plugin directories to load admin extensions from. | `[]` |
| `pluginMode` | `boolean` | Build extensions for a Medusa plugin instead of an application. | `false` |

## Resources

- [Admin Development](https://docs.medusajs.com/learn/fundamentals/admin)
