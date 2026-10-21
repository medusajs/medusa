# Medusa Core

Open-source commerce platform. TypeScript monorepo with 35+ modular commerce packages.

Every package under `packages/` has its own `AGENTS.md` covering how to use it in a Medusa application and how to develop it here. Read the nearest one before working in a package.

## Building on Medusa

Medusa apps are customized, not forked. An application (or plugin) extends Medusa from its own `src/` directory with:

| Customization | App location | Package to read |
| --- | --- | --- |
| Custom modules (data models + service) | `src/modules/<name>` | `packages/core/utils`, `packages/core/modules-sdk` |
| Module links between modules | `src/links` | `packages/core/utils` (`defineLink`), `packages/modules/link-modules` |
| Workflows and steps | `src/workflows` | `packages/core/workflows-sdk`, `packages/core/core-flows` |
| API routes and middlewares | `src/api` | `packages/medusa`, `packages/core/framework` |
| Subscribers and scheduled jobs | `src/subscribers`, `src/jobs` | `packages/medusa`, `packages/core/framework` |
| Admin widgets and UI routes | `src/admin` | `packages/admin/admin-sdk`, `packages/design-system/ui` |
| Module providers (payment, fulfillment, file, auth, notification, ...) | `src/modules/<name>` | `packages/modules/providers/*` as reference implementations |
| Storefront / client calls | separate frontend | `packages/core/js-sdk` |

- Applications import from `@medusajs/framework/*` (e.g. `@medusajs/framework/utils`, `/http`, `/workflows-sdk`, `/types`) and `@medusajs/medusa/*`, not from internal packages directly.
- Commerce features live in modules (`packages/modules/*`), resolved from the container with `Modules.<NAME>`. Before building a feature, check whether a module and a prebuilt workflow in `@medusajs/core-flows` already cover it.
- Mutations go through workflows, not direct service calls from routes, so they get rollback (compensation) and hooks.

**Docs:** the documentation source lives in this repo, so read it locally:

- `docs.medusajs.com/learn/<path>` is `www/apps/book/app/learn/<path>/page.mdx`, `/resources/<path>` is `www/apps/resources/app/<path>/page.mdx`, `/ui/<path>` is `www/apps/ui/app/<path>/page.mdx`.
- Install: [`installation`](www/apps/book/app/learn/installation/page.mdx)
- Fundamentals: [modules](www/apps/book/app/learn/fundamentals/modules/page.mdx), [data models](www/apps/book/app/learn/fundamentals/data-models/page.mdx), [module links](www/apps/book/app/learn/fundamentals/module-links/page.mdx), [workflows](www/apps/book/app/learn/fundamentals/workflows/page.mdx), [API routes](www/apps/book/app/learn/fundamentals/api-routes/page.mdx), [admin](www/apps/book/app/learn/fundamentals/admin/page.mdx), [plugins](www/apps/book/app/learn/fundamentals/plugins/page.mdx)
- References: [commerce modules](www/apps/resources/app/commerce-modules/page.mdx), [infrastructure modules](www/apps/resources/app/infrastructure-modules/page.mdx), [workflows reference](www/apps/resources/app/medusa-workflows-reference/page.mdx), [service factory methods](www/apps/resources/app/service-factory-reference/page.mdx), [JS SDK](www/apps/resources/app/js-sdk/page.mdx)
- Generated references (`/resources/references/...`) have no `page.mdx`; fetch them as Markdown by appending `.md` to the URL, e.g. https://docs.medusajs.com/resources/references/file-provider-module.md. Full index: https://docs.medusajs.com/llms.txt
- Package `AGENTS.md` files ship to npm, where `www/` doesn't exist, so they link `docs.medusajs.com` URLs in their `.md` form instead.

> When working on the API reference documentation (`www/apps/api-reference`), read [`www/apps/api-reference/CLAUDE.md`](www/apps/api-reference/CLAUDE.md) for its path structure and the OAS → public docs flow.

> When working on the resources documentation (`www/apps/resources`), read [`www/apps/resources/CLAUDE.md`](www/apps/resources/CLAUDE.md) for details on references and how they're generated and built

> When working on the main documentation (`www/apps/book`), read [`www/apps/book/CLAUDE.md`](www/apps/book/CLAUDE.md) for the homepage structure and the What's New list that must be updated whenever a new feature, release, or notable guide ships.

### 1. Codebase Structure

**Monorepo Organization:**

