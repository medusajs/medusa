# @medusajs/cloud

An official Medusa plugin that adds Medusa Cloud features to the Medusa Admin of projects deployed on Medusa Cloud. It currently shows in-app announcements fetched from the Medusa Cloud API: a "What's new" button in the admin topbar that opens a drawer of announcements, and a one-time toast for each announcement. Announcements of type `admin` can target an admin page through `admin_path`, such as what users can ask an AI tool connected to the Medusa MCP server on the Orders page. Announcements are authored in the Medusa Cloud admin, so they change without a plugin release. It's the place for future Cloud-only admin features, such as feature promotions.

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

- `src/api/admin/cloud/announcements/route.ts`: `GET /admin/cloud/announcements`, authenticated like every `/admin` route. It resolves the Cloud module (`CLOUD_MODULE`) and calls `listAnnouncements()`. On failure it logs a warning and returns an empty list so the admin never breaks.
- `src/modules/cloud`: the `cloud` module, registered automatically like every plugin module, so its service gets the plugin options. `CloudModuleService` (`service.ts`) sends all requests to the Medusa Cloud API through `request_()`. `listAnnouncements()` fetches the latest 50 announcements of every type from the public `GET /v1/announcements` (5s timeout). It keeps only display fields (no `plan_handles`), drops announcements whose `published_at` is in the future (scheduled), drops links and images that aren't `http(s)`, turns a `link_url` path such as `/settings` into a link to the organization's Cloud dashboard (`https://cloud.medusajs.com/<organizationId>/settings`, dropped when `organizationId` isn't set), keeps `admin_path` only for `admin` announcements (an empty one becomes `null`), and caches each response for 10 minutes with the Caching Module (`Modules.CACHING`) when it's registered, tagged `MedusaCloudAnnouncements` (`ANNOUNCEMENTS_CACHE_TAG`) so it can be cleared with `caching.clear({ tags })`. Without it, nothing is cached and every request hits the Cloud API. Cache read and write errors are logged as warnings and never fail the request. It has no data models or migrations.
- `src/admin/widgets/cloud-announcements.tsx`: widget in the `topbar` zone. Renders no button when there are no announcements. Its drawer lists every announcement, or shows one announcement's details (`src/admin/components/announcement-details.tsx`) when opened from a toast or a list item with `content`. Read state and the IDs of toasted announcements are stored per browser in `localStorage` (`src/admin/lib/storage.ts`).
- `src/admin/hooks/announcement-toasts.tsx` (`useAnnouncementToasts`, called from the widget): when a page opens, shows one announcement as a toast. `getAnnouncementForPath` (`src/admin/lib/announcements.ts`) picks it the same way for every type:
  - An announcement whose `admin_path` matches the page exactly (trailing slashes ignored) wins.
  - Otherwise, the newest one without an `admin_path`, which can be shown on any page. Every type other than `admin` has none.
  - Each announcement is shown once per browser.
- `src/admin/lib/toast.tsx` (`showAnnouncementToast`): shows an announcement as a top-right toast with a sparkles icon (orange for `warning` and `incident`, purple otherwise) and the image, if any. They stay until dismissed. The action is "View details" (opens the details drawer) when the announcement has `content`, or else "Learn more" (opens `link_url` in a new tab).
- `src/admin/lib/sdk.ts`: JS SDK client configured from the admin build globals `__BACKEND_URL__`, `__AUTH_TYPE__`, `__JWT_TOKEN_STORAGE_KEY__` (declared in `src/admin/vite-env.d.ts`).
- `src/index.ts` and `index.d.ts` are intentional no-ops for the TypeScript compiler.

## Development

```bash
yarn build:plugin          # medusa plugin:build -> .medusa/server (the only published dir)
yarn dev                   # medusa plugin:develop (watch + publish to local registry)
yarn test                  # jest unit tests under src/**/__tests__
```

- HTTP integration tests for `GET /admin/cloud/announcements` live in `integration-tests/http/__tests__/cloud/admin/announcements.spec.ts`. `integration-tests/http/medusa-config.js` registers the plugin with `apiUrl: "http://cloud-api.test"`, and the spec mocks `global.fetch` for that URL. They run against the built plugin, so run `yarn build:plugin` first.

- To try it locally, set `EXECUTION_CONTEXT=medusa-cloud` in a test project, or list the plugin in its `medusa-config.ts`.
- The Cloud API source lives in the private platform repository (`apps/backend/src/api/v1/announcements`).

## Gotchas

- Don't add `@medusajs/medusa` as a dependency: it already depends on this package.
- `tsconfig.json` excludes `src/admin`; admin code is type-checked with `src/admin/tsconfig.json` and bundled by `plugin:build`.
- `content` is HTML authored in the Cloud admin and forwarded as is. Always render it through `sanitizeHtml` (`src/admin/lib/sanitize.ts`, DOMPurify), never directly.
- `admin` announcements need a platform that has renamed the `hint` type to `admin`. A `hint` from an older platform is treated as an unknown type: shown on any page, without its `admin_path`.
- Medusa Cloud doesn't inject `MEDUSA_CLOUD_API_URL` or `MEDUSA_CLOUD_ORGANIZATION_ID` yet, so by default the plugin uses the production API and shows only announcements visible to all plans.
