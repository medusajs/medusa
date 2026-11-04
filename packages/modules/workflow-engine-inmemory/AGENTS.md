# @medusajs/workflow-engine-inmemory

Default Workflow Engine Module: orchestrates workflow executions, keeping in-flight checkpoints in a process-local object and persisting executions to the `workflow_execution` table when needed. Registered as `Modules.WORKFLOW_ENGINE` (`"workflows"`). For production or multiple instances use `@medusajs/workflow-engine-redis`.

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/workflow-engine-inmemory`). No module options.
- Workflows run through `workflow(container).run()` from `@medusajs/framework/workflows-sdk` use the registered engine. Resolve the engine directly to drive long-running workflows:

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

Generated CRUD for `WorkflowExecution`, plus `run`, `getRunningTransaction`, `setStepSuccess`, `setStepFailure`, `retryStep`, `cancel`, `subscribe`, `unsubscribe`. `listWorkflowExecutions` / `listAndCountWorkflowExecutions` accept a `q` filter (ILIKE on `transaction_id`, `workflow_id`, `state`, `execution.runId`).

### Data model (`src/models/workflow-execution.ts`)

- `WorkflowExecution` (`wf_exec_`): composite primary key `(workflow_id, transaction_id, run_id)`, `execution` and `context` JSON, `state` (`TransactionState`), `retention_time` (seconds). Kept identical to the Redis engine's model.
- No module links and no module events.

Docs: https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine.md, https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine/in-memory.md, https://docs.medusajs.com/learn/fundamentals/workflows/long-running-workflow.md, https://docs.medusajs.com/learn/fundamentals/workflows/store-executions.md

## Architecture

- `src/services/workflow-orchestrator.ts` (`WorkflowOrchestratorService`): runs exported workflows, notifies subscribers (static, process-wide map), and resumes parent workflows of async sub-workflows.
- `src/utils/workflow-orchestrator-storage.ts` (`InMemoryDistributedTransactionStorage`, registered by `src/loaders/utils.ts`): checkpoints, retries, step/transaction timeouts, and scheduled jobs (`cron` via `cron-parser` or `interval`) all use in-process `setTimeout` timers.
- DB writes happen only when the flow is not started, finished, waiting to compensate, async (`_v`), or a step at the current depth has `store: true`. Finished flows without `retentionTime` are deleted from the DB unless they are sub-workflows (`parentStepIdempotencyKey`).
- Every 30 minutes, finished executions (`done`, `failed`, `reverted`) older than their `retention_time` are deleted.
- This package and `workflow-engine-redis` share most of their service and orchestrator code; port behavior changes to both.

## Development

```bash
cd packages/modules/workflow-engine-inmemory
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__ (needs Postgres, DB_* env vars)
yarn test:integration integration-tests/__tests__/race.spec.ts
yarn migration:create           # after any change in src/models
```

- Integration tests: `index.spec.ts`, `race.spec.ts`, `retry-interval.spec.ts`, `subscribe.spec.ts`; workflow fixtures in `integration-tests/__fixtures__/`.

## Gotchas

- State, timers, and subscribers live in one process: retries, timeouts, and scheduled jobs are lost on restart and are not shared across instances.
- `save` throws `Transaction storage is locked` on concurrent saves for the same key, and `SkipExecutionError` when a manual (non `auto-`) `transactionId` is already running.
- `run` JSON-clones its options, so non-serializable values in `options` are dropped.
- Unlike the Redis engine, `run` copies `options.runId` into the workflow context.
