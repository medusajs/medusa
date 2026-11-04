# @medusajs/file-local

File Module provider that stores uploads on the local filesystem and serves them through the backend's `/static` route. Registered by default by `defineConfig` (outside Medusa Cloud). For development only.

## Using this package

Default registration, shown with its options:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: "http://localhost:9000/static",
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`LocalFileServiceOptions`): `upload_dir` (default `<cwd>/static`), `private_upload_dir` (default `<cwd>/static`), `backend_url` (default `http://localhost:9000/static`, the base for returned file URLs).
- Use the File Module (`Modules.FILE`) or the upload workflows, never the provider directly.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/file/local.md
- Build a custom file provider: https://docs.medusajs.com/resources/references/file-provider-module.md

## Architecture

- `src/services/local-file.ts`: `LocalFileService extends AbstractFileProviderService` (from `@medusajs/framework/utils`), `static identifier = "localfs"`. Also exported as a named export.
- Implements `upload`, `getUploadStream`, `delete`, `getDownloadStream`, `getAsBuffer`, `getPresignedDownloadUrl`, `getPresignedUploadUrl`. Smallest complete reference for a custom file provider.
- Keys are `{dir}/{Date.now()}-{basename}`; private files get a `private-` prefix on the basename.
- `getUploadFilePath` rejects keys that resolve outside the base dir (path traversal guard).
- String `content` is decoded as base64 if it round-trips, else UTF-8 for text MIME types, else binary (latin1).

## Development

- `yarn build`, `yarn test`
- `yarn test:integration`: `integration-tests/__tests__/services.spec.ts` (writes to disk, uses `integration-tests/__fixtures__/catphoto.jpg`).

## Gotchas

- Private files land in `static` too by default, so they're publicly reachable if the key is known. Pointing `private_upload_dir` elsewhere breaks `getPresignedDownloadUrl`, which always returns a `backend_url`-based URL.
- `getPresignedUploadUrl` returns `/admin/uploads` (not a real presigned URL), so clients upload through the admin upload route.
- `backend_url` must match the server's public URL in deployed environments, or stored product image URLs point to localhost.
- The File Module accepts exactly one provider; registering another (e.g. `file-s3`) means replacing this one.
