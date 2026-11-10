# @medusajs/workflows-sdk

Composition API for Medusa workflows (`createWorkflow`, `createStep`, `transform`, `when`, `parallelize`, `createHook`). Each workflow is compiled once, when it is defined, into a `@medusajs/workflow-engine` definition; the Workflow Engine Module (`@medusajs/workflows`) runs it.

## Using this package

- Import from `@medusajs/framework/workflows-sdk` in apps and plugins (re-exports this package), not from `@medusajs/workflows-sdk` directly.
- Docs: https://docs.medusajs.com/learn/fundamentals/workflows.md, constraints: https://docs.medusajs.com/learn/fundamentals/workflows/constructor-constraints.md

```ts
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

const createBrandStep = createStep(
  "create-brand",
  async (input: { name: string }, { container }) => {
    const brandService = container.resolve("brand")
    const brand = await brandService.createBrands(input)
    return new StepResponse(brand, brand.id)
  },
  async (brandId, { container }) => {
    if (!brandId) {
      return
    }
    await container.resolve("brand").deleteBrands(brandId)
  }
)

export const createBrandWorkflow = createWorkflow(
  "create-brand",
  function (input: { name: string; notify?: boolean }) {
    const brand = createBrandStep({ name: input.name })
    const payload = transform({ brand }, ({ brand }) => ({ id: brand.id }))
    when("notify-brand", { input }, ({ input }) => !!input.notify).then(
      () => {
        notifyBrandStep(payload)
      }
    )
    return new WorkflowResponse(brand)
  }
)

const { result } = await createBrandWorkflow(req.scope).run({
  input: { name: "Acme" },
})
```

### Composition rules (the constructor runs once, at definition time)

- `createWorkflow` calls the constructor immediately to record the step graph (`composer.apply(recorder, [inputPlaceHolder])` in `create-workflow.ts`). At that time `input` and every step result are proxies, not values.
- Therefore no `if`/ternary/`??`/`||`/`?.`/`!!`/spread/loops/`try-catch`/`new Date()` on workflow data in the constructor. Use `transform()` to compute values and `when(...).then(...)` for branching. The constructor must not be `async`.
- `transform(values, fn1, fn2, ...)` chains up to 7 functions; results are memoised per run, so a transform runs once per execution.
- `when(input, cond).then(fn)`: if `then` returns a non-step value, give the `when` a name (`when("name", input, cond)`), otherwise a `when-then-<n>` name based on declaration order is used, with a console warning, and it changes when `when` blocks are added or removed. Forgetting `.then` throws `Workflow "<name>": ".then" is missing after "when" condition` when the workflow is created.
- Calling `createStep(...)` result outside a `createWorkflow` constructor throws `createStep must be used inside a createWorkflow definition`.
- Reusing the same step twice in one workflow needs `.config({ name: "unique-name" })`, otherwise the engine throws `Workflow "<id>" has more than one step with id "<name>"`.
- `parallelize(stepA(), stepB())` merges the actions to run in parallel.
- Run another workflow inside a workflow with `otherWorkflow.runAsStep({ input })`, not `.run()`.
- Step and workflow outputs are serialized for storage: return only serializable data (no `Map`, class instances).

### Steps and compensation

- `new StepResponse(output, compensateInput?)`: compensate input defaults to `output` when omitted. The compensation function receives it (may be `undefined`), so guard for it.
- `StepResponse.permanentFailure(message, compensateInput?)` fails without retries; `StepResponse.skip()` marks the step skipped.
- Step config (`createStep({ name, ...config }, fn)` or `.config({...})`): `async`, `backgroundExecution`, `maxRetries`, `retryInterval`, `autoRetry`, `timeout`, `continueOnPermanentFailure`, `skipOnPermanentFailure`, `saveResponse`, `noCompensation`. `compensateAsync`, `retryIntervalAwaiting`, `maxAwaitingRetries`, `store` and `noWait` are still accepted but ignored (`src/compiler/to-definition.ts`).
- Step context (`StepExecutionContext`): `container`, `context`, `workflowId`, `stepName`, `action`, `attempt`, `idempotencyKey`, `transactionId`, `metadata`, `eventGroupId`.

