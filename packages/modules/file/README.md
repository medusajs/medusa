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
  @medusajs/file
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

File Module for Medusa: uploads, retrieves, and deletes files such as product images and import/export files. Storage is delegated to a File Module Provider, so you can swap local storage for S3 or another service without changing your code. It ships with `@medusajs/medusa` and is registered by default; resolve it in your code with `container.resolve(Modules.FILE)`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/file` |
| Type | Infrastructure Module |
| Module key | `Modules.FILE` (`"file"`) |
| Registered by default | Yes (with the Local provider; S3 provider on Medusa Cloud) |

## Providers

The module must be configured with exactly one provider. Official providers:

| Package | Register with |
| --- | --- |
| [`@medusajs/file-local`](../providers/file-local) | `@medusajs/medusa/file-local` |
| [`@medusajs/file-s3`](../providers/file-s3) | `@medusajs/medusa/file-s3` |

## Installation

No installation needed. The module ships with `@medusajs/medusa`.

## Usage

To change the provider, register the module in `medusa-config.ts` with the provider you want:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              // provider options
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
| `providers` | `{ resolve: string, id: string, options?: Record<string, unknown> }[]` | The file provider to use. Must contain exactly one provider. | Local provider (`id: "local"`) |

## Resources

- [File Module](https://docs.medusajs.com/resources/infrastructure-modules/file)
- [Local File Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/file/local)
- [S3 File Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/file/s3)
