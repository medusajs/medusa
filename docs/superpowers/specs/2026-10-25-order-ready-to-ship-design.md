# Order Ready-to-Ship Fulfillment List

## Context

This is the second sub-project in the broader Veeqo-style order-management
effort (see `docs/superpowers/specs/2026-10-21-order-notes-and-tags-design.md`
for the first — notes and tags — and its list of deferred subsystems). The
user picked three subsystems to design together before implementing any:
order detail layout, bulk actions/allocation, and shipping & labels. This
spec covers **shipping & labels** — specifically a Veeqo-style "Ready to
Ship" list view for fulfilling paid, unfulfilled orders.

A screenshot of Veeqo's own "Ready to Ship" list (`app.veeqo.com/orders`,
status tab) was the concrete reference: status tabs (All / Ready to Ship /
Shipped), a dense table with Ship From, Package, Shipping Rates, Ship Date,
Delivery and a per-row "Buy Label" button, plus row checkboxes and a bulk
"Actions" dropdown.

The store's existing `@dtc/fulfillment-easypost` provider (see its README)
does **not** support live multi-carrier re-shopping per order — each
carrier+service pair is a separately configured shipping option with its own
live price, chosen once at cart/checkout time, and label purchase already
happens automatically whenever staff fulfill an order through the existing
flow. Two approaches were considered:

- **Full Veeqo parity**: let staff re-shop live rates across carriers at
  ship time, inline per order, then buy whichever they pick. Requires new
  EasyPost provider capability (multi-quote outside the normal
  cart-shipping-option flow) and a new "buy this specific rate" action.
- **Lean version (chosen)**: a dense "Ready to Ship" list surfacing each
  order's already-chosen shipping rate and computed package weight/dims,
  with a one-click-to-confirm "Fulfill" action that triggers the existing
  fulfillment workflow — which already buys the EasyPost label as a side
  effect. No new provider capability needed.

This spec covers the lean version only. Full rate re-shopping is deferred to
a future spec if it's ever wanted.

## Goals

- Add "Ready to Ship" and "Shipped" tabs to the existing Orders page,
  alongside the current unfiltered list.
- "Ready to Ship": payment captured, fulfillment status `not_fulfilled` or
  `partially_fulfilled`, not canceled. Dense columns suited to shipping:
  Order #, Customer, Ship From, Package, Shipping Rate, Order Date, Total,
  and a `Fulfill` action.
- "Shipped": fulfillment status `shipped` / `partially_shipped` /
  `partially_delivered` / `delivered`. Read-mostly — tracking status,
  carrier, ship date, no action button.
- Package weight/dims computed server-side from unfulfilled line items'
  variant data, the same way the EasyPost provider itself computes a parcel
  (sum of weights, largest item's dimensions, falling back to the
  provider's configured default) — so the displayed number matches what
  actually gets quoted/bought.
- Single-row `Fulfill`: a lightweight confirm popover pre-filled with the
  default stock location and full remaining item quantities. Confirming
  calls the existing fulfillment-creation workflow (same one the order
  detail page already uses) — no new workflow for this path.
- Bulk `Fulfill selected`: row checkboxes (matching the existing order-list
  bulk-tag command bar pattern) + a new bulk-fulfill workflow that loops the
  existing per-order fulfillment creation across the selection. Each order
  fulfills independently — one order's failure must not block the rest.
  Reports a per-order result summary (counts + which orders failed and
  why), not a generic toast.

## Non-goals

- Live multi-carrier rate re-shopping per order (deferred — see Context).
- A separate, explicit "Buy Label" action independent of fulfillment —
  label purchase stays a side effect of the existing fulfillment flow, as
  it is today.
- Editing product/variant weight and dimensions. Current data gap (0 of 20
  variants in the test store have weight set) is explicitly out of scope;
  the Package column shows the provider's configured default until real
  data is entered separately.
- An "Overdue"/SLA ship-by-date indicator like Veeqo's "Delivery" column —
  Medusa has no concept of an expected ship-by date today, and adding one
  is a separate data-model decision not covered here.
- Changes to the EasyPost provider itself, or to how shipping options are
  configured.
- Multi-location-aware default selection beyond "use the store's single
  configured location" — the test store has exactly one stock location
  today; if a second is added later, the default-location logic in the
  confirm popover will need revisiting (flagged, not solved, here).

## Button copy

The per-row and bulk actions are both labeled `Fulfill`, not `Buy Label` —
accurate to what actually happens (the existing fulfillment workflow runs;
EasyPost buying the label is a side effect of that, not a separate explicit
step the UI performs), and consistent with Medusa's own terminology
elsewhere in the dashboard.

## UI placement

Tabs (`All` / `Ready to Ship` / `Shipped`) render at the top of the Orders
page content, above the table — matching Veeqo's own layout (tabs are part
of the page content, not the left sidebar). Each tab is a distinct,
linkable/bookmarkable view (e.g. via a route or query param such as
`/orders?view=ready-to-ship`), not a client-only toggle. `All` continues to
render the existing `OrderListTable` unchanged.