```
/packages/
├── medusa/              # Main Medusa package
├── core/                # Core framework packages
│   ├── framework/       # Core runtime
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Utilities
│   ├── workflows-sdk/   # Workflow composition
│   ├── core-flows/      # Predefined workflows
│   └── modules-sdk/     # Module development
├── modules/             # 35+ commerce modules
│   ├── product/, order/, cart/, payment/...
│   └── providers/       # 16 provider implementations
├── admin/               # Dashboard packages
│   └── dashboard/       # React admin UI
├── cli/                 # CLI tools
├── plugins/             # Official plugins
└── design-system/       # UI components
/integration-tests/      # Full-stack tests
/www/                    # Documentation site
```

**Key Directories:**

- `packages/core/framework/` - Core runtime, HTTP, database
- `packages/medusa/src/api/` - API routes
- `packages/modules/` - Commerce feature modules
- `packages/admin/dashboard/` - Admin React app

### 2. Build System & Commands

**Package Manager**: Yarn 3.2.1 with node-modules linker

**Essential Commands:**

```bash
# Install dependencies
yarn install
# Build all packages
yarn build
# Build specific package
yarn workspace @medusajs/medusa build
# Watch mode (in package directory)
yarn watch
```

**Testing Commands:**

```bash
# All unit tests
yarn test
# Package integration tests
yarn test:integration:packages
# HTTP integration tests
yarn test:integration:http
# Module integration tests
yarn test:integration:modules
```

**Migrations:**

Whenever you create, modify, or delete a data model file inside a module (under `packages/modules`), generate the migration by running the module package's migration script from within that package — NEVER write migration files by hand:

```bash
cd packages/modules/<module> && yarn migration:create
```

NEVER edit the migration file by hand. If new changes land in the model, re run the script.

**Generated Files:**

After adding or removing keys in `packages/admin/dashboard/src/i18n/translations/en.json`, regenerate the JSON schema that validates all translation files:

```bash
cd packages/admin/dashboard && yarn i18n:schema
```

Skipping this leaves `Property <key> is not allowed` warnings on `en.json`, since `translations/$schema.json` is generated from `en.json` and lists every key in both `properties` and `required`. Commit the regenerated `$schema.json` with the translation change.

**Changesets:**

Every change to a published package needs a changeset. Generate it from the repo root with `yarn changeset`. If you can't answer the interactive prompts, write the equivalent file directly in `.changeset/<kebab-case-name>.md`:

```md
---
"@medusajs/workflow-engine-redis": patch
---

fix(workflow-engine-redis): short description of the change
```

- `patch`: non-breaking changes (fixes, features, refactors)
- `minor`: breaking changes
- NEVER use `major`

**Package README and AGENTS Files:**

Every package under `packages/` MUST have a `README.md`, an `AGENTS.md`, and a `CLAUDE.md` whose only content is `@AGENTS.md`.

- **New package:** create all three in the same PR. If it's published, add `"AGENTS.md"` to its `package.json` `files` and copy the `llms`, `llmsFull`, and `mcpServer` fields from `packages/medusa/package.json`.
- **Changed package:** in the same PR, update `README.md` and `AGENTS.md` when you change anything they describe: public API or exports, config or module options, commands and scripts, registration or import paths, data models, events, or documented behavior and gotchas.
- `AGENTS.md` follows the existing package files (e.g. `packages/core/js-sdk/AGENTS.md`): what the package is, `## Using this package`, `## Architecture`, `## Development`, `## Gotchas`. Skip empty sections and stay under 150 lines.
- Verify every command, option, method, and docs link against the source. Link docs as `.md` URLs (e.g. `https://docs.medusajs.com/learn/fundamentals/modules.md`), not repo paths, and only for pages that exist under `www/apps` or as generated references.

### 3. Testing Conventions

**Frameworks:**

- Jest 29.7.0 (backend/core)
- Vitest 4.1.10 (admin/frontend)

**Test Locations:**

- Unit tests: `__tests__/` directories alongside source
- Package integration tests: `packages/*/integration-tests/__tests__/`
- HTTP integration tests: `integration-tests/http/__tests__/`

**Patterns:**

- File extension: `.spec.ts` or `.test.ts`
- Unit test structure: `describe/it` blocks
- Integration tests: Use custom test runners with DB setup

### 4. Code Style Conventions

**Formatting (Prettier):**

- No semicolons
- Double quotes
- 2 space indentation
- ES5 trailing commas
- Always use parens in arrow functions

**TypeScript:**

