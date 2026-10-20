# Medusa Workflow Engine: How the Current Implementation Works

Research basis for the workflow engine rewrite. All paths are relative to the repository root (`/Users/sradevski/Code/medusa/medusa`). Line numbers refer to the `develop` checkout at commit `c522ce6c07`.

Some behaviors were verified with small experiment scripts that ran the compiled `dist` of `@medusajs/workflows-sdk` and `@medusajs/orchestration`. These are marked **[verified]**.

---

## Table of contents

0. [Executive summary](#0-executive-summary)
1. [Architecture overview](#1-architecture-overview)
2. [Execution model in detail](#2-execution-model-in-detail)
3. [Persistence and distribution](#3-persistence--distribution)
4. [Public API surface that must stay backwards compatible](#4-public-api-surface-that-must-stay-backwards-compatible)
5. [Feature inventory](#5-feature-inventory)
6. [Known limitations, complexity hotspots, performance and reliability issues](#6-known-limitations-complexity-hotspots-performance-and-reliability-issues)
7. [GitHub issues and PR history](#7-github-issues-and-pr-history)
8. [Backwards-compatibility risks](#8-backwards-compatibility-risks)
9. [Appendix: core-flows and platform usage inventory](#9-appendix-core-flows-and-platform-usage-inventory)

---

## 0. Executive summary

- **Three layers.**
  1. The **workflows SDK** (`packages/core/workflows-sdk`) is a build-time DSL. `createWorkflow` runs the composer function **once, at module load**, against proxy placeholders. That run records a tree of step definitions (`TransactionStepsDefinition`) plus a map of step handlers, and registers both in a process-global `WorkflowManager`.
  2. The **orchestration** package (`packages/core/orchestration`) holds a generic saga engine. `TransactionOrchestrator` drives a `DistributedTransaction` over a tree-shaped flow and persists checkpoints through a static, swappable `IDistributedTransactionStorage`.
  3. The **workflow engine modules** (`workflow-engine-inmemory`, `workflow-engine-redis`) are that storage. They also provide scheduling, retry and timeout timers, a subscription and pub/sub fan-out, the `workflow_execution` Postgres table, and the `IWorkflowEngineService` module API.
- **Steps form a tree, not a DAG.** Step identity is the dot-joined path from the root (`_root.a.b.c`). Parallel branches come from `next: []` arrays. After a `parallelize(...)`, the next step is attached under the **last** branch, and a sibling barrier makes it wait for all branches.
- **Steps exchange data through a single `TransactionContext`** (`payload`, `invoke[stepName]`, `compensate[stepName]`). It is persisted in full on every stored checkpoint. Inputs are resolved lazily per step by walking proxy references (`resolveValue`). `transform` results are **not** persisted. They are cached only in memory, per transaction instance, and are recomputed in some cases **[verified]**.
- **Persistence is opt-in.** A workflow is persisted only if it has `store`, `retentionTime`, `idempotent`, `timeout`, an async step, a step `timeout`, or a step `retryInterval`. Plain sync workflows never touch storage (`transaction-orchestrator.ts:1506-1539`).
- **When a workflow is persisted, it is checkpointed many times.** A 2-step stored workflow performs 7 saves **[verified]**. Each save re-serializes the whole flow and context, and with Redis it does a Redis GET and SET plus a conditional Postgres upsert.
- **Distribution in the Redis engine uses BullMQ jobs** (retry, step timeout, transaction timeout, scheduled job, cleaner) to resume work on any worker. Optimistic merging of checkpoints with version counters (`_v`), a 2-second Redis `SET NX` lock, and "skip" exceptions used as control flow resolve concurrent writes. The in-memory engine uses `setTimeout` and per-process maps, but still persists to Postgres.
- **Two quadratic costs dominate.** Engine overhead grows super-linearly with step count. A 200-step sequential workflow costs about 650 ms of pure engine overhead per run, and 93% of that time is spent in `getPreviousStep` string splitting. The flow JSON is 650 KB because step ids are full paths **[verified]**.
- **Backwards compatibility hinges on a few things.** The `createWorkflow`/`createStep` DSL and all its config flags must keep working. So must the exported-workflow runner API (`wf(container).run/registerStepSuccess/registerStepFailure/cancel/retryStep`) and the `IWorkflowEngineService` methods. Step idempotency key format `workflowId:transactionId:stepName:invoke|compensate`, the `workflow_execution` table and HTTP API shape, hook semantics, eventGroupId propagation, and the `transactionId` reuse and idempotency semantics must also be preserved.

---

## 1. Architecture overview

### 1.1 Layer diagram

```
User code / core-flows
  createWorkflow, createStep, StepResponse, WorkflowResponse, transform, when, parallelize, createHook, runAsStep
      |
      v   (composition at import time, proxies record a graph)
@medusajs/workflows-sdk
  - composer: create-workflow.ts, create-step.ts, transform.ts, when.ts, parallelize.ts, create-hook.ts
  - helpers: proxy.ts (proxify), resolve-value.ts, create-step-handler.ts, step-response.ts
  - exportWorkflow (helper/workflow-export.ts): wraps LocalWorkflow into run/registerStepSuccess/...
  - MedusaWorkflow registry (medusa-workflow.ts)
      |
      v
@medusajs/orchestration
  - WorkflowManager (global registry of flow definition + handlers + orchestrator per workflow id)
  - LocalWorkflow (per-execution wrapper: container contextualization, event listeners, flow customization)
  - TransactionOrchestrator (saga engine) + DistributedTransaction (state + checkpoint) + TransactionStep
  - OrchestratorBuilder (tree builder used by composer)
  - IDistributedTransactionStorage / IDistributedSchedulerStorage (static, swappable)
  - WorkflowScheduler (static scheduler facade)
      |
      v   (DistributedTransaction.setStorage / WorkflowScheduler.setStorage at module construction)
Workflow engine module (Modules.WORKFLOW_ENGINE)
  - workflow-engine-inmemory: InMemoryDistributedTransactionStorage (Map + setTimeout + Postgres)
  - workflow-engine-redis:    RedisDistributedTransactionStorage (Redis keys + BullMQ queues + Postgres)
  - WorkflowOrchestratorService (run/cancel/setStepSuccess/... + subscribers + parent-step triggering)
  - WorkflowsModuleService (IWorkflowEngineService, MedusaService over WorkflowExecution model)
      |
      v
Postgres table workflow_execution (+ Redis keys "dtrx:<workflowId>:<transactionId>" in redis engine)
```

### 1.2 Global singletons

Many global registries exist and are pinned on `global` so that duplicated package copies share them:

| Global | Defined at | Holds |
|---|---|---|
| `global.WorkflowManager` | `packages/core/orchestration/src/workflow/workflow-manager.ts:230-233` | `Map<workflowId, WorkflowDefinition>` (flow, handlers, orchestrator, options) |
| `global.WorkflowScheduler` | `packages/core/orchestration/src/workflow/scheduler.ts:43-47` | static scheduler storage |
| `global.DistributedTransaction` | `packages/core/orchestration/src/transaction/distributed-transaction.ts:754-765` | static `keyValueStore` (default `BaseInMemoryDistributedTransactionStorage`) |
| `global.MedusaWorkflow` | `packages/core/workflows-sdk/src/medusa-workflow.ts:34-37` | `workflowId -> exportedWorkflow` factory |
| `TransactionOrchestrator.workflowOptions` (static) | `transaction-orchestrator.ts:86-92` | parsed options per model id (`store` forced on, feature flags) |
| `global[SymbolMedusaWorkflowComposerContext]` | `create-workflow.ts:33, 159, 172` | the composition context while a composer function runs |
| `global[SymbolMedusaWorkflowComposerCondition]` | `when.ts:49, 105` | the active `when` block (only one at a time, so nested `when` is impossible) |
| `WorkflowOrchestratorService.subscribers` (static) | `workflow-engine-*/src/services/workflow-orchestrator.ts` (inmemory:103, redis:118) | in-process subscriber map |

The symbols in `packages/core/utils/src/orchestration/symbol.ts` are stringified (`Symbol.for(...).toString()`). They therefore survive JSON and appear in persisted context as `"Symbol(WorkflowStepResponse)"` and similar strings.

### 1.3 From a `createWorkflow` call to an executable flow

`createWorkflow(nameOrConfig, composer)` (`packages/core/workflows-sdk/src/utils/composer/create-workflow.ts:102-299`) does the following:

1. **Pre-register.** It registers an empty definition in `WorkflowManager` if the workflow does not exist yet (`:128-132`). If `options.schedule` is set, `WorkflowManager.register` schedules the workflow immediately, fire-and-forget (`workflow-manager.ts:138-140`).
2. **Create the composition context.** The context contains `flow: OrchestratorBuilder`, `handlers: Map`, `hooks_`, `stepConditions_`, `isAsync` and the binder functions (`:134-157`). It is published on `global[SymbolMedusaWorkflowComposerContext]`.
3. **Run the composer once** with an input placeholder: `proxify({ __type: SymbolInputReference, __step__: "" })` (`:161-170`). Each call inside the composer appends to the builder:
   - **Step call.** `createStep(...)` returns a `StepFunction`. Calling it inside the composer calls `context.stepBinder(applyStep(...))` (`create-step.ts:469-500`). `applyStep` (`create-step.ts:142-290`) then:
     - builds the handler pair `{invoke, compensate}` through `createStepHandler` (`helpers/create-step-handler.ts:55-147`) and wraps it if the step is async (`wrapAsyncHandler`, `create-step.ts:300-346`);
     - mutates `stepConfig.uuid = ulid()` and `stepConfig.noCompensation = !compensateFn` (`:183-184`);
     - calls `this.flow.addAction(stepName, stepConfig)`. This always appends to the **last leaf** of the tree (`orchestrator-builder.ts:38-51`, `findLastStep:376-385`);
     - sets `handlers.set(stepName, handler)` and remembers the overridden handler (`:190-192`);
     - returns a proxied reference `{__type: SymbolWorkflowStep, __step__: stepName}` with `.config()` and `.if()` attached (`:194-289`).
   - **`.config({...})`** re-creates the handler with merged config. It renames the action through `flow.replaceAction(uuid, newName, newConfig)`, re-registers through `WorkflowManager.update`, and moves condition bookkeeping to the new name (`create-step.ts:206-262`).
   - **`parallelize(a, b, c)`** calls `flow.mergeActions(a, b, c)`. This turns the already-appended chain `a -> b -> c` into siblings `next: [a, b, c]` (`parallelize.ts`, `orchestrator-builder.ts:253`).
   - **`transform(values, ...fns)`** adds **no step**. It returns a proxied object `{__type: SymbolWorkflowStepTransformer, __resolver}` that is evaluated lazily whenever a consumer resolves it (`transform.ts:98-166`).
   - **`when(input, cond).then(fn)`** collects the steps created inside `fn` and wraps each one with a conditional invoke (`wrapConditionalStep`, `create-step.ts:356-383`). If `then` returns a non-step value, `when` creates an extra synthetic step (named after the `when` name, or `when-then-<ulid>` with a warning) to carry the value (`when.ts:62-109`).
   - **`createHook(name, input)`** adds a no-op step named `name`. Its handler can later be replaced through `workflow.hooks[name](invoke, compensate)` (`create-hook.ts:28-104`).
   - **Property access on any proxy** (for example `step.id`) creates an implicit `transform` (`helpers/proxy.ts:4-18`).
4. **Remove the global context and commit.** The flow is committed with `WorkflowManager.update` or `register` (`create-workflow.ts:172-178`). `register` throws `Workflow with id "X" and step definition already exists.` if a workflow with the same id but a different step tree (uuids ignored) is registered again (`workflow-manager.ts:102-120`).
5. **Export.** `exportWorkflow(name, returnedStep, {wrappedInput: true, sourcePath})` creates the callable runner and registers it in `MedusaWorkflow.workflows` (`helper/workflow-export.ts:413-588`). The value returned from the composer (a `WorkflowResponse`, a step reference, or any object of references) is stored as `defaultResult` and resolved against the final context after the run.
6. **Attach the returned `mainFlow` API.** This includes `mainFlow(container)`, `.run`, `.runAsStep`, `.getName`, `.hooks.<name>`, and `.config` (the latter is only available on the instance returned by `mainFlow(container)`) (`create-workflow.ts:185-298`).

**Serialized flow shape [verified].** Here is a workflow with `s1 -> parallelize(s2, s3) -> when(...){ s2().config({name:"s2-cond"}) }`:

```json
{ "action": "s1", "uuid": "...", "noCompensation": true,
  "next": [
    { "action": "s2", "uuid": "...", "noCompensation": true },
    { "action": "s3", "uuid": "...", "noCompensation": true,
      "next": { "action": "s2-cond", "uuid": "...", "noCompensation": true, "async": false, "compensateAsync": false } }
  ] }
```

At runtime, `TransactionOrchestrator.buildSteps` (`transaction-orchestrator.ts:1597-1714`) BFS-expands this tree into a flat map keyed by **path ids**: `_root`, `_root.s1`, `_root.s1.s2`, `_root.s1.s3`, `_root.s1.s3.s2-cond`. Each entry is a `TransactionStep` with `depth`, `definition` (a copy without `next`), `invoke`/`compensate` state and status, `attempts`, `failures`, `_v`, and timestamps. Action names must be unique within a workflow (`:1624-1626`). The definition also forces `store=true` on async, retryInterval and timeout steps (`:1668-1677`).

### 1.4 Step handler call chain at runtime

```
TransactionOrchestrator.executeNext
  -> createStepExecutionPromise (optional traceStep wrapper, :1162-1202)
  -> transaction.handler(actionId, type, payload, transaction, step, orchestrator)
       = WorkflowManager.buildHandlers(handlers)(container, context)   (workflow-manager.ts:183-227)
  -> handlers.get(action)[invoke|compensate]({container, payload, invoke, compensate, metadata, transaction, step, orchestrator, context})
       = createStepHandler invoke (create-step-handler.ts:77-112)
           buildStepContext -> StepExecutionContext (:12-53)
           resolveValue(input, stepArguments) (helpers/resolve-value.ts)
           invokeFn(resolvedInput, executionContext)
           returns { __type: SymbolWorkflowWorkflowData, output: StepResponse.toJSON() }
```

The value stored in `context.invoke[stepName]` is therefore `{__type, output: {__type, output, compensateInput}}` **[verified]**. Compensation receives `invoke[stepName].output.compensateInput` (`create-step-handler.ts:114-142`).

### 1.5 `LocalWorkflow` and the runner

Every call to `wf(container)` or `wf.run(...)` builds a fresh `LocalWorkflow` (`packages/core/orchestration/src/workflow/local-workflow.ts:50-73`). For each one:

- It clones the orchestrator: `TransactionOrchestrator.clone`, which skips option parsing.
- It creates a **new `OrchestratorBuilder(flow_)`**. That constructor deep-copies the whole definition with `JSON.parse(JSON.stringify(...))` (`orchestrator-builder.ts:21-36`). This happens on every run.
- It copies the container (`createMedusaContainer({}, container)`) and **monkey-patches `container.resolve`**. Each resolved Medusa module is wrapped in a `Proxy` that injects the workflow's `medusaContext` into methods decorated with `@MedusaContext` when the caller did not pass a context (`local-workflow.ts:96-138`). This is how `transactionId`, `eventGroupId` and the other context fields reach module services without the step author passing them.
- It supports runtime flow edits (`addAction`, `replaceAction`, `insertActionBefore/After`, `appendAction`, `moveAction`, `mergeActions`, `deleteAction`, `pruneAction`, `setOptions`) that `commit()` into a new orchestrator (`local-workflow.ts:140-161, 527-612`). This surface is public through the type `Omit<LocalWorkflow, "run"|...>` on the exported workflow.
- It registers event listeners on the orchestrator and on the transaction for this run's `transactionId` (`local-workflow.ts:171-345`). They are removed when `run()` returns, so callbacks that fire later (background async steps) are lost. That is one reason the engine module keeps its own subscriber mechanism.
- `onLoad` copies `eventGroupId`, `parentStepIdempotencyKey`, `preventReleaseEvents` and `cancelingFromParentStep` from the persisted flow metadata into the medusa context (`local-workflow.ts:622-634`).

`createContextualWorkflowRunner` (`workflow-export.ts:49-411`) wraps `run`, `registerStepSuccess`, `registerStepFailure`, `retryStep` and `cancel`:

- **Defaults.** `context.transactionId ??= "auto-" + ulid()` and `context.eventGroupId ??= ulid()`; `throwOnError` defaults to `true` (`:203-239`).
- **Event release.** Unless `preventReleaseEvents` is set, it wraps `events.onFinish` so that grouped events are released on success or cleared on failure. If release fails, it calls `flow.cancel(transaction)`, which compensates a completed workflow (`attachOnFinishReleaseEvents`, `:590-665`). On failure, the user's `onFinish` is **not** called when an event bus exists (`:637-647`).
- **Flow metadata.** It passes `flowMetadata = {eventGroupId, parentStepIdempotencyKey, sourcePath, preventReleaseEvents, cancelingFromParentStep}` (`:125-131`).
- **Errors.** The returned `errors` contain only **invoke** errors (`:149`). A transaction in `FAILED` or `REVERTED` state throws the first invoke error, unless it was a cancel that ended `REVERTED` or a `registerStepFailure` that ended `REVERTED` (`:151-173`).
- **Result.** With `wrappedInput`, the result is computed with `resolveValue(resultFrom, transaction.getContext())`. This re-runs transforms (see 2.10).
- **Idempotency keys.** `registerStepSuccess`, `registerStepFailure` and `retryStep` split the key with `idempotencyKey.split(":")` and take `transactionId` from index 1 (`:261, 306, 348`).

### 1.6 The engine module wrapper

`WorkflowsModuleService` (`packages/modules/workflow-engine-{inmemory,redis}/src/services/workflows-module.ts`) is a `MedusaService` over the `WorkflowExecution` model. It adds `run`, `getRunningTransaction`, `setStepSuccess`, `setStepFailure`, `retryStep`, `subscribe`, `unsubscribe` and `cancel`, all of which delegate to `WorkflowOrchestratorService`. It also adds `q` text search on list (`prepareFilters`, inmemory `:75-109`).

`run()` (inmemory `:137-195`) behaves as follows:

- It **deep-clones options with `JSON.parse(JSON.stringify(options))`**, which turns Dates into strings and drops `undefined` values and functions. `events` callbacks passed in options are therefore lost when calling through the module.
- It strips `manager` and `transactionManager` from the caller's shared context and merges the rest into `options.context`.
- It computes `preventReleaseEvents` and `eventGroupId`. When the caller's shared context and `options.context` carry the same `eventGroupId`, the child does **not** release events; the parent does.

`WorkflowOrchestratorService.run` (inmemory `services/workflow-orchestrator.ts:173-266`, redis `:219-313`) does the following:

- resolves `MedusaWorkflow.getWorkflow(id)`;
- builds per-run event handlers that fan out to subscribers;
- calls `exportedWorkflow.run({throwOnError: false, container: container ?? sharedContainer})`;
- if the workflow finished, notifies `onFinish` and calls `triggerParentStep`. That function sets the parent's async `runAsStep` step to success or failure through `parentStepIdempotencyKey` (`:135-171`);
- finally, rethrows if `throwOnError`.

It returns `{acknowledgement: {transactionId, workflowId, parentStepIdempotencyKey, hasFinished, hasFailed}, errors, transaction, result, thrownError}`.

---

## 2. Execution model in detail

### 2.1 State enums

The enums live in `packages/core/utils/src/orchestration/types.ts:1-35`:

- **`TransactionState`** (flow-level): `not_started`, `invoking`, `waiting_to_compensate`, `compensating`, `done`, `reverted`, `failed`.
- **`TransactionStepState`** (per step and per phase): `not_started`, `invoking`, `compensating`, `done`, `reverted`, `failed`, `dormant`, `skipped`, `skipped_failure`, `timeout`.
- **`TransactionStepStatus`**: `idle`, `ok`, `waiting_response`, `temp_failure`, `permanent_failure`.
- **`TransactionHandlerType`**: `invoke`, `compensate`.

Every step has two state/status pairs: `invoke` (initially `not_started/idle`) and `compensate` (initially `dormant/idle`) (`transaction-orchestrator.ts:1687-1694`). `getStates()` returns the active pair according to the private flag `stepFailed`, which `beginCompensation()` sets (`transaction-step.ts:67-88`).

**Allowed transitions.** These are enforced by throwing `MedusaError NOT_ALLOWED` (`transaction-step.ts:90-156`). The same table is duplicated in `TransactionCheckpoint` (`distributed-transaction.ts:122-155`).

| From state | To |
|---|---|
| dormant | not_started |
| not_started | invoking, compensating, failed, skipped, skipped_failure |
| invoking | failed, done, timeout, skipped |
| compensating | reverted, failed |
| done | compensating |

| From status | To |
|---|---|
| (any) | waiting_response (always allowed) |
| waiting_response | ok, temp_failure, permanent_failure |
| temp_failure | idle, permanent_failure |
| permanent_failure | idle |

**Flow-level state machine:**

```
not_started --resume--> invoking --all steps complete--> done
invoking --step permanent failure (no continue/skip flags)--> waiting_to_compensate
waiting_to_compensate --(no next steps & no waiting steps)--> compensating  (flagStepsToRevert)
compensating --all compensated--> reverted | failed (if a compensation permanently failed)
invoking --cancelTransaction--> waiting_to_compensate (cancelledAt set)
```

These transitions are implemented in `checkAllSteps` (`transaction-orchestrator.ts:324-377`) and `setStepFailure` (`:756-923`). If any step ends `FAILED` or `TIMEOUT` without the continue or skip flags, the final state is `FAILED` instead of `REVERTED`. This is computed in `computeCurrentTransactionState` (`:379-521`), which treats a step that has `continueOnPermanentFailure` or `skipOnPermanentFailure` as an "ignored failure" and sets `flow.hasFailedSteps`.

`flagStepsToRevert` (`:523-545`) moves every step in `DONE` or `TIMEOUT` state, or with `permanent_failure` status, into compensation. It also **resets all `_v` versions to 0**.

### 2.2 Main loop: `executeNext`

`executeNext` lives at `transaction-orchestrator.ts:925-1057`:

```
loop:
  if finished -> return
  nextSteps = checkAllSteps()            // full scan of all steps, sorted by depth (invoke) or reverse depth (compensate)
  if checkTransactionTimeout() -> continue
  if remaining == 0 -> finalizeTransaction() (save + emit FINISH) -> return
  for each next step: prepareStepForExecution (attempts++, lastAttempt, state->invoking/compensating, status->waiting)
                      noCompensation steps go straight to REVERTED without running
  saveCheckpoint()                      // checkpoint #1 per iteration
  for each next step:
     schedule step timeout (if attempts==1 and has timeout and async)
     emit STEP_BEGIN
     computeCurrentTransactionState()   // ANOTHER full scan per step
     version-control: if >1 async step in batch or step has retryIntervalAwaiting -> flow._v++, step._v = flow._v
     sync  -> push executeSyncStep(promise)   (awaited below)
     async -> push () => executeAsyncStep(promise) (fire-and-forget after a second checkpoint)
  await all sync steps
  if no next steps or (has async and no sync) -> stop looping
  if has async: saveCheckpoint() then `void exec()` for each async step
```

Key properties:

- **"Next" steps.** A step is "next" when it can invoke or compensate and the sibling barrier allows it. `canContinue` uses `getPreviousStep` (`:167-172`, which splits the path id on `.`). It then calls `canMoveForward`: all siblings of the parent must be in one of DONE, FAILED, TIMEOUT, SKIPPED or SKIPPED_FAILURE, unless the step has `noWait` (`:213-223`). Compensation requires all children to be in DONE, REVERTED, FAILED, DORMANT or SKIPPED (`canMoveBackward`, `:225-231`).
- **Sync steps in one batch run concurrently** (`promiseAll(execution)`), so parallel branches really execute in parallel.
- **Async steps are not awaited.** They start only after the checkpoint is saved. `run()` returns while the transaction is still `invoking`.
- **Known code smell.** In the post-async save (`:1044-1050`), the `.catch` sets `continueExecution = false` on an expected error and then **rethrows anyway**.

### 2.3 Sync step result handling

`executeSyncStep` lives at `:1207-1247`.

- **Success.** `handleStepExpiration` runs first. If the output is a `SkipStepResponse` (from `StepResponse.skip()`), `skipStep` is called and the step state becomes `SKIPPED`. Otherwise `handleStepSuccess` runs: it adds the response to `context.invoke` or `context.compensate`, sets status OK and state DONE (or REVERTED during compensation), saves a checkpoint with `{_v, parallelSteps, stepId}`, clears retry and timeout jobs, and emits `stepSuccess` or `compensateStepSuccess` (`:547-622, 1320-1355`).
- **Thrown error.** Expected internal errors (`SkipExecutionError`, `SkipCancelledExecutionError`, `SkipStepAlreadyFinishedError`) are swallowed. `PermanentStepFailureError` (thrown by `StepResponse.permanentFailure(msg, compensateInput)`) fails with `maxRetries=0`. Any other error goes to `setStepFailure` with `definition.maxRetries`. A response attached to the error (`getStepResponse()`) is stored as the step output, so compensation receives partial data (`:1232-1246, 1360-1398`).

### 2.4 `setStepFailure` and retries

`setStepFailure` lives at `:756-923`:

- The error is serialized (`serializeError`, or a JSON round-trip, or `"Unknown non-serializable error"`).
- `failures++`. Status becomes `temp_failure`.
- If `failures > maxRetries`, or the step timed out:
  - state becomes FAILED (unless it is TIMEOUT) and status becomes `permanent_failure`;
  - the error is appended to `transaction.errors` with a source-path breadcrumb added to the stack;
  - **during invoke**:
    - with `continueOnPermanentFailure`, nothing else happens and the flow continues;
    - with `skipOnPermanentFailure: true`, every descendant becomes `SKIPPED_FAILURE`;
    - with `skipOnPermanentFailure: "<action>"`, descendants are skipped until that action, and the flow resumes there;
    - otherwise the flow becomes `WAITING_TO_COMPENSATE`;
    - transaction timeouts ignore the continue and skip flags (`:830-862`).
- Otherwise the step stays in `temp_failure`:
  - with `autoRetry === false` on an async step, `temporaryFailedAt` is set and execution stops (manual `retryStep` is required);
  - for sync steps with `autoRetry: false`, `computeCurrentTransactionState` sets `temporaryFailedAt` and does not pick the step again (`:452-458`).
- The checkpoint is saved and `stepFailure` or `compensateStepFailure` is emitted.

**Retry timing:**

- A step in `temp_failure` is re-picked in the next loop iteration. `canRetry()` returns true immediately if there is no `retryInterval` (`transaction-step.ts:174-183`).
- With `retryInterval` (seconds), a retry job is scheduled through `transaction.scheduleRetry(step, retryInterval)` and the loop stops for that step (`:464-475`). The job later calls `WorkflowOrchestratorService.run(workflowId, {transactionId})` to resume. **A workflow that has `retryInterval` therefore becomes a background execution: `run()` returns before the retry finishes.** This is GitHub issue #10201.
- `retryIntervalAwaiting` and `maxAwaitingRetries` re-invoke a step that is still `waiting_response` (polling-style async steps). For compensating steps, `maxAwaitingRetries` is doubled (`transaction-step.ts:189-202`). These options are not exposed in core-flows; see section 9.
- `maxRetries` defaults to `TransactionOrchestrator.DEFAULT_RETRIES = 0` (`:84`).
- `retryStep(idempotencyKey)` (engine API) forces re-execution of a `waiting_response` step by setting `retryRescheduledAt` and scheduling a 0-delay retry (`:624-650, 1922-1958`).

### 2.5 Async steps, background execution and nested workflows

**Config flags.** These are documented in `packages/core/orchestration/src/transaction/types.ts:13-125`:

- `async: true`. The orchestrator does not wait for the step. The step ends up in `waiting_response` until something calls `setStepSuccess` or `setStepFailure` with the step's idempotency key. The exception is when `backgroundExecution` is set, in which case the step auto-completes when its handler resolves.
- **Implicit background execution.** The SDK `wrapAsyncHandler` (`create-step.ts:300-346`) sets `step.definition.backgroundExecution = true` **at runtime** when an async step's invoke returns a `StepResponse`. It mutates the definition stored in the flow and persists it. So:
  - an async step that **returns a `StepResponse`** auto-completes in the background;
  - an async step that **returns nothing** waits for an external `setStepSuccess` or `setStepFailure`.

  `wrapConditionalStep` also sets `backgroundExecution = true` for async conditional steps (`:373-375`).
- `compensateAsync: true` applies the same logic to the compensate handler.
- `nested: true` marks a step that hosts a sub-transaction. Even with `backgroundExecution`, a nested step never auto-completes; the child's finish triggers the parent (`executeAsyncStep`, `transaction-orchestrator.ts:1274-1278`).

**Continuing after an async step.** When a background async step finishes in the current process, `handleStepSuccess` saves the checkpoint and then calls `scheduleRetry(step, 0)` (`:1351-1354`). The rest of the workflow is resumed through the queue (in-memory `setTimeout(0)`, or a BullMQ job with any worker), not inline.

**`runAsStep`** (`create-workflow.ts:204-296`):

- Creates a step named `${name}-as-step` with `async = nested = (parent composer isAsync || child isAsync)`. `isAsync` becomes true if any step in the workflow is `async` or `compensateAsync` (`create-step.ts:188, 241`).
- **Async child.** The child runs through the workflow engine module: `workflowEngine.run(name, {transactionId: "<stepName>-<parentTransactionId>[-attempt-N]", context: {...parentContext, parentStepIdempotencyKey, preventReleaseEvents: true, runId}})`. When the child finishes, `triggerParentStep` calls `setStepSuccess` or `setStepFailure` on the parent.
- **Sync child.** The child runs inline through `workflow.run({container, context})` and returns `new StepResponse(result, transaction)`. The compensate input is the entire `WorkflowResult`, including the child `DistributedTransaction`, which ends up serialized into the parent context. That is a size hotspot.
- **Compensation.** The child is cancelled with `cancelingFromParentStep: true`, which suppresses parent triggering.
- **Child transaction id.** It is derived from the parent transaction id, so cancelling or retrying parent steps can find the child.

### 2.6 Timeouts

- **Step `timeout`** (seconds). This is not an execution timeout; the handler always runs to completion.
  - For async steps, a step-timeout job is scheduled when the step starts (`scheduleStepTimeout` is a no-op for sync steps, `distributed-transaction.ts:665-681`).
  - For any step, after the handler returns, `handleStepExpiration` checks `now > startedAt + timeout`. If expired, the step goes to `TIMEOUT` state, a `TransactionStepTimeoutError` is added, and `setStepFailure(isTimeout=true)` runs (`transaction-orchestrator.ts:300-322, 717-754, 1303-1315`). Its result is still stored if `saveResponse` is set, but the transaction is compensated.
  - With `continueOnPermanentFailure`, a timed-out step lets the flow continue (PR #14719).
- **Transaction `timeout`** (workflow option, seconds). It is scheduled at begin only if the flow `hasAsyncSteps` (`distributed-transaction.ts:644-655`). It is otherwise checked on each loop iteration (`checkTransactionTimeout`, `:272-298`). On expiry, all current steps get `TransactionTimeoutError`, continue and skip flags are ignored, and the transaction compensates.
- **Effect on persistence.** Timeouts force `store` (section 3.1). Timeout checks are lazy: a sync workflow that is stuck inside a step is not interrupted.

### 2.7 Skipping

- **`StepResponse.skip()`** returns a `SkipStepResponse`. The step becomes `SKIPPED` with status OK, and execution continues (`:652-715, 1222-1228`). The skip check reads `response.output` when it has `__type` (`:1217-1220`).
- **`when` with a false condition** makes the conditional wrapper return `StepResponse.skip()`.
- **Skipped steps do not stop their children.** Downstream steps still run and receive `undefined` for the skipped step's output.
- **Skipped steps are not compensated.** `canMoveBackwardStates` includes SKIPPED, and `flagStepsToRevert` only flags DONE and TIMEOUT.
- **Flow flags.** The flow records `hasSkippedSteps` and `hasSkippedOnFailureSteps`. `DistributedTransaction.isPartiallyCompleted` is true when the flow `hasFailedSteps` or `hasSkippedSteps` (`distributed-transaction.ts:472-474`).
- **`orchestrator.skipStep(idempotencyKey)`** skips a step that is in `waiting_response` (`transaction-orchestrator.ts:1879-1914`). This is not exposed on the module service.

### 2.8 `noCompensation`, `saveResponse`, `noWait`, `autoRetry`

- **`noCompensation`.** The SDK sets it automatically when no compensate function is given (`create-step.ts:184`). The orchestrator marks such steps REVERTED without calling a handler (`:1098-1101`).
- **`saveResponse: false`.** The response is not stored in the context, so downstream references resolve to `undefined` (`:558-566, 1329-1337`). The default is true.
- **`noWait`.** The next step does not wait for its siblings (`:220`). It is only reachable through a raw config.
- **`autoRetry: false`.** No automatic retry happens; a manual `retryStep` is needed (PR #13391).

### 2.9 How results pass between steps (`resolveValue`)

`helpers/resolve-value.ts:12-217` walks the step's declared input (any nesting of plain objects, arrays and proxies) against `stepArguments` (`{payload, invoke, compensate, transaction, ...}`):

- `SymbolInputReference` resolves to `transactionContext.payload` (the workflow input).
- `SymbolWorkflowStep` resolves to `invoke[stepName].output.output`. This is the `StepResponse.output`, or the raw value if the step returned a plain value.
- `SymbolWorkflowStepTransformer` resolves through `__resolver(transactionContext)`, which may be async.
- `SymbolMedusaWorkflowResponse` resolves to `$result`.
- The final value is deep-copied through `parseStringifyIfNecessary` (`packages/core/utils/src/common/parse-stringify-if-necessary.ts`). This drops functions and symbols, converts class instances (Dates, Decimals, BigNumbers) through JSON, and ensures a step **never receives references shared with the context**. Issue #17253 (open) reports repeated deep copies when reading fields.

Step inputs are resolved inside the handler at execution time, from the in-memory context on a fresh run or from the persisted context on resume.

### 2.10 How `transform` is evaluated

`transform.ts:98-166`. Evaluation is lazy and happens only when some consumer (a step input, another transform, or the workflow result) resolves it. The result is cached in `transaction.#temporaryStorage` under `modelId_transactionId_uniqId`. That cache is never persisted and is lost when another process resumes the transaction.

The cache key uses `uniqId = Math.random()` per transform **definition**, so it is stable across runs of the same process.

**Three observed behaviors [verified]:**

1. **Parallel consumers race on the cache.** When two parallel steps consume one transform, it is executed twice: the cache is set only after the awaited computation.
2. **The workflow result recomputes transforms.** It is resolved with `transaction.getContext()`, which does not have the `"transaction" in ctx` property, so the cache is bypassed. A `transform(() => Math.random())` passed to a step and also returned in `WorkflowResponse` gives **different values** (step received 0.226, result 0.813).
3. **Resuming in another process recomputes transforms.**

Transforms receive `(resolvedInput, transactionContext)` as their arguments. The second argument is the raw step-arguments object, which some code may rely on.

### 2.11 How `when` is evaluated

- `when(name?, input, condition).then(fn)` records the steps created inside `fn` and calls `step.if(input, condition)` on each one (`when.ts:37-110`).
- **The condition runs once per step inside the block** (`wrapConditionalStep`), not once per block. It can be async. It receives `(resolvedInput, stepArguments)`.
- **A missing `.then` throws on `process.nextTick`.**
- **Nested `when` crashes at composition** with `Cannot read properties of undefined (reading 'steps')` **[verified]**. The ESLint rules from PRs #16520 and #16585 guard against it.
- **Hooks inside a `when`** are wrapped too: `stepConditions_[hookName]` is applied when the hook handler is registered (`create-hook.ts:80-83`).
- **Return values.** If `then` returns a non-step value, `when` creates a synthetic passthrough step. The result of `when().then()` is `undefined` downstream when the condition is false.

### 2.12 Hooks

`createHook(name, input, {resultValidator?})` (`create-hook.ts:28-104`):

- Inserts a step named `name` whose default invoke returns `StepResponse(NOOP_RESULT)`.
- `workflow.hooks[name](invokeFn, compensateFn?)` replaces that step's handler in the **global** handlers map. It can be called once per workflow, and a second call throws `Cannot define multiple hook handlers for the <name> hook` (`:74-78`). Hooks are registered at import time, typically from `src/workflows/hooks/*.ts`. Issue #11968 asks for multiple handlers.
- `hook.getResult()` lazily creates a step `get-<name>-result` that reads `context[" getStepResult"](name)` and validates it with a zod-like `resultValidator`. A NOOP result returns `undefined`.
- Hooks are surfaced through `new WorkflowResponse(result, {hooks: [hookA, hookB]})`, which drives the TypeScript type of `workflow.hooks`.

### 2.13 Events emitted by the orchestrator

`DistributedTransactionEvent` (`types.ts:203-216`) has these events:

- **Emitted on the orchestrator:** `begin`, `resume`, `compensateBegin`, `finish`, `timeout`.
- **Emitted on the transaction:** `stepBegin`, `stepSuccess`, `stepSkipped`, `stepFailure`, `stepAwaiting`, `compensateStepSuccess`, `compensateStepFailure`.

They map to the `DistributedTransactionEvents` callbacks `onBegin`, `onResume`, `onFinish`, `onTimeout`, `onStepBegin`, `onStepSuccess`, `onStepFailure`, `onStepAwaiting`, `onCompensateBegin`, `onCompensateStepSuccess`, `onCompensateStepFailure` and `onStepSkipped`.

The engine modules forward these events to `subscribe()` subscribers as `{eventType, workflowId, transactionId, step, response, result, errors, state}`. They also replace `onStepSuccess` with a version that resolves the step output first. Neither module forwards `onStepSkipped` to subscribers, and both route `onCompensateStepFailure` custom handlers to `customEventHandlers.onStepFailure` (a bug: inmemory `:846`, redis `:978`).

### 2.14 Execution context passed to steps (`StepExecutionContext`)

`StepExecutionContext` is defined at `type.ts:116-142` and built at `create-step-handler.ts:12-53`. It contains:

- `workflowId`, `stepName`, `action`, `attempt`, `idempotencyKey`, `container`, `metadata`;
- `eventGroupId` (from flow metadata, falling back to the context);
- `parentStepIdempotencyKey`, `preventReleaseEvents`, `transactionId`, `runId`;
- `context` (the full Medusa `Context`, **mutated**: `context.idempotencyKey` is assigned per step even though the context object is shared by parallel steps; see `:22`);
- `" stepDefinition"`;
- `" getStepResult"(stepId, action)`.

The leading-space keys are a convention for "hidden" members.

The step idempotency key is `${workflowId}:${transactionId}:${action}:${invoke|compensate}` (`transaction-orchestrator.ts:1121-1137`). It contains no step path and no attempt number. Since action names are unique per workflow, the key identifies a step.

---

## 3. Persistence and distribution

### 3.1 When a workflow is persisted

`parseFlowOptions` (`transaction-orchestrator.ts:1506-1539`) forces `options.store = true` if the workflow has any of the following:

- a step `timeout`;
- `retryInterval` or `retryIntervalAwaiting`;
- a transaction `timeout`;
- `idempotent`;
- `retentionTime`;
- an async step;
- an explicit `store: true`.

`saveCheckpoint` returns immediately when `store` is false (`distributed-transaction.ts:509-516`). **A plain synchronous workflow never touches any storage.** It is not visible in the admin executions list, cannot be cancelled after the fact, and is not crash-recoverable.

### 3.2 What is stored

`TransactionCheckpoint = {flow, context, errors}` (`distributed-transaction.ts:121-161`):

- **`flow`** is a `TransactionFlow` (`types.ts:279-309`). It holds:
  - `modelId`, `transactionId`, `runId`, `options`;
  - `metadata` (`eventGroupId`, `parentStepIdempotencyKey`, `preventReleaseEvents`, `cancelingFromParentStep`, `sourcePath`, `parentIdempotencyKey`, and any other keys);
  - **`definition` (the full nested step tree)**;
  - the flags `hasAsyncSteps`, `hasFailedSteps`, `hasSkippedOnFailureSteps`, `hasWaitingSteps`, `hasSkippedSteps`, `hasRevertedSteps`;
  - `timedOutAt`, `startedAt`, `cancelledAt`, `state`;
  - **`steps`**, a flat map of `TransactionStep` keyed by path id, where each step contains a definition copy;
  - `_v`.
- **`context`** is `{payload, invoke: {stepName: wrappedResponse}, compensate: {...}}`.
- **`errors`** is a list of `TransactionStepError {action, handlerType, error}` with serialized errors.

`#serializeCheckpointData` (`distributed-transaction.ts:711-751`):

- runs `JSON.stringify(context)` purely as a validation step and throws `NonSerializableCheckPointError` if it fails;
- sanitizes errors that cannot be serialized;
- deep-copies the flow with `JSON.parse(JSON.stringify(flow))`;
- passes the context **by reference**.

The storage implementations then serialize the checkpoint again. The Redis engine stringifies `{errors, flow}` for Redis; the in-memory engine round-trips through JSON into its map; and the Postgres upsert serializes `execution` and `context` again.

**Size [verified].** Because step ids are full paths and `flow` carries both `definition` and `steps[*].definition`, flow size is roughly quadratic in sequential depth:

| Sequential steps | Flow JSON size | Last step id length |
|---|---|---|
| 10 | 6.7 KB | 75 chars |
| 50 | 54 KB | 395 chars |
| 200 | 652 KB | 1,895 chars |

These numbers use roughly 100-byte step outputs.

### 3.3 Checkpoint frequency

For a stored 2-step synchronous workflow, there are **7 `save` calls** **[verified]**:

1. `not_started` at begin (`:1761-1765`);
2. `invoking` at start (`:1423-1425`);
3. one per loop iteration (`:975`);
4. one per step success (`setStepSuccess`);
5. ...
6. ...
7. `done` at finalize (`:1069`).

Async steps add an extra save before they start (`:1043-1050`) and `scheduleStepTimeout` saves again (`distributed-transaction.ts:674`).

**The Postgres write is filtered** by `saveToDb` (inmemory `utils/workflow-orchestrator-storage.ts:205-279`, redis `:335-410`). It upserts only when:

- the state is `not_started`, finished, or `waiting_to_compensate`; or
- the flow has version control (`_v > 0`); or
- the "current" step's depth level contains a step with `definition.store === true` (async, retryInterval or timeout steps).

The "current step" is found by scanning the steps map from the end for the first step in invoking, done or failed state. That scan relies on object-key insertion order. As a result, in the Redis engine, **intermediate context of purely sync segments is not in Postgres**, and Redis holds only `{flow, errors}`, not the context (PR #12795). After a crash, a resumed transaction uses the last DB context together with the Redis flow.

**Finished transactions:**

- Without `retentionTime`, the DB row is deleted, unless the workflow is a child (`parentStepIdempotencyKey`), in which case it is upserted so the parent can read it. The Redis key is unlinked and the in-memory entry is deleted (inmemory `:414-429`, redis `:633-641`).
- With `retentionTime`, the row is kept with `retention_time` set. The cleaner deletes finished rows where `updated_at <= now - retention_time seconds` every 30 minutes (inmemory `:756-775`, redis `:967-986`).
- With `idempotent` but without `retentionTime`, the row is not kept (breaking change in PR #13236). An idempotent workflow therefore returns its prior result only while the row exists.

### 3.4 Storage reads and the `workflow_execution` table

**Model.** Defined in `packages/modules/workflow-engine-*/src/models/workflow-execution.ts`; both engines use the same model.

| Column | Type / notes |
|---|---|
| `id` | `wf_exec_<ulid>` |
| `workflow_id`, `transaction_id`, `run_id` | composite primary key |
| `execution` | jsonb; the flow |
| `context` | jsonb; `{data: context, errors}` |
| `state` | `TransactionState` enum |
| `retention_time` | integer, seconds |
| `created_at`, `updated_at`, `deleted_at` | timestamps |

Indexes: `id`, `workflow_id`, `transaction_id`, unique `(workflow_id, transaction_id, run_id)`, `state`, `run_id`, `(workflow_id, transaction_id)`, `(state, updated_at)`, plus two partial retention indexes.

**Migrations.** 7 in inmemory and 8 in redis. Their names differ between the engines, which once broke switching engines (see the comments in `workflow-engine-redis/src/migrations/Migration20250505101505.ts`). That migration added `run_id` with a **constant** `ulid()` default for existing rows.

**Engine differences.** The two engines carry slightly different `.snapshot` files and migration sets; any new schema must reconcile both.

**`get(key)`** (inmemory `:289-348`, redis `:465-534`) parses `dtrx:<workflowId>:<transactionId>`:

- It **always queries Postgres** for the newest row by `id desc`. The Redis engine also does a Redis GET in parallel.
- The flow and errors come from the in-memory map or Redis when present; otherwise from the DB. The **context always comes from the DB** row.
- If the stored execution is finished and the workflow is not `idempotent`, it returns `undefined`, so a new run starts under the same `transactionId` with a new `run_id`. A cancel of a FAILED or REVERTED run also returns `undefined`.
- If the workflow is idempotent and finished, it returns the finished checkpoint. `resume()` then no-ops and the caller gets the stored result.

### 3.5 Concurrency control

There are several overlapping mechanisms.

**1. Initial-start dedupe.**
- **Redis:** for a manual (non-`auto-`) `transactionId`, the initial `not_started` save uses `SET NX`; on conflict it throws `SkipExecutionError("Transaction already started for transactionId: X")` (redis `:577-629`).
- **In-memory:** the engine checks its map (inmemory `:385-396`).
- **Caller impact:** the second concurrent `run` with the same `transactionId` rejects with that message (test `workflow-engine-redis/integration-tests/__tests__/index.spec.ts:521-559`). `saveCheckpoint` converts any save error during `NOT_STARTED` into that error (`distributed-transaction.ts:550-555`).

**2. Race checks on every save** (`#preventRaceConditionExecutionIfNecessary`, inmemory `:437-518`, redis `:877-965`):
- If the saving step (`options.stepId`) is already in a done state in the latest stored copy, it throws `SkipStepAlreadyFinishedError`.
- If the stored checkpoint has disappeared (another execution finished it) and this is not a child workflow, it throws `SkipExecutionError`.
- If the stored copy was cancelled but this one was not, it throws `SkipCancelledExecutionError`, which makes the caller cancel and compensate (`handleStepSuccess`, `:1345-1349`).

**3. Optimistic merge with versions.**
- When a batch contains more than one async step, or a step uses `retryIntervalAwaiting`, steps get versions `_v` (`:1017-1023`).
- Saves with `_v` take a Redis lock: `SET dtrx:...:lock 1 EX 2 NX`. The lock has a 2-second TTL, no renewal and no fencing token, and on failure the engine throws `"Lock not acquired"` (redis `:551-557, 859-875`). The in-memory engine uses a non-waiting `isLocked` map and throws `"Transaction storage is locked"` (inmemory `:356-360`).
- Inside the lock, the stored checkpoint is merged into the current one (`TransactionCheckpoint.mergeCheckpoints`, `distributed-transaction.ts:170-364`). The merge keeps the further-along flow state by a fixed order, takes the maximum of timestamps, attempts and `_v`, keeps the further-along step state when the transition is valid, unions errors by signature, and fills missing context responses.
- If the stored flow or step version is ahead, the merge throws `SkipExecutionError("Transaction is behind another execution")`.

**4. Save retry loop.** On a non-expected error, `saveCheckpoint` retries up to `parallelSteps + 2` times with exponential backoff plus jitter (50 ms up to 500 ms). Before each retry it reloads and merges **in place**, so step objects held by concurrently running steps stay valid (`distributed-transaction.ts:532-596`). When the retries run out, it throws `Max retries ... exceeded`. Issue #17161 (open) shows that such an error after a successful step escapes the orchestrator without compensation.

**5. Duplicate BullMQ jobs are avoided** with deterministic job ids: `type:workflowId:transactionId[:stepId:attempts][:retry][:compensate]` (redis `:740-767`). `removeJob` only removes jobs that have not started.

### 3.6 Redis engine: queues, worker modes and pub/sub

**Connections** (`workflow-engine-redis/src/loaders/redis.ts`): a main connection, a worker connection (`maxRetriesPerRequest: null`), and a publisher and subscriber pair (optionally a separate `pubsub` URL). The options are `redisUrl` (or deprecated `url`), `redisOptions` (or deprecated `options`), `queueName` (default `medusa-workflows`), `jobQueueName` (default `medusa-workflows-jobs`), shared `queueOptions`/`workerOptions`, and per-queue overrides (`types/index.ts:56-191`).

**Queues** (`utils/workflow-orchestrator-storage.ts:139-271`):

| Queue | Job types | Who consumes |
|---|---|---|
| `medusa-workflows` (main) | `retry`, `step_timeout`, `transaction_timeout` (plus legacy `schedule` removal) | worker only |
| `medusa-workflows-jobs` | `schedule` (repeatable cron or every) | worker only |
| `workflows-cleaner` | `cleaner`, every 30 min, `jobId=clear-expired-executions` | worker only |

**Worker modes.** `isWorkerMode = worker_mode !== "server"`, so both `shared` and `worker` count as worker mode.
- Instances in `server` mode create only the main queue, so they can **enqueue** but never **consume**.
- Server mode still runs the first part of async workflows and the HTTP handlers, but every retry, timeout and async continuation happens on worker instances.
- Server-mode instances do not create the job queue, so `schedule()` is a no-op there (`this.jobQueue?.add`).
- On every start, `removeAllRepeatableJobs(this.queue)` cleans up legacy jobs (`:195-197`).

**Job processing.** A job calls `executeTransaction(workflowId, transactionId, metadata)`, which calls `WorkflowOrchestratorService.run(workflowId, {transactionId, context: {eventGroupId, parentStepIdempotencyKey, preventReleaseEvents}})`. The run loads the existing transaction and resumes it. `SkipExecutionError` is swallowed (redis `:200-228, 420-435`).

**Pub/sub.** Channel `orchestrator:<workflowId>`. `subscribe()` subscribes the instance to the channel. Notifications for flows that have async steps are published to every instance, each of which ignores its own `instanceId`. Notifications for sync flows stay local (redis `services/workflow-orchestrator.ts:155-166, 758-787`). The message is `JSON.stringify({instanceId, data})`, where `data` includes the full `TransactionStep` and the result.

**Shutdown.** `onApplicationPrepareShutdown` closes the workers gracefully, waiting for jobs. `onApplicationShutdown` closes the queues and disconnects Redis.

### 3.7 In-memory engine: timers and Postgres

`InMemoryDistributedTransactionStorage` (`workflow-engine-inmemory/src/utils/workflow-orchestrator-storage.ts`):

- keeps checkpoints in a process-local object;
- **still upserts to Postgres** through the same `saveToDb` rules, and always reads Postgres in `get`;
- handles retries and timeouts with `setTimeout` (`createManagedTimer`), keyed by `workflowId:transactionId[:stepId]` (`:520-642`);
- runs the cleaner with `setInterval` every 30 minutes (`:129-135`).

**Scheduling** (`:645-754`):
- It uses `cron-parser` to compute a delay, then `setTimeout`.
- The next run is scheduled **only after `run` resolves**, so a slow job delays its next tick.
- A thrown error other than NOT_FOUND propagates out of the timer callback and **stops the schedule**.
- The `concurrency` option is not implemented (runs are serial by construction).
- Very long cron intervals overflow `setTimeout`'s 2^31 ms limit and cause a tight loop (issue #16280, unfixed).

**Crash behavior.** Everything in flight (timers, async steps, pending retries) is lost on restart. Nothing reloads unfinished executions on startup.

### 3.8 Scheduling

**Registration.** `createWorkflow({name, schedule})` triggers `WorkflowManager.register`, which calls `WorkflowScheduler.scheduleWorkflow`. That call is fire-and-forget and **not** awaited (`workflow-manager.ts:138-140`; `scheduler.ts:11-32`).
- A string schedule normalizes to `{cron, concurrency: "forbid"}`.
- `SchedulerOptions = {concurrency?: "allow"|"forbid", numberOfExecutions?} & ({cron} | {interval: ms})` (`types.ts:170-194`).
- `WorkflowManager.update` does not reschedule.

**Scheduled jobs** (`packages/core/framework/src/jobs/job-loader.ts:101-156`). Each `src/jobs/*.ts` file is wrapped as:
- a workflow `job-<config.name>`;
- one step `<config.name>-as-step` that calls `handler(container, {scheduledFor: Date})`;
- the input `{scheduledFor: ISO string}`, which both engines pass (inmemory `:721-727`, redis `:437-450`).

The step has no retries, and its error is logged and rethrown.

**Redis scheduling** uses BullMQ repeatables (`repeat: {pattern | every, limit: numberOfExecutions, key: "schedule_<jobId>"}`, `removeOnComplete {age: 1d, count: 1000}`, `removeOnFail {age: 7d, count: 5000}`) (redis `:792-835`).
- **`concurrency: "forbid"` is not enforced.** A TODO in the code says so (`:443-444`). In practice, worker concurrency (default 1 per worker) limits it, but several workers can overlap.
- `scheduledFor` comes from `job.timestamp`.
- A missing workflow is removed from the scheduler with a warning.

### 3.9 Crash recovery and in-flight transactions

- **No startup scan in either engine.** Nothing resumes `invoking` executions found in Postgres at boot.
- **Redis engine.** Recovery depends entirely on pending BullMQ jobs: retries scheduled with a delay, timeouts, and 0-delay "continue" jobs enqueued after async steps.
- **Sync segment crash.** If a process dies in the middle of a sync segment of a stored workflow, no job exists. The transaction stays `invoking` until a transaction or step timeout job fires, or until something calls `setStepSuccess` or `setStepFailure`. Otherwise it is stuck forever.
- **Background async step crash.** If the process running a background async step dies before `handleStepSuccess`, the step stays `waiting_response`. Only an optional step timeout job, or `retryIntervalAwaiting`, recovers it.
- **In-memory engine.** Every in-flight async workflow, retry and timeout is lost on restart.
- **Redis keys.** Unfinished transactions have no TTL; only the initial save of non-async flows uses a 30 s TTL (`DEFAULT_TTL`, `:78, 1424, 1763`). Abandoned transactions therefore leak Redis keys until something finishes them.

### 3.10 Context propagation, events and locking interactions

- **Event grouping.**
  - Each run has an `eventGroupId`, defaulting to a ulid (`workflow-export.ts:224`).
  - The `LocalWorkflow` container proxy injects it into module calls. Modules emitting events with `@EmitEvents` or `emitEventStep` push them to the event bus under that group.
  - When the workflow finishes, `releaseGroupedEvents(eventGroupId)` is called on success and `clearGroupedEvents` on failure or revert (`workflow-export.ts:626-661`).
  - Child workflows (`runAsStep`, and module `run` with the same `eventGroupId`) set `preventReleaseEvents`, so only the root releases.
  - If release fails, the workflow is **cancelled and compensated** (PR #17293, merged after this checkout, changes this).
- **`parentStepIdempotencyKey`, `cancelingFromParentStep`, `preventReleaseEvents`** live in flow metadata and are restored into the context on load (`local-workflow.ts:622-634`).
- **Locking.** The engine itself does not use the Locking module. Core-flows use `acquireLockStep` and `releaseLockStep` (see section 9). The engine's own concurrency uses the Redis `SET NX` lock described above.
- **Tracing.** `TransactionOrchestrator.traceTransaction` and `traceStep` are static hooks set by `packages/medusa/src/instrumentation/index.ts:262-306` (OpenTelemetry). `traceTransaction` is skipped for flows that have async steps (`:1441-1451`).

---

## 4. Public API surface that must stay backwards compatible

### 4.1 SDK exports (`@medusajs/framework/workflows-sdk`, from `packages/core/workflows-sdk/src/index.ts`)

**`createWorkflow(nameOrConfig, composer)`**
- `nameOrConfig` is either a `string` or `{name} & TransactionModelOptions`. The options are `timeout`, `store`, `retentionTime`, `storeExecution` (deprecated), `idempotent` and `schedule`.
- The composer:
  - receives a `WorkflowData<TInput>` proxy;
  - must be a synchronous, non-arrow-dependent function that runs exactly once;
  - returns `void`, a `WorkflowResponse`, a step reference, or an object or array of references (all of these are tested in `compose.spec.ts:2438-2543`).
- It returns a `ReturnWorkflow`, described in the next table.

**`ReturnWorkflow`** (`type.ts:149-177`):

| Member | Notes |
|---|---|
| `wf(container?)` | Returns a `LocalWorkflow`-derived object. Its methods are `run`, `registerStepSuccess`, `registerStepFailure`, `retryStep` and `cancel`, plus the inherited `LocalWorkflow` methods: `getFlow`, `addAction`, `replaceAction`, `insertActionBefore/After`, `appendAction`, `moveAction`, `moveAndMergeNextAction`, `mergeActions`, `deleteAction`, `pruneAction`, `setOptions`, `config(options)`, and the `container` getter/setter. |
| `wf.run({input, context, container, throwOnError=true, logOnError=false, resultFrom, events})` | Returns `{errors, transaction, result}` (plus `thrownError`). The static form `wf.run({container})` is also used. |
| `wf.runAsStep({input})` | Embeds the workflow as a nested step. |
| `wf.getName()` | Returns the workflow id. |
| `wf.hooks.<hookName>(invoke, compensate?)` | Registers the single handler for that hook. |
| `wf.registerStepSuccess/registerStepFailure({idempotencyKey, response, context, events, forcePermanentFailure})` | Static forms. |
| `wf.cancel({transaction | transactionId, context, container})` | Static form. |

`WorkflowResult` = `{errors: TransactionStepError[], transaction: DistributedTransaction, result}`. User code reads several members of the returned `transaction`: `transaction.getFlow()`, `getState()`, `hasFinished()`, `getContext()`, `getErrors()`, `transactionId`, `modelId` and `runId`. For example, `api/store/carts/[id]/complete/route.ts` relies on `hasFinished()`.

**`createStep(nameOrConfig, invokeFn, compensateFn?)`**
- `nameOrConfig` is a `string` or `{name} & step options`. The step options are `async`, `compensateAsync`, `backgroundExecution`, `timeout`, `maxRetries`, `retryInterval`, `autoRetry`, `retryIntervalAwaiting`, `maxAwaitingRetries`, `continueOnPermanentFailure`, `skipOnPermanentFailure` (boolean or step name), `noCompensation`, `saveResponse`, `noWait`, `nested` and `store`.
- `invokeFn(input, StepExecutionContext)` may return `void`, a plain value, or a `StepResponse` (sync or async).
- `compensateFn(compensateInput | undefined, StepExecutionContext)`.
- The returned step function exposes `__step__` and `__type`.
- Calling the step returns a reference with `.config({name?, ...options})` and `.if(input, cond)`. `.if` is undocumented and used internally by `when`.

**`StepResponse`**
- `new StepResponse(output, compensateInput = output)`
- `StepResponse.permanentFailure(message = "Permanent failure", compensateInput?)` throws.
- `StepResponse.skip()`

**Other primitives**

| Function | Notes |
|---|---|
| `new WorkflowResponse(result, {hooks}?)` | |
| `transform(values, ...fns)` | Up to 7 chained functions. Each function receives `(value, stepArgs)`. |
| `when(input, cond)` / `when(name, input, cond)` | Each returns an object with `.then(fn)`. |
| `parallelize(...steps)` | Returns the same references, as an array. |
| `createHook(name, input, {resultValidator}?)` | Returns `{name, getResult()}`. |

**Exported types and helpers**
- Types: `WorkflowData`, `StepFunction`, `StepExecutionContext`, `ReturnWorkflow`, `UnwrapWorkflowInputDataType`, `WorkflowTransactionContext`, `Hook`, `InvokeFn`, `CompensateFn`, `ExportedWorkflow`, `MainExportedWorkflow`, `FlowRunOptions`, `FlowCancelOptions`, `FlowRegisterStepSuccessOptions`, `FlowRegisterStepFailureOptions`, `FlowRetryStepOptions`, `WorkflowResult`.
- Helpers also exported: `resolveValue`, `exportWorkflow`, `MedusaWorkflow`, `Composer` (namespace), `applyStep` and `wrapConditionalStep`.
- **These exported types encode the proxy model.** For example, `WorkflowData<T> = T & {__type, __step__, config}`. A rewrite must keep the type-level ergonomics. Issue #15174 fixed "excessive stack depth" problems in these types.

### 4.2 Orchestration exports (`@medusajs/framework/orchestration`)

`TransactionOrchestrator` (including the static `traceTransaction`/`traceStep`, `DEFAULT_TTL` and `getKeyName`), `DistributedTransaction`, `DistributedTransactionType`, `TransactionCheckpoint`, `TransactionContext`, `TransactionPayload`, `TransactionStep`, `TransactionStepError`, `OrchestratorBuilder`, `LocalWorkflow`, `WorkflowManager`, `WorkflowScheduler`, `GlobalWorkflow` (unused in-tree), the error classes (`PermanentStepFailureError`, `SkipStepResponse`, `SkipExecutionError`, `SkipCancelledExecutionError`, `SkipStepAlreadyFinishedError`, `TransactionStepTimeoutError`, `TransactionTimeoutError`, `NonSerializableCheckPointError`), the storage interfaces (`IDistributedTransactionStorage`, `IDistributedSchedulerStorage`, `DistributedTransactionStorage`, `DistributedSchedulerStorage`), the types (`TransactionStepsDefinition`, `TransactionModelOptions`, `SchedulerOptions`, `TransactionFlow`, `TransactionOptions`, `DistributedTransactionEvents`, `DistributedTransactionEvent`) and the re-exported enums.

**Where these are used outside the package:**
- the engine modules;
- `packages/medusa` instrumentation;
- the dev-server HMR reloaders (`global.WorkflowManager.unregister`, in `packages/medusa/src/commands/utils/dev-server/reloaders/workflows.ts:109` and `jobs.ts:44`);
- test utilities;
- probably third-party plugins. Any of these exports can be imported from `@medusajs/framework/orchestration`, so all of them are de-facto public.

### 4.3 Engine module service (`IWorkflowEngineService`, `Modules.WORKFLOW_ENGINE = "workflows"`)

The interface is defined in `packages/core/types/src/workflows-sdk/service.ts:47-144`.

**Methods:**
- `retrieveWorkflowExecution`, `listWorkflowExecutions`, `listAndCountWorkflowExecutions`, plus the full generated `MedusaService` CRUD (`createWorkflowExecutions`, `deleteWorkflowExecutions`, and so on). The list methods support a `q` filter.
- `run(workflowIdOrWorkflow, {input, transactionId, context, resultFrom, throwOnError, logOnError, events, container})`. It returns `{acknowledgement, result, errors, transaction, thrownError}`. Callers rely on these behaviors:
  - `options` is deep-cloned through JSON, so `events` functions passed through the module are dropped.
  - `throwOnError` defaults to `true`.
  - `transactionId` defaults to `"auto-<ulid>"`.
- `getRunningTransaction(workflowId, transactionId)`. It returns a `DistributedTransaction`, or throws `Transaction <id> could not be found.`
- `setStepSuccess({idempotencyKey, stepResponse, options})` and `setStepFailure({..., options: {forcePermanentFailure}})`.
  - `idempotencyKey` is either the string `wf:trx:step:invoke|compensate` or the object `{workflowId, transactionId, stepId, action}`.
  - Both throw `Cannot set step success|failure when status is <status>` if the step is not in `waiting_response`.
  - `setStepFailure` rethrows the step error unless `throwOnError: false`; this is tested in redis `index.spec.ts:669-727`.
- `retryStep({idempotencyKey, options})`.
- `subscribe({workflowId, transactionId?, subscriber, subscriberId?})` and `unsubscribe({workflowId, transactionId?, subscriberOrId})`.
  - The subscriber receives `{eventType, workflowId, transactionId, step?, response?, result?, errors?, state?}` (and `isFlowAsync` in redis).
  - `eventType` is one of `onBegin`, `onResume`, `onCompensateBegin`, `onFinish`, `onTimeout`, `onStepBegin`, `onStepSuccess`, `onStepFailure`, `onStepAwaiting`, `onCompensateStepSuccess`, `onCompensateStepFailure`.
  - Transaction-scoped subscribers are removed after `onFinish`.
  - Re-subscribing with the same `subscriberId` replaces the previous handler.
- `cancel(workflowId, {transactionId, context, throwOnError, logOnError, events, container})`.
  - It returns `{acknowledgement: {..., exists}, ...}`.
  - A missing transaction returns `{acknowledgement: {exists: false}}` when `throwOnError: false`, and otherwise throws `Transaction not found`.
  - Cancelling a `FAILED` transaction throws `Cannot revert a permanent failed transaction.`
  - Cancelling a compensating transaction throws `Cannot revert a transaction that is already compensating.`
  - Completed transactions **can** be cancelled (compensated) if they are still stored, which requires `retentionTime`.
- `__hooks.onApplicationStart` / `onApplicationPrepareShutdown` / `onApplicationShutdown`.

**Module options:**
- in-memory: none;
- redis: `{redis: RedisWorkflowsOptions}` (section 3.6).

**Linkable entity.** `workflow_execution` is used through `query.graph({entity: "workflow_executions"})` (tests) and through `remoteQuery` in the admin API.

### 4.4 HTTP API (`packages/medusa/src/api/admin/workflows-executions/**`)

Protected by RBAC `workflow_execution` read.

- `GET /admin/workflows-executions` takes `q`, `transaction_id`, `workflow_id`, `state`, `created_at`, `limit`, `offset` and `fields`. It returns `{workflow_executions, count, offset, limit}`.
- `GET /admin/workflows-executions/:id`
- `GET /admin/workflows-executions/:workflow_id/:transaction_id`
- `POST /admin/workflows-executions/:workflow_id/run` takes `{input?, transaction_id?}` and returns `{acknowledgement}`.
- `POST /admin/workflows-executions/:workflow_id/steps/success` and `/steps/failure` take `{transaction_id, step_id, response?, compensate_input?, action?}`. The engine is called with `stepResponse = new StepResponse(response, compensate_input)`.
- `GET /admin/workflows-executions/:workflow_id/subscribe` and `/:workflow_id/:transaction_id/subscribe` stream SSE.

Product import confirmation (`/admin/products/imports/:transaction_id/confirm`) resumes the `waitConfirmationProductImportStep` async step through `setStepSuccess`. That step is `async`, has a `timeout` of 3600 s and an empty handler.

**Admin dashboard contract.** The dashboard (`packages/admin/dashboard/src/routes/workflow-executions/**`) and the HTTP types (`packages/core/types/src/http/workflow-execution/admin/entities.ts`) read the following paths from each execution. The persisted JSON shape is therefore a compatibility constraint, unless a mapping layer is added in the API.

- `execution.steps[<pathId>]`:
  - `.id`; the last `.` segment is the step name and `_root` is filtered out;
  - `.invoke.state` and `.invoke.status`;
  - `.compensate.state`;
  - `.depth`, `.startedAt` and `.definition`.
- `context.data.invoke[step].output.output` and `.output.compensateInput`.
- `context.data.payload`.
- `context.errors[]`, matched by `.action`.

### 4.5 Behavioral contracts (tested)

**Concurrency and storage**
- **Concurrent runs with the same transaction id.** Two concurrent `run`s with the same manual `transactionId` on a stored workflow: one succeeds, and the other rejects with `Transaction already started for transactionId: <id>`. Tested in redis `index.spec.ts:521-559`.
- **Execution retention.** A finished execution without `retentionTime` is removed from `workflow_execution`. With `retentionTime` it is kept, including in `failed` or `reverted` state. Tested in redis `:561-667`.
- **Re-running a finished transaction id.** A non-idempotent finished execution that is still stored can be re-run with the same `transactionId`, which creates a new `run_id`. Tested in redis `:729-793`.
- **Idempotent workflows.** An idempotent workflow returns its stored result after completion. Tested in inmemory `index.spec.ts:1064-1103`.

**Failure handling and timeouts**
- **Timeouts.** A step timeout or a transaction timeout reverts the whole transaction, including transactions with async steps. Tested in redis `:795-913`.
- **Retries.**
  - `maxRetries` retries automatically.
  - `autoRetry: false` stops and waits for a manual `retryStep`.
  - `retryInterval` reschedules the step. Tested in `retry-interval.spec.ts`.
- **Race conditions.** Parallel async steps and parallel sync steps save without losing updates. `retryIntervalAwaiting` does not race-continue. Tested in `race.spec.ts`.
- **Partial compensation data.** A failing step with `StepResponse.permanentFailure(msg, data)` passes `data` to its own compensation. Tested in `compose.spec.ts:2752`.
- **Steps that throw.** A step that throws receives `undefined` in its own compensation. Tested in `compose.spec.ts:2401`.
- **Skip on permanent failure.** `skipOnPermanentFailure` with a step name skips steps until that step. Tested in `compose.spec.ts:1446`.

**Events, nesting, scheduling and composition**
- **Grouped events.** Grouped events are released once on success and cleared on failure. Tested in `compose.spec.ts:2628-2750`.
- **Cancelling.** Cancelling a nested `runAsStep` (sync or async) cancels the child as well. Cancelling a completed workflow compensates it. Tested in the `Cancel transaction` suites of both engines.
- **Scheduled workflows.** They run, and they stop after `numberOfExecutions`. A scheduled workflow is removed if it no longer exists, and it has access to the shared container.
- **Workflow re-definition.** Defining the same workflow id with a different step graph throws. Tested in `compose.spec.ts:2580`.
- **Multiple hook handlers.** Registering more than one handler for the same hook throws.

---

## 5. Feature inventory

**Usage column legend:**
- "core-flows" counts come from grepping `packages/core/core-flows/src`.
- "unused" means the feature is not used in production code; only the SDK and tests use it.

| # | Feature | Where implemented | How it works | Usage |
|---|---|---|---|---|
| 1 | `createWorkflow` (string or options) | `create-workflow.ts:102` | Runs the composer once at import and registers the flow and handlers in `WorkflowManager` | 341 files (12 with options) |
| 2 | `createStep` | `create-step.ts:434` | Handler pair `{invoke, compensate}`; `addAction` on the builder | 463 files |
| 3 | `StepResponse(output, compensateInput)` | `helpers/step-response.ts` | Serialized through `toJSON` into `context.invoke[step].output` | 518 uses |
| 4 | Plain return value from a step | `create-step-handler.ts:96-101` | Stored as `{__type, output: value}`; also used as the compensate input | common |
| 5 | `StepResponse.permanentFailure` | `step-response.ts:24`, orchestrator `:1240` | Throws `PermanentStepFailureError`; skips retries | unused |
| 6 | `StepResponse.skip()` | `step-response.ts:34`, orchestrator `:652` | Step state becomes SKIPPED | lock steps only |
| 7 | `WorkflowResponse(result, {hooks})` | `workflow-response.ts` | `$result` resolved at the end; hooks drive typing | 286 files |
| 8 | `transform` | `transform.ts` | Lazy resolver cached per in-memory transaction instance; not persisted | 664 lines |
| 9 | Proxy property access | `proxy.ts` | Implicit transform | ubiquitous |
| 10 | `when` / `then` (named and unnamed) | `when.ts`, `create-step.ts:356` | Each step's invoke is wrapped with the condition; false returns skip; a non-step return value creates a passthrough step | 143 lines (14 named) |
| 11 | `parallelize` | `parallelize.ts`, `OrchestratorBuilder.mergeActions` | Siblings under one parent; the next step attaches to the last branch, with a sibling barrier | 94 lines |
| 12 | `createHook` and `hooks.x(fn)` | `create-hook.ts` | A no-op step whose handler is replaced; one handler per hook | 80 files |
| 13 | `hook.getResult()` and `resultValidator` | `create-hook.ts:39-55,95-102` | Extra step `get-<name>-result` | 31 uses |
| 14 | `runAsStep` (sync) | `create-workflow.ts:204` | Inline `workflow.run` inside a step; compensation cancels the child | 113 files |
| 15 | `runAsStep` (async/nested) | same, plus `triggerParentStep` | Child runs through the engine and reports success or failure to the parent step by idempotency key | e.g. `import-products.ts:124` |
| 16 | `.config({name})` | `create-step.ts:206` | Renames the action (replace by uuid); needed to reuse a step | about 300 uses |
| 17 | `async` + `backgroundExecution` | orchestrator `:1252-1298`, `create-step.ts:300` | Not awaited; completes in the background and continues through a 0-delay retry job | export, import and reindex workflows |
| 18 | `async` waiting on an external signal | same | The step waits in `waiting_response` until `setStepSuccess` or `setStepFailure` | product import confirm |
| 19 | `compensateAsync` | orchestrator `:965-968, 1008-1010` | Async compensation | unused |
| 20 | `timeout` (step) | orchestrator `:300-322, 717-754` | Checked after the handler and by a scheduled job (async steps only) | 1 |
| 21 | `timeout` (workflow) | orchestrator `:272-298`, `distributed-transaction.ts:644` | Checked in the loop; a job is scheduled only when the workflow has async steps | unused |
| 22 | `maxRetries` | orchestrator `:805, 1385` | Retries immediately in the same loop, or after `retryInterval` | unused in core-flows |
| 23 | `retryInterval` | orchestrator `:464-475` | Retry job; makes the workflow a background workflow | unused (lock step implements its own loop) |
| 24 | `autoRetry: false` | orchestrator `:452-458, 872-879` | Requires a manual `retryStep` | unused |
| 25 | `retryIntervalAwaiting` / `maxAwaitingRetries` | orchestrator `:426-448`, `transaction-step.ts:189` | Re-invokes a waiting step periodically; uses versioning | unused |
| 26 | `continueOnPermanentFailure` | orchestrator `:830-862` | The flow continues; flow `hasFailedSteps=true`; the final state is DONE | 1 (`process-payment.ts:240`) |
| 27 | `skipOnPermanentFailure` (boolean or name) | orchestrator `:840-858` | Descendants become SKIPPED_FAILURE, optionally up to the named step | unused |
| 28 | `noCompensation` | `create-step.ts:184`, orchestrator `:1098` | Set automatically when no compensate function is given | implicit plus 7 explicit |
| 29 | `saveResponse: false` | orchestrator `:558, 1329` | The output is not stored | unused |
| 30 | `noWait` | orchestrator `:220` | Skips the sibling barrier | unused |
| 31 | `store` / `retentionTime` / `idempotent` | orchestrator `:1506`, storages | Persistence and retention; idempotent returns the stored result | complete-cart, plus `idempotent: false` on 10 cart workflows |
| 32 | `schedule` (cron, interval, numberOfExecutions, concurrency) | `scheduler.ts`, storages | Repeatable BullMQ job or `setTimeout`; `concurrency` is not enforced | jobs loader |
| 33 | Cancel (running or completed) | orchestrator `:1465-1504`, `LocalWorkflow.cancel` | Moves to WAITING_TO_COMPENSATE, then compensates | API, loyalty plugin |
| 34 | `setStepSuccess` / `setStepFailure` / `retryStep` | orchestrator `:1922-2078`, engine services | Located by idempotency key; requires `waiting_response` | HTTP, imports |
| 35 | Subscriptions | engine `subscribe`/`notify` | In-process map; Redis pub/sub for async flows | admin SSE, tests |
| 36 | Event grouping | `workflow-export.ts:590`, `LocalWorkflow` proxy | `eventGroupId` propagated; release or clear on finish | all workflows |
| 37 | Context injection into module services | `local-workflow.ts:96-138` | Proxy on resolved modules injects the Medusa context | all workflows |
| 38 | Tracing | orchestrator `traceTransaction` / `traceStep` | OpenTelemetry hooks | instrumentation |
| 39 | Runtime flow editing (`LocalWorkflow.addAction`...) | `local-workflow.ts:527-612` | Public but legacy | tests only (in-tree) |
| 40 | Dev-server HMR (`registerDevServerResource`, `unregister`) | `create-workflow.ts:120`, `create-step.ts:168,506` | Reload workflows and jobs | dev |
| 41 | Locking steps | `core-flows/src/locking/steps/*` | Locking module with a retry loop; skipped in sub-workflows unless `executeOnSubWorkflow` | 48 files |
| 42 | `useQueryGraphStep` / `useRemoteQueryStep` | `core-flows/src/common/steps` | Regular steps calling Query | 78 and 87 files |
| 43 | `emitEventStep` / `releaseEventsStep` | `core-flows/src/common/steps/emit-event.ts`, `release-event.ts` | Grouped emit with compensation; explicit release | 107 files |

---

## 6. Known limitations, complexity hotspots, performance and reliability issues

### 6.1 Performance

1. **Super-linear engine overhead per step [verified].** These are average engine-only costs (no persistence, about 100-byte outputs) for a sequential workflow:

   | Steps | Average run time |
   |---|---|
   | 10 | 0.6 ms |
   | 50 | 17 ms |
   | 200 | 650 ms |

   In a CPU profile of the 200-step run, **92.9% of the time is in `getPreviousStep`** (`transaction-orchestrator.ts:167-172`). The causes compound:
   - `getPreviousStep` splits the path id string, which has O(depth) length.
   - It is called from `canContinue` for every step on every scan.
   - `computeCurrentTransactionState` scans all steps once per loop iteration and **again for every step started in that iteration** (`:1013`).

   The result is roughly O(N^2 × depth). Real core-flows workflows have tens of steps, plus hidden `when` passthrough steps and `get-<hook>-result` steps.
2. **Checkpoint size grows quadratically with depth [verified]** (section 3.2): 650 KB of flow for 200 steps, before counting the context. The flow carries the full nested `definition` and a copy of the definition in each step. Sync `runAsStep` also embeds the child `DistributedTransaction` as its compensate input (`create-workflow.ts:253-256`).
3. **Checkpoint frequency.** A stored 2-step workflow makes 7 `save` calls [verified]. Each save:
   - JSON-stringifies the context once as a validity check (`distributed-transaction.ts:712-718`);
   - deep-copies the flow through JSON (`:746-750`);
   - is serialized again by storage. Redis `JSON.stringify` and a pipeline SET; in-memory `JSON.parse(JSON.stringify(flow/context))` (inmemory `:408-412`); and Postgres jsonb for both columns.
   - performs a race-check read. That is a Redis GET, and a Postgres SELECT if the Redis key is missing. With versioning, it also does a lock SET plus a `get()` (Postgres SELECT) plus a merge.

   `get()` always queries Postgres, even in the Redis engine (redis `:474-494`).
4. **Per-run setup cost.** Every `wf(...)` call creates a new `LocalWorkflow`, which does all of the following:
   - deep-copies the flow definition through JSON (`orchestrator-builder.ts:21-36`);
   - clones the orchestrator, losing the cached sorted step lists;
   - copies the DI container;
   - monkey-patches `resolve` and wraps every resolved module in a `Proxy`;
   - attaches and detaches EventEmitter listeners.

   The engine module's `run` also JSON-clones its options. `buildSteps` runs on every transaction creation and every load.
5. **Deep copies of step inputs.** `resolveValue` deep-copies every step input through `parseStringifyIfNecessary`. Issue #17253 (open) reports repeated deep copies on property access.
6. **Redis lock design.** The lock is a fixed 2-second TTL `SET NX` with no wait queue and no renewal. A failed acquire throws, then backs off and retries up to `parallelSteps + 2` times. Under contention this means busy retry loops. It also creates a correctness risk when a save takes longer than 2 s: the lock expires while the save is still writing.
7. **Pub/sub payload.** Messages include the full step object and the full result.
8. **Polling-style patterns.** `retryIntervalAwaiting` re-invokes waiting steps. The lock step loops with `retryInterval`. Test utilities poll `listWorkflowExecutions` for unfinished states.

### 6.2 Reliability and correctness

1. **No crash recovery scan** (section 3.9). A stored transaction that dies mid-sync-segment stays `invoking` forever unless a timeout job exists. In-memory engine state is lost on restart.
2. **Persisted state can be inconsistent across stores.** In the Redis engine:
   - the flow comes from Redis;
   - the context comes from Postgres;
   - `saveToDb` skips intermediate saves using a heuristic (`saveToDb`, redis `:335-410`). The heuristic relies on object-key iteration order and on "the current step depth level contains a store step".

   Resume correctness therefore depends on that heuristic.
3. **Concurrency relies on exceptions as control flow.** `SkipExecutionError`, `SkipStepAlreadyFinishedError` and `SkipCancelledExecutionError` are thrown from storage and caught at many levels. Some paths:
   - **rethrow an expected error.** In `executeNext`, the post-async save `catch` (`:1044-1050`) sets `continueExecution = false` and then throws anyway.
   - **swallow errors that escape after a successful step.** See issue #17161 (OPEN).
   - **throw on transitions from status-machine races.** See issue #16825 (`ok -> temp_failure`).
4. **Transforms are not deterministic across resumes [verified].** They are re-evaluated when:
   - parallel steps consume the same transform;
   - the workflow result is computed;
   - another process resumes the transaction.

   Results are not persisted, so non-pure transforms (ulid, Date.now, random) give inconsistent values.
5. **Hidden background execution.** Adding `retryInterval`, `async` or `timeout` to a step changes the semantics of `run()`. The call returns before completion, and `throwOnError` cannot throw for failures that happen later (issue #10201). The `complete` route compensates by checking `transaction.hasFinished()`.
6. **Scheduling gaps.**
   - Redis does not enforce `concurrency: "forbid"` (redis `:443`).
   - The in-memory engine stops a job's schedule forever after a non-NOT_FOUND error. It also overflows `setTimeout` for long crons (#16280).
   - `scheduleWorkflow` is not awaited (`workflow-manager.ts:138-140`).
   - Duplicate and missed runs are reported often (section 7.2).
7. **Event release failure compensates a completed workflow** (`workflow-export.ts:654-660`). This was being fixed upstream in PR #17293. The user's `onFinish` callback is skipped on failure when an event bus exists.
8. **Unescaped idempotency key splitting.** Keys are built as `wf:trx:action:type` and parsed with `split(":")` in at least six places:
   - `transaction-orchestrator.ts:1825`
   - `local-workflow.ts:188`
   - `workflow-export.ts:261,306,348`
   - engine `buildIdempotencyKeyAndParts`

   A `transactionId` or workflow id that contains `:` breaks resumption. The storage key `dtrx:wf:trx` is split the same way (inmemory `:295`, redis `:472`).
9. **Shared mutable state.**
   - The composer context is a global variable, so composition must be synchronous and non-reentrant.
   - The `when` state is also a global, so nested `when` crashes [verified].
   - `stepConfig` objects are mutated (`uuid`, `noCompensation`), and that config is shared by every use of the step.
   - `context.idempotencyKey` is overwritten on the shared context by each step, including parallel ones (`create-step-handler.ts:22`).
   - `step.definition.backgroundExecution` is mutated at runtime.
10. **Behavioral drift between the two engines** (duplicated code). Examples:
    - the in-memory engine passes `runId` from options while Redis does not (`workflows-module.ts` diff);
    - `setStepSuccess` passes the original `options` instead of the computed `options_` (inmemory `:252-256`), while Redis's `setStepFailure` and `retryStep` pass `options_`;
    - the in-memory `cancel` accepts a workflow object while Redis takes only an id;
    - the subscriber notification models differ;
    - the Redis engine strips `onFinish` and calls it itself, while the in-memory engine passes it through.
11. **Subscriber event mapping bug.** `onCompensateStepFailure` calls the user's `onStepFailure` callback (inmemory `:846`, redis `:978`). `onStepSkipped` is never forwarded to subscribers.
12. **Limited error reporting.** Only invoke errors are returned in `errors`. When compensation fails, the flow ends `failed`, but the caller sees only the original invoke error.
13. **Global registries keyed by id that throw on duplicates.** Duplicate package copies, plugins and Docker builds break startup (section 7.9). Hooks allow a single handler globally.
14. **No fencing for in-flight code changes.** A persisted transaction uses its stored `definition` (`loadTransactionById`, `:1584-1590`). The handlers are looked up by action name in the currently deployed code. If a step is renamed or removed while transactions are in flight, resume fails with `Handler for action "X" not found.` The engine has no workflow versioning.

### 6.3 Readability and maintainability hotspots

- **`transaction-orchestrator.ts` (2,079 lines).** A single class handles state machine, scheduling, timeouts, retries, persistence calls, events and tracing. Static methods mutate instances. Saves are retried in several places, each with slightly different error handling.
- **State-transition tables duplicated** between `TransactionStep` and `TransactionCheckpoint`.
- **`DistributedTransaction`** extends `EventEmitter`. It mixes in-memory event wiring, persistence (through a static storage), temporary caches and serialization.
- **Two engine modules are about 80% copy-paste**: services, storage, `saveToDb`, race checks and subscriber logic.
- **The SDK relies on several fragile mechanisms:**
  - proxies;
  - global symbols-as-strings;
  - `this` binding (`fn.bind(context)`);
  - runtime mutation of configs;
  - string-based `__type` dispatch.

  `resolveValue` has intertwined sync and async paths (`resolve-value.ts:46-182`).
- **`LocalWorkflow`** carries a legacy, mostly-unused graph-editing API. It also monkey-patches the DI container on every run.
- **Mostly-unused orchestration features add branches:** `noWait`, `retryIntervalAwaiting`, `maxAwaitingRetries`, `skipStep`, `GlobalWorkflow` and `storeExecution`.
- **Hidden-key conventions** (`" stepDefinition"`, `" getStepResult"`, `" output"`).

---

## 7. GitHub issues and PR history

This section comes from about 70 issue searches and 12 PR searches on `medusajs/medusa`, plus `git log --since=2024-06-01` (244 commits) on the four engine packages. **"CLOSED (stale)" means the stale bot closed the issue; it was not fixed.**

### 7.1 Retention and storage growth
The `workflow_execution` table and Redis keep growing. The `retentionTime`, `idempotent` and `store` options interact in confusing ways, and the cleaner once deleted unfinished executions.
- [#11175](https://github.com/medusajs/medusa/issues/11175) table grows too large
- [#9077](https://github.com/medusajs/medusa/issues/9077) long-running workflows not saved
- [#11189](https://github.com/medusajs/medusa/issues/11189) retentionTime unclear
- [#16562](https://github.com/medusajs/medusa/issues/16562) grouped events had no TTL
- [#14357](https://github.com/medusajs/medusa/issues/14357) Redis memory growth
- Fix [PR #12795](https://github.com/medusajs/medusa/pull/12795): the cleaner removed unfinished flows; the PR also stopped storing context in Redis
- Fix [PR #13236](https://github.com/medusajs/medusa/pull/13236): breaking change; `idempotent` no longer retains executions on its own

### 7.2 Scheduled jobs (the most reported category)
Jobs run twice, do not run, or run at the wrong time.

Root causes:
- BullMQ repeatable semantics and upgrades;
- server and worker both consuming the queue (fixed);
- `setTimeout` overflow in the in-memory engine;
- workflows not loaded in worker mode.

Issues:
- [#8422](https://github.com/medusajs/medusa/issues/8422) scheduled jobs fail with the Redis engine
- [#8888](https://github.com/medusajs/medusa/issues/8888) BullMQ queue-name colon
- [#8976](https://github.com/medusajs/medusa/issues/8976) empty `error:` log line
- [#11286](https://github.com/medusajs/medusa/issues/11286) sporadic runs and `Workflow with id job-... not found` (fixed by PR #11740)
- [#11869](https://github.com/medusajs/medusa/issues/11869) job not executing
- [#12373](https://github.com/medusajs/medusa/issues/12373) and [#12977](https://github.com/medusajs/medusa/issues/12977) jobs execute twice, CLOSED (stale)
- [#13393](https://github.com/medusajs/medusa/issues/13393) wrong timezone or skipped runs
- [#13452](https://github.com/medusajs/medusa/issues/13452) `queueName` ignored
- [#14889](https://github.com/medusajs/medusa/issues/14889) jobs stop after some time, CLOSED (stale)
- [#16280](https://github.com/medusajs/medusa/issues/16280) monthly cron tight-loop from `setTimeout` overflow, CLOSED (stale), fix PR not merged
- [#15442](https://github.com/medusajs/medusa/issues/15442) `index.ts` workflows not loaded in worker mode

### 7.3 Concurrency, races and checkpoint merging
Multiple processes act on the same transaction, and the engine relies on merge rules and skip-exceptions to resolve conflicts. This has caused orphaned orders, hung workflows and invalid-transition exceptions. The engine has been reworked several times: PRs [#11771](https://github.com/medusajs/medusa/pull/11771), [#13345](https://github.com/medusajs/medusa/pull/13345), [#13396](https://github.com/medusajs/medusa/pull/13396), [#13645](https://github.com/medusajs/medusa/pull/13645), [#13769](https://github.com/medusajs/medusa/pull/13769) (+2690/-1384, added versioning) and [#12903](https://github.com/medusajs/medusa/pull/12903).

Issues:
- [#16825](https://github.com/medusajs/medusa/issues/16825) orphaned order: a failing step in `parallelize` races its siblings
- [#17161](https://github.com/medusajs/medusa/issues/17161) **OPEN**: a checkpoint save error after a successful step escapes; no compensation, lock still held
- [#17022](https://github.com/medusajs/medusa/issues/17022) and [#15028](https://github.com/medusajs/medusa/issues/15028) `completeCartWorkflow` returns an empty `{id}`
- [#16440](https://github.com/medusajs/medusa/issues/16440) unreachable merge branch
- [#13301](https://github.com/medusajs/medusa/issues/13301) Stripe double capture

### 7.4 Async steps, retries, timeouts and resumption
Async steps and `retryInterval` silently turn a workflow into a background execution. Retry jobs collided on job ids. Checkpoints were not saved before async steps.

- [#10201](https://github.com/medusajs/medusa/issues/10201) error not thrown when `maxRetries`/`retryInterval` is set; "works as expected"
- [#12853](https://github.com/medusajs/medusa/issues/12853) container errors on `setStepSuccess`
- [#15136](https://github.com/medusajs/medusa/issues/15136) subscribe routes use `req.query` instead of `req.params`
- Fixes:
  - [PR #13786](https://github.com/medusajs/medusa/pull/13786) jobId collision hung retries
  - [PR #12138](https://github.com/medusajs/medusa/pull/12138) save before an async step
  - [PR #14037](https://github.com/medusajs/medusa/pull/14037) which steps require a save
  - [PR #14719](https://github.com/medusajs/medusa/pull/14719) continueOnPermanentFailure on timeout
  - [PR #13319](https://github.com/medusajs/medusa/pull/13319) use the step's maxRetries in setStepFailure
  - [PR #13391](https://github.com/medusajs/medusa/pull/13391) added autoRetry, maxAwaitingRetries and retryStep

### 7.5 Compensation correctness
A step that throws partway through gets no compensation input, so partial side effects leak. Many hand-written core-flows compensations are wrong.

- [#9844](https://github.com/medusajs/medusa/issues/9844) remote links not compensated inside parallelize
- [#17023](https://github.com/medusajs/medusa/issues/17023) remote-link step not atomic
- [#17055](https://github.com/medusajs/medusa/issues/17055) duplicated tax lines
- [#17222](https://github.com/medusajs/medusa/issues/17222) **OPEN** product update compensation loses prices
- [#17299](https://github.com/medusajs/medusa/issues/17299) **OPEN** deleted customer address not restored
- [#17294](https://github.com/medusajs/medusa/issues/17294) **OPEN** order placed on a cancelled payment
- [#13625](https://github.com/medusajs/medusa/issues/13625) inventory not released
- [#13667](https://github.com/medusajs/medusa/issues/13667) reverting deletes the Stripe customer
- [#15122](https://github.com/medusajs/medusa/issues/15122) `order.placed` emitted while compensation can still delete the order
- Fixes: [PR #16573](https://github.com/medusajs/medusa/pull/16573) await mutations in compensations; [PR #17293](https://github.com/medusajs/medusa/pull/17293) do not compensate a completed workflow when event release fails

### 7.6 Locking
Multi-key acquire is not all-or-nothing. Locks without an owner share `"*"`, leases are never renewed, and nested workflows deadlock on the parent's lock.

- [#14804](https://github.com/medusajs/medusa/issues/14804) `runAsStep` deadlock
- [#16285](https://github.com/medusajs/medusa/issues/16285) partial acquire and ABBA deadlocks
- [#16994](https://github.com/medusajs/medusa/issues/16994) Postgres advisory-lock deadlock
- [#16995](https://github.com/medusajs/medusa/issues/16995) **OPEN** Redis multi-key deadlock
- [#17031](https://github.com/medusajs/medusa/issues/17031) in-memory locking waits on its own first key
- [#17200](https://github.com/medusajs/medusa/issues/17200) **OPEN** lock steps share owner `"*"`, no renewal; payment captured without an order
- [#17284](https://github.com/medusajs/medusa/issues/17284) **OPEN** partial acquire keeps the keys it got
- Fixes: [PR #12646](https://github.com/medusajs/medusa/pull/12646), [PR #13535](https://github.com/medusajs/medusa/pull/13535), [PR #15397](https://github.com/medusajs/medusa/pull/15397), [PR #16768](https://github.com/medusajs/medusa/pull/16768)

### 7.7 Idempotency and transactionId reuse
- [#12184](https://github.com/medusajs/medusa/issues/12184) and [#12481](https://github.com/medusajs/medusa/issues/12481) cart cannot be completed a second time after a failed attempt
- [#14205](https://github.com/medusajs/medusa/issues/14205) Stripe webhook triggers premature completion
- Fixes: [PR #12362](https://github.com/medusajs/medusa/pull/12362) re-run a stored, non-idempotent, finished transaction; [PR #9231](https://github.com/medusajs/medusa/pull/9231); [PR #13236](https://github.com/medusajs/medusa/pull/13236); [PR #9507](https://github.com/medusajs/medusa/pull/9507) transactionId inheritance

### 7.8 Nested workflows (`runAsStep`)
- [#11840](https://github.com/medusajs/medusa/issues/11840) cannot use the same workflow twice
- [#13278](https://github.com/medusajs/medusa/issues/13278) `__resolver is not a function`
- [#12912](https://github.com/medusajs/medusa/issues/12912)
- Fixes: PRs [#12675](https://github.com/medusajs/medusa/pull/12675), [#12449](https://github.com/medusajs/medusa/pull/12449), [#12196](https://github.com/medusajs/medusa/pull/12196), [#11641](https://github.com/medusajs/medusa/pull/11641), [#9119](https://github.com/medusajs/medusa/pull/9119), [#10674](https://github.com/medusajs/medusa/pull/10674)

### 7.9 Global registry: duplicate ids and loading gaps
- [#7105](https://github.com/medusajs/medusa/issues/7105), [#10133](https://github.com/medusajs/medusa/issues/10133), [#11137](https://github.com/medusajs/medusa/issues/11137) and [#14748](https://github.com/medusajs/medusa/issues/14748): `Workflow with id ... and step definition already exists`
- [#11968](https://github.com/medusajs/medusa/issues/11968) a plugin and the app cannot both handle the same hook
- [#14125](https://github.com/medusajs/medusa/issues/14125) hooks not loaded during migrations
- [#12387](https://github.com/medusajs/medusa/issues/12387) `when is not a function` in Docker builds
- Fix: [PR #8462](https://github.com/medusajs/medusa/pull/8462) moved the registries onto `global`

### 7.10 DSL gotchas
- [#10003](https://github.com/medusajs/medusa/issues/10003) a transform is not run unless a step consumes it
- [#10194](https://github.com/medusajs/medusa/issues/10194) no loops over dynamic input
- [#13654](https://github.com/medusajs/medusa/issues/13654) hidden transforms on proxy property access
- [#13378](https://github.com/medusajs/medusa/issues/13378) metadata leaking into data
- Fixes:
  - [PR #17282](https://github.com/medusajs/medusa/pull/17282): a transform result with a `key` property broke `acquireLockStep({key})`
  - [PR #13467](https://github.com/medusajs/medusa/pull/13467), [PR #13655](https://github.com/medusajs/medusa/pull/13655)
  - [PR #12255](https://github.com/medusajs/medusa/pull/12255): steps returning `undefined`
  - [PR #10459](https://github.com/medusajs/medusa/pull/10459), [PR #9427](https://github.com/medusajs/medusa/pull/9427), [PR #11756](https://github.com/medusajs/medusa/pull/11756): `when`
  - PRs [#16520](https://github.com/medusajs/medusa/pull/16520) and [#16585](https://github.com/medusajs/medusa/pull/16585): ESLint rules against nested and unnamed `when`

### 7.11 Performance and serialization
- [#17253](https://github.com/medusajs/medusa/issues/17253) **OPEN**: deep copies on field reads, a regression from [PR #13421](https://github.com/medusajs/medusa/pull/13421)
- [PR #10674](https://github.com/medusajs/medusa/pull/10674) non-serializable state handling
- [PR #13413](https://github.com/medusajs/medusa/pull/13413) avoided unnecessary serialization

### 7.12 Event grouping and release
- [#15122](https://github.com/medusajs/medusa/issues/15122)
- [#7223](https://github.com/medusajs/medusa/issues/7223) events lost in worker mode
- [#15836](https://github.com/medusajs/medusa/issues/15836) test runner returns before background workflows settle
- Fixes: [PR #12157](https://github.com/medusajs/medusa/pull/12157), [PR #9177](https://github.com/medusajs/medusa/pull/9177), [PR #11641](https://github.com/medusajs/medusa/pull/11641), [PR #17208](https://github.com/medusajs/medusa/pull/17208), [PR #17293](https://github.com/medusajs/medusa/pull/17293)

### 7.13 Redis configuration and worker mode
- [#16697](https://github.com/medusajs/medusa/issues/16697) options type does not match the loader
- [#14094](https://github.com/medusajs/medusa/issues/14094), [#10171](https://github.com/medusajs/medusa/issues/10171) Redis URL errors
- Fixes: PRs [#11740](https://github.com/medusajs/medusa/pull/11740), [#13561](https://github.com/medusajs/medusa/pull/13561), [#14099](https://github.com/medusajs/medusa/pull/14099), [#14201](https://github.com/medusajs/medusa/pull/14201), [#13557](https://github.com/medusajs/medusa/pull/13557), [#8446](https://github.com/medusajs/medusa/pull/8446)

### 7.14 Errors, observability and typing
- [#13003](https://github.com/medusajs/medusa/issues/13003) errors show only `{handlerType}`
- [#9754](https://github.com/medusajs/medusa/issues/9754) admin page crash
- Typing: [#6084](https://github.com/medusajs/medusa/issues/6084), [#14625](https://github.com/medusajs/medusa/issues/14625), [#16751](https://github.com/medusajs/medusa/issues/16751); fix `fdec6f0358` (#15174) addressed TS "excessive stack depth"

### 7.15 Notable fix commits by theme (local git log)

| Theme | Commits |
|---|---|
| Races and checkpoints | `72d2cf9207` (#11771), `31abba8cde` (#12138), `bd206cb250` (#13345), `2b89510df3` (#13396), `76aa4a48b3` (#13645), `516f5a3896` (#13769), `1ea932a56f` (#14037), `c5d609d09c` (#12903), `13e159d8ad` (#11873, shared context reference), `b43b285125` (#13707) |
| Retries and async | `bad0858348` (#13786), `ff152e7ace` (#13319), `583deb57ea` (#14719), `01acf9e700` (#10913), `f9e8403d29` (#9482), `d7692100e7` (#13391) |
| Retention | `316a325b63` (#12795), `cb716856b6` (#13557), `1c987540aa` (#12775), `5b135a41fe` (#13629) |
| Scheduling and queues | `5c09f0813d` (#8446), `4155d0354f` (#8462), `cc8422d3a1` (#11740), `fc652ea51e` (#11800), `b1cba9fdeb` (#13151), `9633e0676e` (#13570), `68a643bb3a` (#13561), `6c3ec528f1` (#14099), `144f0f4e2e` (#14201), `7054b05d1f` (#16730) |
| Nesting, idempotency, cancellation | `ef8dc4087e` (#9119), `7c5415ba3a` (#9507), `7d8f6cf39f` (#10674), `7fdbf2a965` (#12449), `1a78476608` (#12675), `80007f3afd` (#12362), `9412669e65` (#13236), `b09c19912b` (#8765) |
| Events | `afae395fea` (#7668), `a227d73e4f` (#9177), `c250de7919` (#11641), `2f6963a5fb` (#12157) |
| SDK and performance | `55a35e4721` (#13413), `8e5c22a8e8` (#13421), `0079464f32` (#13467), `8734866eb1` (#13655), `fdec6f0358` (#15174) |
| Flaky tests (a timing-sensitivity signal) | `bb2cbe963a`, `bcba5b3a6c`, `a843721b15`, `f731790360` (#16533) |

### 7.16 Lessons from the history
1. **One durable source of truth** with versioned compare-and-set transitions. Do not use exceptions for expected races.
2. **Treat persistence failure as a first-class failure** that retries or compensates and releases locks.
3. **Make sync vs. background explicit** in the run result.
4. **Use one retention setting with clear defaults**, and clean up by state.
5. **Build scheduling with exactly-once claiming per tick**, support long intervals, and enforce concurrency.
6. **Make locks per-run, all-or-nothing and renewed**, and let nested workflows re-enter the parent's lock.
7. **Give compensation a way to record partial side effects.**
8. **Release domain events only after the point of no return.** A release failure must not roll back.
9. **Avoid global registries that throw on duplicates.** Allow multiple hook handlers.
10. **Keep the DSL predictable.** Persist transform results, and support loops.

---

## 8. Backwards-compatibility risks

These are subtle behaviors that a rewrite could break. Each one either needs a decision (keep, change with a migration, or change as a documented fix) or a mapping-layer shim.

1. **Composition runs once at import time and registers globally.** User workflows rely on import side effects: the workflow loader just imports files. Hook handlers are registered from separate files by calling `wf.hooks.x(...)` after the workflow module is loaded. Load order matters.
   - If a hook is registered after a run has started, that run uses whichever handler is in the global map when its step executes.
   - Re-defining the same id with an identical graph is allowed (HMR and duplicate imports); a different graph throws.
2. **Step identity is the action name.** It is unique per workflow, and renaming is done with `.config({name})`. The idempotency key `wf:trx:stepName:invoke|compensate` is used by:
   - external callers: the HTTP API, product-import confirm, payment flows and webhooks;
   - the `IdempotencyKeyParts.stepId` field, which is the action name and **not** the path id.

   Both forms must keep resolving.
3. **Plain return vs `StepResponse`.** A plain return value is used as both the output and the compensate input. Returning `undefined` gives `undefined` downstream. With `StepResponse(output, compInput)`, `compInput` defaults to `output`. A step that throws gets `undefined` as its compensation input, unless it used `permanentFailure(msg, data)` or an error that carries `getStepResponse()`.
4. **Async semantics depend on the return value.** An `async: true` step that **returns a `StepResponse`** auto-completes (implicit `backgroundExecution`). One that **returns nothing** waits for `setStepSuccess` or `setStepFailure`. For example, `waitConfirmationProductImportStep` relies on the "returns nothing" behavior.
5. **`run()` return semantics.**
   - It resolves when the workflow finishes, or when it reaches the first async, background or retry-interval point. In the second case `transaction.getState()` is `invoking` and `result` is resolved from a partial context, which may be `undefined` or partial (#15028).
   - `throwOnError` defaults to `true` and throws the **first invoke error**.
   - A cancel that ends `REVERTED` does not throw.
   - `errors` contains only invoke errors.
   - `transaction.hasFinished()` is used to detect concurrent cart completion.
6. **`transactionId` semantics.**
   - The default is `auto-<ulid>`, and the `auto-` prefix disables the "already started" `NX` check.
   - Re-running a finished, non-idempotent transaction id starts a new run (new `run_id`).
   - Running an idempotent workflow whose execution is still stored returns the stored result without re-executing.
   - Two concurrent runs of the same manual id: the second throws `Transaction already started for transactionId: ...`. Cart completion depends on this.
   - Child workflow transaction ids are derived as `<child>-as-step-<parentTrx>[-attempt-N]`.
7. **Persistence is implicit.** Workflows without store-forcing options are not persisted and do not show up in the admin executions list. Workflows with them are stored, and deleted on completion unless `retentionTime` is set. Child executions are kept until the parent reads them. If the rewrite persists everything, it changes visibility, retention cost and the admin UI.
8. **Persisted JSON shape.** The admin dashboard, HTTP types, test utilities (`waitWorkflowExecutions` filters by `state`) and probably user dashboards read:
   - `execution.steps[...]` keyed by path id, with `invoke`/`compensate` `state`/`status`, `depth`, `startedAt` and `definition`;
   - `context.data.invoke[step].output.output` and `context.data.payload`;
   - `context.errors`.

   The TransactionState and step-state enum string values are public as well.
9. **In-flight executions at upgrade time.** A rewrite must either drain or migrate stored executions (Redis `dtrx:*` keys, BullMQ jobs in `medusa-workflows*` queues, `workflow_execution` rows in `invoking` or `waiting_to_compensate`). Otherwise long-running async workflows, such as product imports waiting up to 1 h for confirmation, break across the upgrade. Repeatable scheduled-job keys (`schedule_<jobId>`) live in BullMQ.
10. **Event grouping contract.**
    - Events emitted by module services inside a workflow are grouped under its `eventGroupId` (through the container proxy that injects the context).
    - They are released only after the **root** workflow finishes successfully and cleared on failure.
    - Children and module `run` calls that share the `eventGroupId` must not release.
    - `emitEventStep`'s compensation clears its events.
    - `releaseEventsStep` releases them explicitly from within a step.
11. **Context injection into module services.** `LocalWorkflow` proxies modules so that a `@MedusaContext()` parameter is auto-filled with the workflow context (`transactionId`, `eventGroupId`, `idempotencyKey`, and so on) when the caller omits it. Modules and their events rely on this implicitly.
12. **StepExecutionContext fields** used by user code:
    - `container`, `context`, `eventGroupId`, `transactionId`, `idempotencyKey`, `attempt`, `metadata` (`model_id`, `idempotency_key`, `action`, `action_type`, `attempt`, `timestamp`);
    - `parentStepIdempotencyKey`, which the lock steps use to detect sub-workflows;
    - `preventReleaseEvents`, `runId`, `workflowId`, `stepName`, `action`;
    - the hidden members `" getStepResult"` and `" stepDefinition"`.
13. **`when` semantics.**
    - The condition is evaluated per step at that step's execution time.
    - Skipped steps produce `undefined`, are not compensated, and do not stop later steps.
    - The return value of `when().then()` is a passthrough step whose name comes from the `when` name, so that name appears in execution records.
    - Nested `when` is unsupported. A rewrite that makes it work is fine.
14. **Implicit steps appear in step lists and keys:** hook steps (named after the hook), `get-<hook>-result`, `when` passthrough steps, and `<workflow>-as-step`.
15. **Parallel semantics.**
    - `parallelize` runs sync steps concurrently in one batch.
    - The next step waits for **all** siblings (barrier), even though it is structurally attached to the last branch.
    - When one parallel step fails, siblings already in flight complete, and then all of them are compensated in reverse depth order. Same-depth steps are compensated concurrently.
16. **Compensation order and scope.**
    - Compensation runs in reverse **depth** order (not reverse completion order).
    - Steps without a compensate function are skipped.
    - TIMEOUT steps are compensated.
    - A failed compensation leads to `failed` state.
    - `continueOnPermanentFailure` ends `done` with `hasFailedSteps`.
    - `skipOnPermanentFailure` produces `skipped_failure` states.
17. **Retry semantics.**
    - `maxRetries` means the number of retries after the first failure (`failures > maxRetries`).
    - `retryInterval` is in **seconds**, and so are `timeout` and `retentionTime`. A scheduler `interval` is in **milliseconds**.
    - `autoRetry: false` requires a manual `retryStep`.
18. **Timeout semantics.** Timeouts do not interrupt the handler; they are only checked after it returns or when a job fires. The step's result is discarded and compensation runs. A transaction timeout overrides the continue and skip flags.
19. **Transform semantics.** Transforms are lazy (never run if unused), re-evaluated in some cases [verified], and receive `(input, stepArgs)`. Code that accidentally relies on re-evaluation (for example `new Date()` being "now" when the result is built) is rare, but if the rewrite persists transform results it changes timing. Proxy property access on step results (`step.id`, `step[0]`) must still work, including through arrays, and it creates an implicit transform.
20. **Deep-copy semantics.** Step inputs are deep-copied and JSON-normalized: Dates become strings in some paths, BigNumber values are serialized, functions are dropped. The engine module JSON-clones `options`. Steps that mutate their input do not affect other steps. A rewrite that passes references could introduce aliasing bugs.
21. **Scheduled jobs.**
    - The workflow id is `job-<name>` and the step is `<name>-as-step`.
    - The input is `{scheduledFor}` and `ScheduledJobContext.scheduledFor` is a Date.
    - Schedules run only in `worker` or `shared` mode.
    - `numberOfExecutions` is supported.
    - `concurrency` defaults to `"forbid"` in config, but is not enforced. Enforcing it changes behavior for long-running jobs.
22. **Subscriber API.**
    - The event names and payload shape are listed in 4.3.
    - Notifications are delivered asynchronously (`setImmediate`).
    - Transaction subscribers are auto-removed after `onFinish`.
    - Cross-instance delivery happens only for async flows in Redis.
    - The admin SSE endpoint depends on this API.
23. **`cancel` of completed workflows** works only while the execution is stored (`retentionTime` set). It throws on `failed` and on compensating transactions.
24. **Public internal APIs.**
    - `@medusajs/framework/orchestration` exports internals that third parties may use: `WorkflowManager`, `LocalWorkflow` and the graph-editing methods, `TransactionOrchestrator.traceStep`/`traceTransaction`, `DistributedTransaction.setStorage`, `MedusaWorkflow.getWorkflow`.
    - The SDK's `exportWorkflow` and `resolveValue` are used by the engine modules.
    - The dev-server HMR calls `global.WorkflowManager.unregister`.
    - A mapping layer should keep these names, or deprecate them explicitly.
25. **Redis module options and queue names** (`queueName`, `jobQueueName`, per-queue options, `pubsub`) and the in-memory vs Redis module paths (`@medusajs/medusa/workflow-engine-redis`) are user configuration.
26. **The migration story for the `workflow_execution` table.** Schema changes must be reconciled with the divergent migration histories of the two engines (section 3.4), and both engines share one table.

---

## 9. Appendix: core-flows and platform usage inventory

### 9.1 core-flows

Counts are files / lines and include TSDoc and tests unless noted.

| Item | Count / location |
|---|---|
| `createWorkflow(` | 341 / 345 (12 with an options object) |
| `createStep(` | 463 / 469 |
| `new StepResponse(` | 518 |
| `transform(` | 248 / 664 |
| `WorkflowResponse(` | 286 / 290 (79 with `hooks`) |
| `createHook(` | 80 / 94 (31 with `resultValidator`) |
| `when(` | 78 / 143 (14 named) |
| `parallelize(` | 80 / 94 |
| `.runAsStep(` | 113 / 206 |
| `.config(` | 145 / 333 (mostly `{name}`; top names: `order-query` 69, `order-change-query` 69) |
| `useQueryGraphStep(` / `useRemoteQueryStep(` | 78 / 143 and 87 / 208 |
| `acquireLockStep(` / `releaseLockStep(` | 48 / 50 each |
| `emitEventStep(` | 107 / 126 |
| `throw new MedusaError` | 165 (INVALID_DATA 115, NOT_ALLOWED 27, NOT_FOUND 12, ...) |

**Async and background steps:**
- `async` + `backgroundExecution`:
  - `order/workflows/export-orders.ts:93-94`
  - `product/workflows/export-products.ts:59-60`
  - `inventory/workflows/export-inventory-items.ts:60-61`
  - `search/workflows/reindex-search-indexes.ts:60-61`
  - `product/workflows/import-products.ts:124` (on a `runAsStep`)
- Waits for an external `setStepSuccess`: `product/steps/wait-confirmation-product-import.ts:12-17` (`async`, `timeout: 3600`, empty handler).
- `product/steps/process-import-chunks.ts:15-18`: `async`, returns `StepResponse`, and runs `batchProductsWorkflow(container).run(...)` imperatively inside the step.

**Failure and compensation flags:**
- `noCompensation: true`:
  - `rbac/steps/delete-rbac-policies.ts:22`, `rbac/steps/delete-rbac-role-policies.ts:22`
  - `api-key/steps/revoke-api-keys.ts:38`, `api-key/steps/delete-api-keys.ts:15`
  - `file/steps/delete-files.ts:22`
  - `payment-collection/workflows/create-payment-session.ts:148,171`
- `continueOnPermanentFailure`: `payment/workflows/process-payment.ts:240`.
- **Unused in production:** `compensateAsync`, `maxRetries`, step-level `retryInterval`, `skipOnPermanentFailure`, `saveResponse`, `StepResponse.permanentFailure`, `retryIntervalAwaiting`, `noWait`.
- `StepResponse.skip()`: only `locking/steps/acquire-lock.ts:71` and `release-lock.ts:53`. Both skip when `parentStepIdempotencyKey` is set, unless `executeOnSubWorkflow` is passed.

**Workflow-level options:**
- `cart/workflows/complete-cart.ts:354-360` is the only workflow with `store: true`, `retentionTime` (3 days) and `idempotent: false`.
- `idempotent: false` is set on `add-to-cart`, `update-cart`, `update-line-item-in-cart`, `update-cart-promotions`, `create-payment-collection-for-cart`, `refresh-cart-shipping-methods`, `refresh-payment-collection`, `transfer-cart-customer`, `refresh-cart-items` and `delete-line-items`.

**Steps with notable context or engine usage:**
- `common/steps/emit-event.ts:96-130`: copies `eventGroupId`; its compensation calls `clearGroupedEvents(eventGroupId, {eventNames})`; data may be a function of the context.
- `common/steps/release-event.ts:7-15`: explicit `releaseGroupedEvents`.
- `payment/steps/complete-cart-after-payment.ts:22-28`: resolves the engine and runs `completeCartWorkflow` by id.
- `notification/steps/notify-on-failure.ts:74-78`: a compensation-only step that sends notifications on rollback.

### 9.2 `packages/medusa`

- **Workflow runs from routes.** About 273 `xWorkflow(req.scope).run({input})` calls in 219 route files. Only 4 routes pass `context: {requestId}`. `throwOnError: false` is used by reset-password, cart complete and steps/failure.
- **Store routes that run workflows through the engine by id:**
  - carts (`api/store/carts/[id]/route.ts:30`, `line-items/*`, `promotions`, `customer`, `complete`)
  - `api/store/payment-collections/route.ts:34`
  - CLI `commands/user.ts`
- **Cart completion.** `api/store/carts/[id]/complete/route.ts` throws CONFLICT if `!transaction.hasFinished()`.
- **Async exports.** `products/export`, `inventory-items/export` and `products/imports` return `transaction.transactionId` with a 202.
- **Webhooks.** `subscribers/payment-webhook.ts:61-62` runs `processPaymentWorkflow` through the engine.
- **Instrumentation.** `src/instrumentation/index.ts:262-306`.
- **Dev-server HMR.** `commands/utils/dev-server/reloaders/workflows.ts:109`, `jobs.ts:44`, plus `registerDevServerResource` in the SDK and loaders.

### 9.3 Other dependents

- **Loyalty plugin (`packages/plugins/loyalty`).**
  - Registers hook handlers with compensation on `completeCartWorkflow.hooks.orderCreated` and `.beforePaymentAuthorization`.
  - Inside a hook, runs another workflow with `context: {...stepContext, preventReleaseEvents: true}`.
  - Compensates by calling `otherWorkflow(container).cancel({transactionId})`.
  - Runs `createGiftCardsWorkflow.run(...)` from a subscriber.
- **Test utilities.**
  - `medusa-test-utils/src/medusa-test-runner-utils/wait-workflow-executions.ts` polls `listWorkflowExecutions({state: {$nin: [...]}})`.
  - Integration tests use `MedusaWorkflow.getWorkflow("job-...")` and `createCartWorkflow.hooks.setPricingContext`.
- **js-sdk.** `admin.workflowExecution.list` and `retrieve` only.

---

## Appendix: experiment scripts

The scripts are in `/private/tmp/claude-501/-Users-sradevski-Code-medusa-medusa/f3ba683f-bc7b-4c98-a055-3a387b0b0343/scratchpad/exp/` and run against `packages/core/*/dist`:

| Script | What it checks |
|---|---|
| `t1.js` | Compiled flow shape, path ids, and the context layout |
| `t2.js` | Nested `when` crash at composition time |
| `t3.js` | Per-run overhead and flow size as step count grows; CPU profile showing `getPreviousStep` dominates |
| `t4.js` | Checkpoint save count for a stored workflow |
| `t5.js` | Transform recomputation for the workflow result |
