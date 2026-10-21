# @medusajs/workflows-sdk

Composition API for Medusa workflows (`createWorkflow`, `createStep`, `transform`, `when`, `parallelize`, `createHook`). It builds a step graph on top of `@medusajs/orchestration`; execution is handled by the workflow engine module.

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

- `createWorkflow` calls the constructor immediately to record the step graph (`composer.apply(context, [inputPlaceHolder])` in `create-workflow.ts`). At that time `input` and every step result are proxies, not values.
- Therefore no `if`/ternary/`??`/`||`/`?.`/`!!`/spread/loops/`try-catch`/`new Date()` on workflow data in the constructor. Use `transform()` to compute values and `when(...).then(...)` for branching. The constructor must not be `async`.
- `transform(values, fn1, fn2, ...)` chains up to 7 functions; results are cached per transaction in temporary data, so a transform runs once per execution.
- `when(input, cond).then(fn)`: if `then` returns a non-step value, give the `when` a name (`when("name", input, cond)`), otherwise a random `when-then-<ulid>` name is used with a console warning ("not recommended for production"). Forgetting `.then` throws `".then" is missing after "when" condition` on next tick.
- Calling `createStep(...)` result outside a `createWorkflow` constructor throws `createStep must be used inside a createWorkflow definition`.
- Reusing the same step twice in one workflow needs `.config({ name: "unique-name" })`, otherwise orchestration throws `Step <name> is already defined in workflow.`
- `parallelize(stepA(), stepB())` merges the actions to run in parallel.
- Run another workflow inside a workflow with `otherWorkflow.runAsStep({ input })`, not `.run()`.
- Step and workflow outputs are serialized for storage: return only serializable data (no `Map`, class instances).

### Steps and compensation

- `new StepResponse(output, compensateInput?)`: compensate input defaults to `output` when omitted. The compensation function receives it (may be `undefined`), so guard for it.
- `StepResponse.permanentFailure(message, compensateInput?)` fails without retries; `StepResponse.skip()` marks the step skipped.
- Step config (`createStep({ name, ...config }, fn)` or `.config({...})`): `async`, `compensateAsync`, `maxRetries`, `retryInterval`, `timeout`, `continueOnPermanentFailure`, `skipOnPermanentFailure`, `saveResponse`, `nested` (from `TransactionStepsDefinition` in orchestration).
- Step context (`StepExecutionContext`): `container`, `context`, `workflowId`, `stepName`, `action`, `attempt`, `idempotencyKey`, `transactionId`, `metadata`, `eventGroupId`.

### Long-running / async steps

- A step with `async: true` that returns no `StepResponse` leaves the workflow waiting in the background; if it does return a `StepResponse` it completes immediately (`wrapAsyncHandler`).
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
- Exported workflow also has `registerStepSuccess`, `registerStepFailure`, `retryStep`, `cancel`.

## Architecture

- `src/utils/composer/`: `create-workflow.ts`, `create-step.ts`, `transform.ts`, `when.ts`, `parallelize.ts`, `create-hook.ts`, `helpers/` (`StepResponse`, `WorkflowResponse`, proxy, `resolveValue`, step handler).
- `src/helper/workflow-export.ts`: `exportWorkflow` wraps a `LocalWorkflow` with `run`/`cancel`/etc. and resolves results.
- `src/medusa-workflow.ts`: global `MedusaWorkflow` registry (stored on `global`, so duplicated package copies share it).
- Composition state lives on `global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext]` and the `when` condition on `global[...SymbolMedusaWorkflowComposerCondition]`; steps attach to whatever context is current.
- Workflow names are global: re-calling `createWorkflow` with an existing name re-registers it in `WorkflowManager` (this is how definitions are overridden).
- Subpath export `@medusajs/workflows-sdk/composer` (re-exported as `@medusajs/framework/workflows-sdk/composer`).

## Development

```bash
yarn workspace @medusajs/workflows-sdk build
yarn workspace @medusajs/workflows-sdk test
cd packages/core/workflows-sdk && ../../../node_modules/.bin/jest src/utils/composer/__tests__/compose.spec.ts
yarn workspace @medusajs/workflows-sdk test:run   # runs dist/utils/_playground.js after build
```

- Unit tests: `src/utils/composer/__tests__/` (`compose.spec.ts`, `index.spec.ts`).
- Engine-level behavior (async steps, retries, subscribe, races) is tested in `packages/modules/workflow-engine-inmemory/integration-tests/__tests__/` and `packages/modules/workflow-engine-redis/integration-tests/__tests__/`.

## Gotchas

- Hook handlers are wrapped in the same `when` condition as the hook if declared inside one.
- `runAsStep` of an async workflow runs it via the workflow engine as a nested transaction with id `<name>-as-step-<parentTransactionId>`; its compensation cancels that nested transaction.
