# @medusajs/cloud

An official Medusa plugin that adds Medusa Cloud features to the Medusa Admin of every Medusa project, on Medusa Cloud or self-hosted. It currently shows in-app announcements fetched from the Medusa Cloud API: a "What's new" button in the admin topbar that opens a drawer of announcements, and a card at the bottom of the admin sidebar, above Settings, that shows new announcements until they're dismissed. The announcement categories shown to the team are chosen in Settings > Announcements. Announcements of type `admin` can target an admin page through `admin_path`, such as what users can ask an AI tool connected to the Medusa MCP server on the Orders page. Announcements are authored in the Medusa Cloud admin, so they change without a plugin release. It's the place for future Cloud-only admin features, such as feature promotions.

## Using this package

- Nothing to install or configure. `@medusajs/medusa` depends on it, and `defineConfig` (`packages/core/utils/src/common/define-config.ts`) adds it to `plugins` of every project.
- `defineConfig` fills the options from environment variables, which are only set on Medusa Cloud. To override them, list the plugin yourself in `medusa-config.ts`; user entries replace the default by `resolve` key:

```ts
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@medusajs/cloud",
      options: {
        apiUrl: "https://api.prod.medusajs.cloud",
        organizationId: "org_123",
        disabled: false,
      },
    },
  ],
})
```

| Option | Env variable | Default | Description |
| --- | --- | --- | --- |
| `apiUrl` | `MEDUSA_CLOUD_API_URL` | `https://api.prod.medusajs.cloud` | Base URL of the Medusa Cloud API. |
| `organizationId` | `MEDUSA_CLOUD_ORGANIZATION_ID` | none | Sent as the `x-medusa-organization` header so the Cloud API also returns announcements targeted at the organization's plan. Without it, only announcements with no plan targeting are returned, and `link_url` paths lead to the Medusa Cloud sign-up page. |
| `apiKey` | `MEDUSA_CLOUD_API_KEY` (through `projectConfig.cloud.apiKey`) | none | The environment's Medusa Cloud API key, which Cloud injects for deployed projects. When set, announcements are fetched from `/v1/services/announcements` with `Authorization: Basic <apiKey>`, so the Cloud API filters announcements to the organization's plan. |
| `environmentHandle` | `MEDUSA_CLOUD_ENVIRONMENT_HANDLE` (through `projectConfig.cloud.environmentHandle`) | none | The handle of the project's Cloud environment, which Cloud injects for deployed projects. Sent as the `x-medusa-environment-handle` header. |
| `disabled` | none | `false` | When `true`, `defineConfig` leaves the plugin out of `plugins`, so nothing of it loads: no Cloud API calls, admin widgets, Settings > Announcements page, API routes, or module. |

- Plugin docs: https://docs.medusajs.com/learn/fundamentals/plugins.md

## Architecture

- `src/api/admin/cloud/announcements/route.ts`: `GET /admin/cloud/announcements`, authenticated like every `/admin` route. It resolves the Cloud module (`CLOUD_MODULE`), and calls `listAnnouncements()`. On failure it logs a warning and returns an empty list so the admin never breaks.
- `src/modules/cloud`: the `cloud` module, registered automatically like every plugin module, so its service gets the plugin options. `CloudModuleService` (`service.ts`) sends all requests to the Medusa Cloud API through `request_()`. `listAnnouncements()` fetches the latest 50 announcements of the enabled categories' types from the public `GET /v1/announcements`, or from `GET /v1/services/announcements` when `apiKey` is set (5s timeout). It keeps only display fields (no `plan_handles`), drops announcements whose `published_at` is in the future (scheduled), drops links and images that aren't `http(s)`, turns a `link_url` path such as `/settings` into a link to the organization's Cloud dashboard (`https://cloud.medusajs.com/<organizationId>/settings`, or the sign-up page (`CLOUD_SIGNUP_URL`, `https://cloud.medusajs.com/signup` with UTM parameters) when `organizationId` isn't set), keeps `admin_path` only for `admin` announcements (an empty one becomes `null`), and caches each response for 10 minutes with the Caching Module (`Modules.CACHING`) when it's registered, tagged `MedusaCloudAnnouncements` (`ANNOUNCEMENTS_CACHE_TAG`) so it can be cleared with `caching.clear({ tags })`. Without it, nothing is cached and every request hits the Cloud API. Cache read and write errors are logged as warnings and never fail the request.
- Announcement preferences: team-wide, shared by every admin user. They're stored in the `cloud` module's `CloudAnnouncementPreference` model (`src/modules/cloud/models/cloud-announcement-preference.ts`, table `cloud_announcement_preference`) as a single row with a boolean per category (`security`, `feature`, `cloud`). Every category is enabled until the row exists.
  - `listAnnouncements()` in the service reads the row and maps each enabled category to its types (`ANNOUNCEMENT_CATEGORY_TYPES`): `security` covers `security` and `incident`, `feature` covers `feature`, and `cloud` covers `cloud-feature` and `admin`. It sends them to the Cloud API as the `type[]` filter. With every category disabled, the Cloud API isn't called.
  - `src/api/admin/cloud/announcement-preferences/route.ts`: `GET` returns the preferences and `POST` updates the passed categories through `updateAnnouncementPreferencesWorkflow` (`src/workflows/update-announcement-preferences.ts`), which creates the row the first time. The body is validated in `src/api/middlewares.ts`.
  - `src/admin/routes/settings/announcements/page.tsx`: the Settings > Announcements page with a switch per category.
