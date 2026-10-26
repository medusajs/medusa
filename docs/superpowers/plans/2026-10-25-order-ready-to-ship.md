# Order Ready-to-Ship Fulfillment List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Veeqo-style "Ready to Ship" and "Shipped" tabs to the admin order list, with single-row and bulk one-click fulfillment that reuses the existing fulfillment workflow (which already buys the EasyPost label as a side effect).

**Architecture:** Two new tabs filter the existing orders list server-side by `fulfillment_status`/`payment_status` (new filter fields on the existing list route). A dashboard-side utility computes each order's parcel weight/dimensions from already-fetched line-item/variant data — shared by this feature and, later, the order-detail-layout plan. Single-row fulfillment reuses the existing `createOrderFulfillmentWorkflow` unchanged; bulk fulfillment gets one new workflow that loops it per order, independently.

**Tech Stack:** Medusa v2 (workflows, admin HTTP routes), React/React Query admin dashboard, Jest integration tests.

**Spec:** `docs/superpowers/specs/2026-10-25-order-ready-to-ship-design.md`

## Global Constraints

- Prettier: no semicolons, double quotes, 2-space indentation, ES5 trailing commas, parens around all arrow-function params.
- Every changed published package gets its own `patch` changeset — never `major`.
- No live Veeqo integration anywhere — Veeqo was only a UX reference during design.
- No emojis in code, comments, or copy.
- Button copy is `Fulfill`, never `Buy Label` (per spec) — label purchase is a side effect of fulfillment, not a separate explicit action.
- "Ready to Ship" = `payment_status` in `[captured, partially_captured]` AND `fulfillment_status` in `[not_fulfilled, partially_fulfilled]` AND `canceled_at IS NULL`.
- "Shipped" = `fulfillment_status` in `[shipped, partially_shipped, partially_delivered, delivered]`.
- `FulfillConfirmPopover` is a read-only confirmation display, never an editable form — an order needing a different location/quantities uses the existing full fulfillment form on the order detail page, unchanged by this plan.
- **Deviation from the spec's literal wording, decided during planning (see Task 2):** the spec says Package weight/dims "fall back to the provider's configured default." Verified during planning that the EasyPost provider's `defaultParcel` is a private constructor option (`this.options_.defaultParcel` in `EasyPostFulfillmentService`) with no public getter, and `buildParcel()` is not re-exported from the provider's `src/index.ts`. Reading it would require either changing the provider (a named non-goal) or a fragile deep import. Ruling: compute weight/dims from available variant data only; a field with no data anywhere among an order's unfulfilled items renders as "Not set" in the UI rather than a fabricated numeric default that might not even match what EasyPost would actually use. This is more honest to the user than a silent, unverifiable fallback number.
- **Deviation from the spec's literal wording, decided during planning (see Task 2):** the spec says parcel weight/dims are "computed server-side." Verified during planning that every input the computation needs (`items[].variant.weight/length/width/height`) is already fetchable through the existing orders list query's `fields` parameter — no new backend endpoint or server-side computation step is needed for this piece. The computation is implemented as a pure dashboard-side utility function instead, still structured as one shared, exported function so the order-detail-layout plan can reuse it unchanged, per that spec's own stated dependency on "the exact same server-side parcel-computation logic." ("Server-side" in that later spec's own wording should be read as "the one shared computation," not literally server-side; this plan's correction carries forward to that one.)

## Review Focus

- An order with multiple unfulfilled line items where only some have weight/dimensions set — the parcel computation must apply the "Not set" fallback per missing field, not treat the whole order as unknown because one item is incomplete. (Task 2)
- An order with a shipping method priced at exactly `$0` (free shipping) must show "$0.00" (or equivalent) in the Shipping Rate column, visibly distinct from an order with no shipping method at all (which shows the disabled-Fulfill "No shipping method" state) — these must not look identical. (Task 3)
- Switching between `All` / `Ready to Ship` / `Shipped` tabs must update the URL (not just client state) and must not show a stale previous tab's results while the new tab's query is loading. (Task 5)
- Bulk-fulfilling a mix of orders in one batch, where one is already `partially_fulfilled` with some items previously shipped — the workflow must only fulfill each order's own remaining unfulfilled items, not re-fulfill or error on the already-fulfilled ones. (Task 7)
- Clicking "Fulfill selected" with zero rows selected must not be reachable (the command bar only renders when `rowSelection` is non-empty, per the existing `_DataTable` mechanism) — confirmed by trace, not just inherited by assumption. (Task 8)

