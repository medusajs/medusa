# @medusajs/workflows

The Workflow Engine Module: runs Medusa workflows on `@medusajs/workflow-engine` and connects the engine to Medusa (container, context, grouped events, the admin's execution view). Registered by default as `Modules.WORKFLOW_ENGINE` (`"workflows"`). It replaces `@medusajs/workflow-engine-inmemory` and `@medusajs/workflow-engine-redis`; `defineConfig` swaps either for this module and logs a warning.

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/workflows`). Options (`src/types/index.ts`): `store` (`"postgres"` when a database connection exists, else `"memory"`), `notifier` (`{ type: "redis", url }`), `pollIntervalMs`, `recovery`, `maxConcurrentRuns`, `shutdownGraceMs`, `instanceId`.
- Workflows must be registered before they can run. The framework registers those exported from `src/workflows` of the app and its plugins, and core flows; others need `registerWorkflows([workflow])`.
- Resolve the module to drive long-running workflows:

```ts
import { Modules, TransactionHandlerType } from "@medusajs/framework/utils"
import { StepResponse } from "@medusajs/framework/workflows-sdk"

const workflowEngineService = container.resolve(Modules.WORKFLOW_ENGINE)

await workflowEngineService.setStepSuccess({
  idempotencyKey: {
    action: TransactionHandlerType.INVOKE,
    transactionId,
    stepId: "step-2",
    workflowId: "hello-world",
  },
  stepResponse: new StepResponse("Done!"),
})
```

### Service methods (`src/services/workflows-module.ts`)

`run`, `getRunningTransaction`, `setStepSuccess`, `setStepFailure`, `retryStep`, `cancel`, `subscribe`, `unsubscribe`, `registerWorkflows`, `unregisterWorkflows`, `listRegisteredWorkflows`, and `listWorkflowExecutions` / `listAndCountWorkflowExecutions` / `retrieveWorkflowExecution`, which return runs in the shape of the old `workflow_execution` rows.

### Data models (`src/models/`)

- The engine's tables: `workflow_run`, `workflow_step`, `workflow_timer`, `workflow_schedule`, `workflow_worker`, `workflow_outbox`.
- `workflow_execution` (`src/models/workflow-execution.ts`) has no table: it is the shape executions are listed and queried in, mapped from the run tables. It is not exported from `src/models`, so no migration creates it.
- On start, the module warns about unfinished executions left in the old engines' `workflow_execution` table (`src/legacy/check-legacy-executions.ts`).
- No module links and no module events.

Docs: https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine.md, https://docs.medusajs.com/learn/fundamentals/workflows/long-running-workflow.md, https://docs.medusajs.com/learn/fundamentals/workflows/store-executions.md

## Architecture

- `src/loaders/engine.ts`: creates the engine with the Postgres or memory store, the Redis notifier, recovery, and the outbox.
- `src/adapters/`: maps between the module's API and the engine (run options, results and errors, step calls, execution DTOs).
- `src/legacy/transaction-view.ts`: presents an engine run as the transaction shape the module API and the admin expect.
- `src/events/`: routes grouped events from the event bus to the engine's outbox, and releases groups of runs that are not stored.
- `src/middleware/`: gives module services resolved inside a step the run's context, and traces runs and steps.

## Development

```bash
cd packages/modules/workflows
yarn build
yarn test                       # unit tests, src/**/__tests__
yarn test:integration           # integration-tests/__tests__, once on Postgres, once with WORKFLOWS_TEST_STORE=memory
yarn migration:create           # after any change in src/models
```

- Integration tests need Postgres (`DB_*` env vars). Fixtures in `integration-tests/__fixtures__/` export their workflows, and each spec registers the ones it runs.

## Gotchas

- A workflow that is not registered cannot run: `run` throws a not-found error naming the workflow.
- `store: "memory"` is for a single instance: runs are lost on restart, there is no crash recovery, and instances do not share work. The module ignores `notifier` and `recovery` with it.
- Grouped events are staged with the run and published only when the root run succeeds; a run started from a step gets its own event group unless the caller passes the parent's.
