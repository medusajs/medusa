# @medusajs/core-flows

Library of Medusa's prebuilt workflows and steps (cart, order, product, payment, fulfillment, etc.). The Medusa API routes are thin wrappers around these workflows, and apps reuse them to perform the same business logic with the same side effects (links, events, inventory, locks).

## Using this package

- Import from `@medusajs/medusa/core-flows` in apps and plugins (re-export of this package). Inside the monorepo, `packages/medusa` imports `@medusajs/core-flows` directly.
- Every workflow and step has an exported ID constant next to it: `createProductsWorkflow` / `createProductsWorkflowId`, `createProductsStep` / `createProductsStepId`.
- Find the right workflow: read the matching API route in `packages/medusa/src/api/{admin,store}/...` to see which workflow it runs, or browse https://docs.medusajs.com/resources/medusa-workflows-reference.md (generated from the TSDoc in this package).

```ts
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

const { result } = await createProductsWorkflow(req.scope).run({
  input: {
    products: [
      { title: "Shirt", options: [{ title: "Size", values: ["S"] }] },
    ],
    additional_data: { erp_id: "123" },
  },
})
```

- Inside a custom workflow, call a prebuilt workflow with `.runAsStep({ input })`, and reuse prebuilt steps directly (e.g. `useQueryGraphStep`, `createRemoteLinkStep`, `emitEventStep`, `acquireLockStep`/`releaseLockStep`).
- `useQueryGraphStep` has the fixed step name `use-query-graph-step`; call `.config({ name: "..." })` when using it more than once in a workflow.

### Extending via hooks

- Workflows expose hooks through `createHook` and list them in `@property hooks.<name>` TSDoc. Consume them in `src/workflows/hooks/*.ts`:

```ts
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    return new StepResponse(undefined, products.map((p) => p.id))
  },
  async (productIds, { container }) => {}
)
```

- Hook inputs usually include `additional_data`, which API routes forward from the request body (see https://docs.medusajs.com/learn/fundamentals/api-routes/additional-data.md).
- One handler per hook per workflow. Docs: https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks.md

## Architecture

- `src/<domain>/` per commerce domain (e.g. `cart`, `order`, `product`, `payment-collection`, `locking`, `common`, `defaults`), each with:
  - `steps/`: one step per file, mostly a single module-service call plus a compensation that undoes it.
  - `workflows/`: compositions of steps; `order/workflows/` has subfolders for order changes (`claim`, `exchange`, `order-edit`, `return`, `transfer`).
  - `utils/` (or `helpers/`): plain functions and field lists shared by the domain.
  - `index.ts` barrels re-exported by `src/index.ts`.
- `common/` holds cross-domain steps/workflows: `useQueryGraphStep`, `useRemoteQueryStep`, `emitEventStep`, `createRemoteLinkStep`, `dismissRemoteLinkStep`, `updateRemoteLinksStep`, `createEntitiesStep`, `deleteEntitiesStep`, and `createLinksWorkflow`/`updateLinksWorkflow`/`dismissLinksWorkflow`/`batchLinksWorkflow`.
- Cart and other concurrency-sensitive workflows wrap their body in `acquireLockStep({ key: input.cart_id, ... })` / `releaseLockStep` (from `locking/`).
- Step convention (see `product/steps/create-products.ts`):

```ts
export const createProductsStepId = "create-products"
export const createProductsStep = createStep(
  createProductsStepId,
  async (data: ProductTypes.CreateProductDTO[], { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)
    const created = await service.createProducts(data)
    return new StepResponse(created, created.map((product) => product.id))
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)
    await service.deleteProducts(createdIds)
  }
)
```

## Development

```bash
yarn workspace @medusajs/core-flows build
yarn workspace @medusajs/core-flows test
cd packages/core/core-flows && ../../../node_modules/.bin/jest src/cart/utils/__tests__/prepare-confirm-inventory-input.spec.ts
```

- Unit tests are sparse (`src/**/__tests__/`). Workflow behavior is covered by:
  - `integration-tests/http/__tests__/<domain>/` (through API routes), run with `yarn test:integration:http` from the root.
  - `integration-tests/modules/__tests__/<domain>/` (e.g. `order/workflows/`), run with `yarn test:integration:modules`.
- Import framework APIs from `@medusajs/framework/*` (`/workflows-sdk`, `/utils`, `/types`), as nearly all files do. `@medusajs/framework` is a peer dependency.
- New workflows/steps: export an `xWorkflowId`/`xStepId` constant, add TSDoc with `@example`, `@summary`, and `@property hooks.<name>` for each hook (the reference docs are generated from it; use the `writing-tsdocs` skill), and export from the domain `index.ts`.

## Gotchas

- Workflow IDs, step IDs, hook names, and hook input shapes are public API: apps consume hooks by name, run workflows by ID through the workflow engine (e.g. the store add-to-cart route calls `workflowEngine.run(addToCartWorkflowId, ...)`), and target steps by ID in `setStepSuccess`. Renaming or reshaping them is breaking.
- Steps must stay compensatable: return the data needed to undo the action as the second `StepResponse` argument and guard against `undefined` in the compensation.
- `emitEventStep` emits with the workflow's `eventGroupId`; its compensation clears those grouped events, so emit inside the workflow rather than calling the event bus directly.
- Adding a step to an existing workflow that already uses the same step needs a unique `.config({ name })`, or registration fails with `Step <name> is already defined in workflow.`