---

## Task 1: Backend — `fulfillment_status`/`payment_status` filters on the admin orders list

**Files:**
- Modify: `packages/medusa/src/api/admin/orders/validators.ts`
- Test: `integration-tests/http/__tests__/order/admin/order.spec.ts` (add cases to the existing list-filter test file — check this exact filename exists before creating a new one)

**Interfaces:**
- Produces: `GET /admin/orders?fulfillment_status=not_fulfilled,partially_fulfilled&payment_status=captured,partially_captured` returns only matching, non-canceled orders. `GET /admin/orders?fulfillment_status=shipped,partially_shipped,partially_delivered,delivered` likewise.

- [ ] **Step 1: Write the failing test**

In the orders list HTTP integration test file, add:

```ts
it("filters orders by fulfillment_status and payment_status, excluding canceled orders", async () => {
  // create: one order matching Ready-to-Ship criteria (captured, not_fulfilled, not canceled),
  // one shipped order, one canceled-but-otherwise-matching order
  const response = await api.get(
    "/admin/orders?fulfillment_status[]=not_fulfilled&fulfillment_status[]=partially_fulfilled&payment_status[]=captured&payment_status[]=partially_captured",
    adminHeaders
  )
  const ids = response.data.orders.map((o) => o.id)
  expect(ids).toContain(readyToShipOrder.id)
  expect(ids).not.toContain(shippedOrder.id)
  expect(ids).not.toContain(canceledOrder.id)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `integration-tests/http`): `npx jest --no-cache --forceExit --testPathPattern=order/admin/order.spec`
Expected: FAIL — `fulfillment_status`/`payment_status` are not recognized filter keys (either silently ignored, returning unfiltered results, or a Zod `.strict()` rejection — check which, and assert against the actual failure).

- [ ] **Step 3: Add `fulfillment_status` and `payment_status` to `AdminGetOrdersParamsBase`**

In `packages/medusa/src/api/admin/orders/validators.ts`, add to the merged `z.object({...})` alongside `sales_channel_id`/`tag_id`:

```ts
fulfillment_status: z
  .union([z.string(), z.array(z.string())])
  .optional(),
payment_status: z.union([z.string(), z.array(z.string())]).optional(),
```

Both are plain scalar columns on `Order` (unlike `tag_id`, which needed a transform to a relation filter) — no change to `AdminGetOrdersParamsTransform` should be needed. Verify this assumption while implementing; if the underlying query layer needs these as an explicit `$in` operator map instead of a bare array, add that narrowly, matching how `status` above it in the same file is already typed (`z.union([z.string(), z.array(z.string()), createOperatorMap()])`).

- [ ] **Step 4: Run test to verify it passes**

Same command as Step 2. Expected: PASS.

- [ ] **Step 5: Add the changeset**

```bash
cat > .changeset/add-order-fulfillment-payment-status-filters.md <<'EOF'
---
"@medusajs/medusa": patch
---

