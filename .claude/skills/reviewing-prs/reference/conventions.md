# Medusa Development Conventions

Conventions to verify when reviewing code contributions. Focus on areas relevant to the changed files.

## API Changes

- **Integration tests required**: Changes to `packages/medusa/src/api/` must include corresponding changes in `integration-tests/http/__tests__/`.
- **Zod validation**: API routes that accept a request body must validate it with a Zod schema. Look for a `validator` middleware or a `.zod.ts` schema file alongside the route.
- **HTTP types**: Zod schema changes must be reflected in HTTP types. These can be generated using `packages/cli/http-types-generator`. If a Zod schema changed but no HTTP type changed, flag it.
- **Typed route arguments**: Request and response types for API routes must use type arguments for query params, request body, and response. The types must be HTTP types from `@medusajs/framework/types`. Example:
  ```typescript
  // Correct
  export const POST = async (
    req: AuthenticatedMedusaRequest<AdminCreateOrderBody>,
    res: MedusaResponse<AdminOrderResponse>
  ) => { ... }

  // Wrong — missing type arguments
  export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => { ... }
  ```

## Naming Conventions

- **Object properties**: snake_case (`region_id`, `created_at`)
- **Variables and function parameters**: camelCase (`regionId`, `createdAt`)
- **Private/protected class properties**: suffixed with `_` (`this.service_`, `protected manager_`)
- **File names**: kebab-case (`order-module-service.ts`, `delete-promotions.ts`)
- **Variable names must be readable** — avoid abbreviations like `ord`, `rej`, `tmp`

## Code Style

- No semicolons
- Double quotes for strings
- 2-space indentation
- ES5 trailing commas
- Arrow functions always use parentheses around parameters: `(x) => x + 1`

## Architecture Patterns

- **Services**: Must extend `MedusaService`. Public methods use `@InjectManager()`. Protected methods (for transactions) use `@InjectTransactionManager()`. Both accept `@MedusaContext() sharedContext: Context = {}` as the last parameter.
- **Mutations**: Must go through workflows (`createWorkflow` / `createStep`). API routes must not call module services directly for writes.
- **Errors**: Use `new MedusaError(MedusaError.Types.NOT_FOUND, "...")` — never raw `throw new Error(...)`.
- **Barrel exports**: Use `export * from` for module re-exports.
- **Step compensation**: `createStep` should include a compensation function when the step has side effects that can be rolled back.

## Testing

- Unit tests: `__tests__/` directories alongside source, `.spec.ts` or `.test.ts` suffix.
- Integration tests for HTTP routes: `integration-tests/http/__tests__/`.
- New functionality must have tests. Minor bug fixes may omit tests if the fix is trivial and clear, but tests are always preferred.
