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
  @medusajs/file-local
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

Local File Module Provider for Medusa: stores uploaded files on the server's local filesystem and serves public files from the `static` directory. It's the default file provider for self-hosted applications and is meant for development; use a provider like `@medusajs/file-s3` in production. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/file-local` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/file-local` |
| Type | Module Provider (File Module) |
| Provider ID | `localfs` |
| Registered by default | Yes, with `id: "local"` (not on Medusa Cloud, which uses `file-s3`) |
| Import from | `@medusajs/medusa/file-local` |

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa` and is registered by default.

## Usage

Register it yourself only to pass options. The File Module accepts exactly one provider.

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
            resolve: "@medusajs/medusa/file-local",
            id: "local",
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

Private files aren't access-protected: their download URLs are plain file URLs, not signed URLs.

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `upload_dir` | `string` | Directory where public files are stored. | `static` in the current working directory |
| `private_upload_dir` | `string` | Directory where private files are stored. | `static` in the current working directory |
| `backend_url` | `string` | Base URL used to build file URLs. | `http://localhost:9000/static` |

## Resources

- [Local File Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/file/local)
- [File Module](https://docs.medusajs.com/resources/infrastructure-modules/file)
