# TSDoc: API Routes

API route files live under `packages/medusa/src/api/admin/` and `packages/medusa/src/api/store/`. They export named HTTP handler functions (`GET`, `POST`, `DELETE`, `PATCH`).

## Rules

- Only add TSDocs to the exported handler functions (`GET`, `POST`, etc.)
- Keep it **minimal**: only `@featureFlag` and/or `@since` — no full method documentation
- If a handler has neither a feature flag nor is demonstrably new, add **no TSDoc**
- Do NOT add `@param`, `@returns`, `@example`, or descriptions to route handlers

## Detecting Feature Flags

Look inside the handler body for `FeatureFlag.isFeatureEnabled(...)`:

```typescript
// This route is behind the "index_engine" feature flag
export const GET = async (req, res) => {
  if (FeatureFlag.isFeatureEnabled(IndexEngineFeatureFlag.key)) {
    // ...
  }
}
```

The `@featureFlag` value is the flag's key string (e.g. `IndexEngineFeatureFlag.key` → `"index_engine"`).

Also check if the route file is conditionally registered based on a flag in the route registration config or middleware.

## When to Add Each Tag

| Condition | Add |
|-----------|-----|
| Handler uses `FeatureFlag.isFeatureEnabled(XFlag.key)` | `@featureFlag <flag_key>` |
| Handler is new in this commit's diff | `@since <version>` |
| Handler is existing AND has no feature flag | Nothing |

## Examples

**Feature flag only:**
```typescript
/**
 * @featureFlag index_engine
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductListParams>,
  res: MedusaResponse<HttpTypes.AdminProductListResponse>
) => {
  // ...
}
```

**New route with feature flag:**
```typescript
/**
 * @since 2.14.0
 * @featureFlag view_configurations
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminViewConfigurationListResponse>
) => {
  // ...
}
```

**New route without feature flag:**
```typescript
/**
 * @since 2.14.0
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateRegionType>,
  res: MedusaResponse<HttpTypes.AdminRegionResponse>
) => {
  // ...
}
```

**Existing route, no feature flag — no TSDoc needed:**
```typescript
// No TSDoc added — route is existing and has no feature flag
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminOrderListParams>,
  res: MedusaResponse<HttpTypes.AdminOrderListResponse>
) => {
  // ...
}
```

## Non-Handler Exports

Route files sometimes export validators or helpers. These are typically not exported from the module's public surface and do not need TSDocs.
