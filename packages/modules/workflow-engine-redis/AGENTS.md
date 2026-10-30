# @medusajs/workflow-engine-redis

Production Workflow Engine Module: orchestrates workflow executions with checkpoints in Redis, BullMQ queues for retries, timeouts, scheduled jobs, and cleanup, and Redis pub/sub so subscribers on any instance get notified. Registered as `Modules.WORKFLOW_ENGINE` (`"workflows"`), replacing `@medusajs/workflow-engine-inmemory`.

## Using this package

- Not loaded by default for self-hosted apps. On Medusa Cloud, `defineConfig` registers it when `REDIS_URL` is set.
- All options sit under `redis` (`RedisWorkflowsOptions`, `src/types/index.ts`):

```ts
import { Modules } from "@medusajs/framework/utils"

module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          redisUrl: process.env.WE_REDIS_URL,
          workerOptions: { concurrency: 10 },
          jobWorkerOptions: { concurrency: 5 },
        },
      },
    },
  ],
})
```

- Options: `redisUrl` (required; `url` is deprecated), `redisOptions` (ioredis; `options` is deprecated), `queueName` (default `medusa-workflows`), `jobQueueName` (default `medusa-workflows-jobs`), shared `queueOptions` / `workerOptions`, per-queue `mainQueueOptions`, `mainWorkerOptions`, `jobQueueOptions`, `jobWorkerOptions`, `cleanerQueueOptions`, `cleanerWorkerOptions`, and `pubsub: { url, options }` for a separate pub/sub connection.
- Resolve with `container.resolve(Modules.WORKFLOW_ENGINE)`. Same public API as the in-memory engine: `run`, `getRunningTransaction`, `setStepSuccess`, `setStepFailure` (accepts `options.forcePermanentFailure`), `retryStep`, `cancel`, `subscribe`, `unsubscribe`, plus `listWorkflowExecutions` / `listAndCountWorkflowExecutions` with a `q` filter.

### Data model (`src/models/workflow-execution.ts`)

- `WorkflowExecution` (`wf_exec_`): composite primary key `(workflow_id, transaction_id, run_id)`, `execution` and `context` JSON, `state`, `retention_time`. Identical to the in-memory engine's model; both write the `workflow_execution` table.
- No module links and no module events.

Docs: https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine/redis.md, https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine.md, https://docs.medusajs.com/learn/fundamentals/workflows/long-running-workflow.md

## Architecture

- `src/loaders/redis.ts` opens four ioredis connections (main, worker with `maxRetriesPerRequest: null`, publisher, subscriber) and registers resolved per-queue options; `src/loaders/utils.ts` registers `RedisDistributedTransactionStorage`.
- `src/utils/workflow-orchestrator-storage.ts`:
  - main queue: `retry`, `step_timeout`, `transaction_timeout` jobs
  - job queue: scheduled workflows (BullMQ Job Schedulers with id `schedule_<workflowId>`, `cron` pattern or `interval`)
  - `workflows-cleaner` queue: deletes expired finished executions every 30 minutes
- Async flows (`_v`) take a 2-second `SET NX` lock on `<key>:lock` before saving; failure throws `Lock not acquired`.
- `src/services/workflow-orchestrator.ts` publishes notifications on a per-workflow channel so subscribers on other instances are notified.
- This package and `workflow-engine-inmemory` share most of their service and orchestrator code; port behavior changes to both.

## Development

```bash
cd packages/modules/workflow-engine-redis
yarn build
yarn test                       # src/loaders/__tests__, src/utils/__tests__
yarn test:integration           # needs Postgres (DB_* env vars) and Redis on localhost:6379
../../../node_modules/.bin/jest --forceExit integration-tests/__tests__/race.spec.ts  # single suite
yarn migration:create           # after any change in src/models
```

- Integration tests: `index.spec.ts`, `race.spec.ts`, `retry-interval.spec.ts`, run one after another by `test:integration` (extra args only reach the last run, so call jest directly for a single file); fixtures in `integration-tests/__fixtures__/`. `integration-tests/utils/database.ts` deletes `bull:*` and `dtrx:*` keys in Redis at `REDIS_URL` (default `redis://localhost:6379`), and `index.spec.ts` hardcodes `redisUrl: "localhost:6379"`.

## Gotchas

- Workers, the job queue, and the cleaner queue only exist when `worker_mode` is not `"server"`. On a server-only instance, retries and timeouts are enqueued but processed elsewhere, and `schedule()` is a no-op (`jobQueue` is undefined).
- The loader throws when no `redisUrl` / `url` is set, but connection errors are only logged.
- Shutdown: workers close in `onApplicationPrepareShutdown` (waits for running jobs), queues and Redis connections close in `onApplicationShutdown`.
- On start it removes every repeatable job and Job Scheduler on the main queue (pre-2.6 versions scheduled jobs there) and every one except `clear-expired-executions` on the cleaner queue, plus their pending `repeat:*` runs. Keys and delayed job ids are read from the `repeat` and `delayed` sorted sets because BullMQ v6's `getJobSchedulers` throws on repeatable jobs written by older BullMQ versions; when nothing needs removing this costs one `ZRANGE` per queue. Legacy `schedule_<id>` entries on the job queue are taken over by `upsertJobScheduler`.
- BullMQ rejects custom job ids containing `:`, so retry and timeout job ids use `|` (`retry|<workflowId>|<transactionId>|...`). Clearing a job also looks up the legacy `:` id for jobs enqueued by older versions.
- Interval schedules and the cleaner pass `startDate` set to the next interval boundary: Job Schedulers would otherwise run `every` jobs immediately on creation.
- Unlike the in-memory engine, `run` does not copy `options.runId` into the workflow context.
