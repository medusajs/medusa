# @medusajs/api-key

API Key Module (`Modules.API_KEY`, container key `"api_key"`). Stores publishable keys (`pk_...`, used by storefronts to scope requests to sales channels) and secret keys (`sk_...`, used to authenticate admin API requests).

## Using this package

- Registered by default via `defineConfig` as `@medusajs/medusa/api-key` (a re-export of this package). No module options.
- Resolve: `container.resolve(Modules.API_KEY)` (type `IApiKeyModuleService` from `@medusajs/framework/types`).
- Prefer the core-flows workflows over calling the service directly from routes: `createApiKeysWorkflow`, `updateApiKeysWorkflow`, `revokeApiKeysWorkflow`, `deleteApiKeysWorkflow`, `linkSalesChannelsToApiKeyWorkflow` (`@medusajs/medusa/core-flows`).

```ts
const apiKeyModule = container.resolve(Modules.API_KEY)

const key = await apiKeyModule.createApiKeys({
  title: "Storefront",
  type: "publishable",
  created_by: userId,
})

await apiKeyModule.revoke(key.id, { revoked_by: userId, revoke_in: 3600 })
const matched = await apiKeyModule.authenticate("sk_...") // ApiKeyDTO | false
```

### Data model

- `ApiKey` (`apk_` prefix): `token`, `salt`, `redacted`, `title`, `type` (`"publishable" | "secret"`), `last_used_at`, `created_by`, `revoked_by`, `revoked_at`. Unique index on `token`.

### Custom (non-generated) service methods

- `createApiKeys` / `upsertApiKeys`: generate the token; the raw token is returned only in this response.
- `updateApiKeys(idOrSelector, data)`: only `title` is persisted; other fields are ignored.
- `revoke(idOrSelector, { revoked_by, revoke_in? })`: sets `revoked_at` to now + `revoke_in` seconds.
- `authenticate(token)`: matches an unrevoked secret key; used by the framework `authenticate` middleware for `Authorization: Basic <sk_... or base64>` headers.
- `deleteApiKeys`: overridden to block deleting unrevoked keys.
- `retrieveApiKey`, `listApiKeys`, `listAndCountApiKeys`: overridden to blank `token` for secret keys and strip `salt`.

### Events

No event constants; generated mutations emit internal events named `api_key.api-key.<created|updated|deleted|restored>` (see `MedusaService.interceptEntityMutationEvents`).

### Module links

- `ApiKey` <-> `SalesChannel` (`link-modules/src/definitions/publishable-api-key-sales-channel.ts`): `api_key.sales_channels` / `sales_channel.publishable_api_keys`. The joiner config adds a legacy linkable key `publishable_key_id`.

### Docs

- https://docs.medusajs.com/resources/commerce-modules/api-key.md
- https://docs.medusajs.com/resources/commerce-modules/api-key/concepts.md
- https://docs.medusajs.com/resources/commerce-modules/api-key/links-to-other-modules.md
- https://docs.medusajs.com/resources/commerce-modules/api-key/workflows.md

## Architecture

- `src/services/api-key-module-service.ts`: the whole module. Extends `MedusaService({ ApiKey })` and overrides most generated methods (hence the `@ts-expect-error` signatures).
- Publishable keys: `"pk_" + 32 random bytes hex`, stored unhashed, empty `salt`.
- Secret keys: `"sk_" + 32 random bytes hex`, stored as `scrypt(token, salt, 64)` hex with a random 16-byte salt.
- `redacted` = first 6 chars + `***` + last 3 chars; used to narrow candidates before hashing in `authenticate_`.

## Development

```bash
yarn build
yarn test                  # src unit tests (only a noop)
yarn test:integration      # integration-tests/__tests__/api-key-module-service.spec.ts (needs Postgres: DB_HOST, DB_USERNAME, DB_PASSWORD)
yarn test:integration -t "<test name>"
yarn migration:create      # after any change to src/models; never hand-write migrations
```

## Gotchas

- Raw secret tokens are unrecoverable after creation: `list`/`retrieve` return `token: ""` for secret keys. Publishable key tokens are returned in full.
- `deleteApiKeys` throws `NOT_ALLOWED` unless every key is revoked, i.e. `revoked_at` is set and in the past. A key revoked with a future `revoke_in` cannot be deleted yet.
- `revoke` requires `revoked_by` and throws `INVALID_DATA` if any targeted secret key is already revoked.
- `omitToken` mutates the entity in place (MikroORM relies on non-enumerable fields for serialization); don't swap it for a spread copy.
- `authenticate` only considers `type: "secret"` keys; it never matches publishable keys.
