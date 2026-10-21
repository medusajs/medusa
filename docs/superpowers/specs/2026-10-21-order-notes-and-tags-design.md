# Order Notes & Tags

## Context

The broader goal is bringing Veeqo-style order-management features into this
store's Medusa admin order pages (`packages/admin/dashboard/src/routes/orders`).
That request spans several independent subsystems — list power-features,
order actions/notes, bulk fulfillment batches, an allocations layer, shipping
and label purchasing, and documents/printing. These orders live in Medusa
only; Veeqo is not a data source here, only the UX reference for feature
parity (the Veeqo MCP connection is used to inspect Veeqo's real order
behavior while designing, not wired into the running store).

This spec covers the first sub-project: **order/customer/line-item notes and
order tagging**, including bulk tagging. The remaining subsystems (batches,
allocations, shipping/labels, documents, and merge/unmerge of duplicate
orders) are deferred to their own future specs.

## Goals

- Finish the order-notes feature, which already exists as disabled/dead code
  in this codebase (`order-note-form.tsx`, `order-timeline.tsx`'s commented
  `NoteBody` and `useNotes`/`useAdminDeleteNote` references) — resurrect the
  original design rather than inventing a new shape.
- Extend the same notes concept to customers and to individual order line
  items.
- Add a shared, bulk-manageable tag vocabulary for orders, mirroring the
  existing `ProductTag` pattern, including bulk-applying/removing tags across
  many selected orders at once from the order list.

## Non-goals

- Merging/unmerging duplicate orders (deferred).
- Any live sync or data exchange with Veeqo.
- Per-note edit (notes are create/delete only, matching the original dead
  code's scope).
- Author-restricted delete — any authenticated admin can delete any note in
  v1 (explicit scope decision, not an oversight).

## Data model

### New `note` module (`packages/modules/note`)

```ts
Note: {
  id: model.id({ prefix: "note" }).primaryKey(),
  resource_type: model.enum(["order", "customer", "order_line_item"]),
  resource_id: model.text(),
  value: model.text(),
  author_id: model.text(), // admin user id, set server-side from auth context
}
```

Standard `MedusaService<{ Note }>` module service — no custom business logic
needed at the module level. `resource_id`/`resource_type` is a loose
reference (no FK), matching the shape the existing dead UI code already
expects, so that code can be reconnected rather than rewritten.

Migration is generated via `yarn migration:create` from within
`packages/modules/note` once the model is in place, per this repo's
convention — never written by hand.

### `OrderTag` (new model inside the existing `order` module)

```ts
OrderTag: {
  id: model.id({ prefix: "otag" }).primaryKey(),
  value: model.text().searchable(),
  metadata: model.json().nullable(),
  orders: model.manyToMany(() => Order, { mappedBy: "tags" }),
}
```

Plus a unique index on `value` (`deleted_at IS NULL`), mirroring
`ProductTag`. `Order` and `OrderTag` live in the same module, so this is a
direct in-module many-to-many relation — no cross-module link required,
exactly like `Product`/`ProductTag`. Migration generated the same way, from
within `packages/modules/order`.

## API & workflows

### Notes

- `POST /admin/notes` — body `{ resource_type, resource_id, value }`.
  `author_id` comes from the authenticated admin user, never from the
  request body.
- `GET /admin/notes?resource_type=&resource_id=` — list notes for a given
  resource; used by the order timeline, the customer notes section, and the
  line-item notes popover.
- `DELETE /admin/notes/:id` — any authenticated admin may delete.
- Workflows:
  - `createNoteWorkflow` — step creates the note via the note module
    service; compensation deletes it.
  - `deleteNoteWorkflow` — soft-delete step; compensation restores the note,
    following the `delete-promotions` step/compensation pattern.

### Tags

- `GET/POST /admin/order-tags`, `GET/POST/DELETE /admin/order-tags/:id` —
  admin CRUD over the tag vocabulary, mirroring `product-tags` routes
  exactly.
- `POST /admin/orders/tags/batch` — body
  `{ order_ids: string[], add?: string[], remove?: string[] }` (tag ids).
  Bulk-apply/remove tags across many orders in one call.
- Workflows:
  - `createOrderTagsWorkflow` / `updateOrderTagsWorkflow` — manage the tag
    entities themselves, mirroring `create/update-product-tags`.
  - `bulkTagOrdersWorkflow` (new) — step loads each order's current tags,
    computes the new set from `add`/`remove`, updates via the order module
    service. Compensation restores each order's prior tag set — this must
    be tested for partial-batch failures (see Testing).

## Admin UI

### Notes

- Re-enable `OrderNoteForm` in `order-activity-section.tsx` and the
  notes/`NoteBody` rendering in `order-timeline.tsx`, wired to new
  `useNotes` / `useCreateNote` / `useDeleteNote` hooks
  (`hooks/api/notes.ts`), backed by a new `notes` resource added to the JS
  SDK client alongside the other admin resources.
- Extract a shared `<ResourceNotesSection resourceType resourceId />`
  component (form + list) so order/customer/line-item notes reuse one
  implementation instead of three.
- Customer notes: new "Notes" section on the customer-detail page using the
  shared component with `resource_type: "customer"`.
- Line-item notes: a small note icon/button per line item (in the
  fulfillment/items list) opening a popover using the shared component with
  `resource_type: "order_line_item"`.

### Tags

- Order detail: new "Tags" row in `order-general-section` — badge list plus
  an add/remove combobox (create-on-type), backed by `/admin/order-tags`.
- Order list: enable the `DataTable` component's existing `commandBar` prop
  (already used elsewhere in the dashboard for row-selection bulk actions,
  just not wired up for orders yet) so selecting rows surfaces "Add tags" /
  "Remove tags", calling `POST /admin/orders/tags/batch`.
- Add `tags` as an optional column/filter in `use-order-data-table-columns.tsx`,
  consistent with the existing order-list filter conventions.

## Testing

- `packages/modules/note/integration-tests/__tests__/` — module service CRUD,
  filtering by `resource_type`+`resource_id`.
- `packages/modules/order/integration-tests/__tests__/` — `OrderTag` CRUD and
  many-to-many assignment to `Order`.
- `integration-tests/http/__tests__/` — route tests for `/admin/notes`,
  `/admin/order-tags`, and `/admin/orders/tags/batch`, including the
  add+remove-together case and the "tag id doesn't exist" error case.
- Workflow tests for `createNoteWorkflow`, `deleteNoteWorkflow`, and
  `bulkTagOrdersWorkflow` — the last one must specifically test the
  compensation path (force a failure partway through a batch and assert
  every order's tag set rolls back, not just the one that failed).
- UI pieces (notes form/list, tag combobox, bulk command bar) are verified
  manually by running the dev server and exercising the golden path plus a
  few edge cases (empty notes list, removing the last tag, bulk-tagging zero
  vs. many selected orders) — this dashboard has no existing component-test
  convention to extend.

## Changesets

One `patch` changeset per published package touched, per this repo's
convention:

- `@medusajs/note` (new package)
- `@medusajs/order` (`OrderTag`)
- `@medusajs/core-flows` (new workflows)
- `@medusajs/medusa` (new API routes)
- `@medusajs/js-sdk` (new `notes` / `order-tags` resources)
- `@medusajs/dashboard` (UI)
