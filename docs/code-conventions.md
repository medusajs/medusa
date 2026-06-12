# code-conventions.md

**Last updated:** 2026-06-11

## Naming Conventions

All naming conventions below are derived from codegraph symbol queries against the actual codebase.

### Classes

PascalCase. Class names are descriptive nouns or noun phrases.

| Pattern                       | Examples                                                                                         |
|-------------------------------|--------------------------------------------------------------------------------------------------|
| `<Domain>ModuleService`       | `ApiKeyModuleService`, `AuthModuleService`, `OrderModuleService`                                 |
| `<Role>Service` (internal)    | `MedusaService`, `AbstractEventBusModuleService`                                                 |
| `<Name>Finder`, `<Name>Loader`| `RoutesFinder`, `MiddlewareFileLoader`, `JobLoader`                                              |
| `<Concept>Error`              | `MedusaError`, `DuplicateIdPropertyError`                                                        |
| `<Name>Manager`               | `ConfigManager`, `WorkflowManager`                                                               |
| `<Concept>Filter`             | `AllowedFieldFilter`, `RestrictedFieldFilter`, `RBACFieldFilter`                                 |
| Relations (DML)               | `BelongsTo`, `HasMany`, `BaseRelationship`                                                       |

Source: `packages/modules/api-key/src/services/api-key-module-service.ts`, `packages/core/utils/src/common/errors.ts`, `packages/core/framework/src/http/routes-finder.ts`

### Interfaces

PascalCase, prefixed with `I` for module service contracts; no prefix for other interfaces.

| Pattern                  | Examples                                                                        |
|--------------------------|---------------------------------------------------------------------------------|
| `I<Domain>ModuleService` | `IOrderModuleService`, `IAuthModuleService`, `IApiKeyModuleService`             |
| `I<Concept>`             | `IModuleService`, `IFieldFilter`, `IAuthProvider`                               |
| No prefix                | `MedusaRequest`, `AuthContext`, `Logger`, `RouteVerb`, `TestRunnerConfig`       |

Source: `packages/core/types/src/modules-sdk/index.ts`, `packages/core/framework/src/http/utils/field-filtering/index.ts`

### Type Aliases

PascalCase. Used for union types, function types, and complex object shapes.

Examples: `MedusaErrorHandlerFunction`, `AuthType`, `RouteVerb`, `MiddlewareVerb`, `AsyncRouteHandler`, `WorkflowData`, `StepFunction`, `Hook`, `CreateWorkflowComposerContext`

Source: `packages/core/framework/src/http/types.ts`, `packages/core/workflows-sdk/src/utils/composer/type.ts`

### Functions and Methods

camelCase.

| Pattern                               | Examples                                                                                 |
|---------------------------------------|------------------------------------------------------------------------------------------|
| `create<Concept>` (factory / builder) | `createWorkflow`, `createStep`, `createHook`, `createEntity`                             |
| `define<Concept>`                     | `defineMiddlewares`, `defineProperty`, `defineRelationship`                              |
| `get<Concept>`                        | `getCallerFilePath`, `getWorkflow`, `getApiKeyInfo`, `getAuthContextFromJwtToken`        |
| `is<Concept>`                         | `isString`, `isDefined`, `isPresent`, `isProduction`, `isBelongsTo`, `isHasMany`        |
| `use<Concept>Step`                    | `useQueryGraphStep`                                                                      |
| `<verb><Noun>Step` (workflow steps)   | `deletePromotionsStep`, `emitEventStep`                                                  |
| `<verb><Noun>Workflow`                | `deletePromotionsWorkflow`, `updateOrderWorkflow`, `deleteApiKeysWorkflow`               |
| Decorators (exported as functions)    | `InjectManager`, `InjectTransactionManager`, `MedusaContext`, `EmitEvents`               |

Source: `packages/core/workflows-sdk/src/utils/composer/create-workflow.ts`, `packages/core/utils/src/modules-sdk/decorators/`

### Variables and Constants

- **Local variables / parameters:** camelCase — `actorType`, `authContext`, `stepName`
- **Module-level constants:** camelCase or SCREAMING_SNAKE_CASE

| Pattern                    | Examples                                                                |
|----------------------------|-------------------------------------------------------------------------|
| SCREAMING_SNAKE_CASE       | `ADMIN_ACTOR_TYPE`, `SESSION_AUTH`, `BEARER_AUTH`, `API_KEY_AUTH`      |
| camelCase (exported consts)| `defaultAdminCustomerFields`, `allowed`, `retrieveTransformQueryConfig` |

Source: `packages/core/framework/src/http/middlewares/authenticate-middleware.ts`, `packages/medusa/src/api/admin/customers/query-config.ts`

### Files

kebab-case for all TypeScript / JavaScript source files:
- `api-key-module-service.ts`
- `authenticate-middleware.ts`
- `define-middlewares.ts`
- `create-workflow.ts`
- `delete-promotions.ts`