- RBAC: with the RBAC module installed, the admin routes are guarded by the `cloud_announcement` resource (`src/api/middlewares.ts`). `cloud_announcement:read` covers `GET /admin/cloud/announcements` and `GET /admin/cloud/announcement-preferences`, and `cloud_announcement:update` covers `POST /admin/cloud/announcement-preferences`. Without RBAC, `authorize` is a no-op.
  - `src/types/rbac.ts` declares the resource, and `src/migration-scripts/create-cloud-rbac-policies.ts` creates the two policies on `db:migrate` (skipped, and retried later, while RBAC isn't installed). It calls the RBAC module directly instead of `createRbacPoliciesWorkflow`, because the plugin can't depend on `@medusajs/medusa`.
  - In the admin, the widgets only fetch announcements with `cloud_announcement:read`, the settings page needs it to show, and its switches are disabled without `cloud_announcement:update`.
- `src/admin/widgets/cloud-announcements.tsx`: widget in the `topbar` zone. Renders no button when there are no announcements. Its drawer lists every announcement, or shows one announcement's details (`src/admin/components/announcement-details.tsx`) when opened from a list item with `content`. Read state is stored per browser in `localStorage` (`src/admin/lib/storage.ts`).
- `src/admin/widgets/cloud-announcement-card.tsx`: widget in the `sidebar.settings.before` zone, which the dashboard renders above the Settings item of the main sidebar. Shows one announcement as a card with its image, title, subtitle, and one action: "View details" (opens the details drawer) when the announcement has `content`, or else "Learn more" (opens `link_url` in a new tab). `getAnnouncementForPath` (`src/admin/lib/announcements.ts`) picks it the same way for every type:
  - An announcement whose `admin_path` matches the page exactly (trailing slashes ignored) wins.
  - Otherwise, the newest one without an `admin_path`, which can be shown on any page. Every type other than `admin` has none.
  - It stays until it's dismissed with the close button or Esc, or its action is used. The IDs of dismissed announcements are stored per browser in `localStorage`.
  - The first time the admin opens in a browser, the current date is stored in `localStorage` (`getAnnouncementsSince`). Announcements published on or before it never show in the card and aren't marked as new in the topbar drawer, so a new install isn't flooded with old announcements. The drawer still lists them.
  - After one is dismissed, the next matching announcement shows the next time a page opens, not right away.
- `src/admin/lib/sdk.ts`: JS SDK client configured from the admin build globals `__BACKEND_URL__`, `__AUTH_TYPE__`, `__JWT_TOKEN_STORAGE_KEY__` (declared in `src/admin/vite-env.d.ts`).
- `src/index.ts` and `index.d.ts` are intentional no-ops for the TypeScript compiler.

## Development

```bash
yarn build:plugin          # medusa plugin:build -> .medusa/server (the only published dir)
yarn dev                   # medusa plugin:develop (watch + publish to local registry)
yarn test                  # jest unit tests under src/**/__tests__
yarn medusa plugin:db:generate   # generate a migration after changing a model in src/modules/cloud/models
```

- HTTP integration tests for `/admin/cloud/announcements` and `/admin/cloud/announcement-preferences` live in `integration-tests/http/__tests__/cloud/admin/announcements.spec.ts`, and the RBAC ones in `rbac.spec.ts` next to it. `integration-tests/http/medusa-config.js` registers the plugin with `apiUrl: "http://cloud-api.test"`, and the spec mocks `global.fetch` for that URL. They run against the built plugin, so run `yarn build:plugin` first.

- The Cloud API source lives in the private platform repository (`apps/backend/src/api/v1/announcements`).

## Gotchas

- The `MedusaService` key of a model must match its table name in PascalCase (`CloudAnnouncementPreference` for `cloud_announcement_preference`), or `query.graph` fails with `Method "listCloudAnnouncementPreferences" does not exist on "cloud"`.
- Until the module's migration runs, `GET /admin/cloud/announcements` fails to read the preferences and returns an empty list.
- Don't add `@medusajs/medusa` as a dependency: it already depends on this package.
- `tsconfig.json` excludes `src/admin`; admin code is type-checked with `src/admin/tsconfig.json` and bundled by `plugin:build`.
- `content` is HTML authored in the Cloud admin and forwarded as is. Always render it through `sanitizeHtml` (`src/admin/lib/sanitize.ts`, DOMPurify), never directly.
- Announcement types are `cloud-feature` (the default when the Cloud API sends none), `feature`, `security`, `incident`, and `admin`. They must match the platform's `AnnouncementTypeSchema`.
- It runs on self-hosted projects too, where the backend calls the public Medusa Cloud API to fetch announcements. To turn it off, list the plugin in `medusa-config.ts` with `options: { disabled: true }`. `defineConfig` (`resolvePlugins`) then removes it from `plugins`, because admin widgets and UI routes can't be hidden at runtime. The plugin itself doesn't read `disabled`, so a config that isn't built with `defineConfig` still loads it.
- Listing the plugin in `medusa-config.ts` replaces the default entry, so on Cloud pass `apiUrl`, `organizationId`, `apiKey`, and `environmentHandle` again when overriding other options.
- Medusa Cloud doesn't inject `MEDUSA_CLOUD_API_URL` or `MEDUSA_CLOUD_ORGANIZATION_ID` yet, so by default the plugin uses the production API, and `link_url` paths lead to the sign-up page. Plan targeting relies on `apiKey`.
- `apiKey` is a secret: never log it or include it in a cache key or response.
