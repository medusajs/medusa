# TSDoc: core-flows Workflows and Steps

Workflow and step files live under `packages/core/core-flows/src/`. Workflows are created with `createWorkflow(...)`, steps with `createStep(...)`.

## Workflows

Document the exported workflow `const` with:
- A description paragraph explaining what the workflow does and when it's used
- A link to the API route that executes it (if applicable)
- `@example` showing how to call `.run()`
- `@summary` with a one-line description
- `@property hooks.*` entries for each hook the workflow exposes
- `@since` if new (version from prompt)
- `@featureFlag` if behind a feature flag

### Workflow Template

```typescript
export const myWorkflowId = "my-workflow"
/**
 * This workflow [does X]. It's executed by the
 * [Some API Route](https://docs.medusajs.com/api/admin#resource_postresourceid).
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around [the operation].
 *
 * @example
 * const { result } = await myWorkflow(container)
 *   .run({
 *     input: {
 *       id: "foo_123",
 *     },
 *   })
 *
 * @summary
 *
 * [One-line summary of what the workflow does.]
 *
 * @property hooks.myHook - This hook is called [when/before/after X]. You can
 * use it to [describe what customization is possible].
 */
export const myWorkflow = createWorkflow(myWorkflowId, (input) => {
```

### Workflow with @featureFlag and @since

```typescript
/**
 * This workflow creates a view configuration.
 *
 * @since 2.10.3
 * @featureFlag view_configurations
 *
 * @example
 * const { result } = await createViewConfigurationWorkflow(container)
 *   .run({ input: { ... } })
 *
 * @summary
 *
 * Create a view configuration.
 */
export const createViewConfigurationWorkflow = createWorkflow(...)
```

### @property hooks — Documenting Hooks

Each hook exposed on `hooks.*` gets a `@property` entry describing when it runs and what it enables:

```typescript
 * @property hooks.validate - This hook is called before all operations. You can
 * use it to validate the input or perform any custom validation logic.
 *
 * @property hooks.setPricingContext - This hook is called after the cart is
 * retrieved. You can use it to pass custom pricing context to the workflow.
```

## Steps

Document the exported step `const` with:
- A description of what the step does (and what it throws/returns)
- `@example` showing how to call the step
- `@since` if new
- `@featureFlag` if behind a feature flag

Document the step's input type interface with descriptions for each property.

### Step Template

```typescript
export const myStepId = "my-step"
/**
 * This step [does X]. If [condition], the step throws an error.
 *
 * @example
 * const data = myStep({
 *   id: "foo_123",
 * })
 */
export const myStep = createStep(
  myStepId,
  async (data: MyStepInput, { container }) => {
```

### Step Input Type

```typescript
/**
 * The input for the {@link validateCartStep}.
 */
export interface ValidateCartStepInput {
  /**
   * The cart to validate.
   */
  cart: CartWorkflowDTO | CartDTO
}
```

> Use `{@link stepName}` in descriptions to cross-reference related steps.

### Step with @featureFlag and @since

For simple flag/version-only documentation (no full description warranted):

```typescript
export const createViewConfigurationStepId = "create-view-configuration"
/**
 * @since 2.10.3
 * @featureFlag view_configurations
 */
export const createViewConfigurationStep = createStep(...)
```

When a step is more complex or widely used, include a full description and `@example` even if it also has `@featureFlag`/`@since`.

## What NOT to Document

- The `*Id` string constant (e.g. `export const addToCartWorkflowId = "add-to-cart"`) — no TSDoc needed
- Internal helper functions not exported from the module
- Compensation functions (the third argument to `createStep`) — internal implementation detail