feat(orders): add fulfillment_status and payment_status filters to the admin orders list
EOF
```

- [ ] **Step 6: Commit**

```bash
git add packages/medusa/src/api/admin/orders/validators.ts integration-tests/http/__tests__/order/admin/order.spec.ts .changeset/add-order-fulfillment-payment-status-filters.md
git commit -m "feat(orders): add fulfillment_status/payment_status filters to admin orders list"
```

---

## Task 2: Dashboard — shared parcel-computation utility

**Files:**
- Create: `packages/admin/dashboard/src/lib/order-parcel.ts`
- Test: `packages/admin/dashboard/src/lib/order-parcel.spec.ts`

**Interfaces:**
- Produces:
  ```ts
  export type OrderParcel = {
    weight: number | null
    length: number | null
    width: number | null
    height: number | null
  }
  export function computeOrderParcel(
    items: Pick<HttpTypes.AdminOrderLineItem, "quantity" | "detail" | "variant">[]
  ): OrderParcel
  ```
  Takes an order's line items (the shape `AdminOrder.items` already has, including `variant.weight`/`length`/`width`/`height` once requested via `fields`) and an item's remaining-to-fulfill quantity (`item.detail.fulfilled_quantity` subtracted from `item.quantity` — read the existing `AdminOrderLineItem`/`detail` type shape before writing this, matching how the order detail page already determines "unfulfilled" per item elsewhere in this codebase). Returns one parcel: `weight` summed across unfulfilled items' `variant.weight * remaining_quantity`; `length`/`width`/`height` taken from whichever single unfulfilled item has the largest volume (`length * width * height`) among items that have all three set. A field is `null` in the result only when NO unfulfilled item in the order has a value for that field at all — this is the "Not set" case from Global Constraints, not per-item.
  - Consumed by: Task 3 (Ready-to-Ship table's Package column) and, later, the separate order-detail-layout plan.

- [ ] **Step 1: Write the failing tests**

```ts
describe("computeOrderParcel", () => {
  it("sums weight across unfulfilled items, multiplied by remaining quantity", () => {
    // two unfulfilled items, weights 10 and 5, quantities 2 and 1 => weight 25
  })
  it("takes dimensions from the item with the largest volume", () => {
    // item A: 2x2x2 (volume 8), item B: 10x1x1 (volume 10) => dims come from item B
  })
  it("returns null for a dimension when no unfulfilled item has it set", () => {
    // all items missing height => result.height === null, weight/length/width still computed if present
  })
  it("excludes already-fulfilled items from the computation", () => {
    // one item fully fulfilled (remaining quantity 0), one not => only the unfulfilled one counts
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run (from `packages/admin/dashboard`): `yarn vitest run src/lib/order-parcel.spec.ts`
Expected: FAIL — `computeOrderParcel` not defined.

- [ ] **Step 3: Implement `computeOrderParcel`**

Per the Interfaces block above. The "largest volume among items that have all three dimensions set" rule means an item missing even one dimension is excluded from the dimensions comparison entirely (it can still contribute to `weight` if it has a weight). If no unfulfilled item has all three dimensions set, `length`/`width`/`height` are each independently `null` only if literally no item has that specific field — check this matches the test in Step 1's third case exactly, since this is the one place the behavior is subtle enough to get wrong.

- [ ] **Step 4: Run tests to verify they pass**

Same command as Step 2. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/admin/dashboard/src/lib/order-parcel.ts packages/admin/dashboard/src/lib/order-parcel.spec.ts
git commit -m "feat(dashboard): add shared order-parcel computation utility"
```

---

## Task 3: Backend + Dashboard — Ready-to-Ship table

**Files:**
- Create: `packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/ready-to-ship-table.tsx`
- Modify: `packages/admin/dashboard/src/routes/orders/order-list/const.ts` (add fields needed: `items.variant.weight`, `items.variant.length`, `items.variant.width`, `items.variant.height`, `items.detail.fulfilled_quantity`, `shipping_methods`)
- Test: `integration-tests/http/__tests__/order/admin/order.spec.ts` (reuse Task 1's new filter to assert the right orders come back for this view)

**Interfaces:**
- Consumes: Task 1's `fulfillment_status`/`payment_status` filters; Task 2's `computeOrderParcel`.
- Produces: `ReadyToShipTable` component, consumed by Task 5's tab switch when `view=ready-to-ship`.

- [ ] **Step 1: Write the failing integration test**

Using Task 1's filter directly (`GET /admin/orders?fulfillment_status[]=not_fulfilled&fulfillment_status[]=partially_fulfilled&payment_status[]=captured&payment_status[]=partially_captured`), assert the fields needed for the Package column (`items.variant.weight` etc.) are present in the response when requested via `fields`. This is really confirming Task 1 + existing field-selection already compose correctly — if it already passes once Task 1 lands, that's fine; note it as confirming, not failing, in the report.

- [ ] **Step 2: Implement `ReadyToShipTable`**

Columns: Order #, Customer, Ship From (stock location name — read from `order.fulfillments`/the order's configured location the same way the existing order detail fulfillment panel resolves it; check that resolution before duplicating it), Package (render `computeOrderParcel(order.items)`'s weight/dims, each missing field shown as "Not set" per Global Constraints), Shipping Rate (`order.shipping_methods[0].name` + formatted amount; if absent, render empty and disable Fulfill — see Review Focus), Order Date, Total, a `Fulfill` action button rendered with no click handler yet — Task 6 (dispatched after this task) wires it to the real confirm popover by modifying this same file. Do not build a popover or placeholder dialog here; the button exists and is correctly disabled per the "No shipping method" rule, nothing more.

- [ ] **Step 3: Write the Review Focus test for the free-shipping-vs-no-shipping-method distinction**

```ts
it("shows $0.00 for a free shipping method, distinct from no shipping method at all", () => {
  // order A: shipping_methods[0].amount === 0 -> renders "$0.00", Fulfill enabled
  // order B: shipping_methods is empty -> renders empty cell, Fulfill disabled with "No shipping method"
})
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn vitest run` (dashboard component test) and the HTTP integration test from Step 1.
Expected: PASS.

- [ ] **Step 5: Add the changeset**

```bash
cat > .changeset/add-ready-to-ship-table.md <<'EOF'
---
"@medusajs/dashboard": patch
---

feat(orders): add Ready to Ship table with package and shipping rate columns
EOF
```

- [ ] **Step 6: Commit**

```bash
git add packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/ready-to-ship-table.tsx packages/admin/dashboard/src/routes/orders/order-list/const.ts .changeset/add-ready-to-ship-table.md
git commit -m "feat(orders): add Ready to Ship table"
```

---

## Task 4: Dashboard — Shipped table

**Files:**
- Create: `packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/shipped-table.tsx`

**Interfaces:**
- Consumes: Task 1's `fulfillment_status` filter (`shipped,partially_shipped,partially_delivered,delivered`).
- Produces: `ShippedTable` component, consumed by Task 5's tab switch when `view=shipped`.

- [ ] **Step 1: Implement `ShippedTable`**

Read-mostly columns: Order #, Customer, tracking status (from the order's fulfillments/tracking data — check what's already surfaced on the order detail fulfillment panel and reuse that field, don't invent a new one), carrier (from the fulfillment's shipping option/provider), ship date, Total. No action column, no Fulfill button.

- [ ] **Step 2: Add the changeset**

```bash
cat > .changeset/add-shipped-table.md <<'EOF'
---
"@medusajs/dashboard": patch
---

feat(orders): add read-only Shipped table
EOF
```

- [ ] **Step 3: Commit**

```bash
git add packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/shipped-table.tsx .changeset/add-shipped-table.md
git commit -m "feat(orders): add Shipped table"
```

---

## Task 5: Dashboard — tab bar and route/query-param wiring

**Files:**
- Modify: `packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/order-list-table.tsx`
- Create: `packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/order-list-tabs.tsx`

**Interfaces:**
- Consumes: Task 3's `ReadyToShipTable`, Task 4's `ShippedTable`.
- Produces: a `view` query param on the orders list route — `?view=ready-to-ship`, `?view=shipped`, or absent (defaults to `all`). `OrderListTabs` component reads/writes this param (via the existing `useSearchParams`/router convention already used elsewhere in this route tree — check `use-order-table-query.tsx` for the established pattern before picking a new one).

- [ ] **Step 1: Write `OrderListTabs`**

A simple tab bar (three tabs: `All`, `Ready to Ship`, `Shipped`) rendered above the table in `order-list-table.tsx`, each tab a `Link`/navigation changing the `view` query param — matching the "tabs at the top of the page content" placement from the spec's UI placement section.

- [ ] **Step 2: Wire `order-list-table.tsx` to switch rendered table by `view`**

`view=ready-to-ship` renders Task 3's `ReadyToShipTable`, `view=shipped` renders Task 4's `ShippedTable`. Default (`view` absent) renders the existing `OrderListTable`, completely unchanged.

- [ ] **Step 3: Write the Review Focus test for tab URL state**

A component/route test asserting: selecting the "Ready to Ship" tab updates the URL's `view` query param (not just internal component state — confirm by checking the URL itself, e.g. via the router's location, not just the rendered table), and that navigating directly to `?view=ready-to-ship` renders `ReadyToShipTable` without first flashing the default `All` table's stale results.

- [ ] **Step 4: Run tests to verify they pass**

Run: `yarn vitest run` (dashboard).
Expected: PASS.

- [ ] **Step 5: Add the changeset**

```bash
cat > .changeset/add-order-list-tabs.md <<'EOF'
---
"@medusajs/dashboard": patch
---

feat(orders): add Ready to Ship/Shipped tabs to the order list
EOF
```

- [ ] **Step 6: Commit**

```bash
git add packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/ .changeset/add-order-list-tabs.md
git commit -m "feat(orders): add Ready to Ship/Shipped tabs to the order list"
```

---

## Task 6: Dashboard — single-row Fulfill confirm popover

**Files:**
- Create: `packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/fulfill-confirm-popover.tsx`
- Modify: `packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/ready-to-ship-table.tsx` (wire the existing, currently-inert `Fulfill` button to open this popover)

**Interfaces:**
- Consumes: the existing `useCreateOrderFulfillment` hook (`packages/admin/dashboard/src/hooks/api/orders.tsx:206`), which calls `sdk.admin.order.createFulfillment(orderId, payload)` → `POST /admin/orders/:id/fulfillments` → `createOrderFulfillmentWorkflow` (from `@medusajs/core-flows`) — all pre-existing and unchanged by this task. Also consumes Task 3's `ReadyToShipTable` (to wire into).
- Produces: `FulfillConfirmPopover` component, and a working `Fulfill` button in Task 3's table (no longer inert after this task).

- [ ] **Step 1: Implement `FulfillConfirmPopover`**

Read-only confirmation display per Global Constraints: shows the order's default stock location and full remaining-quantity line items (reuse whatever the existing single-order fulfillment form (`order-create-fulfillment-form.tsx`) already resolves as "default location" and "remaining quantities" — read that file's logic before reimplementing it, since Task 2 already needed the same "remaining quantity" concept for Package computation). A Confirm button calls `useCreateOrderFulfillment(orderId).mutateAsync(...)` with those exact (unmodified) defaults as the payload. On success: closes, refetches the Ready-to-Ship list (invalidate the same query key Task 3's table reads). On failure (the workflow throws — e.g. EasyPost can't quote/buy for an incomplete address): stays open, shows the error message inline, per spec Error handling.

- [ ] **Step 2: Wire `ReadyToShipTable`'s `Fulfill` button to the popover**

Give the button an `onClick` that opens `FulfillConfirmPopover` for that row's order (local open/close state, same general shape as any other row-scoped popover in this codebase — check an existing one, e.g. the line-item notes popover from the earlier notes-and-tags plan, for the established pattern of a popover trigger living inside a table cell).

- [ ] **Step 3: Manual verification**

No new backend logic is introduced (the existing workflow is reused unchanged), so no new integration test is required per the spec's Testing section. Verify by reading: does `createOrderFulfillmentWorkflow`'s route handler surface a thrown provider error as a 4xx/5xx with a readable message the popover can display, or does it need explicit error-shape handling? Trace this before calling the task done.

- [ ] **Step 4: Commit**

```bash
git add packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/fulfill-confirm-popover.tsx packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/ready-to-ship-table.tsx
git commit -m "feat(orders): add single-row Fulfill confirm popover to Ready to Ship table"
```

---

## Task 7: Backend — `bulkFulfillOrdersWorkflow`

**Files:**
- Create: `packages/core/core-flows/src/order/steps/bulk-fulfill-orders.ts`
- Create: `packages/core/core-flows/src/order/workflows/bulk-fulfill-orders.ts`
- Modify: `packages/core/core-flows/src/order/steps/index.ts`, `packages/core/core-flows/src/order/workflows/index.ts` (barrel exports)
- Create: `packages/medusa/src/api/admin/orders/fulfillments/batch/route.ts` (or confirm the right path convention against `packages/medusa/src/api/admin/orders/tags/batch/route.ts` from the earlier notes-and-tags plan — mirror that exact structural pattern: validators, middlewares registration, route handler)
- Modify: `packages/medusa/src/api/admin/orders/validators.ts`, `packages/medusa/src/api/admin/orders/middlewares.ts`
- Test: `integration-tests/http/__tests__/order/admin/orders-fulfillments-batch.spec.ts`

**Interfaces:**
- Produces: `bulkFulfillOrdersWorkflow(container).run({ input: { order_ids: string[] } })` → `Promise<{ succeeded: string[]; failed: { order_id: string; error: string }[] }>`. `POST /admin/orders/fulfillments/batch` with body `{ order_ids: string[] }`, response `{ succeeded: string[], failed: { order_id: string, error: string }[] }`.

- [ ] **Step 1: Write the failing test**

```ts
it("fulfills each order independently, one order's failure doesn't block the others", async () => {
  // orderA: complete, fulfillable state (valid shipping address, in-stock items)
  // orderB: incomplete shipping address, so createOrderFulfillmentWorkflow throws for it
  const response = await api.post(
    "/admin/orders/fulfillments/batch",
    { order_ids: [orderA.id, orderB.id] },
    adminHeaders
  )
  expect(response.data.succeeded).toContain(orderA.id)
  expect(response.data.failed.map((f) => f.order_id)).toContain(orderB.id)
  // confirm orderA's fulfillment actually exists, orderB's does not
})
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `integration-tests/http`): `npx jest --no-cache --forceExit --testPathPattern=orders-fulfillments-batch`
Expected: FAIL — route doesn't exist.

- [ ] **Step 3: Implement `bulkFulfillOrdersStep`**

In `createStep`'s invoke function, for each `order_id` in input: wrap a call that (a) resolves the order's unfulfilled line items and remaining quantities (same resolution Task 6 needs — if that logic ended up as a reusable function rather than inline in the popover's own request-building, reuse it; if it's dashboard-only code, this step needs its own equivalent server-side resolution — these are NOT automatically the same code, since Task 6 is dashboard/TypeScript-for-the-browser and this is core-flows/Node — write the step's own version, do not attempt a cross-runtime import), (b) calls `createOrderFulfillmentWorkflow(container).run({ input: {...} })` for that one order, in a try/catch. On success, push `order_id` to `succeeded`. On throw, push `{ order_id, error: error.message }` to `failed` and continue the loop — do NOT let one order's exception propagate out of the step.

- [ ] **Step 4: Implement `bulkFulfillOrdersWorkflow`**

Thin wrapper around the step, per the established pattern (see `bulkTagOrdersWorkflow` from the earlier notes-and-tags plan for the project's own shape of a thin bulk-wrapper workflow, though that one was all-or-nothing — this one is explicitly not; don't copy its validate-before-mutate structure, only its general workflow-composition shape).

- [ ] **Step 5: Add the `POST /admin/orders/fulfillments/batch` route**

Validator: `order_ids: z.array(z.string()).min(1)`. Middleware registration: placed before any `/admin/orders/:id` matcher, same reasoning as the earlier `tags/batch` route needed (check `middlewares.ts`'s current matcher order before inserting, since Task 1's changes may have touched this file already). Handler calls `bulkFulfillOrdersWorkflow(req.scope).run({ input: { order_ids: req.validatedBody.order_ids } })` and returns its result directly as the response body.

- [ ] **Step 6: Run test to verify it passes**

Same command as Step 2. Run twice for stability (this project's established convention for Postgres-backed integration tests).
Expected: PASS, both runs.

- [ ] **Step 7: Add the changeset**

```bash
cat > .changeset/add-bulk-fulfill-orders.md <<'EOF'
---
"@medusajs/core-flows": patch
"@medusajs/medusa": patch
---

feat(orders): add bulk order fulfillment workflow and route
EOF
```

- [ ] **Step 8: Commit**

```bash
git add packages/core/core-flows/src/order/steps/bulk-fulfill-orders.ts packages/core/core-flows/src/order/workflows/bulk-fulfill-orders.ts packages/core/core-flows/src/order/steps/index.ts packages/core/core-flows/src/order/workflows/index.ts packages/medusa/src/api/admin/orders/fulfillments/batch/ packages/medusa/src/api/admin/orders/validators.ts packages/medusa/src/api/admin/orders/middlewares.ts integration-tests/http/__tests__/order/admin/orders-fulfillments-batch.spec.ts .changeset/add-bulk-fulfill-orders.md
git commit -m "feat(orders): add bulk fulfillment workflow and route"
```

---

## Task 8: Dashboard — bulk `Fulfill selected` command and result summary

**Files:**
- Modify: `packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/ready-to-ship-table.tsx`
- Create: `packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/bulk-fulfill-result-summary.tsx`

**Interfaces:**
- Consumes: Task 7's `POST /admin/orders/fulfillments/batch` (needs a matching JS SDK method and dashboard hook — check whether `sdk.admin.order` needs a new method added, mirroring how `bulkTag` was added to that same class in the earlier notes-and-tags plan, or whether a generic fetch suffices for a one-off bulk action; follow whichever this codebase's own established convention turns out to be once you're looking at `packages/core/js-sdk/src/admin/order.ts`).

- [ ] **Step 1: Add row checkboxes and `Fulfill selected` to `ReadyToShipTable`'s `commands`**

Same `_DataTable` `commands` + `RowSelectionState` pattern as the existing bulk-tag command bar on the main order list (`order-list-table.tsx`) — read that file's existing wiring before reimplementing, since `ReadyToShipTable` is a sibling table, not the same component, and needs its own `enableRowSelection`/`rowSelection` state.

- [ ] **Step 2: Implement `BulkFulfillResultSummary`**

Shown after the bulk action resolves: counts (`"8 fulfilled, 1 failed"`) plus each failed order's id and error message, per spec Error handling — not a single generic toast.

- [ ] **Step 3: Manual verification for the Review Focus zero-selection case**

Trace: does clicking "Fulfill selected" with zero rows selected ever reach this code path, or does `_DataTable`'s own `commands` rendering already prevent it? Confirm by reading `data-table-root.tsx`'s `hasCommandBar`/`CommandBar open` logic (already read once during the earlier notes-and-tags plan — same file, same mechanism) rather than assuming.

- [ ] **Step 4: Add the changeset**

```bash
cat > .changeset/add-bulk-fulfill-ui.md <<'EOF'
---
"@medusajs/js-sdk": patch
"@medusajs/dashboard": patch
---

feat(orders): add bulk Fulfill command and result summary to Ready to Ship table
EOF
```

(Adjust the package list if Step 1's SDK investigation concludes no `@medusajs/js-sdk` change was needed.)

- [ ] **Step 5: Commit**

```bash
git add packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/ready-to-ship-table.tsx packages/admin/dashboard/src/routes/orders/order-list/components/order-list-table/components/bulk-fulfill-result-summary.tsx packages/core/js-sdk/src/admin/order.ts .changeset/add-bulk-fulfill-ui.md
git commit -m "feat(orders): add bulk Fulfill command to Ready to Ship table"
```

---

## Task 9: Final changeset sweep

**Files:**
- Review: `.changeset/*.md` added in Tasks 1, 3, 4, 5, 7, 8

- [ ] **Step 1: Confirm every touched published package has a changeset**

Cross-check the full diff's touched packages (`@medusajs/medusa`, `@medusajs/core-flows`, `@medusajs/dashboard`, `@medusajs/js-sdk` if Task 8 needed it) against this plan's per-task changesets. Add any missing one.

- [ ] **Step 2: Commit any additions**

```bash
git add .changeset
git commit -m "chore: add any missing changesets for Ready to Ship fulfillment list"
```
