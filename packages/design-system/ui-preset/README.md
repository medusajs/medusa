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
  @medusajs/ui-preset
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

Tailwind CSS preset for Medusa UI: the design tokens (colors, typography, effects, and component styles) that `@medusajs/ui` components are styled with. Add it to your Tailwind CSS config when you use `@medusajs/ui` in a standalone project; Medusa Admin extensions don't need it.

## At a glance

| | |
|---|---|
| Package | `@medusajs/ui-preset` |
| Type | Design system |
| Import from | `@medusajs/ui-preset` |

## Installation

```bash
npm install @medusajs/ui-preset --save-dev
```

## Usage

With Tailwind CSS v3, add the preset and the `@medusajs/ui` files to your config:

```js title="tailwind.config.js"
module.exports = {
  presets: [require("@medusajs/ui-preset")],
  content: [
    // ...
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
}
```

## Contributing

The tokens are generated from Medusa's Figma file with `yarn generate`, which requires a `FIGMA_TOKEN` for the Medusa Figma organization. If you're not a Medusa team member, open an issue for token problems instead of a PR.

## Resources

- [Use Medusa UI in a Standalone Project](https://docs.medusajs.com/ui/installation/standalone-project)
- [Colors](https://docs.medusajs.com/ui/colors/overview)
