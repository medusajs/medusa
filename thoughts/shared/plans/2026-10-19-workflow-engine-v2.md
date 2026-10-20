# Workflow Engine v2 Implementation Plan

## Overview

Replace `@medusajs/orchestration`, `@medusajs/workflow-engine-inmemory` and `@medusajs/workflow-engine-redis` with:

- a standalone engine package, `@medusajs/workflow-engine` (`packages/core/workflow-engine`);
- a thin Medusa module, `@medusajs/workflows` (`packages/modules/workflows`);
- rebuilt internals in `@medusajs/workflows-sdk`.

The design is the agreed architecture in the doc "Workflow Engine v2: Architecture Proposal" (https://claude.ai/code/artifact/a928ce01-03f8-47e5-a6c2-371a07c8710e). This plan does not redesign it. Where this plan departs from the doc, the change was decided during planning and is listed in "Decisions taken during planning".

## Decisions taken during planning

The doc was reviewed against the code, and these answers from planning change how it is delivered:

1. **One cutover, no dual engine.** All work lands on one branch, `feat/workflow-engine-v2`, and merges to `develop` once.
   - The phases below are milestones on that branch, each with its own exit criteria. They are not separate releases.
   - There is no feature flag and no period where both engines serve traffic.
   - This replaces the doc's risk mitigation "run every integration suite against both engines behind a feature flag". Instead, we record a baseline of the HTTP and module suites on `develop` before starting and compare against it (see Milestone 0).
2. **HTTP integration tests stay engine-agnostic.** The `integration-tests/http` suite must pass with no changes, except the five spec edits that decision 11 forces (item 4 below).
   - Unit tests may be rewritten freely to match the new packages.
3. **New tables, legacy table untouched.** The new module creates new tables: `workflow_run`, `workflow_step`, `workflow_timer`, `workflow_schedule`, `workflow_worker` and `workflow_outbox`.
   - These come from DML models through `yarn migration:create`.
   - `workflow_execution` is not renamed, and no view is created. No hand-written migration is needed.
   - The admin list and retrieve read the new tables only. On startup the module counts non-final rows in `workflow_execution` (if the table exists), logs their ids, and with `legacy: "fail"` (the default) marks them `failed`. The table is dropped in the next major.
   - This replaces the doc's "Migration" paragraph (rename plus a `UNION ALL` view). Old execution history is no longer visible in the admin after the upgrade. The upgrade guide says how to query it.
4. **Decision 11 is kept strictly.** Only loaders register workflows. `MedusaWorkflow` and `WorkflowManager` are removed. Five HTTP specs get minimal edits:
   - `integration-tests/http/__tests__/workflow-engine/admin/index.spec.ts` (inline workflows run by id): call `registerWorkflows([...])` after each `createWorkflow`.
   - `integration-tests/http/__tests__/cart/store/cart.spec.ts:8083` (inline `test-workflow`): the same.
   - `integration-tests/http/__tests__/order/admin/order.spec.ts:4579`: the same.
   - `integration-tests/http/__tests__/feature-flag/resources-with-flags.spec.ts:35,40` and `resources-without-flags.spec.ts:32,37`: replace `MedusaWorkflow.getWorkflow(id)` with a lookup in `listRegisteredWorkflows()` on the resolved module.
5. **SDK runtime tests move to the module package.**
   - The SDK must not depend on the module (the module depends on the SDK; a dev dependency back would make a cyclic turbo graph).
   - So the 66 runtime cases in `workflows-sdk/src/utils/composer/__tests__/{compose,index}.spec.ts` move to `packages/modules/workflows/src/__tests__/sdk/` and run against the module with `store: "memory"`.
   - The SDK keeps compiler-only unit tests (definition shape, edges, hashing, types).
6. **The engine depends on `cron-parser`.** The doc lists the engine's dependencies as "Node.js only" (plus optional `pg`/`ioredis`). We add `cron-parser`, already used in the repo, as a regular dependency instead of writing a cron parser. Flagged in the summary for confirmation.
7. **The composition-time global stays.** `global[SymbolMedusaWorkflowComposerContext]` is set only while a composer function runs. It stays in the SDK so that duplicate package copies keep composing (#8462). The registries (`WorkflowManager`, `MedusaWorkflow`) are removed, as the doc says. The engine package has no globals.
8. **The codemod skips `integration-tests/http`.** Those specs keep their deprecated direct calls, so the HTTP suite also proves the deprecated path still works.

## Current State Analysis

- **SDK.** `packages/core/workflows-sdk` depends on orchestration at runtime in these places:
  - `WorkflowManager` (`create-workflow.ts:129-177`, `create-step.ts:248`).
  - `LocalWorkflow` as the runner base object (`helper/workflow-export.ts:72`).
  - `OrchestratorBuilder.addAction/replaceAction/mergeActions` (`create-step.ts:186,240`, `parallelize.ts`).
  - The `WorkflowStepHandlerArguments` runtime shape (`helpers/create-step-handler.ts:12-53`, `transform.ts:161-229`).
  - `PermanentStepFailureError` and `SkipStepResponse` (`helpers/step-response.ts`).
  - About 12 exported types reference orchestration types (`utils/composer/type.ts:1-9`, `helper/type.ts:1-7`).
- **SDK tests.** Two files, 66 cases.
  - Workflows run with `workflow().run()` with no container, `workflow.run()`, or `workflow(container).run()` (the last only in the three grouped-event tests, `compose.spec.ts:2690-2886`).
  - Six cases touch internals: `WorkflowManager.unregisterAll`, `MedusaWorkflow.workflows = {}`, `DistributedTransaction.setStorage` (`compose.spec.ts:2786-2812`), `WorkflowScheduler.setStorage` (`:50`), and `getFlow().next/.async/.nested/.hasSkippedSteps` (`index.spec.ts:52-145`, `compose.spec.ts:1578,1595`).
- **Other orchestration consumers.**
  - `packages/core/framework/src/orchestration/index.ts` (the `@medusajs/framework/orchestration` subpath).
  - `packages/core/framework/src/jobs/job-loader.ts:1` (the `SchedulerOptions` type).
  - The framework tests `jobs/__tests__/register-jobs.spec.ts` and `workflows/__tests__/index.spec.ts`.
  - `packages/medusa/src/instrumentation/index.ts:263-302` (`traceTransaction`/`traceStep`).
  - The dev-server reloaders through `global.WorkflowManager` (`packages/medusa/src/commands/utils/dev-server/index.ts:51-74`, `reloaders/workflows.ts:109,160`, `reloaders/jobs.ts:43-46`).
  - `packages/eslint-plugin/src/rules/import-from-framework-not-internal/rule.ts:16`.
- **Module wiring.**
  - `MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE]` (`packages/core/utils/src/modules-sdk/definition.ts:54`) and `TEMPORARY_REDIS_MODULE_PACKAGE_NAMES` (`:78-97`).
  - `defineConfig` adds the engine at `define-config.ts:376,418-424,458`, with about 15 snapshot assertions in `__tests__/define-config.spec.ts`.
  - The re-export files are `packages/medusa/src/modules/workflow-engine-{inmemory,redis}.ts`. `ModulesDefinition` is at `packages/core/modules-sdk/src/definitions.ts:111-122`.
- **Loaders.**
  - Workflows self-register on import.
  - `WorkflowLoader.onFileLoaded` unregisters the exports of skipped files (`workflow-loader.ts:14-30`).
  - Core-flows register when `@medusajs/core-flows` is first imported, at `packages/medusa/src/loaders/index.ts:227`, after modules, plugin workflows, subscribers, jobs and entrypoints have loaded.
- **Events.**
  - `attachOnFinishReleaseEvents` (`workflow-export.ts:590-659`) releases or clears grouped events.
  - `emitEventStep` and `releaseEventsStep` (`core-flows/src/common/steps/emit-event.ts:76-134`, `release-event.ts:5-18`) call the bus directly.
  - Grouping is implemented per provider (`event-bus-local.ts:89-195`, `event-bus-redis.ts:301-351`).
  - Modules resolve the event bus lazily from the shared container (`modules-sdk/src/loaders/utils/load-internal.ts:297-317`). Link modules get it eagerly (`medusa-app.ts:547-552`).
- **Test infrastructure.**
  - `waitWorkflowExecutions` polls `listWorkflowExecutions({ state: { $nin: ["not_started","done","reverted","failed"] } })` (`packages/medusa-test-utils/src/medusa-test-runner-utils/wait-workflow-executions.ts:10-35`).
  - CI runs the HTTP suite in 4 shards and the modules suite in 4 shards, with Postgres and Redis services (`.github/workflows/action.yml:279-421`).
  - `integration-tests/modules/medusa-config.ts:129-132` hard-wires the in-memory engine.
- **Existing tests to port.** `workflow-engine-inmemory` has 37 integration cases and `workflow-engine-redis` has 37, across `index`, `race`, `retry-interval` and `subscribe` specs, plus about 20 workflow fixtures each.
- **Tooling.** Codemods already exist: `medusa codemod <name>` (`packages/cli/medusa-cli/src/codemods/`, with `replace-zod-imports.ts` as the model). ESLint rules live in `packages/eslint-plugin/src/rules/<name>/` and are tested with `createRuleTester()`.

## Desired End State

- `packages/core/workflow-engine` exists and has no `@medusajs/*` imports. It ships `MemoryStore`, `PostgresStore`, the polling, `LISTEN/NOTIFY` and Redis notifiers, heartbeat recovery and the outbox extension. It passes its unit tests, the store conformance suite on both stores, the multi-process crash tests and the benchmark targets.
- `packages/modules/workflows` is the only `Modules.WORKFLOW_ENGINE` implementation and is registered by default. `IWorkflowEngineService` keeps its methods and DTOs, and gains `registerWorkflows`, `unregisterWorkflows` and `listRegisteredWorkflows`.
- `@medusajs/workflows-sdk` keeps every public DSL signature. It has no orchestration dependency, sends every run-time call through the module, and has no registries.
- `packages/core/orchestration`, `packages/modules/workflow-engine-inmemory` and `packages/modules/workflow-engine-redis` are deleted, together with their re-exports.
- `defineConfig` filters out old engine entries with one warning and carries over their Redis URL.
- Direct calls such as `wf(container).run()` are deprecated, warn in development, have an ESLint rule with an autofix, and are migrated in production code.
- These all pass:
  - `yarn test`
  - `yarn test:integration:packages`
  - `yarn test:integration:modules`
  - `yarn test:integration:http` (unchanged apart from the five specs)
  - the module's ported integration tests
  - the benchmarks
- The upgrade guide, the What's New entry and the changesets are in.

### Key Discoveries

- The step idempotency key format `wf:trx:step:action` is parsed with `split(":")` in `workflow-export.ts:261,306,348` (SDK) and in the engines. Everything moves to `adapters/step-key.ts`, which handles escaping.
- `mainFlow.run` is the runner of a `LocalWorkflow` created with no container (`create-workflow.ts:203`). With no container, the runner falls back to `MedusaModule.getLoadedModules()` (`workflow-export.ts:38-47,102-112`). The new facade keeps this fallback to find the module: "the one passed, else the app container".
- `ReturnWorkflow`'s call signature includes `Omit<LocalWorkflow, ...>` (`type.ts:261-317`). Removing `LocalWorkflow` removes the graph-editing methods from the type, which the doc allows. `config` exists only on `mainFlow(container)` (`create-workflow.ts:190`), even though the type declares it on the function itself.
- `runAsStep` derives the child transaction id from `step.__step__` (`create-workflow.ts:35-45`). The compensation input is the child `WorkflowResult` for sync children and the parent transaction id for async ones (`:254-256`).
- `when` keeps one global condition (`when.ts:97,156`), which is why nested `when` crashes. The recorder uses a stack instead.
- `applyStep` mutates the shared step config (`uuid`, `noCompensation`, `create-step.ts:183-184`). The recorder copies the config per use.
- `defineConfig` runs before the feature-flag loader. No flag is needed now (decision 1), but any later toggle would have to read `process.env`.
- `ModulesDefinition[WORKFLOW_ENGINE]` has `defaultPackage: false`, so the engine comes only from `defineConfig` (`medusa-app-loader.ts:79-117`).

## What We're NOT Doing

- No feature flag and no running both engines side by side (decision 1).
- No migration of in-flight runs, Redis `dtrx:*` keys or BullMQ jobs. Old runs are drained.
- No `UNION` view over `workflow_execution`, and no rename of it (decision 3).
- No support for workflows defined outside `src/workflows`, plugin `src/workflows` and core-flows (decision 11), and no fallback registration.
- No multiple hook handlers (#11968). Registering a second handler still throws.
- No DSL loops (#10194) and no persisted transform results. Transforms recompute after a resume, as the doc decides.
- No exposure of `retryBackoff` in the DSL.
- No admin UI changes (the execution DTO keeps its shape) and no admin "force resume" button.
- No changes to the locking module or to the lock steps' semantics (#17200, #17284), beyond what the engine requires.
- No audit or fix of core-flows compensations (#17222, #17299). The re-execution audit in the Risks section only produces a list.

## Implementation Approach

The work is bottom-up on one branch, `feat/workflow-engine-v2`. Each milestone ends green on its own tests:

- Milestones 1 to 3 build the engine against its own tests.
- Milestone 4 swaps Medusa onto it and is the first point where the HTTP suite can run.
- Milestone 5 removes what is left of the old world and adds the deprecation and upgrade work.

Between milestones 1 and 4 the old engine modules no longer compile, because the SDK no longer exports what they import. That is acceptable on a feature branch. The HTTP and module suites are not expected to run until milestone 4.

Review: open one draft PR from `feat/workflow-engine-v2` to `develop`. Each milestone is a stacked PR into the feature branch, so it can be reviewed on its own.

---

## Milestone 0: Baseline

### Overview

Record what passes today so that milestone 4 failures can be told apart from existing flakes.

### Changes Required

None to code. Create the branch `feat/workflow-engine-v2` from `develop`.

### Success Criteria

#### Automated Verification

- [ ] On `develop`, `yarn build` passes.
- [ ] On `develop`, `yarn test:integration:http` (all 4 shards) and `yarn test:integration:modules` have been run. Pass/fail per spec file goes to `thoughts/shared/research/2026-10-19-workflow-engine-v2-baseline.md`, run twice to flag flaky specs.
- [ ] The current engine benchmark numbers (50-step and 200-step sequential, stored 2-step save count) are recorded with the research experiment scripts (`t3.js`, `t4.js`).

---

## Milestone 1: Engine core, MemoryStore, SDK compiler and module skeleton

### Overview

This milestone builds:

- the engine's definition, compile, executor, transitions, compensation, child runs and events over `MemoryStore`;
- the SDK compiler and facade;
- the minimal module (memory store, adapters, `registerWorkflows`).

The SDK only reaches the engine through the module, so the module skeleton is pulled forward into this milestone. Postgres, middleware, the outbox, the execution view and the loaders wait for milestone 4.

**Exit criterion:** all 66 SDK runtime cases, rewritten and moved to `packages/modules/workflows/src/__tests__/sdk/`, pass through the new engine. The engine and adapter unit tests below also pass.

Within this milestone, retries with `retryInterval` and step and workflow timeouts run in-process: a timer plus an `AbortSignal`, with the lease held. Durable timer rows, the dispatcher, schedules and recovery come in milestone 3. The `Store` interface is defined in full now. `MemoryStore` stubs the timer, schedule, heartbeat and lease-expiry methods until milestone 3.

### Changes Required

#### 1. New package `packages/core/workflow-engine`

**Files**: package scaffolding, using `packages/core/orchestration/package.json` as the model.

- `package.json`:
  - `name: "@medusajs/workflow-engine"` and the fixed monorepo version.
  - `exports`: `"."`, `"./postgres"`, `"./redis"`, `"./outbox"`, `"./testing"`. Only `"."` and `"./testing"` are populated in this milestone; the others are created in milestones 2 to 4.
  - `dependencies`: `ulid`, plus `cron-parser` from milestone 3.
  - optional `peerDependencies`: `pg`, `ioredis`.
  - `files`, `engines.node >=22.22.0` and `publishConfig.access: public`.
  - scripts `build`, `watch`, `test` (`--testPathPattern=src`) and `test:integration`.
- `tsconfig.json` extends `../../../_tsconfig.base.json`.
- `jest.config.js` uses `defineJestConfig()`.

**Files**: `src/` (layout from the doc's "Engine package" tree)

| File | Responsibility |
|---|---|
| `src/index.ts` | Public exports: `createEngine`, `defineWorkflow`, the types, the errors and `MemoryStore` |
| `src/engine.ts` | `createEngine(config)`. It holds the registry, store, notifier, emitter, extensions, mode and `instanceId`. API: `register`, `unregister`, `isRegistered`, `listRegistered`, `start`, `completeStep`, `failStep`, `retryStep`, `cancel`, `resume`, `getRun`, `findRun`, `queryRuns`, `on`/`off`, `shutdown` |
| `src/errors.ts` | `WorkflowNotRegisteredError`, `TransactionAlreadyStartedError` (message `Transaction already started for transactionId: <id>`), `StepNotWaitingError` (message `Cannot set step success|failure when status is <status>`), `NonRetryableError` (carries `compensateInput`), `StepTimeoutError`, `RunTimeoutError`, `DefinitionMismatchError`, `LeaseLostError` |
| `src/definition/types.ts` | `WorkflowDefinition`, `StepNode`, `StepOptions`, `WorkflowOptions`, `RunOptions`, `StepContext`, `StepResult`, and `Durability = "none" \| "summary" \| "full"` (doc "Workflow definition") |
| `src/definition/builder.ts` | `defineWorkflow()`, the native programmatic API |
| `src/definition/validate.ts` | Unique ids, every `dependsOn` id exists, no cycles, option ranges, and `skipOnPermanentFailure: "<id>"` must name a descendant |
| `src/definition/compile.ts` | `CompiledWorkflow`: integer indexes, `dependents[]`, `depCount[]`, topological order, compensation levels (reverse topological, grouped by independence), `durability` (store-forcing rules from research 3.1 plus the doc's table) and a stable `definitionHash` over ids, edges and options, excluding handlers |
| `src/definition/registry.ts` | A per-engine `Map<id, {compiled, hooks}>`. Registering the same hash is a no-op. A different hash throws `Workflow with id "<id>" and step definition already exists.` (research 4.5) |
| `src/runtime/transitions.ts` | The run and step state machines as pure tables plus `applyRunEvent` and `applyStepEvent` (doc "State machines"). Invalid transitions throw `InvalidTransitionError` |
| `src/runtime/run-state.ts` | In-memory state of one run: flat arrays indexed by step (status, attempt, depCount remaining, output, compensateInput, error, timestamps), the results map, the transform memo and the pending changes buffer |
| `src/runtime/executor.ts` | Ready queue and parallel dispatch, applying results and committing (one batched commit per tick in `full`, start and end only in `summary`, nothing in `none`). It handles `wait` and background steps, permanent failure leading to draining running siblings and then `compensating`, and checks the cancel flag on each commit |
| `src/runtime/step-invoker.ts` | Calls a handler inside the scope, with `maxRetries` inline retries, an in-process `retryInterval` wait, a step-timeout `AbortSignal`, and result discard on timeout. Maps thrown `NonRetryableError` to a permanent failure that keeps its `compensateInput` |
| `src/runtime/scope.ts` | `AsyncLocalStorage<{runId, stepId, attempt, rootRunId, eventGroupId?}>` plus `currentScope()` |
| `src/runtime/compensator.ts` | Reverse-level compensation with parallel steps per level. Covers `succeeded` and `timed_out` steps, skips steps that have no compensate function, retries per the step options, and ends in `compensated` or `failed` |
| `src/runtime/completion.ts` | `completeStep`, `failStep` and `retryStep` without a lease: a conditional store update plus resume. Runs inline when the lease is free and the instance is not a server |
| `src/runtime/children.ts` | Child runs with `parentRunId` and `parentStepId`, the parent step completed by child finish, and the cancel cascade |
| `src/runtime/middleware.ts` | Extension API: `aroundRun`, `aroundStep`, and lifecycle hooks (`onRunCommit`, `onStepAttemptFailed`, `onStepCompensated`, `onRunFinished`) |
| `src/store/store.ts` | The `Store` interface verbatim from the doc, plus `NewRun`, `RunRecord`, `StepRecord`, `RunChanges`, `Lease`, `CommitResult` and `IdPolicy` |
| `src/store/memory/memory-store.ts` | Maps, always-granted leases, a partial-unique emulation for `(workflowId, transactionId)` over non-final runs, `retain_until` and `deleteExpired` |
| `src/store/conformance/index.ts` | `runStoreConformance(name, createStore)`: the shared suite, filled out in milestone 2. In this milestone it covers create-run id policy, commit fencing, waiting-step completion, cancel request and query |
| `src/signals/notifier.ts`, `src/signals/memory.ts` | The `Notifier` interface and the in-process emitter |
| `src/events/emitter.ts` | Typed events: `runStarted`, `runResumed`, `stepStarted`, `stepSucceeded`, `stepFailed`, `stepSkipped`, `stepWaiting`, `compensationStarted`, `stepCompensated`, `stepCompensationFailed`, `runTimedOut`, `runFinished` |
| `src/serialization/serializer.ts` | JSON with `Date` and `BigInt` support. Pluggable |
| `src/testing/index.ts` | Fake clock, `createTestEngine()` and `collectEvents()` |

Signatures to pin before coding (types only):

```ts
interface RunOptions {
  workflowId: string
  transactionId: string            // caller applies "auto-<ulid>" default
  input: unknown
  context?: Record<string, unknown> // opaque to the engine, passed to StepContext
  metadata?: Record<string, unknown>
  parent?: { runId: string; stepId: string }
  durability?: Durability           // overrides compiled level only upward
}

interface RunHandle {
  runId: string
  status: RunStatus                 // status when start() resolved
  outcome: "finished" | "waiting"   // waiting = async/background step reached
  result(): Promise<RunResult>      // waits for final state
  snapshot(): Promise<RunRecord>
}

interface StepContext {
  runId: string
  workflowId: string
  transactionId: string
  stepId: string
  action: "invoke" | "compensate"
  attempt: number
  idempotencyKey: { workflowId: string; transactionId: string; stepId: string; action: "invoke" | "compensate" }
  signal: AbortSignal
  context: Record<string, unknown>
  metadata: Record<string, unknown>
  input: unknown                    // run input
  results: ReadonlyMap<string, unknown>
  memo: Map<string, unknown>        // per-run memo, used by SDK transforms and `when`
  startChild(opts: RunOptions): Promise<RunHandle>
}
```

#### 2. Shared types in `packages/core/types`

**File**: `packages/core/types/src/workflows-sdk/service.ts`

- Add `registerWorkflows(workflows: ReturnWorkflowLike[])`, `unregisterWorkflows(ids: string[])` and `listRegisteredWorkflows()` (doc "Workflow registration").
- Widen `run` and `cancel` to accept a workflow object, and infer input and result types from it (doc "Deprecating the direct call").
- Make `acknowledgement` part of the result type.

**File**: `packages/core/types/src/workflows-sdk/common.ts` (or a new `legacy-transaction.ts`)

- Add a `LegacyTransaction` interface: `getState`, `hasFinished`, `getErrors`, `getContext`, `getFlow`, `transactionId`, `modelId`, `runId`.
- Add `TransactionStepError` and `WorkflowEvents`, which keeps the `DistributedTransactionEvents` callback names.
- Move `SchedulerOptions` here from orchestration, for `job-loader.ts`.

The enum values in `packages/core/utils/src/orchestration/types.ts` (`TransactionState` and the others) stay as public string values, derived from the new states.

#### 3. SDK compiler and facade in `packages/core/workflows-sdk`

**Files**: new

| File | Responsibility |
|---|---|
| `src/compiler/recorder.ts` | Replaces the `OrchestratorBuilder` composition context. Records `StepNode` drafts in declaration order. Each step depends on the previous "frontier"; `parallelize` replaces the frontier with the group. Keeps a `when` stack for nested `when` and a hooks list. Lives on `global[SymbolMedusaWorkflowComposerContext]` only during composition (decision 7) |
| `src/compiler/to-definition.ts` | Turns a recording into a `WorkflowDefinition`, mapping workflow and step options (seconds to milliseconds; `retryIntervalAwaiting`, `maxAwaitingRetries` and `noWait` mapped and marked deprecated) |
| `src/compiler/handlers.ts` | Maps the step's return to `StepResult`: a plain value becomes `{output: v, compensateInput: v}`; `StepResponse` becomes its fields; `skip()` becomes `{kind: "skip"}`; `async` with no return becomes `{kind: "wait"}`; `async` returning a `StepResponse` becomes a background step; `permanentFailure` becomes `NonRetryableError`; an error with `getStepResponse()` becomes a failure with partial output |
| `src/compiler/step-context.ts` | Builds `StepExecutionContext` from `StepContext` plus the middleware-supplied values. Gives each step its own copy of `context` with `idempotencyKey`. Keeps the `" getStepResult"` and `" stepDefinition"` members and the legacy metadata keys (`model_id`, `idempotency_key`, `action`, `action_type`, `attempt`, `timestamp`) |
| `src/compiler/values.ts` | Input resolution from the results map with one deep copy (`parseStringifyIfNecessary`). Transform evaluation memoised in `StepContext.memo` by transform id, and the workflow result read through the same memo. `when` conditions memoised per block per run |
| `src/brand.ts` | `Symbol.for("medusa.workflow")` and `isWorkflow()` |
| `src/exported-workflow.ts` | The deprecated direct-call facade. `wf(container)` returns `{run, registerStepSuccess, registerStepFailure, retryStep, cancel, config, container}`; static `run`, `registerStepSuccess`, `registerStepFailure`, `retryStep` and `cancel` also exist. Each resolves `Modules.WORKFLOW_ENGINE` from the passed container, else from `MedusaModule.getLoadedModules()`, and calls the module with the workflow object. `config()` stores per-call workflow option overrides that are passed to `run` |

**Files**: changed

- `src/utils/composer/create-workflow.ts`:
  - Remove `WorkflowManager`. Run the composer once against a `Recorder` and compile.
  - Attach `__definition`, `__hooks` (a per-workflow handler map) and the brand.
  - Keep `getName`, `hooks`, `run` (facade), `runAsStep` and `registerDevServerResource`.
  - `runAsStep` records a child-run node named `<name>-as-step` (renamable with `.config`), keeps the `buildTransactionId` derivation (`create-workflow.ts:35-45`), and sets compensation to cancel the child with `cancelingFromParentStep`.
- `src/utils/composer/create-step.ts`:
  - `applyStep` records a node with a copy of the config.
  - `.config()` renames or replaces the node in the recorder (no `WorkflowManager.update`).
  - `.if()` attaches a condition.
  - Delete `wrapAsyncHandler`; background vs wait is decided in `compiler/handlers.ts`.
  - Keep exporting `applyStep` and `wrapConditionalStep` with their signatures, as deprecated and internal.
- `src/utils/composer/parallelize.ts`: `recorder.parallel(stepIds)` instead of `mergeActions`.
- `src/utils/composer/when.ts`: push and pop on the recorder's `when` stack, so nested `when` composes. Keep the passthrough-step naming (`when-then-<ulid>` with a warning) and the `process.nextTick` missing-`.then` error.
- `src/utils/composer/create-hook.ts`: a hook node. `workflow.hooks.x(fn)` stores the handler in the workflow object's hook map, read when the step runs. A second handler still throws `Cannot define multiple hook handlers for the <name> hook`. `get-<name>-result` stays.
- `src/utils/composer/transform.ts`: replace the `DistributedTransaction` temporary storage with the run memo. Same `(value, stepArgs)` arguments.
- `src/utils/composer/helpers/step-response.ts`: SDK-local `PermanentStepFailureError` and `SkipStepResponse`, both exported for compatibility.
- `src/utils/composer/helpers/resolve-value.ts`: same exported signature, so it works on `{payload, invoke}` built by `values.ts`.
- `src/utils/composer/helpers/create-step-handler.ts`: deleted; replaced by `compiler/handlers.ts` and `compiler/step-context.ts`.
- `src/utils/composer/type.ts` and `src/helper/type.ts`: replace the orchestration types with SDK-local or `@medusajs/types` equivalents:
  - `TransactionModelOptions` becomes `WorkflowConfig`.
  - The step-config `Omit<TransactionStepsDefinition, ...>` becomes `StepConfig`.
  - `DistributedTransactionType` becomes `LegacyTransaction`.
  - `DistributedTransactionEvents` becomes `WorkflowEvents`.
  - `CreateWorkflowComposerContext.flow` becomes `recorder`.
  - `ReturnWorkflow` drops `Omit<LocalWorkflow, ...>` and declares `config` on `wf(container)` to match the implementation.
  - Add the additive workflow option `durability?: "none" | "summary" | "full"`.
- `src/helper/workflow-export.ts`: reduced to a deprecated `exportWorkflow` that returns the facade. `attachOnFinishReleaseEvents` is deleted, because event release moves to the outbox in milestone 4. In this milestone, root runs release through the module adapter calling the event bus, so the grouped-event tests keep passing until the outbox replaces it.
- `src/medusa-workflow.ts`: deleted, and removed from `src/index.ts` (decision 4).
- `package.json`: drop `@medusajs/orchestration`, and add `@medusajs/workflow-engine` as a types-only dev dependency.
- `src/utils/_playground.ts`: deleted.

**Tests**: `packages/core/workflows-sdk/src/compiler/__tests__/`

- `to-definition.spec.ts`:
  - A sequence becomes a chain.
  - `parallelize(a,b,c)` gives a, b and c the previous step as dependency, and the next step depends on all three.
  - `.config({name})` renames the node.
  - `when` wraps every step in its block, and nested `when` composes.
  - Hooks give a hook node plus `get-<name>-result`.
  - `runAsStep` gives a child node `<name>-as-step`.
  - The `when` passthrough step is named after the `when` name.
  - Durability is derived from the options.
  - The hash is stable across recompiles and changes with shape.
- `types.spec.ts`: the `expectTypeOf` assertions moved from `index.spec.ts`.

#### 4. Module skeleton in `packages/modules/workflows`

**Files**: scaffolding modelled on `packages/modules/api-key` (`package.json` scripts including `migration:create`, `tsconfig.json` paths, `jest.config.js`, `mikro-orm.config.dev.ts`). The models are added in milestone 4.

| File | Responsibility |
|---|---|
| `src/index.ts` | `Module(Modules.WORKFLOW_ENGINE, { service: WorkflowsModuleService, loaders: [engineLoader] })` |
| `src/loaders/engine.ts` | Builds the engine from options. In this milestone only `store: "memory"` is supported |
| `src/services/workflows-module.ts` | `IWorkflowEngineService`: `run`, `cancel`, `setStepSuccess`, `setStepFailure`, `retryStep`, `subscribe`, `unsubscribe`, `getRunningTransaction`, `registerWorkflows`, `unregisterWorkflows`, `listRegisteredWorkflows`. Each method is a few lines over the engine (doc snippet). `registerWorkflows` accepts branded workflow objects and calls `engine.register(wf.__definition)` |
| `src/adapters/run-options.ts` | Normalizes options for both entry points: one serializer for input, `transactionId ??= "auto-" + ulid()`, `throwOnError ??= true`, `logOnError ??= false`, and `events` callbacks kept. The `eventGroupId` rule: a run started inside a running step (from `currentScope()`) joins that group and does not release; anything else is a root and gets a new group unless one is passed |
| `src/adapters/workflow-result.ts` | `{acknowledgement, errors (invoke only), transaction, result, thrownError}`. Throw rules from `workflow-export.ts:151-173`: FAILED or REVERTED throws the first invoke error, except a cancel ending REVERTED or `setStepFailure` ending REVERTED |
| `src/adapters/legacy-transaction.ts` | `LegacyTransaction` over a `RunRecord`. `getContext()` lazily builds `{payload, invoke: {[step]: {output: {output, compensateInput}}}}`, and `getFlow()` builds a reduced `{state, steps, hasSkippedSteps, hasFailedSteps, ...}` |
| `src/adapters/step-key.ts` | `parseStepKey(string \| IdempotencyKeyParts)` and `formatStepKey()`. New keys escape `:` (as `\:`); legacy unescaped keys with exactly four parts still parse |
| `src/adapters/subscriber-events.ts` | Engine events mapped to `onBegin`, `onResume`, `onCompensateBegin`, `onFinish`, `onTimeout`, `onStepBegin`, `onStepSuccess`, `onStepFailure`, `onStepAwaiting`, `onCompensateStepSuccess`, `onCompensateStepFailure`, `onStepSkipped`, with the payload `{eventType, workflowId, transactionId, step, response, result, errors, state}`. Transaction-scoped subscribers are removed after `onFinish`, the same `subscriberId` replaces the handler, and delivery uses `setImmediate` |
| `src/adapters/execution-dto.ts` | Stub in this milestone; implemented in milestone 4 |
| `src/adapters/state.ts` | Mapping from the new run and step states to `TransactionState`, `TransactionStepState` and `TransactionStepStatus` (doc table) |

**Tests** in `packages/modules/workflows/src/`:

- `adapters/__tests__/*.spec.ts` are pure unit tests for each adapter:
  - step-key round trips, including legacy keys and ids containing `:`;
  - the throw and no-throw matrix;
  - the `eventGroupId` root and child rule;
  - the state mapping;
  - the `getContext()` shape;
  - subscriber event names and payload.
- `__tests__/sdk/compose.spec.ts` and `__tests__/sdk/index.spec.ts`: the 66 cases moved from the SDK and rewritten. They use a helper `__tests__/utils/test-engine.ts` that creates a container, registers a `WorkflowsModuleService` with `store: "memory"` under `Modules.WORKFLOW_ENGINE`, and calls `registerWorkflows` for the workflows each test defines. Rewrites:
  - Every `workflow().run()` with no container passes the test container.
  - `WorkflowManager.unregisterAll()` and `MedusaWorkflow.workflows = {}` become `unregisterWorkflows(...)` in `afterEach`.
  - `WorkflowScheduler.setStorage` is removed (schedules are tested in milestone 3).
  - `DistributedTransaction.setStorage` (`compose.spec.ts:2786-2812`) is removed; the test uses `store: true` against the memory store.
  - `getFlow().next/.async/.nested` (`index.spec.ts:52-145`) are asserted on `workflow.__definition` (the child node's `async` and `nested` options).
  - `getFlow().hasSkippedSteps` stays on `LegacyTransaction.getFlow()`.
  - The duplicate-definition message test (`compose.spec.ts:2679`) asserts on `registerWorkflows`.
  - The grouped-events tests keep the `asValue` event-bus mock.
- `__tests__/engine/*.spec.ts` (in the engine package `src/**/__tests__`):
  - `transitions.spec.ts` covers every allowed and forbidden transition.
  - `compile.spec.ts`
  - `executor.spec.ts` covers:
    - sequence, parallel and barrier behaviour;
    - write counts per durability (counted through a spy store): `none` is 0, `summary` is 2, and `full` 2-step is 4;
    - permanent failure with running siblings draining;
    - continue and skip flags;
    - inline and interval retries;
    - `autoRetry: false`;
    - async wait plus `completeStep`;
    - background steps;
    - cancel while running and after completion with retention;
    - child runs and the cancel cascade;
    - transform memo (one evaluation per run, and the result matches the step input);
    - nested `when`;
    - `when` evaluated once per block.

### Compatibility behaviours this milestone must preserve (research section 8)

Each item is covered by a moved SDK case or a new engine or adapter test:

- **#1** Same id and same hash is a no-op. A different hash throws. Multiple hook handlers throw.
- **#2** Step identity is the action name. The key format is `wf:trx:step:invoke|compensate`, and both string and object forms parse.
- **#3** A plain return is both output and compensate input. `StepResponse` compensate input defaults to the output. A throwing step gets `undefined` in its compensation. `permanentFailure(msg, data)` passes `data`, and an error with `getStepResponse()` passes partial data.
- **#4** An `async` step returning `StepResponse` runs in the background. An `async` step returning nothing waits.
- **#5** `run()` resolves at the end or at the first async or background step. `throwOnError` defaults to true and throws the first invoke error. A cancel ending REVERTED does not throw. `errors` holds invoke errors only. `transaction.hasFinished()` works.
  - Intended change: a `retryInterval` retry now waits inside `run()`, which fixes #10201.
- **#6** The `auto-` prefix means no uniqueness check. A concurrent manual id gets `Transaction already started for transactionId: <id>`. A finished non-idempotent id starts a new run. A finished idempotent id returns the stored result. Child ids are `<step>-<parentTrx>[-attempt-N]`.
- **#12** All `StepExecutionContext` fields, including the hidden members.
- **#13** Skipped steps give `undefined`, are not compensated and do not stop later steps.
  - Intended changes: the condition is evaluated once per block, and nested `when` now works.
- **#14** Implicit step names: hook steps, `get-<hook>-result`, `when` passthrough and `<workflow>-as-step`.
- **#15** Parallel steps run concurrently. The next step waits for all. On failure, in-flight siblings finish and are then compensated.
- **#16** Reverse-dependency compensation. Steps without a compensate function are skipped. `timed_out` steps are compensated. A failed compensation ends `failed`. `continueOnPermanentFailure` ends `done` with `hasFailedSteps`. `skipOnPermanentFailure` gives `skipped_failure` in the legacy mapping.
- **#17** `failures > maxRetries`. Seconds at the DSL level. `autoRetry: false` needs `retryStep`.
- **#18** Timeouts do not stop handlers that ignore the signal. The result is discarded and the run compensates. A workflow timeout ignores the continue and skip flags.
- **#19** Transforms are lazy (never run if unused) and receive `(input, stepArgs)`. Proxy property access works, including through arrays.
  - Intended change: transforms are memoised per run.
- **#20** Step inputs are deep-copied, so steps never share references.

### Success Criteria

#### Automated Verification

- [ ] `yarn workspace @medusajs/workflow-engine build` and `test` pass.
- [ ] `yarn workspace @medusajs/workflows-sdk build` and `test` pass (compiler and type tests).
- [ ] `yarn workspace @medusajs/workflows build` and `test` pass, including all 66 moved SDK cases and the adapter tests.
- [ ] `yarn workspace @medusajs/types build` passes.
- [ ] `grep -r "@medusajs/" packages/core/workflow-engine/src` returns nothing (standalone check).
- [ ] `grep -rE "orchestration|WorkflowManager|MedusaWorkflow" packages/core/workflows-sdk/src` returns nothing, except the `OrchestrationUtils` symbols from `@medusajs/utils`.
- [ ] A micro-benchmark in `packages/core/workflow-engine/src/__tests__/perf.spec.ts` runs a 200-step `none` workflow in under 20 ms (median of 20 runs), as a sanity check before milestone 2's suite.

#### Manual Verification

- [ ] Review: the transition tables in `transitions.ts` match the doc's state lists, and nothing outside the executor changes state.
- [ ] Review: no SDK file calls the engine; everything goes through the module.

**Implementation note:** after the automated checks pass, pause for review before milestone 2.

---

## Milestone 2: PostgresStore, conformance suite, benchmarks

### Overview

This milestone adds `PostgresStore` with hand-written SQL through a `query(sql, params)` client adapter, and makes the conformance suite complete for both stores. It also creates the benchmark suite that checks the doc's Performance targets.

### Changes Required

**Engine** (`packages/core/workflow-engine`):

- `src/store/postgres/client.ts`: the `SqlClient` interface (`query`, `transaction(fn)`) with adapters for `pg.Pool` and for a knex instance. The knex adapter is what Medusa uses through `PG_CONNECTION`.
- `src/store/postgres/schema.sql`: the doc's tables plus `workflow_outbox`, for standalone users. It includes:
  - the partial unique index `(workflow_id, transaction_id) WHERE status NOT IN (final states)`;
  - `workflow_timer (due_at)`;
  - `workflow_run (lease_expires_at) WHERE status IN ('running','compensating')`.
- `src/store/postgres/apply-schema.ts`: idempotent setup for standalone use. Medusa does not call it.
- `src/store/postgres/postgres-store.ts`: every `Store` method.
  - `commit` is one transaction with `WHERE lease_token = $token`. Step rows are a multi-row upsert, the output is written once, and the call returns the cancel flag.
  - `acquireLease` is one conditional `UPDATE ... RETURNING lease_token`.
  - All time comparisons use `now()`.
- `src/store/postgres/verify-schema.ts`: checks that the expected columns and indexes exist. Used by the module test in milestone 4.
- `src/store/conformance/*.ts`: the full suite. It runs for `MemoryStore` in unit tests and for `PostgresStore` in `integration-tests/`. It covers:
  - the create-run id policies (auto, manual-running, manual-final idempotent and non-idempotent);
  - fencing after lease loss;
  - concurrent `completeWaitingStep` (exactly one wins);
  - `requestCancel` while another lease holds the run;
  - write counts per durability through an instrumented client;
  - `queryRuns` filters and paging;
  - `deleteExpired` honouring `retain_until`;
  - serializer round trips of `Date` and `BigInt`.
- `integration-tests/__tests__/postgres-conformance.spec.ts`: a fresh database per worker, created the way `packages/medusa-test-utils/src/database.ts` does it, with `apply-schema`.

**Benchmarks**: new private workspace `integration-tests/bench` (`package.json` name `integration-tests-bench`):

- `bench/sequential.bench.ts`: 50-step and 200-step `none`. Target under 5 ms and under 20 ms of engine time.
- `bench/stored.bench.ts`: a 2-step run on Postgres, writes for `full` and `summary` (4 and 2), and bytes written per step.
- `bench/wakeup.bench.ts` (filled in milestone 3): latency after `completeStep`, inline vs notifier vs polling.
- A `bench` script that prints a table and exits non-zero when a CPU target is missed by more than 50% (the margin absorbs noisy CI hardware). Write counts are asserted exactly.
- CI: a new `bench` job in `.github/workflows/action.yml` with a Postgres service, running after `setup`.

### Success Criteria

#### Automated Verification

- [ ] `yarn workspace @medusajs/workflow-engine test` passes (conformance on `MemoryStore`).
- [ ] `yarn workspace @medusajs/workflow-engine test:integration` passes (conformance on `PostgresStore`).
- [ ] `yarn workspace integration-tests-bench bench` meets the targets: 200-step `none` under 20 ms, 50-step under 5 ms, stored 2-step at 4 writes (`full`) and 2 writes (`summary`).
- [ ] `verifySchema()` passes against `schema.sql`.

#### Manual Verification

- [ ] `EXPLAIN` of the timer claim and lease reaper queries shows index scans on a table seeded with 100k rows.

---

## Milestone 3: Timers, schedules, heartbeat recovery, crash tests

### Overview

This milestone makes all time-based behaviour durable through `workflow_timer` and adds the dispatcher, cron and interval schedules, heartbeats, leases, the reaper, notifiers and graceful shutdown. It proves them with multi-process tests.

### Changes Required

**Engine**:

- `src/scheduling/timers.ts`: resume, retry, step-timeout and run-timeout timer kinds, with deterministic ids for reaper timers.
- `src/scheduling/dispatcher.ts`:
  - The claim loop from the doc's SQL.
  - Limited by `maxConcurrentRuns` (default 50).
  - Claims only definition hashes this instance knows. After a 5-minute grace, it may resume another hash if every completed step id exists in its own definition; otherwise it fails the run with `DefinitionMismatchError`.
  - Polls every `pollIntervalMs` (default 1000) and wakes early on notifier signals.
- `src/scheduling/schedules.ts` and `cron.ts` (`cron-parser`):
  - Upsert on register.
  - Fire with transaction id `schedule:<id>:<fireTime>`.
  - `concurrency: "forbid"` enforced, with skipped fires logged.
  - `catchUp` collapse.
  - `numberOfExecutions`, through `remaining`.
  - The next fire is computed before the run starts.
  - A schedule not seen for 24 h is removed.
- `src/recovery/heartbeat.ts`, `leases.ts`, `reaper.ts`:
  - A 5 s heartbeat that renews this instance's leases in the same tick.
  - A 10 s reaper on dispatcher instances.
  - `summary` runs are marked `failed`.
  - Without heartbeats the lease TTL is 24 h.
  - On restart with the same `instanceId`, the instance resumes its own runs.
- `engine.resume(runId, { force: true })`.
- Timeout takeover 5 minutes after the deadline.
- Server mode: commit and leave a resume timer; never run background steps or continuations.
- Graceful shutdown: stop claiming, wait up to the grace period (default 10 s), release leases and write resume timers.
- `src/signals/postgres-listen.ts` (`LISTEN/NOTIFY` on a dedicated session connection, payload `{runId, event, stepId}`) and `src/signals/redis.ts` (`ioredis` pub/sub). Both are opt-in.
- `MemoryStore`: a timer heap with one `setTimeout` capped at 2^31 - 1 ms (fixes #16280).

**Tests**:

- Unit tests (fake clock, `MemoryStore`): timer firing, retry after interval, step and run timeouts with `AbortSignal`, cron next-fire, overlap forbid, catch-up, `numberOfExecutions`, a long cron with no tight loop, and a schedule error not stopping the schedule.
- `integration-tests/__tests__/multi-process/*.spec.ts` (Postgres, worker processes created with `child_process.fork`, short lease TTL for test speed). One scenario per row of the doc's "Scenarios checked":
  - two servers starting the same manual `transactionId`;
  - a server handing off a background step;
  - `completeStep` on a server while a worker holds the lease;
  - a duplicate webhook;
  - cancel while a worker is running;
  - 3 workers and one timer;
  - 3 workers and one cron fire;
  - `kill -9` mid sync segment (resumed within the TTL);
  - `kill -9` in a background step;
  - a paused worker losing its lease (forced by expiring the lease in SQL) and its commit being fenced;
  - a rolling deploy with a changed hash;
  - a heartbeat-off matrix row (a stuck run recovered by a step timeout or `resume(force)`);
  - graceful shutdown handing runs over immediately.
- `integration-tests/bench/bench/wakeup.bench.ts`: under 50 ms with a notifier, and no more than the poll interval without one.

### Success Criteria

#### Automated Verification

- [ ] `yarn workspace @medusajs/workflow-engine test` passes.
- [ ] `yarn workspace @medusajs/workflow-engine test:integration` passes, including every multi-process scenario, 5 consecutive runs without a flake (run in CI with `--runInBand`).
- [ ] The wake-up benchmark meets its target.

#### Manual Verification

- [ ] Two local processes against one Postgres: start a run with a 30 s async step on one, kill it, and watch the other resume it within about 30 s.
- [ ] With Redis notifier configured, stop Redis mid-run: the engine falls back to polling with no errors beyond a warning.

---

## Milestone 4: The Medusa module and the swap

### Overview

This milestone completes `@medusajs/workflows`:

- Postgres store over Medusa's connection, plus DML models and the generated migration;
- the execution DTO mapping and joiner config;
- the Medusa context and tracing middleware;
- the outbox plus `GroupingEventBus`;
- explicit registration in all loaders;
- the legacy check.

It also makes the new module the default, deletes the old modules and orchestration, and runs every integration suite. This is the milestone where "iterate until the HTTP suite passes" happens.

### Changes Required

**Module** (`packages/modules/workflows`):

- `src/models/*.ts`: DML models for `workflow_run`, `workflow_step` (composite primary key `run_id`, `step_id`), `workflow_timer`, `workflow_schedule`, `workflow_worker` and `workflow_outbox`, matching the engine's `schema.sql` (indexes including the partial unique index through DML `indexes: [{ on, unique, where }]`).
  - These models exist for migrations and the joiner config. The engine writes SQL directly.
  - Then run `cd packages/modules/workflows && yarn migration:create`, and never edit the result.
- `src/loaders/engine.ts`:
  - `PostgresStore` over a knex client from `ContainerRegistrationKeys.PG_CONNECTION`.
  - Options `store` (`"postgres"` default, `"memory"`), `pollIntervalMs`, `notifier` (`{ redisUrl }` or `{ type: "postgres" }`), `recovery` (or `false`), `maxConcurrentRuns`, `legacy` (`"fail"` or `"keep"`), and `deprecationWarnings`.
  - The worker mode comes from `configModule.projectConfig.workerMode`.
  - The `__hooks` `onApplicationStart` (dispatcher, heartbeat, legacy check), `onApplicationPrepareShutdown` (graceful drain) and `onApplicationShutdown`.
- `src/services/workflows-module.ts`:
  - Add `listWorkflowExecutions`, `listAndCountWorkflowExecutions` and `retrieveWorkflowExecution` (by id or `{workflow_id, transaction_id}`). They go through `store.queryRuns` and `adapters/execution-dto.ts`, and support `q` (ilike over workflow and transaction id), the `state` filter in legacy names (including `$nin`, used by `waitWorkflowExecutions`), `created_at`, paging and `fields`.
  - `createWorkflowExecutions`, `updateWorkflowExecutions` and `deleteWorkflowExecutions` throw "not supported".
  - Add `resume(workflowId, transactionId, { force })`.
- `src/joiner-config.ts`: a manual joiner config exposing a linkable `workflow_execution` entity (alias `workflow_executions`), served by the list methods above, so that `query.graph({ entity: "workflow_executions" })` and `remoteQuery` keep working.
- `src/adapters/execution-dto.ts`:
  - `execution.steps` keyed `_root.<step>`, with `id`, `invoke.{state,status}`, `compensate.state`, `depth` (topological level), `startedAt` and `definition`.
  - `context.data.{payload, invoke}` and `context.errors[]`, matched by `action`.
  - The legacy `state`.
- `src/middleware/medusa-context.ts`: a scoped container per run that wraps resolved modules in a `Proxy` and fills `@MedusaContext()` parameters with `transactionId`, `eventGroupId` and the step's `idempotencyKey`, the same behaviour as `local-workflow.ts:96-138`.
- `src/middleware/tracing.ts`: OpenTelemetry spans for runs and steps, replacing `TransactionOrchestrator.traceTransaction` and `traceStep`.
- `src/events/grouping-event-bus.ts`: wraps the registered event bus.
  - `emit` with `eventGroupId` stages through the outbox; anything else passes through.
  - `releaseGroupedEvents` and `clearGroupedEvents` route groups the outbox knows to the outbox, and other groups to the provider (legacy staging, deprecated).
- `src/events/publisher.ts`: the provider's `emit` with the group id stripped.
- `src/legacy/check-legacy-executions.ts`: runs only if `to_regclass('workflow_execution')` is not null. It counts non-final rows, logs their ids, and marks them `failed` when `legacy: "fail"`.

**Engine**: `src/outbox/outbox.ts` and `publisher.ts`, implementing the doc's lifecycle table:

- stage with run, step and attempt from the scope;
- delete on a failed attempt that will retry;
- delete on compensation;
- delete on child failure;
- mark `ready` in the root's final commit, then publish and delete;
- drop on root failure;
- republish `ready` rows after a crash;
- retry `publish` with backoff.

For `none` runs, staged messages are kept in memory.

**Framework and loaders**:

- `packages/core/framework/src/workflows/workflow-loader.ts`: collect branded exports per file and call `workflowEngine.registerWorkflows(...)` once after loading. `skipFile` means "do not register".
- `packages/core/framework/src/jobs/job-loader.ts`: register the job workflows (`job-<name>` with step `<name>-as-step`, input `{scheduledFor}`) through the module. Import `SchedulerOptions` from `@medusajs/types`.
- `packages/medusa/src/loaders/index.ts`: import `@medusajs/core-flows` and call `registerWorkflows(collectWorkflows(coreFlows))` right after `MedusaAppLoader().load()` (line 209), before plugin workflows, subscribers and jobs.
- `packages/core/modules-sdk/src/medusa-app.ts` (or `medusa-app-loader.ts:383-386`, whichever runs before other modules first resolve the bus): register `GroupingEventBus` in place of `Modules.EVENT_BUS` in the shared container when the workflows module is loaded, including the eagerly injected link-module dependency at `medusa-app.ts:547-552`.
- `packages/medusa/src/commands/utils/dev-server/{index,types}.ts` and `reloaders/{workflows,jobs}.ts`: use `unregisterWorkflows` and `registerWorkflows` on the resolved module instead of `global.WorkflowManager`.
- `packages/medusa/src/instrumentation/index.ts:263-302`: configure the module's tracing middleware.

**Core-flows**:

- `packages/core/core-flows/src/common/steps/emit-event.ts`: keep the signature. Emitting through the bus wrapper stages to the outbox. Compensation becomes a no-op, because the outbox discards on compensation.
- `release-event.ts`: keep the signature. Calls `releaseGroupedEvents`, which the wrapper routes to `outbox.release`.

**Wiring and defaults**:

- `packages/core/utils/src/modules-sdk/definition.ts:54`: `MODULE_PACKAGE_NAMES[Modules.WORKFLOW_ENGINE] = "@medusajs/medusa/workflows"`. Remove the workflow engine from `TEMPORARY_REDIS_MODULE_PACKAGE_NAMES` (`:78-97`).
- `define-config.ts:418-424`: when `REDIS_URL` is set (cloud), add the same module with `notifier: { redisUrl }`.
- `packages/medusa/src/modules/workflows.ts`: a re-export file following the pattern of `workflow-engine-inmemory.ts`. Add the dependency to `packages/medusa/package.json`.
- `integration-tests/modules/medusa-config.ts:129-132` and the `package.json` files of `integration-tests/{http,modules}`: point to the new module. These are config changes, not test changes.
- `packages/medusa-test-utils/src/medusa-test-runner-utils/wait-workflow-executions.ts`: no change expected. Verify it works through the legacy-state filter.

**Deletions**:

- `packages/core/orchestration`, `packages/modules/workflow-engine-inmemory`, `packages/modules/workflow-engine-redis`.
- `packages/medusa/src/modules/workflow-engine-{inmemory,redis}.ts` and their `package.json` entries.
- `packages/core/framework/src/orchestration/` and the `./orchestration` export in `packages/core/framework/package.json:36`.
- The orchestration rewrite in `packages/eslint-plugin/src/rules/import-from-framework-not-internal/rule.ts:16` (and its test).
- The root `package.json:144-145` turbo filters that name `workflow-engine-redis`.
- Framework tests that use `WorkflowManager` (`jobs/__tests__/register-jobs.spec.ts`, `workflows/__tests__/index.spec.ts`): rewritten against `listRegisteredWorkflows` on a memory-store module.

**HTTP specs**: the five edits from decision 4. Nothing else in `integration-tests/http` changes.

**Tests**:

- `packages/modules/workflows/integration-tests/__tests__/`: the 74 cases ported from the two old modules (`index`, `race`, `retry-interval`, `subscribe`), with their fixtures, using `moduleIntegrationTestRunner` with Postgres.
  - Cases whose expectations change by decision are updated and commented, for example `retry-interval` now completing inside `run()`, `forbid` enforced, and `onStepSkipped` forwarded.
  - New cases: the execution DTO shape (`_root.<step>` keys, `context.data.invoke`); `query.graph` on `workflow_executions`; the legacy check with a seeded `workflow_execution` table; `verifySchema()` after the generated migrations; the outbox lifecycle (retry attempt dropping its events, compensated step dropping its events, release failure not compensating, crash after `ready` republishing); `GroupingEventBus` routing.
  - `middleware/__tests__/medusa-context.spec.ts`: `@MedusaContext` injection of `transactionId`, `eventGroupId` and `idempotencyKey`.

### Compatibility behaviours this milestone must preserve (research section 8)

- **#7** Visibility: `none` runs are not listed. Runs are deleted at the end unless `retentionTime` is set, and child runs are kept until the parent finishes.
- **#8** The execution JSON shape is read by the admin dashboard, `waitWorkflowExecutions` and the HTTP types.
- **#10** The grouped-event contract: the root releases on success and clears on failure; children never release; `emitEventStep` compensation drops its events; `releaseEventsStep` releases early.
- **#11** Context injection into module services.
- **#21** Scheduled jobs: `job-<name>`, `<name>-as-step`, `{scheduledFor}` as a `Date` in `ScheduledJobContext`, only in `worker` or `shared` mode, `numberOfExecutions` respected. `forbid` is now enforced, as decided.
- **#22** Subscriber API names and payload, auto-removal after `onFinish`, and admin SSE across instances (verified with the notifier).
- **#23** Cancel of a completed run works only while it is retained. Cancelling a `failed` run throws `Cannot revert a permanent failed transaction.`, and cancelling a compensating run throws `Cannot revert a transaction that is already compensating.`.
- **#26** Schema: the new tables are separate, so the divergent migration histories of the two old engines no longer matter.

### Success Criteria

#### Automated Verification

- [ ] `yarn build` passes for the whole monorepo with the old packages deleted.
- [ ] `cd packages/modules/workflows && yarn migration:create` produced the migration, and re-running it produces no diff.
- [ ] `yarn test` passes, with the `define-config.spec.ts` snapshots updated to the new module path.
- [ ] `yarn workspace @medusajs/workflows test:integration` passes (74 ported cases plus the new ones).
- [ ] `yarn test:integration:packages` passes.
- [ ] `yarn test:integration:modules` passes (4 shards), compared against the milestone 0 baseline.
- [ ] `yarn test:integration:http` passes (4 shards), compared against the milestone 0 baseline, with no spec changed except the five from decision 4. Iterate on engine and module fixes until green; never on HTTP spec logic.
- [ ] `git diff develop --stat -- integration-tests/http/__tests__` lists exactly the five files.

#### Manual Verification

- [ ] `medusa develop` on a test project: the admin workflow executions list and detail pages render runs with steps and payloads, and product import plus confirm works end to end.
- [ ] HMR: editing a workflow file reloads it without the "already exists" error.
- [ ] Worker mode: one `server` and one `worker` process against one database. A scheduled job runs once per tick on the worker, and an export started on the server completes on the worker.

**Implementation note:** pause for manual confirmation before milestone 5.

---

## Milestone 5: Cutover polish

### Overview

This milestone adds:

- the `defineConfig` filter for old module paths;
- the load-time error for configs that bypass `defineConfig`;
- the deprecation of direct calls (TSDoc, runtime warning, ESLint rule, codemod);
- migration of production call sites;
- documentation, the upgrade guide and changesets.

### Changes Required

- `packages/core/utils/src/common/define-config.ts`:
  - Filter out module entries whose `resolve` is `@medusajs/medusa/workflow-engine-{inmemory,redis}` or `@medusajs/workflow-engine-{inmemory,redis}`.
  - Log one deprecation warning that names the entry, its replacement and the dropped queue and worker options.
  - Carry over `redis.url`, `redis.redisUrl` or `url` to `notifier.redisUrl` unless one is already set.
  - Add the new module as the default.
  - Tests in `__tests__/define-config.spec.ts`: an object entry, an array entry, every old path, URL carry-over, an existing notifier winning, and the warning text.
- `packages/core/modules-sdk` module resolution: resolving an old path without `defineConfig` throws an error that names `@medusajs/medusa/workflows`. Add a unit test.
- Deprecation in `packages/core/workflows-sdk`:
  - `@deprecated` TSDoc on the call signature and on static `run`, `cancel`, `registerStepSuccess`, `registerStepFailure` and `retryStep`, following the `writing-tsdocs` skill.
  - A runtime warning once per workflow per process: on by default in development, off in production, and configurable through the module option `deprecationWarnings`.
- `packages/eslint-plugin/src/rules/no-direct-workflow-run/{index.ts,__tests__/rule.spec.ts}`:
  - Flags `wf(container).run(...)`, `wf.run({ container })`, and the static and contextual `cancel` and step-completion calls.
  - The autofix rewrites them to `container.resolve(Modules.WORKFLOW_ENGINE).run(wf, {...})` (or the matching method).
  - Registered in `src/rules/index.ts` and set to `warn` in `recommended`.
- `packages/cli/medusa-cli/src/codemods/workflow-engine-run.ts` (plus a test in `__tests__/`): the same transform as the rule, registered in `codemods/index.ts`. Run with `medusa codemod workflow-engine-run`.
- Run the codemod on `packages/medusa/src` (about 215 sites, mostly API routes), `packages/core/core-flows/src` (6 sites) and the plugins. Skip `integration-tests/http` (decision 8). Review the diff manually, and check that `yarn build` and the HTTP suite still pass.
- Docs (load the `writing-docs` skill first; book What's New list per `www/apps/book/CLAUDE.md`):
  - Workflow guides switch to the module call.
  - Workflows must live in `src/workflows`.
  - The new `durability` option.
  - `run()` now waits through `retryInterval`.
  - At-least-once grouped events.
  - Cron `forbid` enforcement.
  - The new module options and the Redis notifier.
  - About 94 direct-call snippets updated under `www/apps`.
- Upgrade guide:
  - Drain check (`GET /admin/workflows-executions?state=invoking`).
  - Config entries can be removed (they are filtered anyway).
  - Old history stays in `workflow_execution` and is no longer listed.
  - The `legacy` option.
  - Commands to delete `bull:medusa-workflows*` and `dtrx:*` from Redis.
  - Workflows outside `src/workflows` must move there.
  - Removed exports (`@medusajs/framework/orchestration`, `MedusaWorkflow`, `LocalWorkflow` graph editing, the `workflow_execution` write methods).
- Changesets in `.changeset/` (all `minor`, because each package carries a breaking change; never `major`):
  - `feat(workflow-engine): ...` for `@medusajs/workflow-engine`.
  - `feat(workflows): ...` for `@medusajs/workflows`.
  - `feat(workflows-sdk): ...`.
  - `@medusajs/framework`, `@medusajs/medusa`, `@medusajs/utils`, `@medusajs/types`, `@medusajs/core-flows`, `@medusajs/modules-sdk`, `@medusajs/eslint-plugin`, `@medusajs/cli` and `@medusajs/test-utils` as they are touched.
  - The deleted packages are called out in the release notes, not in changesets.

### Success Criteria

#### Automated Verification

- [ ] `yarn build`, `yarn test` and `yarn lint` pass.
- [ ] `yarn workspace @medusajs/eslint-plugin test` passes, including the new rule's valid, invalid and autofix cases.
- [ ] `yarn workspace @medusajs/cli test` passes, including the codemod tests.
- [ ] `grep -rnE "Workflow\((req\.scope|container|appContainer)\)\.run\(" packages/medusa/src packages/core/core-flows/src` returns nothing.
- [ ] `yarn test:integration:http`, `test:integration:modules` and `test:integration:packages` pass again after the codemod.
- [ ] The docs build passes for the touched `www/apps` projects.

#### Manual Verification

- [ ] A test project with `@medusajs/medusa/workflow-engine-redis` in `medusa-config.ts` starts with one warning and uses the Redis notifier.
- [ ] Running `medusa develop` on a project with a direct `wf(container).run()` call prints the deprecation warning once. A production start prints nothing.
- [ ] Review of the upgrade guide and the What's New entry.

---

## Testing Strategy

### Unit Tests

- Engine: transitions, compile, executor, compensator, completion, children, scope, serializer, `MemoryStore` conformance, timers and schedules with a fake clock.
- SDK: compiler output and types.
- Module: adapters (pure), middleware, the 66 moved SDK runtime cases, and the outbox routing.
- `defineConfig` filter, ESLint rule, codemod.

### Integration Tests

- Engine: Postgres conformance, multi-process crash scenarios, benchmarks.
- Module: 74 ported cases, plus the execution view, `query.graph`, the legacy check, the outbox lifecycle and schema verification.
- Monorepo: `integration-tests/http` (unchanged apart from five specs), `integration-tests/modules` and package integration tests, compared against the milestone 0 baseline.

### Manual Testing Steps

1. Admin workflow executions list and detail on a seeded project.
2. Product import, waiting on confirmation, then confirm.
3. A server and a worker process: scheduled job once per tick, export handed off to the worker.
4. Kill the worker mid-run; the run resumes within about 30 s on another worker.
5. Start with an old engine entry in config: one warning, app works.

## Performance Considerations

- Targets from the doc are enforced by `integration-tests/bench` in CI: 200-step `none` under 20 ms, 50-step under 5 ms, stored 2-step at 4 and 2 writes, wake-up under 50 ms with a notifier.
- Postgres load comes from polling (one indexed query per worker per second), heartbeats (one write per instance per 5 s) and per-step writes in `full`. Measure on a Cloud-sized fleet before release. `summary` and a longer poll interval are the levers.

## Migration Notes

- Drain, don't migrate. Legacy non-final rows are marked `failed` at first start (`legacy: "keep"` leaves them).
- `workflow_execution` stays untouched until the next major. The new tables are created by the module's generated migration.
- Old config entries are filtered with a warning, and Redis URLs carry over to the notifier.

## Risks

- **More re-execution.** Interrupted steps now really run again after a crash.
  - Before merge, audit core-flows for steps with outside effects (payment capture, refunds, provider calls, notifications) and list any that do not pass the step `idempotencyKey`.
  - The list goes into the PR description; fixes are follow-ups.
- **Event bus wrapping point.** Modules resolve the bus lazily, but link modules get it eagerly (`medusa-app.ts:547-552`). If the wrapper is installed too late, some emits bypass the outbox. Covered by a module integration test that emits from a link-module path.
- **Hidden core-flows quirks.** Some flows may depend on quirks of today's engine: transforms recomputed, `when` evaluated per step, the barrier attached to the last branch.
  - Mitigation: the HTTP suite plus the baseline comparison.
  - Expect several iterations in milestone 4. Every fix goes into the engine, SDK or module, never into HTTP specs.
- **Removing the old engines breaks third parties.** Removing `@medusajs/framework/orchestration` and `MedusaWorkflow` breaks third-party plugins that import them. Before merge, search public plugins for these imports to size the break, and list the replacements in the upgrade guide.
- **`run()` waits through retries.** A long `retryInterval` with several retries can now hold an HTTP request past its timeout. Document this and prefer async steps.
- **DML partial unique index.** If DML `indexes.where` cannot express the "non-final status" predicate, stop and decide how to generate it. Do not hand-edit the migration.
- **Typing regressions.** Replacing the orchestration types in `ReturnWorkflow` and `WorkflowData` risks "excessive stack depth" again (#15174). Keep the moved `expectTypeOf` tests and type-check `packages/core/core-flows` early in milestone 1.
- **Flaky multi-process tests.** Use short TTLs, keep scenarios independent, and run them `--runInBand`.

## References

- Architecture: https://claude.ai/code/artifact/a928ce01-03f8-47e5-a6c2-371a07c8710e
- Current engine research: `/private/tmp/claude-501/-Users-sradevski-Code-medusa-medusa/f3ba683f-bc7b-4c98-a055-3a387b0b0343/scratchpad/current-workflow-engine-research.md` (also `thoughts/shared/research/2026-10-19-current-workflow-engine.md`)
- Library survey: `thoughts/shared/research/2026-10-19-workflow-engine-libraries.md`
- Key code: `packages/core/workflows-sdk/src/utils/composer/create-workflow.ts:102-299`, `create-step.ts:142-513`, `helper/workflow-export.ts:49-659`, `packages/medusa/src/loaders/index.ts:164-254`, `packages/core/utils/src/common/define-config.ts:372-515`, `packages/core/utils/src/modules-sdk/definition.ts:36-97`

---

## Status (2026-10-19)

Milestones 1-5 are implemented on `feat/workflow-engine-v2`. `yarn build` passes. Test runs are deferred to the end.

Milestone 5 notes:

- `defineConfig` replaces the old workflow engine entries instead of dropping them, carrying the Redis URL to `notifier.redisUrl`. Loading an old path outside `defineConfig` throws in `registerMedusaModule`.
- The module's `run` is typed from the workflow (`WorkflowInputOf`, `WorkflowResultOf` in `@medusajs/types`), via a type-only `" $workflowTypes"` property on `ReturnWorkflow`. Runs by id stay `any`. Migrating the loyalty plugin would surface two untyped inputs (gift card and store credit account creation).
- Deprecation warning: the SDK facade calls the module's `DIRECT_CALL_NOTICE` symbol method. The module option `deprecationWarnings` defaults to `NODE_ENV === "development"`.
- The `no-workflow-call-without-container` ESLint rule is deprecated and removed from `strict`, replaced by `no-direct-workflow-run` in `recommended`.
- Codemod: `packages/cli/medusa-cli/src/codemods/workflow-engine-run.ts`, which also inlines `const x = wf(c); x.run()` bindings. By decision (keep the change minimal), it is NOT applied to the repo: call sites in medusa, core-flows, the plugins, TSDoc examples, and docs snippets still use the deprecated direct calls. Migrate them in a follow-up.
- core-flows unit tests load `@medusajs/workflows` at runtime, with no declared devDependency, to avoid a turbo cycle (workflows -> test-utils -> core-flows).
- The upgrade guide lives on the resources Workflow Engine Module page. The codemod page is in the book. Changesets: `.changeset/workflow-engine-v2-*.md`.

Still to run: unit tests (workflows, core-flows, medusa, cli, eslint-plugin, utils, modules-sdk), the ported module integration tests, `integration-tests/modules`, and the HTTP suite (re-check the 6 connection-failure suites).
