# @medusajs/event-bus-redis

Redis Event Bus Module (`Modules.EVENT_BUS`, container key `"event_bus"`). A BullMQ-backed `IEventBusModuleService` for production: events are queued in Redis and processed by worker-mode instances, with optional retries and priorities.

## Using this package

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.EVENTS_REDIS_URL,
        jobOptions: { attempts: 3, removeOnComplete: { age: 3600 } },
      },
    },
  ],
})
```

- Options (`EventBusRedisModuleOptions`, `src/types/index.ts`):
  - `redisUrl` (required), `redisOptions` (ioredis, spread over `{ maxRetriesPerRequest: null, enableReadyCheck: false, lazyConnect: true }`)
  - `queueName` (default `"events-queue"`), `queueOptions`, `workerOptions` (BullMQ, without `connection`)
  - `jobOptions`: defaults for every emitted job (BullMQ `JobsOptions`), overridable per `emit`.
- Used automatically on Medusa Cloud when `REDIS_URL` is set (with `workerOptions: { concurrency: 1 }`).
- Emit options (second arg of `emit`): BullMQ job options plus `internal` and `groupedEventsTTL` (seconds, default 600). Per-message `options` override both.
- Methods: `emit`, `subscribe` (supports `"*"`), `unsubscribe`, `releaseGroupedEvents`, `clearGroupedEvents(eventGroupId, { eventNames? })`, `addInterceptor`.
- No data models, links, or providers.
- Docs: https://docs.medusajs.com/resources/infrastructure-modules/event/redis.md, https://docs.medusajs.com/resources/infrastructure-modules/event.md

## Architecture

- `src/loaders/index.ts`: creates the ioredis connection and registers `eventBusRedisConnection`, `eventBusRedisQueueName`, `eventBusRedisQueueOptions`, `eventBusRedisWorkerOptions`, `eventBusRedisJobOptions`.
- `src/services/event-bus-redis.ts`:
  - One BullMQ `Queue` (prefix `RedisEventBusService`). A `Worker` is created only when the module's `worker_mode` is not `"server"`, and started (not awaited) in `onApplicationStart`.
  - Grouped events (`metadata.eventGroupId`) are `RPUSH`ed to `staging:<eventGroupId>` with a TTL, and moved to the queue on `releaseGroupedEvents`.
  - `worker_` runs all subscribers for the job's event plus `"*"`, records successful subscriber IDs in `completedSubscriberIds`, and on retry only re-runs the failed ones.
- Job defaults: `removeOnComplete: true`, `attempts: 1`, priority `EventPriority.DEFAULT` or `EventPriority.LOWEST` for `internal` events. Precedence: message options, then emit options, then `jobOptions`.

## Development

```bash
yarn build
yarn test                  # src/services/__tests__/event-bus.ts (mocked BullMQ)
yarn test:integration      # integration-tests/__tests__/index.spec.ts
```

## Gotchas

- Events are only queued if the emitting process has a subscriber for that name (or `"*"`). Subscribers are loaded in every worker mode for this reason, even though only worker/shared instances process jobs.
- With the default `attempts: 1`, failed subscribers are logged and never retried. Set `attempts` (and backoff) in `jobOptions` or per emit.
- Missing `redisUrl` throws at load time; a failed connection is only logged.
- Grouped events that are never released expire after `groupedEventsTTL` (600s default). Long-running workflows need a higher TTL.
- Priorities outside `1..EventPriority.LOWEST` are replaced with the default, with a warning.
- Event payloads are JSON-serialized into Redis; metadata dates are restored with `parseEventMetadataDates`, but `data` is not.
