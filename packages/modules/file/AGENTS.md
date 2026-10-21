# @medusajs/file

File Module (`Modules.FILE`, container key `"file"`). A stateless facade over exactly one File Module Provider (Local, S3, or custom) for uploading, reading, and deleting files. It stores nothing in the database; a file's `id` is the provider's file key.

## Using this package

- Registered by default via `defineConfig` as `@medusajs/medusa/file` with `@medusajs/medusa/file-local` (id `local`); on Medusa Cloud with `@medusajs/medusa/file-s3`.
- Overriding the module replaces the default provider:

```ts
module.exports = defineConfig({
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
            },
          },
        ],
      },
    },
  ],
})
```

- Resolve: `container.resolve(Modules.FILE)` (`IFileModuleService`). Prefer `uploadFilesWorkflow` / `deleteFilesWorkflow` from `@medusajs/medusa/core-flows` in routes.

```ts
const fileModule = container.resolve(Modules.FILE)

const { id, url } = await fileModule.createFiles({
  filename: "report.csv",
  mimeType: "text/csv",
  content: Buffer.from(csv).toString("base64"), // base64 string
  access: "private",
})

const file = await fileModule.retrieveFile(id) // url is a presigned download URL
const buffer = await fileModule.getAsBuffer(id)
```

### Service methods (`src/services/file-module-service.ts`)

- `createFiles(data | data[])` -> `{ id, url }`
- `deleteFiles(id | ids)`
- `retrieveFile(id)`, `listFiles({ id })`, `listAndCountFiles({ id })`: return presigned download URLs
- `getUploadFileUrls({ filename, mimeType?, access? })`: presigned upload URLs (provider must implement `getPresignedUploadUrl`)
- Streams and buffers: `getDownloadStream(id)`, `getAsBuffer(id)`, `getUploadStream({ filename, mimeType, ... })` -> `{ writeStream, promise, url, fileKey }`
- `getProvider()`: the internal `FileProviderService`

- No data models, no emitted events. The joiner config declares a `File` entity, but nothing links to it in `link-modules`.
- Custom providers extend `AbstractFileProviderService` from `@medusajs/framework/utils`.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/file.md, https://docs.medusajs.com/resources/infrastructure-modules/file/local.md, https://docs.medusajs.com/resources/infrastructure-modules/file/s3.md

## Architecture

- `src/loaders/providers.ts`: registers each provider as `fs_<identifier>_<id>` (static `identifier` from the provider class, e.g. `localfs`) and appends to `file_providers_identifier`.
- `src/services/file-provider-service.ts`: picks the single container key starting with `fs_` and forwards every call to it.

## Development

```bash
yarn build
yarn test                  # src/services/__tests__/file.spec.ts
yarn test:integration      # integration-tests/__tests__/module.spec.ts (fixture provider in integration-tests/__fixtures__/providers)
yarn test:integration -t "<test name>"
```

## Gotchas

- Exactly one provider is allowed: `FileProviderService` throws "File module should be initialized with exactly one provider" for zero or several.
- The loader reads `options.providers` (array), but the exported `FileModuleOptions` type declares a singular `provider`. Configure with `providers`.
- `listFiles` / `listAndCountFiles` throw `INVALID_DATA` unless filtered by `id`; there is no way to enumerate stored files.
- `createFiles` does not validate MIME types or size (see the TODO in the service).
- `getUploadFileUrls` throws if the provider lacks `getPresignedUploadUrl` or `filename` is missing.
- `package.json` has `migration:*` scripts, but the module has no models or `mikro-orm.config.dev.ts`; don't run them.
