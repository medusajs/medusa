# @medusajs/file-s3

File Module provider for AWS S3 and S3-compatible storage via `@aws-sdk/client-s3`. Used by default on Medusa Cloud.

## Using this package

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
              endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
  ],
})
```

- Required: `file_url` (public base URL for returned links), `region`, `bucket`, plus `access_key_id` and `secret_access_key` when `authentication_method` is `"access-key"` (the default).
- Optional (`S3FileServiceOptions`): `authentication_method` (`"access-key"` | `"s3-iam-role"`), `session_token`, `prefix`, `endpoint`, `cache_control` (default `"public, max-age=31536000"`), `download_file_duration` (presigned download expiry in seconds, default 3600), `additional_client_config` (spread into `S3Client` config, e.g. `{ forcePathStyle: true }` for MinIO), `acl`.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/file/s3.md
- Build a custom file provider: https://docs.medusajs.com/resources/references/file-provider-module.md

## Architecture

- `src/services/s3-file.ts`: `S3FileService extends AbstractFileProviderService`, `static identifier = "s3"`.
- Implements `upload`, `getUploadStream` (multipart via `@aws-sdk/lib-storage` `Upload`), `delete`, `getPresignedDownloadUrl`, `getPresignedUploadUrl`, `getDownloadStream`, `getAsBuffer`.
- Keys: `{prefix}{dir/}{name}-{ulid}{ext}`; filenames are sanitized (backslashes normalized, leading `/` and `..`/`.` segments stripped). The original filename is stored in `original-filename` object metadata.
- Returned URL is `${file_url}/${key}` with each path segment URI-encoded.

## Development

- `yarn build`, `yarn test` (unit specs in `src/services/__tests__`: ACL, binary encoding, URL encoding).
- `integration-tests/__tests__/services.spec.ts` is `describe.skip`: it hits a real bucket and is meant to be run manually with `S3_TEST_*` env vars.

## Gotchas

- `"s3-iam-role"` passes no credentials, so the AWS SDK default credential chain (env vars, instance/task role) is used.
- ACL: by default uploads send `public-read` or `private` based on `access`. Buckets with Object Ownership "BucketOwnerEnforced" reject ACL headers; set `acl: false` to omit them. A string `acl` forces that ACL for every server-side upload.
- `getPresignedUploadUrl` only sets an ACL when `access` is passed, and uses the sanitized filename as the key (no ulid suffix), so same-named uploads overwrite each other.
- `delete` swallows S3 errors (logged only).
- `file_url` must not end with `/`; it's concatenated with `/` + key.
