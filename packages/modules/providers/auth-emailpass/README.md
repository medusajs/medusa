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
  @medusajs/auth-emailpass
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

Email/Password Auth Module Provider for Medusa: authenticates users and customers with an email (or other identifier) and a password hashed with scrypt. It's the default auth provider of the Auth Module, so admin users and customers can log in with email and password out of the box. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/auth-emailpass` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/auth-emailpass` |
| Type | Module Provider (Auth Module) |
| Provider ID | `emailpass` |
| Registered by default | Yes, with `id: "emailpass"` |
| Import from | `@medusajs/medusa/auth-emailpass` |

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa` and is registered by default.

## Usage

You only need to register the provider yourself to pass options, or when you override the Auth Module's `providers` array (for example, to add another provider). Keep `emailpass` in the list in that case:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
            options: {
              // optional
            },
          },
        ],
      },
    },
  ],
})
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `hashConfig` | `{ logN: number, r: number, p: number }` | The scrypt parameters used to hash passwords. | `{ logN: 15, r: 8, p: 1 }` |

## Resources

- [Emailpass Auth Module Provider](https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers/emailpass)
- [Auth Providers](https://docs.medusajs.com/resources/commerce-modules/auth/auth-providers)
- [Auth Module](https://docs.medusajs.com/resources/commerce-modules/auth)