### Database Fields

snake_case (MikroORM entity property naming maps to snake_case columns):
- `actor_id`, `auth_identity_id`, `app_metadata`, `user_metadata`
- `parent_category_id`, `is_active`, `is_internal`

Source: `packages/core/framework/src/http/types.ts:209`, `packages/medusa/src/api/admin/product-categories/query-config.ts`

---

## Formatting Rules

From root `.prettierrc`:

| Rule            | Value              |
|-----------------|--------------------|
| `semi`          | `false` (no semicolons) |
| `singleQuote`   | `false` (double quotes) |
| `tabWidth`      | `2`                |
| `trailingComma` | `"es5"`            |
| `arrowParens`   | `"always"`         |
| `endOfLine`     | `"auto"`           |

**Tailwind class sorting** (`prettier-plugin-tailwindcss`) is applied to:
- `packages/admin/dashboard/src/**/*.{ts,tsx}`
- `packages/design-system/ui/src/**/*.{ts,tsx}`

Source: `.prettierrc`

---

## Type System Usage

**TypeScript configuration** (from `_tsconfig.base.json`):

| Option                    | Value       | Implication                                              |
|---------------------------|-------------|----------------------------------------------------------|
| `target`                  | `ES2021`    | Modern JS features available                             |
| `module`                  | `Node16`    | Node ESM/CJS interop                                    |
| `strictNullChecks`        | `true`      | Null safety enforced                                    |
| `strictFunctionTypes`     | `true`      | Function parameter contravariance enforced              |
| `noImplicitAny`           | `false`     | Implicit `any` allowed (not strict mode)                |
| `noImplicitThis`          | `true`      | `this` must be typed                                    |
| `noImplicitReturns`       | `true`      | All code paths must return                              |
| `emitDecoratorMetadata`   | `true`      | Required for MikroORM and DI decorators                 |
| `experimentalDecorators`  | `true`      | Enables TypeScript decorator syntax                     |

**Type preferences:**
- **Interfaces** for module service contracts and request/response shapes: `IOrderModuleService`, `MedusaRequest`, `Logger`
- **Type aliases** for union types, function types, complex compositions: `AuthType`, `MedusaErrorHandlerFunction`, `WorkflowData<T>`
- **Generics** used extensively in workflow SDK: `createWorkflow<TData, TResult, THooks>`, `createStep<TInvokeInput, TInvokeResultOutput, TInvokeResultCompensateInput>`, `MedusaRequest<Body, QueryFields>`
- **Enums** used for domain constants: `MedusaErrorTypes` (as a plain object with `as const`), `Entities` enums in query configs, `RouteVerb`

Source: `_tsconfig.base.json`, `packages/core/utils/src/common/errors.ts`, `packages/core/workflows-sdk/src/utils/composer/create-workflow.ts`

---

## Async Patterns

The codebase is **uniformly async/await**. No Promise chaining (`.then().catch()`) or callback patterns are observed in the core application code. Observable patterns (RxJS) are not used.

```typescript
// Standard pattern across all route handlers:
export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const result = await someWorkflow(req.scope).run({ input: { ... } })
  res.status(200).json({ ... })
}

// Standard pattern in service methods:
@InjectManager()
async deleteOrders(ids: string[], @MedusaContext() sharedContext: Context = {}) {
  return await this.deleteOrders_(ids, sharedContext)
}
```

`promiseAll` (from `packages/core/utils/src/common/promise-all.ts`) is used in framework utilities for concurrent operations.

Source: `packages/medusa/src/api/admin/api-keys/[id]/route.ts`, `packages/core/utils/src/modules-sdk/decorators/inject-manager.ts`

---

## Error Handling Style

**Throw `MedusaError` everywhere**. All application errors use `new MedusaError(type, message)`.

```typescript
// packages/medusa/src/api/admin/api-keys/[id]/route.ts:24
throw new MedusaError(
  MedusaError.Types.NOT_FOUND,
  `API Key with id: ${req.params.id} was not found`
)
```

```typescript
// packages/core/modules-sdk/src/remote-query/query.ts:179
throw new MedusaError(
  MedusaError.Types.INVALID_DATA,
  "Invalid query, expected object and received something else."
)
```

**Patterns:**
- Route handlers throw `MedusaError` directly — no try/catch at the handler level
- The framework's global error handler (registered via `MedusaErrorHandlerFunction`) maps `MedusaError` types to HTTP status codes
- Service methods throw `MedusaError` for NOT_FOUND, INVALID_DATA, NOT_ALLOWED scenarios
- Input validation errors from Zod surface as `zod-validation-error` (version 5.0.0, `packages/core/framework/`)
- In `ConfigManager.rejectErrors()`: errors are thrown in production but only logged as warnings in development
- Workflow compensation functions handle rollback — they receive the compensation data from `StepResponse` and reverse the step's side effects

Source: `packages/core/utils/src/common/errors.ts`, `packages/core/framework/src/config/config.ts:59`

