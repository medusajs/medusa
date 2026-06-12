# api-standards.md

**Last updated:** 2026-06-11

## Framework

**Express 4** (`express ^4.21.0`) — the HTTP layer is custom-built on top of Express, without NestJS or any decorator-based controller framework. Route files export named async functions for each HTTP method. All routing, middleware ordering, and handler wiring are managed by the Medusa framework layer in `packages/core/framework/src/http/`.

---

## Controller Inventory

Medusa does not use a controller class model. Routes are defined by **filesystem location** — each `route.ts` file within `packages/medusa/src/api/` corresponds to one URL. Named exports (`GET`, `POST`, `DELETE`, `PATCH`) define the handlers. Representative routes discovered via codegraph:

| Route file                                                                | Methods exposed       | URL (inferred from path)                             |
|---------------------------------------------------------------------------|-----------------------|------------------------------------------------------|
| `packages/medusa/src/api/admin/api-keys/[id]/route.ts`                   | GET, POST, DELETE     | `/admin/api-keys/:id`                                |
| `packages/medusa/src/api/admin/campaigns/[id]/route.ts`                  | GET, POST, DELETE     | `/admin/campaigns/:id`                               |
| `packages/medusa/src/api/admin/collections/[id]/route.ts`                | GET, POST, DELETE     | `/admin/collections/:id`                             |
| `packages/medusa/src/api/admin/customer-groups/[id]/route.ts`            | GET, POST, DELETE     | `/admin/customer-groups/:id`                         |
| `packages/medusa/src/api/admin/customers/[id]/route.ts`                  | GET, POST, DELETE     | `/admin/customers/:id`                               |
| `packages/medusa/src/api/admin/customers/[id]/addresses/[address_id]/route.ts` | GET, POST, DELETE | `/admin/customers/:id/addresses/:address_id`   |
| `packages/medusa/src/api/admin/draft-orders/[id]/route.ts`               | GET, POST, DELETE     | `/admin/draft-orders/:id`                            |
| `packages/medusa/src/api/admin/fulfillment-sets/[id]/service-zones/[zone_id]/route.ts` | GET, POST, DELETE | `/admin/fulfillment-sets/:id/service-zones/:zone_id` |
| `packages/medusa/src/api/admin/inventory-items/[id]/route.ts`            | GET, POST, DELETE     | `/admin/inventory-items/:id`                         |
| `packages/medusa/src/api/admin/orders/route.ts`                          | GET (list)            | `/admin/orders`                                      |
| `packages/medusa/src/api/admin/payment-collections/[id]/route.ts`        | GET, POST             | `/admin/payment-collections/:id`                     |
| `packages/medusa/src/api/admin/product-categories/` (tree)               | GET, POST, DELETE     | `/admin/product-categories`, `/admin/product-categories/:id` |
| `integration-tests/http/__fixtures__/feature-flag/src/api/custom/route.ts` | GET, POST           | `/custom` (fixture)                                  |

Source: `packages/medusa/src/api/admin/` tree; `packages/core/framework/src/http/routes-finder.ts`

---

## HTTP Method Usage

| Method | Usage pattern                                               | Example                                                       |
|--------|-------------------------------------------------------------|---------------------------------------------------------------|
| GET    | Retrieve a single resource or list resources                | `GET /admin/api-keys/:id` → returns `{ api_key: ApiKeyDTO }` |
| POST   | Create or update a resource (update uses POST on `:id`)     | `POST /admin/api-keys/:id` → update; `POST /admin/products` → create |
| DELETE | Soft-delete a resource                                      | `DELETE /admin/api-keys/:id` → returns delete response shape |
| PATCH  | Partial update (used for some routes)                       | Present in some routes per codegraph discovery                |

Note: Medusa uses `POST /:id` for updates rather than `PUT` or `PATCH` in the admin API, as seen in `packages/medusa/src/api/admin/api-keys/[id]/route.ts` and `packages/medusa/src/api/admin/campaigns/[id]/route.ts`.

---

## URL Pattern Conventions