- Target: ES2021
- Module: Node16
- Strict null checks enabled
- Decorators enabled (experimental)

**Naming Conventions:**

- Files: kebab-case (`define-config.ts`)
- Types/Interfaces/Classes: PascalCase
- Functions/Variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- DB fields: snake_case

**Branch Naming:**
Branch names must be prefixed by type, since the prefix drives the labels automatically applied to the PR:

- `feat/readable-name`: new features
- `fix/readable-name`: bug fixes
- `chore/readable-name`: refactors, clean-ups, and similar work
- `docs/readable-name`: docs-only PRs

`readable-name` must describe the PR's changes (kebab-case). Do NOT use just the ticket number (e.g. use `fix/loyalty-admin-auth-type`, not `dx-2801`).

**Export Patterns:**

- Barrel exports via `export * from`
- Named re-exports for specific items

**General Conventions:**

- NEVER use emojos.

### 5. Architecture Patterns

#### 5.1 Module Pattern - Services with Decorators

**Service Structure:**

- Extend `MedusaService<T>` with typed model definitions
- Inject dependencies via constructor
- Use decorators for cross-cutting concerns

**Key Decorators:**

- `@InjectManager()` - Inject entity manager (use on public methods)
- `@InjectTransactionManager()` - Inject transaction manager (use on protected methods)
- `@MedusaContext()` - Inject shared context as parameter
- `@EmitEvents()` - Emit domain events after operation

**Example:**

```typescript
export class OrderModuleService
  extends MedusaService<{ Order: { dto: OrderDTO } }>({ Order })
  implements IOrderModuleService
{
  @InjectManager()
  @EmitEvents()
  async deleteOrders(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.deleteOrders_(ids, sharedContext)
  }

  @InjectTransactionManager()
  protected async deleteOrders_(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    await this.orderService_.softDelete(ids, sharedContext)
  }
}
```

**Reference Files:**

- `packages/modules/order/src/services/order-module-service.ts`
- `packages/modules/api-key/src/services/api-key-module-service.ts`

#### 5.2 API Route Pattern

**Route Structure:**

- Named exports for HTTP methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- Type request: `AuthenticatedMedusaRequest<T>` or `MedusaRequest<T>`
- Type response: `MedusaResponse<T>`
- Access dependencies from `req.scope`
- Use workflows from `@medusajs/core-flows`

**Example:**

```typescript
import { deleteOrderWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminOrderDeleteResponse>
) => {
  const { id } = req.params

  await deleteOrderWorkflow(req.scope).run({
    input: { id },
  })

  res.status(200).json({
    id,
    object: "order",
    deleted: true,
  })
}
```

**Common Patterns:**

- Filters: `req.filterableFields`
- Pagination: `req.queryConfig.pagination`
- Fields: `req.queryConfig.fields`
- Resolve services: `req.scope.resolve(ContainerRegistrationKeys.QUERY)`

**Store Routes - Allowed Fields:**

Store routes are public, so every store route that returns data MUST define an explicit `allowed` list in its query config. Without it, a client can request any field or relation through `?fields=` and read data it shouldn't see.

- Define `defaults` and `allowed` in the route's `query-config.ts`
- Build `allowed` with `buildAllowedFields()` / `prefixAllowedFields()` from `packages/medusa/src/api/store/utils/allowed-fields.ts`
- Only allow fields safe to expose publicly; list nested relation fields explicitly (e.g. `countries.iso_2`), not whole relations
- Pass the config to `validateAndTransformQuery()` in the route's `middlewares.ts`

```typescript
export const retrieveTransformQueryConfig = {
  defaults: defaultStoreRegionFields,
  allowed: buildAllowedFields(
    defaultStoreRegionFields,
    nestedStoreRegionCountryFields
  ),
  isList: false,
}
```

**Reference Files:**

- `packages/medusa/src/api/admin/orders/route.ts`
- `packages/medusa/src/api/admin/payment-collections/[id]/route.ts`
- `packages/medusa/src/api/store/regions/query-config.ts` (store allowed fields)

#### 5.3 Workflow Pattern

**Step Definition:**

- Create steps with `createStep(id, mainAction, compensationAction?)`
- Return `StepResponse(result, compensationData)`
- Compensation function handles rollback

**Workflow Composition:**

- Create workflows with `createWorkflow(id, function)`
- Use `WorkflowData<T>` for typed input
- Return `WorkflowResponse<T>` for typed output
- Chain steps, use `transform()`, `when()`, `parallelize()`
- Query data with `useQueryGraphStep()`
- Emit events with `createHook()`