---

## Logging Patterns

**Logger interface** defined in `packages/core/types/src/logger/index.ts`:

```typescript
export interface Logger {
  panic(data: unknown): void
  shouldLog(level: string): boolean
  setLogLevel(level: string): void
  unsetLogLevel(): void
  activity(message: string, config?: unknown): string
  progress(activityId: string, message: string): void
  error(messageOrError: string | Error, error?: Error): void
  failure(activityId: string, message: string): unknown
  success(activityId: string, message: string): Record<string, unknown>
  silly(message: string): void
  debug(message: string): void
  verbose(message: string): void
  http(message: string): void
  info(message: string): void
  warn(message: string): void
  log(...args: unknown[]): void
}
```

**Log levels used in application code:** `panic`, `error`, `failure`, `warn`, `info`, `debug`, `verbose`, `silly`, `http`, `activity`, `progress`, `success`

**Instantiation pattern:** The logger is resolved from the DI container or accessed via the framework's `logger` export:
```typescript
// packages/core/framework/src/config/config.ts:2
import { logger } from "../logger"
// ...
customLogger.log(`redisUrl not found. A fake redis instance will be used.`)
```

The logger instance is also injectable via `InjectedDependencies` in module constructors:
```typescript
// packages/modules/event-bus-redis/src/services/event-bus-redis.ts
constructor({ logger, ... }: InjectedDependencies) {
  this.logger_ = logger
}
```

**Structured vs. unstructured:** The `Logger` interface uses string messages — unstructured logging. No JSON-structured logging library (e.g., pino, winston structured output) was observed in core framework code.

Source: `packages/core/types/src/logger/index.ts`, `packages/core/framework/src/config/config.ts`, `packages/modules/event-bus-redis/src/services/event-bus-redis.ts`

---

## Decorator Usage

TypeScript decorators are central to the module service pattern. All decorators are custom-built in `packages/core/utils/src/modules-sdk/decorators/`.

| Decorator                    | Construct level | Purpose                                                                                      | Source file                                                                    |
|------------------------------|-----------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `@InjectManager()`           | Method          | Injects an entity manager from `baseRepository_`; used on **public** service methods        | `packages/core/utils/src/modules-sdk/decorators/inject-manager.ts`             |
| `@InjectTransactionManager()` | Method         | Injects a transaction manager; used on **protected** (`_`-suffixed) service methods         | (sibling of inject-manager)                                                    |
| `@MedusaContext()`           | Parameter       | Marks the `sharedContext` parameter for automatic injection                                  | (sibling decorator)                                                            |
| `@EmitEvents()`              | Method          | Emits domain events after the decorated method completes                                     | (sibling decorator)                                                            |
| `@Cached(...)`               | Method          | Caches the method's return value (used on `RemoteQuery.graph` and `RemoteQuery.index`)       | `packages/core/modules-sdk/src/remote-query/query.ts`                          |

**Usage pattern in module services:**

```typescript
// Public method — uses @InjectManager + @EmitEvents
@InjectManager()
@EmitEvents()
async deleteOrders(
  ids: string[],
  @MedusaContext() sharedContext: Context = {}
) { ... }

// Protected implementation — uses @InjectTransactionManager
@InjectTransactionManager()
protected async deleteOrders_(
  ids: string[],
  @MedusaContext() sharedContext: Context = {}
) { ... }
```

Source: `packages/core/utils/src/modules-sdk/decorators/inject-manager.ts`, CLAUDE.md reference pattern from `packages/modules/order/src/services/order-module-service.ts`

**Requirement:** `@InjectManager()` requires that `@MedusaContext()` has been applied to a parameter in the same class first — the decorator reads `target.MedusaContextIndex_`. Missing `@MedusaContext()` raises an explicit error at decoration time.

---

## Anti-patterns Observed

The following are observed neutrally from codegraph traversal without evaluation:

1. **`noImplicitAny: false`** — TypeScript's `noImplicitAny` is disabled in `_tsconfig.base.json`, meaning untyped `any` can appear implicitly without a compile error.

2. **`console.error` in authentication middleware** — `packages/core/framework/src/http/middlewares/authenticate-middleware.ts:158` uses `console.error(error)` directly rather than the structured `logger` interface used elsewhere.

3. **`// @ts-ignore` comment** — present in `packages/modules/event-bus-redis/src/services/event-bus-redis.ts` (line ~42: `// @ts-ignore super(...arguments)`), suppressing a type error in the event bus constructor.

4. **Commented-out code blocks** — `packages/modules/event-bus-redis/src/services/event-bus-redis.ts` contains a multi-line TODO block for `eventOptions_` that is temporarily disabled (referenced issue #14478).

5. **`@deprecated` fields** — `MedusaRequest.remoteQueryConfig` is marked `@deprecated` in favor of `queryConfig` (`packages/core/framework/src/http/types.ts:162`), indicating an in-progress migration.