## Components

- New dense table component for "Ready to Ship" (columns: Order #,
  Customer, Ship From, Package, Shipping Rate, Order Date, Total, Fulfill
  action), under
  `packages/admin/dashboard/src/routes/orders/order-list/components/`.
- A sibling, read-mostly table component for "Shipped".
- Tab bar component sitting above the per-tab table, driving which table
  renders.
- `FulfillConfirmPopover`: shows the default location and full
  remaining-quantity line items as **read-only confirmation display, not an
  editable form** — this is what keeps it lightweight. An order needing a
  different location, partial quantities, or any other adjustment is not
  this popover's job; staff use the existing full fulfillment form on the
  order detail page for that case, unchanged by this spec. Confirm calls
  the existing fulfillment-creation workflow with the displayed
  (unmodified) defaults; on success closes and refetches the list; on
  failure stays open and shows the error inline (no silent failure).
- Bulk path: row checkboxes (reusing the `_DataTable` `commands` pattern
  already used for bulk-tag) + a `Fulfill selected` command that calls the
  new bulk-fulfill workflow and surfaces its per-order result summary.

## Data flow

- `Ready to Ship` / `Shipped` list queries: existing orders-list query path,
  filtered server-side by payment status + fulfillment status combinations
  described in Goals.
- Package weight/dims: computed server-side per order from its unfulfilled
  line items' variant `weight`/`length`/`width`/`height` — sum weights,
  take the largest item's dimensions, fall back to the provider's
  configured default for missing fields. This mirrors the EasyPost
  provider's own parcel-building logic exactly, so what's displayed matches
  what would actually be quoted/bought.
- Shipping Rate column reads the order's existing `shipping_methods[0]`
  (name + amount) directly — no live re-quote.
- Fulfill (single or bulk) → existing fulfillment-creation workflow (bulk
  path loops it per order) → `createFulfillment` → EasyPost provider buys
  the label automatically → existing tracking webhook updates fulfillment
  status later, exactly as it does today for fulfillment triggered from the
  order detail page.

## Error handling

- An order with no shipping method attached yet has no "Shipping Rate" to
  show and nothing for the Fulfill popover to confirm against — the row
  renders its Shipping Rate cell as empty and the Fulfill action is
  disabled with a short inline reason ("No shipping method"), rather than
  opening a popover that can't succeed.
- Single-row Fulfill: if the underlying workflow throws (e.g. EasyPost
  can't quote/buy for an incomplete address — a documented, real failure
  mode of the provider), the popover stays open and surfaces the error
  inline.
- Bulk Fulfill: the new workflow wraps each order's fulfillment attempt
  independently (try/catch per order, not an all-or-nothing step response
  like `bulkTagOrdersWorkflow`). One order's failure doesn't stop or roll
  back the others. The result is a structured per-order summary (succeeded
  order ids, failed order ids with their error message) that the UI renders
  as counts plus the specific failures, not a single generic toast.

## Testing

- Integration tests for the Ready-to-Ship / Shipped list filters, including
  edge cases: a partially-fulfilled multi-item order, a paid-but-canceled
  order (must not appear in Ready to Ship), an order with no shipping
  method yet.
- Integration test for the new bulk-fulfill workflow's partial-failure
  behavior: one order with a complete, fulfillable state and one with an
  incomplete shipping address in the same batch — assert the first
  fulfills successfully and the second reports its specific error without
  blocking or rolling back the first.
- No new tests needed for the single-row path's actual fulfillment logic
  (it reuses the existing, already-tested fulfillment-creation workflow
  unchanged) — only for the new confirm-popover wiring and its error
  display.

## Changesets

Standard per-package patch changesets for every touched package, following
this project's existing convention (see `docs/superpowers/specs/2026-10-21-order-notes-and-tags-design.md`'s
precedent) — enumerated precisely in the implementation plan once task
boundaries are drawn.
