# @medusajs/orchestration

The low-level transaction engine behind Medusa workflows: it executes a tree of steps with invoke/compensate handlers, retries, timeouts, async (long-running) steps, and checkpointing to a pluggable storage. `@medusajs/workflows-sdk` (`createWorkflow`/`createStep`) compiles workflows into this format, and the workflow engine modules provide the persistent storage.

## Using this package

Application code should not build transactions with this package; use `@medusajs/framework/workflows-sdk`. The step options you set via `createStep({ name, ...options }, fn)` or `myStep(input).config({ ... })` map to `TransactionStepsDefinition` here:

- `maxRetries` (default 0), `retryInterval` (seconds), `autoRetry` (default `true`)
- `timeout` (seconds; marks the step `TIMEOUT` but does not abort the running handler)
- `async` (step completes only via `setStepSuccess`/`setStepFailure`), `backgroundExecution` (async step that completes on its own), `compensateAsync`
- `continueOnPermanentFailure`, `skipOnPermanentFailure` (`true` or a step name to resume from), `noCompensation`, `saveResponse`

Workflow-level options (`TransactionModelOptions`): `timeout`, `store`, `retentionTime`, `idempotent`, `schedule` (cron string, or `SchedulerOptions`: `cron` or `interval` in ms, plus `concurrency` (`"allow" | "forbid"`, default forbid) and `numberOfExecutions`).

Things you may import from `@medusajs/framework/orchestration`: `TransactionState`, `TransactionStepStatus`, `TransactionHandlerType`, `SchedulerOptions`, `PermanentStepFailureError`, `SkipStepResponse`, and `TransactionOrchestrator` (only for its static `traceTransaction`/`traceStep` instrumentation hooks).

Docs: https://docs.medusajs.com/learn/fundamentals/workflows.md, https://docs.medusajs.com/learn/fundamentals/workflows/retry-failed-steps.md, https://docs.medusajs.com/learn/fundamentals/workflows/long-running-workflow.md, https://docs.medusajs.com/learn/fundamentals/workflows/workflow-timeout.md, https://docs.medusajs.com/learn/fundamentals/workflows/store-executions.md

## Architecture

- `src/transaction/transaction-orchestrator.ts`: `TransactionOrchestrator` walks the step tree (`buildSteps`), invokes handlers, moves steps through states, triggers compensation in reverse, and handles retries/timeouts.
- `src/transaction/distributed-transaction.ts`: `DistributedTransaction` holds a run's flow, context, and errors, and saves `TransactionCheckpoint`s through the static storage (`setStorage`).
- `src/transaction/datastore/abstract-storage.ts`: `IDistributedTransactionStorage` (`get`, `save`, `scheduleRetry`, `scheduleTransactionTimeout`, `scheduleStepTimeout`, `clearExpiredExecutions`, ...) and the in-memory default. `packages/modules/workflow-engine-inmemory` and `workflow-engine-redis` call `setStorage` with their own implementations.
- `src/transaction/orchestrator-builder.ts`: `OrchestratorBuilder` for composing step trees programmatically.
- `src/workflow/workflow-manager.ts`: `WorkflowManager` global registry (`register`, `update`, `getWorkflow`). `local-workflow.ts`: `LocalWorkflow` runs a registered workflow (`run`, `cancel`, `retryStep`, `registerStepSuccess`, `registerStepFailure`). `scheduler.ts`: `WorkflowScheduler` for scheduled workflows.
- `src/transaction/errors.ts`: control-flow errors (`PermanentStepFailureError`, `SkipStepResponse`, `TransactionStepTimeoutError`, `TransactionTimeoutError`, `NonSerializableCheckPointError`, `SkipExecutionError`, ...).

## Development

```bash
yarn build
yarn test                                   # jest --bail --forceExit
yarn test src/__tests__/transaction/transaction-orchestrator.ts
```

- Tests live in `src/__tests__/transaction/` and `src/__tests__/workflow/` (plain `.ts` files, picked up by jest's `__tests__` match). Several use real `setTimeout` waits, so keep them targeted.
- Behavior changes here surface through `packages/core/workflows-sdk` tests and the workflow engine modules' integration tests; run those too.

## Gotchas

- `DistributedTransaction`, `WorkflowManager`, and `WorkflowScheduler` are stored on `global` (`global.X ??= X`) so duplicate package copies share state; storage set by a workflow engine module applies process-wide.
- Checkpointing (`store`) is forced on when any step has `timeout`, `retryInterval`/`retryIntervalAwaiting`, or `async`, or the workflow has `timeout`, `idempotent`, or `retentionTime` (`parseFlowOptions`).
- The context is `JSON.stringify`-ed on every checkpoint; non-serializable workflow input or step output throws `NonSerializableCheckPointError` (errors are sanitized instead of throwing).
- Re-registering a workflow id with a different step definition throws `Workflow with id "<id>" and step definition already exists.` (step `uuid`s are ignored in the comparison).
- Step `timeout` is not an execution timeout: the handler keeps running, and the workflow reverts once the response arrives.
