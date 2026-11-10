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
  @medusajs/ui
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

Medusa UI: the React component library of Medusa's design system, used to build the Medusa Admin dashboard. Use it to build admin widgets and UI routes that match the dashboard, or in any React app styled with Tailwind CSS and `@medusajs/ui-preset`.

## At a glance

| | |
|---|---|
| Package | `@medusajs/ui` |
| Type | Design system |
| Import from | `@medusajs/ui` |

## Features

- Components such as `Button`, `Container`, `Heading`, `Input`, `Select`, `Table`, `FocusModal`, `Drawer`, `DatePicker`, and `Toaster`.
- A `DataTable` block for filterable, sortable, paginated tables.
- Hooks: `usePrompt` and `useToggleState`.
- Utilities: `clx` for merging class names, and `toast` for showing toasts.

## Installation

Admin extensions in a Medusa application or plugin can import `@medusajs/ui` without extra setup. In a standalone React project, install it with the Tailwind CSS preset:

```bash
npm install @medusajs/ui
npm install @medusajs/ui-preset --save-dev
```

Then follow the [standalone installation guide](https://docs.medusajs.com/ui/installation/standalone-project) to configure Tailwind CSS.

## Usage

```tsx
import { Button } from "@medusajs/ui"

const App = () => <Button variant="primary">Hello World</Button>
```

## Resources

- [Medusa UI documentation](https://docs.medusajs.com/ui)
- [Use Medusa UI in Admin Customizations](https://docs.medusajs.com/ui/installation/medusa-admin-extension)
- [Use Medusa UI in a Standalone Project](https://docs.medusajs.com/ui/installation/standalone-project)
