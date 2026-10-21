# @medusajs/order

Order Module (`Modules.ORDER`): orders, draft orders, returns, claims, exchanges and order edits. Every post-placement mutation is recorded as an order change with actions, and confirming a change produces a new order version.

## Using this package

- Registered by default; consumers import it as `@medusajs/medusa/order`. Resolve with `container.resolve(Modules.ORDER)` (`IOrderModuleService`).
- Almost all order operations should go through `@medusajs/core-flows` workflows (`createOrderWorkflow`, `beginReturnOrderWorkflow`, `beginOrderEditOrderWorkflow`, ...): they orchestrate payment, fulfillment, inventory and links around this module.
- Option `generateCustomDisplayId(order, sharedContext) => Promise<string | undefined>`: sets `custom_display_id` on `createOrders`.

```ts
module.exports = defineConfig({
  modules: [
    {
      key: Modules.ORDER,
      options: {
        generateCustomDisplayId: async (order, sharedContext) =>
          `${order.email}-${Date.now()}`,
      },
    },
  ],
})
```

Docs: https://docs.medusajs.com/resources/commerce-modules/order.md, https://docs.medusajs.com/resources/commerce-modules/order/order-change.md, https://docs.medusajs.com/resources/commerce-modules/order/order-versioning.md, https://docs.medusajs.com/resources/commerce-modules/order/order-totals.md, https://docs.medusajs.com/resources/commerce-modules/order/return.md, https://docs.medusajs.com/resources/commerce-modules/order/claim.md, https://docs.medusajs.com/resources/commerce-modules/order/exchange.md, https://docs.medusajs.com/resources/commerce-modules/order/edit.md, https://docs.medusajs.com/resources/commerce-modules/order/links-to-other-modules.md

## The data model (non-obvious parts)

- `Order` (`order_`): `version` (starts at 1), `display_id` autoincrement, `status`, `is_draft_order`, addresses, plain-string `region_id` / `customer_id` / `sales_channel_id`.
- `OrderLineItem` (`ordli_`) holds the immutable product snapshot and price. `OrderItem` (`orditem_`, exposed as `item.detail`) is the per-version row: `quantity`, `fulfilled_quantity`, `shipped_quantity`, `delivered_quantity`, `return_requested/received/dismissed_quantity`, `written_off_quantity`, keyed by `(order_id, version)`.
- Versioned per order: `OrderItem`, `OrderShipping` (pivot to `OrderShippingMethod`), `OrderSummary` (`totals` JSON), `OrderTransaction`, `OrderCreditLine`, line item and shipping method adjustments. `src/utils/base-repository-find.ts` filters these to the order's current `version` by default (pass `version` in filters to read another one).
- `OrderChange` (`ordch_`): `version` = order version + 1, `change_type` (`OrderChangeType`), `status` (`OrderChangeStatus`: pending, requested, confirmed, declined, canceled), optional `return_id` / `claim_id` / `exchange_id`. Has many `OrderChangeAction` (`ordchact_`): `action` (`ChangeActionType`, e.g. `ITEM_ADD`, `RETURN_ITEM`, `FULFILL_ITEM`, `SHIPPING_ADD`, `CREDIT_LINE_ADD`, `PROMOTION_ADD`), `details`, `amount`, `ordering`, `applied`.
- `Return` (`return_`), `OrderClaim` (`claim_`, `type`: refund / replace), `OrderExchange` (`oexc_`) record `order_version` and own their items, shipping methods and transactions. `ReturnReason` is standalone (nested via `parent_return_reason`).

**Lifecycle of a change** (`src/services/order-module-service.ts`):

1. `createOrderChange({ order_id, change_type, actions? })` (throws if a pending/requested change already exists), then `addOrderAction(...)` to append actions.
2. `previewOrderChange(orderId)` applies pending actions in memory (`calculateOrderChange` in `src/utils/calculate-order-change.ts`) without persisting.
3. `confirmOrderChange(id)` marks it confirmed and calls `applyOrderChanges_` -> `applyChangesToOrder` (`src/utils/apply-order-changes.ts`), which upserts new versioned rows, a new `OrderSummary`, and bumps `Order.version`. `declineOrderChange` / `cancelOrderChange` only update status.
4. `applyPendingOrderActions(orderId)` applies unapplied actions of the current version; `registerOrderChange` records an already-applied `UPDATE_ORDER_PROPERTIES` change; `undoLastChange` / `revertLastVersion` roll back (require `version >= 2`).

Bundled shortcuts in `src/services/actions/` create and immediately confirm a change: `createReturn`, `receiveReturn`, `cancelReturn`, `createClaim`, `cancelClaim`, `createExchange`, `cancelExchange`, `registerFulfillment`, `cancelFulfillment`, `registerShipment`, `registerDelivery`. Also: `completeOrder`, `cancel`, `archive`, `addOrderTransactions`, `set/upsert` tax lines and adjustments for items and shipping methods.

**Events**: no custom event builders; `MedusaService` emits `order.<kebab-entity>.<action>` from ORM hooks. Business events (`order.placed`, ...) are emitted by core-flows workflows (`OrderWorkflowEvents`).

**Module links** (in `packages/modules/link-modules`): `order_cart`, `order_fulfillment`, `return_fulfillment`, `order_payment_collection` (cascade-deletes the payment collection), `order_promotion`. Read-only: customer, region, sales channel, shipping option, and product / variant via `items.product_id` / `items.variant_id`.

## Architecture

- Action types are registered with `OrderChangeProcessing.registerActionType(ChangeActionType.X, { operation, validate, isDeduction? })` in `src/utils/actions/*.ts`; they mutate a virtual order copy. A new action type needs a file there, an export in `src/utils/actions/index.ts`, and the enum value in `packages/core/utils/src/order/order-change-action.ts`.
- `src/utils/transform-order.ts` `formatOrder` reshapes versioned rows (`items[].detail`, `shipping_methods`) into the DTO and decorates totals.
- `src/repositories/{order,return,claim,exchange}.ts` use the version-aware `base-repository-find.ts`.

## Development

```bash
cd packages/modules/order
yarn build
yarn test                      # src/services/__tests__ (action calculations, transform-order)
yarn test:integration          # needs Postgres
../../../node_modules/.bin/jest integration-tests/__tests__/order-edit.spec.ts
yarn migration:create          # after any change in src/models
```

- Integration tests: `integration-tests/__tests__/` (`create-order`, `order-edit`, `order-return`, `order-claim`, `order-exchange`, `order-items-shipping`, `returns`, `delete-order`, `index`). End-to-end HTTP flows at the repo root: `integration-tests/http/__tests__/{order,order-changes,order-edits,returns,claims,exchanges,draft-order}`.

## Gotchas

- Never update `OrderItem` quantities or `Order.version` directly; add actions and confirm a change, or totals and history go out of sync.
- Totals are computed only if `select` includes a total field (or `*`); then the service force-loads `items`, `shipping_methods`, `credit_lines` with tax lines and adjustments (`shouldIncludeTotals`).
- `retrieveOrder` attaches the active (pending/requested) change as `order.order_change`.
- Confirm/cancel/decline throw "Order Change cannot be modified" unless the change is pending or requested.
- Adjustments are only created (never updated) when a change produces a new version; older versions keep their own rows.
- All amounts and quantities are `bigNumber`; use `MathBN`.
