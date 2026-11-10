# @medusajs/analytics

Analytics Module (`Modules.ANALYTICS`). A thin, provider-based facade that forwards `track` / `identify` calls to exactly one Analytics Module Provider (Local, PostHog, or custom). It has no data models and is not registered by default.

## Using this package

- Install path consumers use: `@medusajs/medusa/analytics` (re-export of this package). Providers: `@medusajs/medusa/analytics-local`, `@medusajs/medusa/analytics-posthog`.
- Register in `medusa-config.ts` (not part of `defineConfig` defaults):

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/analytics-local",
            id: "local",
          },
        ],
      },
    },
  ],
})
```

- Module options (`AnalyticsModuleOptions` in `src/types/index.ts`): `providers: { resolve, id, options? }[]`. `options` is passed as the provider constructor's second argument.
- Resolve and use (typically inside a workflow step):

```ts
const analytics = container.resolve(Modules.ANALYTICS)

await analytics.track({
  event: "order_placed",
  actor_id: order.customer_id,
  properties: { order_id: order.id },
})

await analytics.identify({ actor_id: customer.id, properties: { email } })
// or group identify:
await analytics.identify({ group: { type: "company", id }, properties })
```

- Service methods (`src/services/analytics-service.ts`): `track(data)`, `identify(data)`, `getProvider()` (returns the internal provider service). No generated CRUD methods, no events emitted, no module links.
- Custom providers extend `AbstractAnalyticsProviderService` from `@medusajs/framework/utils` and implement `track`, `identify`, and optionally `shutdown`.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/analytics.md, https://docs.medusajs.com/resources/infrastructure-modules/analytics/local.md, https://docs.medusajs.com/resources/infrastructure-modules/analytics/posthog.md

## Architecture

- `src/index.ts`: `Module(Modules.ANALYTICS, { service: AnalyticsService, loaders: [loadProviders] })`.
- `src/loaders/providers.ts`: registers each provider in the module container as `aly_<identifier>_<id>` (via `ProviderService.getRegistrationIdentifier`) and appends the key to `analytics_providers_identifier`.
- `src/services/provider-service.ts` (`AnalyticsProviderService`): picks up the single container key starting with `aly_` and delegates to it.
- `src/services/analytics-service.ts`: wraps provider errors in `MedusaError(UNEXPECTED_STATE, "Error tracking event for <event>: ...")` / `"Error identifying event for <id>: ..."`.
- `src/types/index.ts` augments `ModuleOptions` for both `@medusajs/analytics` and `@medusajs/medusa/analytics`.

## Development

```bash
yarn build
yarn test                 # unit tests under src (none currently)
yarn test:integration     # integration-tests/__tests__/module.spec.ts
yarn test:integration -t "<test name>"
```

- Integration tests use `moduleIntegrationTestRunner` with a fixture provider in `integration-tests/__fixtures__/providers/default-provider.ts`, spied with `jest.spyOn`.
- No models, so there is no `migration:create` script and no migrations.

## Gotchas

- Exactly one provider is required: `AnalyticsProviderService` throws `INVALID_DATA` ("Analytics module should be initialized with exactly one provider") with zero or more than one. There is no `is_default` / per-call provider selection.
- Provider shutdown runs through the service's `__hooks.onApplicationShutdown`, calling the provider's optional `shutdown()` (used by PostHog to flush).
- Provider classes must define a static `identifier`; the registration key is built from it (`aly_<identifier>_<id>`) and nothing validates it is set.
