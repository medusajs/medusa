# @medusajs/workflow-engine

The runtime behind Medusa workflows: it executes compiled step graphs with retries, timeouts, async steps, compensation, schedules and child runs, and keeps all run state in a store (Postgres in applications, in memory for development and tests). It has no Medusa dependencies. `@medusajs/workflows-sdk` compiles `createWorkflow`/`createStep` code into its definitions, and the Workflow Engine Module (`@medusajs/workflows`) connects it to Medusa. See `ARCHITECTURE.md` for how the parts fit together.

## Using this package

Application code should not use this package directly; use `@medusajs/framework/workflows-sdk` to define workflows and the Workflow Engine Module (`Modules.WORKFLOW_ENGINE`) to run and control them. The step options set with `createStep({ name, ...options }, fn)` or `.config({ ... })` map to `StepOptions` here (`maxRetries`, `retryIntervalMs`, `autoRetry`, `timeoutMs`, `async`, `nested`, `continueOnPermanentFailure`, `skipOnPermanentFailure`, `saveResponse`), and workflow options to `WorkflowOptions` (`timeoutMs`, `retentionTimeMs`, `idempotent`, `store`, `durability`, `schedule`).

Docs: https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine.md, https://docs.medusajs.com/learn/fundamentals/workflows.md

## Architecture

- `src/definition/`: `defineWorkflow` and the compiler that turns a definition into a `CompiledWorkflow` with a stable hash; `registry.ts` holds the compiled workflows an instance knows.
- `src/engine/`: `createEngine` / `Engine` (start, resume, complete or fail a step, retry, cancel, find runs), run handles, and the timer handler.
- `src/runtime/`: the `Executor` that drives one run (ready steps, retries, compensation, checkpoints), the run state, the step invoker, the run scope (`AsyncLocalStorage`), and the extension hooks in `middleware.ts`.
- `src/store/`: the `Store` interface, `PostgresStore` (`src/store/postgres/`, one statement per write, fenced by the lease token), `MemoryStore`, and the conformance suite both stores must pass (`src/store/conformance/`).
- `src/scheduling/`: the `Dispatcher` that claims due timers and schedules, timer helpers, and cron parsing.
- `src/recovery/`: heartbeats, the reaper (one elected instance resumes runs of dead instances) and other periodic tasks.
- `src/outbox/`: stages grouped events with the runs that emit them and publishes them when the root run succeeds.
- `src/signals/`: the `Notifier` interface and the Redis and in-process notifiers.

## Development

```bash
yarn build
yarn test                       # unit tests, src/**/__tests__
yarn test:integration           # Postgres and Redis tests in integration-tests/__tests__
yarn test src/__tests__/lifecycle.spec.ts
```

- Integration tests need Postgres (`DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`) and Redis (`REDIS_URL`, default `redis://localhost:6379`). `postgres-conformance.spec.ts` runs the store conformance suite against Postgres, `multi-process.spec.ts` runs several engines on one database.
- A change to the store contract needs a conformance test, so both stores are held to it.

## Gotchas

- A run only executes on an instance whose compiled definition has the same hash. After a deploy, runs of a changed workflow wait for an instance with the new definition, and fail as interrupted if steps they already ran no longer exist.
- Every write that needs a run's lease is a single statement conditioned on the lease token; an instance that lost a run cannot overwrite it, but steps it already started may run again elsewhere. Steps must be idempotent.
- Leases stay held while their owner heartbeats; without recovery (the memory store), they last 24 hours.
- Grouped events of a stored run are written with the commit that records the step that emitted them; events of async steps are written immediately because their outcome is written separately.
