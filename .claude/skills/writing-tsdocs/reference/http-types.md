# TSDoc: HTTP Types

HTTP type files live under `packages/core/types/src/http/`. They define the request and response shapes for the Medusa REST API.

## Rules

- Document every exported `interface` and `type` with a 1-sentence description
- Document every property with a concise description meaningful to API consumers
- Use `@expandable` on properties whose type is another interface that can be fetched expanded
- For union/enum fields with semantic values, explain each value with a bullet list
- **Do NOT add** `@param`, `@returns`, or `@since` to HTTP types — these are data shapes, not methods

## Interface Description Format

```typescript
/**
 * The order's adjustment line details.
 */
export interface BaseOrderAdjustmentLine {
```

```typescript
/**
 * The filters to apply when listing orders.
 */
export interface AdminOrderFilters extends BaseFilterable<AdminOrderFilters> {
```

## @expandable — Nested Objects

Add `@expandable` to properties whose type is another interface that can be fetched expanded via the `fields` query parameter:

```typescript
export interface AdminOrder {
  /**
   * The associated shipping methods.
   * @expandable
   */
  shipping_methods?: AdminOrderShippingMethod[]

  /**
   * The associated customer.
   * @expandable
   */
  customer?: AdminCustomer | null

  /**
   * The order's total amounts.
   */
  summary: BaseOrderSummary  // embedded value object — NOT independently fetchable, no @expandable
}
```

> **When to use `@expandable`:** The referenced type is a full entity that can be fetched via `fields` expansion (e.g. `?fields=+customer`). Primitive types, scalars, and embedded value objects do NOT get `@expandable`.

## Union/Enum Status Fields

When a string property has a finite set of meaningful values, explain each:

```typescript
/**
 * The order's status:
 * - `pending` — the order is awaiting payment
 * - `completed` — the order has been fulfilled and paid
 * - `cancelled` — the order has been cancelled
 * - `archived` — the order has been archived
 */
status: OrderStatus
```

## Full Before/After Example

**Before (no TSDocs):**

```typescript
export interface BaseOrderAdjustmentLine {
  id: string
  code?: string
  amount: number
  order_id: string
  description?: string
  promotion_id?: string
  provider_id?: string
  created_at: Date | string
  updated_at: Date | string
}
```

**After (with TSDocs):**

```typescript
/**
 * The order adjustment line's details.
 */
export interface BaseOrderAdjustmentLine {
  /**
   * The adjustment line's ID.
   */
  id: string
  /**
   * The promotion code associated with this adjustment.
   */
  code?: string
  /**
   * The adjustment's monetary amount.
   */
  amount: number
  /**
   * The ID of the order this adjustment belongs to.
   */
  order_id: string
  /**
   * The adjustment's description.
   */
  description?: string
  /**
   * The ID of the applied promotion.
   */
  promotion_id?: string
  /**
   * The ID of the associated provider.
   */
  provider_id?: string
  /**
   * The date the adjustment was created.
   */
  created_at: Date | string
  /**
   * The date the adjustment was last updated.
   */
  updated_at: Date | string
}
```

## Filterable Props Pattern

```typescript
/**
 * The filters to apply when listing orders.
 */
export interface AdminOrderFilters extends BaseFilterable<AdminOrderFilters> {
  /**
   * Filter by order IDs.
   */
  id?: string | string[]

  /**
   * Filter by order status.
   */
  status?: OrderStatus | OrderStatus[]
}
```
