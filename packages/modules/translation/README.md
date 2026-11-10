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
  @medusajs/translation
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

Translation Module for Medusa: manages locales, translations of entity fields (such as product titles and descriptions), and translation settings that define which entities and fields are translatable. Use it to add multi-language support to a Medusa store. It ships with `@medusajs/medusa` and is only enabled when the `translation` feature flag is on.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/translation` |
| Type | Commerce Module |
| Module key | `Modules.TRANSLATION` (`"translation"`) |
| Registered by default | Yes |
| Import from | `@medusajs/medusa/translation` |

## Installation

No installation needed. The module ships with `@medusajs/medusa` and is registered by default. Run the migrations to create its tables:

```bash
npx medusa db:migrate
```

## Resources

- [Translation Module](https://docs.medusajs.com/resources/commerce-modules/translation)
- [Translation Concepts](https://docs.medusajs.com/resources/commerce-modules/translation/concepts)
- [Translate Custom Data Models](https://docs.medusajs.com/resources/commerce-modules/translation/custom-data-models)
- [Links to Other Modules](https://docs.medusajs.com/resources/commerce-modules/translation/links-to-other-modules)