- **No version prefix** in the current URL tree (`/admin/...`, `/store/...`, `/auth/...`)
- **Resource naming:** plural nouns — `/admin/api-keys`, `/admin/campaigns`, `/admin/customers`
- **Nesting:** sub-resources use parent ID in path — `/admin/customers/:id/addresses/:address_id`
- **Dynamic segments:** bracket notation in file system (`[id]`, `[address_id]`) maps to Express `:id` params
- **Admin vs Store separation:** all admin-only routes live under `/admin/`; storefront routes live under `/store/`; auth routes under `/auth/`

Source: `packages/medusa/src/api/` directory tree

---

## Request Handling

### Request Types

Route handlers are typed with two request interfaces defined in `packages/core/framework/src/http/types.ts`:

- `MedusaRequest<Body, QueryFields>` — base request interface for unauthenticated or public endpoints
- `AuthenticatedMedusaRequest<Body, QueryFields>` — extends `MedusaRequest` with `auth_context: AuthContext` for protected endpoints

Key properties on `MedusaRequest`:

| Property              | Type                                                      | Description                                              |
|-----------------------|-----------------------------------------------------------|----------------------------------------------------------|
| `validatedBody`       | `Body`                                                    | Zod-validated request body                              |
| `validatedQuery`      | `RequestQueryFields & QueryFields`                        | Zod-validated query parameters                          |
| `queryConfig`         | `{ fields, pagination, withDeleted? }`                    | RemoteQuery field selection and pagination config        |
| `filterableFields`    | `QueryFields`                                             | Filterable fields extracted from query params            |
| `scope`               | `MedusaContainer`                                         | Awilix IoC container for resolving services              |
| `listConfig`          | `FindConfig<unknown>`                                     | MikroORM select/relation/pagination config (legacy)      |
| `retrieveConfig`      | `FindConfig<unknown>`                                     | MikroORM retrieve config (legacy)                        |

### Validation

Request body and query validation is done with **Zod 4** schemas, applied via:
- `validateAndTransformBody` — `packages/core/framework/src/http/utils/validate-body.ts`
- `validateAndTransformQuery` — `packages/core/framework/src/http/utils/validate-query.ts`

Middleware validators use `additionalDataValidator` (a `ZodObject`) for extensible `additional_data` fields:
```typescript
// packages/core/framework/src/http/__fixtures__/routers-middleware/middlewares.ts:58
{
  method: "POST",
  matcher: "/customers",
  additionalDataValidator: { group_id: z.string() },
}
```

### Query Config

Each route directory contains a `query-config.ts` that defines allowed fields and defaults:
```typescript
// packages/medusa/src/api/admin/customers/query-config.ts
export const listTransformQueryConfig = {
  defaults: defaultAdminCustomerFields,
  allowed,
  isList: true,
  entity: Entities.customer,
}
```
Source: `packages/medusa/src/api/admin/customers/query-config.ts`, `packages/medusa/src/api/admin/product-categories/query-config.ts`

---

## Response Shape

**Delete response** (consistent across all DELETE handlers):
```json
{ "id": "<resource_id>", "object": "<resource_type>", "deleted": true }
```
Example from `packages/medusa/src/api/admin/api-keys/[id]/route.ts`:
```typescript
res.status(200).json({ id, object: "api_key", deleted: true })
```

**Retrieve response** — resource wrapped in a named key:
```json
{ "api_key": { ...ApiKeyDTO } }
{ "campaign": { ...CampaignDTO } }
```

**List response** — resource array in a named plural key, with pagination metadata:
```json
{ "customers": [...], "count": 100, "limit": 20, "offset": 0 }
```

All response body types are drawn from `HttpTypes` in `@medusajs/framework/types`.

---

## Error Handling

### MedusaError

All internal errors use `MedusaError` from `packages/core/utils/src/common/errors.ts`:

```typescript
export class MedusaError extends Error {
  type: string       // one of MedusaErrorTypes
  message: string
  code?: string      // one of MedusaErrorCodes
  date: Date
}
```

**Error types** (`MedusaError.Types`):

