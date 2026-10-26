# @medusajs/cloud

An official Medusa plugin that adds Medusa Cloud features to the Medusa Admin of projects deployed on Medusa Cloud. It currently shows in-app announcements fetched from the Medusa Cloud API: a "What's new" button in the admin topbar that opens a drawer of announcements, and a toast for a newly published announcement. It's the place for future Cloud-only admin features, such as feature promotions and hints about operations the Medusa MCP server can do.

## Using this package

- Nothing to install or configure. `@medusajs/medusa` depends on it, and `defineConfig` (`packages/core/utils/src/common/define-config.ts`) adds it to `plugins` only when `EXECUTION_CONTEXT=medusa-cloud`. Self-hosted projects never load it.
- `defineConfig` fills the options from environment variables. To override them, list the plugin yourself in `medusa-config.ts`; user entries replace the default by `resolve` key:

```ts
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@medusajs/cloud",
      options: {
        apiUrl: "https://api.prod.medusajs.cloud",
        organizationId: "org_123",
      },
    },
  ],
})
```

| Option | Env variable | Default | Description |
| --- | --- | --- | --- |
| `apiUrl` | `MEDUSA_CLOUD_API_URL` | `https://api.prod.medusajs.cloud` | Base URL of the Medusa Cloud API. |
| `organizationId` | `MEDUSA_CLOUD_ORGANIZATION_ID` | none | Sent as the `x-medusa-organization` header so the Cloud API also returns announcements targeted at the organization's plan. Without it, only announcements with no plan targeting are returned. |

- Plugin docs: https://docs.medusajs.com/learn/fundamentals/plugins.md

## Architecture

- `src/api/admin/cloud/announcements/route.ts`: `GET /admin/cloud/announcements`, authenticated like every `/admin` route. Reads the plugin options from the config module and proxies the Cloud API's public `GET /v1/announcements`. On failure it logs a warning and returns an empty list so the admin never breaks.
- `src/utils/fetch-announcements.ts`: calls the Cloud API (5s timeout), keeps only display fields (no HTML `content`, no `plan_handles`), drops non-`http(s)` links and images, and caches the result in memory for 10 minutes.
- `src/admin/widgets/cloud-announcements.tsx`: widget in the `topbar` zone. Renders nothing when there are no announcements. Read state and the last toasted announcement are stored per browser in `localStorage` (`src/admin/lib/storage.ts`). A toast is shown once per announcement, and only when it's unread and published in the last 14 days.
- `src/admin/lib/sdk.ts`: JS SDK client configured from the admin build globals `__BACKEND_URL__`, `__AUTH_TYPE__`, `__JWT_TOKEN_STORAGE_KEY__` (declared in `src/admin/vite-env.d.ts`).
- `src/index.ts` and `index.d.ts` are intentional no-ops for the TypeScript compiler.

## Development

```bash
yarn build:plugin          # medusa plugin:build -> .medusa/server (the only published dir)
yarn dev                   # medusa plugin:develop (watch + publish to local registry)
yarn test                  # jest unit tests under src/**/__tests__
```

- To try it locally, set `EXECUTION_CONTEXT=medusa-cloud` in a test project, or list the plugin in its `medusa-config.ts`.
- The Cloud API source lives in the private platform repository (`apps/backend/src/api/v1/announcements`).

## Gotchas

- Don't add `@medusajs/medusa` as a dependency: it already depends on this package.
- `tsconfig.json` excludes `src/admin`; admin code is type-checked with `src/admin/tsconfig.json` and bundled by `plugin:build`.
- Announcement `content` is HTML authored in the Cloud admin. It's intentionally not forwarded, so the admin never renders remote HTML; link to the full announcement through `link_url` instead.
- Medusa Cloud doesn't inject `MEDUSA_CLOUD_API_URL` or `MEDUSA_CLOUD_ORGANIZATION_ID` yet, so by default the plugin uses the production API and shows only announcements visible to all plans.