### Long-running / async steps

- A step with `async: true` that returns no `StepResponse` leaves the workflow waiting in the background; if it does return a `StepResponse` it completes immediately. With `backgroundExecution: true` it completes when its handler finishes, whatever it returns (`toStepResult` in `src/compiler/handlers.ts`).
- Complete it later with the workflow engine service (`Modules.WORKFLOW_ENGINE`) `setStepSuccess` / `setStepFailure`, passing `idempotencyKey: { action, transactionId, stepId, workflowId }`. Docs: https://docs.medusajs.com/learn/fundamentals/workflows/long-running-workflow.md

### Hooks

```ts
const productCreated = createHook("productCreated", { product })
return new WorkflowResponse(product, { hooks: [productCreated] })

// consumer, e.g. src/workflows/hooks/product-created.ts
myWorkflow.hooks.productCreated(async ({ product }, { container }) => {
  // ...
}, async (compensateInput, { container }) => {})
```

- One handler per hook: a second registration throws `Cannot define multiple hook handlers for the <name> hook`. Unconsumed hooks run as no-op steps.
- `createHook(name, input, { resultValidator })` + `hook.getResult()` lets a workflow read the handler's return value (validated with a Zod-like `parse`).
- Docs: https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks.md

### Running

- `workflow(container).run({ input, context, throwOnError, resultFrom, logOnError })`. `throwOnError` defaults to `true`; with `false`, inspect `errors` on the returned `{ result, errors, transaction }`.
- Exported workflow also has `registerStepSuccess`, `registerStepFailure`, `retryStep`, `cancel` (`src/helper/runner.ts`), all through the Workflow Engine Module.
- Only registered workflows run. The framework registers those exported from `src/workflows` files of the app and its plugins, and core flows; others need `registerWorkflows` on the module.

## Architecture

- `src/utils/composer/`: `create-workflow.ts`, `create-step.ts`, `transform.ts`, `when.ts`, `parallelize.ts`, `create-hook.ts`, `helpers/` (`StepResponse`, `WorkflowResponse`, proxy, `resolveValue`).
- `src/compiler/`: `recorder.ts` records steps, conditions and hooks while the constructor runs; `to-definition.ts` turns the recording into an engine definition; `handlers.ts` builds each step's invoke and compensate handlers; `values.ts` resolves step inputs and conditions at run time.
- `src/helper/runner.ts`: `workflow(container)` and its `run`/`cancel`/etc., which go through the Workflow Engine Module.
- `src/brand.ts`: marks a workflow with its compiled definition (`isWorkflow`, `getWorkflowDefinition`), which is how loaders find workflows among a file's exports.
- The active recorder is kept on `global` (`Symbol.for("medusa.workflow.recorder")`), so duplicate package copies share it; steps attach to whatever recorder is current.
- Subpath export `@medusajs/workflows-sdk/composer` (re-exported as `@medusajs/framework/workflows-sdk/composer`).

## Development

```bash
yarn workspace @medusajs/workflows-sdk build
yarn workspace @medusajs/workflows-sdk test
cd packages/core/workflows-sdk && ../../../node_modules/.bin/jest src/compiler/__tests__/recorder.spec.ts
```

- Unit tests: `src/utils/composer/__tests__/` and `src/compiler/__tests__/`. Composition tests that run workflows end to end live in `packages/modules/workflows/src/__tests__/sdk/`.
- Engine-level behavior (async steps, retries, subscribe, races) is tested in `packages/modules/workflows/integration-tests/__tests__/` and `packages/core/workflow-engine/`.

## Gotchas

- Hook handlers are wrapped in the same `when` condition as the hook if declared inside one.
- `runAsStep` runs the child through the Workflow Engine Module with transaction id `<name>-as-step-<parentTransactionId>` (a sync child adds `-attempt-<n>` on retries); its compensation cancels that child run. An async child completes the parent's step when it finishes.