| Type constant         | String value                  | Typical use                                |
|-----------------------|-------------------------------|--------------------------------------------|
| `NOT_FOUND`           | `"not_found"`                 | Resource lookup failure                    |
| `INVALID_DATA`        | `"invalid_data"`              | Bad input or invalid state                 |
| `NOT_ALLOWED`         | `"not_allowed"`               | Forbidden operation                        |
| `UNAUTHORIZED`        | `"unauthorized"`              | Auth failure                               |
| `FORBIDDEN`           | `"forbidden"`                 | Permission denial                          |
| `DUPLICATE_ERROR`     | `"duplicate_error"`           | Uniqueness violation                       |
| `CONFLICT`            | `"conflict"`                  | Resource state conflict                    |
| `UNEXPECTED_STATE`    | `"unexpected_state"`          | Internal invariant violation               |
| `DB_ERROR`            | `"database_error"`            | Database-level error                       |

Source: `packages/core/utils/src/common/errors.ts`

**Throwing pattern** (seen across route files):
```typescript
if (!apiKey) {
  throw new MedusaError(
    MedusaError.Types.NOT_FOUND,
    `API Key with id: ${req.params.id} was not found`
  )
}
```
Source: `packages/medusa/src/api/admin/api-keys/[id]/route.ts:24`

### Error Handler Function

The framework defines `MedusaErrorHandlerFunction` for global error handling:
```typescript
// packages/core/framework/src/http/types.ts:47
export type MedusaErrorHandlerFunction = (
  error: any,
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => Promise<void> | void
```

A custom error handler can be exported from a project's middleware file and is loaded by `MiddlewareFileLoader` (`packages/core/framework/src/http/middleware-file-loader.ts`).

**HTTP status codes:** 200 for success, 401 for unauthenticated responses (set explicitly in authenticate middleware), framework maps `MedusaError` types to appropriate HTTP codes.

---

## Authentication

Authentication is handled by the `authenticate` middleware factory in `packages/core/framework/src/http/middlewares/authenticate-middleware.ts`.

**Supported auth types** (`AuthType`):
- `SESSION_AUTH` — session cookie (`express-session`)
- `BEARER_AUTH` — JWT Bearer token in `Authorization` header, verified with `jsonwebtoken`
- `API_KEY_AUTH` — secret API key via HTTP Basic auth (`sk_` prefixed tokens)

**Flow:**
1. For `user` actor type: attempts API key authentication via `Basic sk_...` header
2. Falls back to session: reads `req.session.auth_context`
3. Falls back to JWT: verifies `Authorization: Bearer <token>` using `http.jwtSecret` from config
4. Respects `allowUnauthenticated` and `allowUnregistered` flags for public/invite-flow endpoints
5. Returns `401 { message: "Unauthorized" }` if all auth methods fail

**Auth context** attached to request:
```typescript
// packages/core/framework/src/http/types.ts:209
export interface AuthContext {
  actor_id: string
  // ... additional fields
}
```

**JWT config keys** (from `packages/core/framework/src/config/config.ts`):
- `process.env.JWT_SECRET` / `http.jwtSecret`
- `process.env.JWT_PUBLIC_KEY` / `http.jwtPublicKey`
- `http.jwtExpiresIn` (default: `"1d"`)

---

## Middleware & Interceptors

Middleware is defined using `defineMiddlewares` from `packages/core/framework/src/http/utils/define-middlewares.ts` and loaded from each project's middleware file by `MiddlewareFileLoader`.

**Middleware configuration shape:**
```typescript
defineMiddlewares([
  {
    matcher: "/customers",          // string or RegExp
    methods?: MiddlewareVerb[],     // HTTP methods filter
    middlewares: [fn, ...],
    bodyParser?: { sizeLimit?, preserveRawBody? } | false,
    additionalDataValidator?: ZodRawShape,
  }
])
```

**Known built-in middleware:**
- `authenticate` — auth guard (described above)
- `wrapWithPoliciesCheck` — RBAC policy enforcement (`packages/core/framework/src/http/middlewares/check-permissions.ts`)
- Body parser middleware with configurable size limits and raw body preservation
- `defaultFiltersMiddleware` — extracts filterable fields from query params
- `paramsAsFiltersMiddleware` — maps path params to filter fields
- `applyLocale` — resolves locale from query param, header, or store default
- `clearFiltersByKeyMiddleware` — removes specific filter keys

Source: `packages/core/framework/src/http/middleware-file-loader.ts`, `packages/core/framework/src/http/__fixtures__/routers-middleware/middlewares.ts`
