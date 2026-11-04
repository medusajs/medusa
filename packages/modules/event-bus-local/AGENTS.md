# @medusajs/event-bus-local

Local Event Bus Module (`Modules.EVENT_BUS`, container key `"event_bus"`). An in-process `EventEmitter` implementation of `IEventBusModuleService` for development; the default event bus registered by `defineConfig` for non-Cloud projects.

## Using this package

- Registered by default as `@medusajs/medusa/event-bus-local` (`MODULE_PACKAGE_NAMES[Modules.EVENT_BUS]`). No module options. Swap it for `@medusajs/medusa/event-bus-redis` in production.
- Apps rarely call it directly: emit events from workflows with `emitEventStep` and handle them with subscribers in `src/subscribers`. Direct use:

```ts
const eventBus = container.resolve(Modules.EVENT_BUS)

await eventBus.emit({ name: "brand.created", data: { id: brand.id } })
await eventBus.emit({ name: "digest.ready", data: {} }, { delay: 5000 }) // ms
```

- Methods: `emit(message | message[], options?)`, `subscribe(event, subscriber, context?)` (supports `"*"`), `unsubscribe`, `releaseGroupedEvents(eventGroupId)`, `clearGroupedEvents(eventGroupId, { eventNames? })`, plus `addInterceptor` from `AbstractEventBusModuleService`.
- No data models, events of its own, links, or providers.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/event/local.md, https://docs.medusajs.com/resources/infrastructure-modules/event.md

## Architecture

- `src/services/event-bus-local.ts` extends `AbstractEventBusModuleService` (`@medusajs/framework/utils`), which keeps the subscriber registry and interceptors.
- Messages with `metadata.eventGroupId` are staged in an in-memory map and only emitted on `releaseGroupedEvents`; workflows use this to emit after the transaction succeeds.
- Each emit runs asynchronously after the optional `options.delay` (ms); `emit` resolves before subscribers run.
- `src/loaders/index.ts` only logs "Local Event Bus installed. This is not recommended for production."

## Development

```bash
yarn build
yarn test                  # src/services/__tests__
yarn test:integration      # integration-tests/__tests__/index.spec.ts
yarn test:integration -t "<test name>"
```

## Gotchas

- The `EventEmitter` is a module-level singleton shared by every instance in the process, and events never leave the process: no delivery to other server/worker instances, no persistence, no retries.
- Subscriber errors are caught and logged, never rethrown or retried.
- `"*"` listeners are counted at emit time: a `"*"` subscriber added after `emit` (during a delay) won't receive that event.
- Grouped events are JSON round-tripped on release, so non-JSON data (Dates, class instances) in `data` is serialized. Only `metadata` dates are restored.
- Messages with `options.internal` (e.g. module mutation events) are not logged as "Processing ...".
