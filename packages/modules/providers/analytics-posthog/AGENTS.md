# @medusajs/analytics-posthog

Analytics Module provider that forwards `track`/`identify` calls to PostHog through `posthog-node`.

## Using this package

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/analytics-posthog",
            id: "posthog",
            options: {
              posthogEventsKey: process.env.POSTHOG_EVENTS_API_KEY,
              posthogHost: process.env.POSTHOG_HOST,
            },
          },
        ],
      },
    },
  ],
})
```

- Options (`PosthogAnalyticsServiceOptions`): `posthogEventsKey` (required, the project API key), `posthogHost` (defaults to `https://eu.i.posthog.com`).
- Resolve the module with `Modules.ANALYTICS` and call `track()` / `identify()`.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/analytics/posthog.md
- Build a custom analytics provider: https://docs.medusajs.com/resources/references/analytics/provider.md

## Architecture

- `src/services/posthog-analytics.ts`: `PosthogAnalyticsService extends AbstractAnalyticsProviderService`, `static identifier = "analytics-posthog"`.
- Implements `track` (maps to `client.capture`), `identify` (maps to `client.identify`, or `client.groupIdentify` when the input has a `group`), and `shutdown` (flushes the PostHog client; called by the Analytics Module on shutdown).
- Good reference for a custom analytics provider that needs a `shutdown()` flush.

## Development

- `yarn build`, `yarn test` (no tests in this package).

## Gotchas

- The constructor throws if `posthogEventsKey` is missing, so a missing env var fails at boot.
- The default host is the EU cloud; set `posthogHost` (e.g. `https://us.i.posthog.com`) for US projects.
- `track` throws without `event` or `actor_id`, and throws if `group.id` is passed without `group.type`.
- `identify` throws when neither `actor_id` nor `group` is given.
- `track`/`identify` don't await delivery (`posthog-node` queues them); `shutdown()` flushes the queue, so short-lived scripts must let the module shut down cleanly.
- Exactly one Analytics provider may be registered.
