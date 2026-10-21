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
  @medusajs/file-s3
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

S3 File Module Provider for Medusa: stores uploaded files in Amazon S3 or any S3-compatible storage, such as MinIO, DigitalOcean Spaces, Cloudflare R2, or Supabase Storage. Use it for file storage in production. It ships with `@medusajs/medusa` and is registered through the `@medusajs/medusa/file-s3` path.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/file-s3` |
| Type | Module Provider (File Module) |
| Provider ID | `s3` |
| Registered by default | No (on Medusa Cloud, yes, with `id: "s3"` and IAM role authentication) |
| Import from | `@medusajs/medusa/file-s3` |

## Features

- Public and private file uploads, with presigned download and upload URLs.
- Access key or IAM role authentication.
- Custom endpoints for S3-compatible storage.
- Configurable object ACLs, including disabling ACLs for buckets with Object Ownership set to "Bucket owner enforced".

## Installation

No installation needed. The provider is a dependency of `@medusajs/medusa`.

## Usage

Register the provider in the File Module's `providers` array in `medusa-config.ts`. The File Module accepts exactly one provider, so this replaces the default local provider.

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
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
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
| `file_url` | `string` | Required. Base URL used to build public file URLs. | - |
| `region` | `string` | Required. The bucket's region. | - |
| `bucket` | `string` | Required. The bucket name. | - |
| `authentication_method` | `"access-key" \| "s3-iam-role"` | How to authenticate. With `s3-iam-role`, the AWS SDK's default credentials chain is used. | `"access-key"` |
| `access_key_id` | `string` | Access key ID. Required when `authentication_method` is `"access-key"`. | - |
| `secret_access_key` | `string` | Secret access key. Required when `authentication_method` is `"access-key"`. | - |
| `session_token` | `string` | Session token for temporary credentials. | - |
| `prefix` | `string` | Prefix (folder path) added to uploaded file keys. | `""` |
| `endpoint` | `string` | Custom endpoint URL for S3-compatible storage. | - |
| `cache_control` | `string` | `Cache-Control` header set on uploaded objects. | `"public, max-age=31536000"` |
| `download_file_duration` | `number` | Validity of presigned download URLs, in seconds. | `3600` |
| `additional_client_config` | `Record<string, any>` | Extra options passed to the S3 client. | `{}` |
| `acl` | `"public-read" \| "private" \| "authenticated-read" \| "bucket-owner-full-control" \| false` | ACL set on uploaded objects. `false` omits the ACL header. | `"public-read"` for public files, `"private"` for private files |

| Environment variable | Description |
| --- | --- |
| `S3_FILE_URL`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_BUCKET`, `S3_ENDPOINT` | Values for the matching options, as used in the example above. |
| `S3_FILE_URL`, `S3_PREFIX`, `S3_REGION`, `S3_BUCKET`, `S3_ENDPOINT` | Read by `defineConfig` to configure the default provider on Medusa Cloud. |

## Resources

- [S3 File Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/file/s3)
- [File Module](https://docs.medusajs.com/resources/infrastructure-modules/file)