**Example Step:**

```typescript
export const deletePromotionsStep = createStep(
  "delete-promotions",
  async (ids: string[], { container }) => {
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )
    await promotionModule.softDeletePromotions(ids)
    return new StepResponse(void 0, ids)
  },
  async (idsToRestore, { container }) => {
    if (!idsToRestore?.length) return
    const promotionModule = container.resolve<IPromotionModuleService>(
      Modules.PROMOTION
    )
    await promotionModule.restorePromotions(idsToRestore)
  }
)
```

**Example Workflow:**

```typescript
export const deletePromotionsWorkflow = createWorkflow(
  "delete-promotions",
  (input: WorkflowData<{ ids: string[] }>) => {
    const deletedPromotions = deletePromotionsStep(input.ids)
    const promotionsDeleted = createHook("promotionsDeleted", {
      ids: input.ids,
    })
    return new WorkflowResponse(deletedPromotions, {
      hooks: [promotionsDeleted],
    })
  }
)
```

**Reference Files:**

- `packages/core/core-flows/src/promotion/steps/delete-promotions.ts`
- `packages/core/core-flows/src/promotion/workflows/delete-promotions.ts`
- `packages/core/core-flows/src/order/workflows/update-order.ts`

#### 5.4 Error Handling

**MedusaError Pattern:**

- Use `new MedusaError(type, message)` for all error throwing
- Provide contextual, user-friendly error messages
- Validate inputs early in services and workflow steps

**Common Error Types:**

- `MedusaError.Types.NOT_FOUND` - Resource not found
- `MedusaError.Types.INVALID_DATA` - Invalid input or state
- `MedusaError.Types.NOT_ALLOWED` - Operation not permitted

**Example:**

```typescript
import { MedusaError, validateEmail } from "@medusajs/framework/utils"

// In service
if (!entity) {
  throw new MedusaError(
    MedusaError.Types.NOT_FOUND,
    `Order with id: ${id} was not found`
  )
}

// In workflow step
if (input.email) {
  validateEmail(input.email)
}

if (order.status === "cancelled") {
  throw new MedusaError(
    MedusaError.Types.NOT_ALLOWED,
    "Cannot update a cancelled order"
  )
}
```

**Reference Files:**

- `packages/core/utils/src/modules-sdk/medusa-internal-service.ts`
- `packages/core/core-flows/src/order/workflows/update-order.ts`

#### 5.5 Common Import Patterns

**Path Aliases (configured in tsconfig.json):**

- `@models` - Entity models
- `@types` - DTO and type definitions
- `@services` - Service dependencies
- `@repositories` - Data access layer
- `@utils` - Utility functions

**Framework Imports:**

```typescript
// Utils and decorators
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  MedusaService,
  EmitEvents,
  Modules,
} from "@medusajs/framework/utils"

// Types
import type {
  Context,
  DAL,
  IOrderModuleService,
} from "@medusajs/framework/types"

// Workflows
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"

// Core flows
import { deleteOrderWorkflow } from "@medusajs/core-flows"

// HTTP
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
```

### 6. GitHub Actions

**Automation Token:**

Any workflow that pushes branches, opens or updates PRs, comments, or labels MUST authenticate as the Medusa GitHub App. NEVER use a personal access token (e.g. `REFERENCE_PAT`) or the default `GITHUB_TOKEN` for these: the default token's pushes and PRs don't trigger CI.

```yaml
- name: Generate GitHub App token
  id: app-token
  uses: actions/create-github-app-token@v1
  with:
    app-id: ${{ secrets.MEDUSA_APP_ID }}
    private-key: ${{ secrets.MEDUSA_APP_PRIVATE_KEY }}

- uses: actions/checkout@v4
  with:
    token: ${{ steps.app-token.outputs.token }}
```

- Pass `${{ steps.app-token.outputs.token }}` as `GH_TOKEN` for `gh` calls and as `token` for `peter-evans/create-pull-request`
- Reusable workflows take `MEDUSA_APP_ID` and `MEDUSA_APP_PRIVATE_KEY` as `workflow_call` secrets and generate the token themselves
- In workflows that run Claude, keep the app token out of the job that runs the model: the model writes a result file, and a separate job validates it and pushes/opens the PR with the app token

**Reference Files:**

- `.github/workflows/fix-bug-action.yml`
- `.github/workflows/triage-issue-action.yml`
