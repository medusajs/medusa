# @medusajs/cart

Cart Module (`Modules.CART`, container key `"cart"`). Stores carts, line items, shipping methods, their tax lines and adjustments, addresses, and credit lines, and computes cart totals. Prices, promotions, taxes, and inventory are owned by other modules and written into the cart by core-flows workflows.

## Using this package

- Registered by default via `defineConfig` as `@medusajs/medusa/cart`. No module options.
- Resolve: `container.resolve(Modules.CART)` (`ICartModuleService`).
- Prefer the core-flows workflows (`@medusajs/medusa/core-flows`) that keep the cart consistent with pricing, promotions, taxes, and inventory: `createCartWorkflow`, `addToCartWorkflow`, `updateCartWorkflow`, `addShippingMethodToCartWorkflow`, `updateCartPromotionsWorkflow`, `updateTaxLinesWorkflow`, `refreshCartItemsWorkflow`, `completeCartWorkflow`.

```ts
const cartModule = container.resolve(Modules.CART)

const cart = await cartModule.retrieveCart(cartId, {
  select: ["id", "total", "subtotal"],
  relations: ["items"],
})
```

### Data models (`src/models`)

- `Cart` (`cart_`): `region_id`, `customer_id`, `sales_channel_id`, `email`, `currency_code`, `locale`, `completed_at`, `metadata`, `shipping_address`/`billing_address` (hasOne `Address`), `items`, `shipping_methods`, `credit_lines`, plus computed (non-persisted) total fields.
- `LineItem` (`cali_`): `variant_id`, `product_id`, snapshot fields (`product_title`, `variant_sku`, ...), `unit_price`, `compare_at_unit_price`, `is_tax_inclusive`, `is_custom_price`, `requires_shipping`, `is_discountable`, `is_giftcard`; has `tax_lines`, `adjustments`.
- `ShippingMethod` (`casm_`): `shipping_option_id`, `amount`, `is_tax_inclusive`; has `tax_lines`, `adjustments`.
- `LineItemAdjustment` / `ShippingMethodAdjustment`: `amount`, `code`, `promotion_id`, `provider_id`.
- `LineItemTaxLine` / `ShippingMethodTaxLine`: `rate`, `code`, `tax_rate_id`, `provider_id`.
- `Address` (`caaddr_`), `CreditLine` (`cacl_`: `amount`, `reference`, `reference_id`).

### Custom (non-generated) service methods (`src/services/cart-module.ts`)

- `retrieveCart` / `listCarts` / `listAndCountCarts`: compute totals with `decorateCartTotals` when any total field (or `*`) is selected, auto-adding the relations needed.
- `createCarts` (with nested `items`), `updateCarts(data[] | id | selector, data?)`.
- `addLineItems`, `updateLineItems`, `addShippingMethods`, `createAddresses`, `updateAddresses`.
- Adjustments: `addLineItemAdjustments`, `setLineItemAdjustments`, `upsertLineItemAdjustments`, `addShippingMethodAdjustments`, `setShippingMethodAdjustments`, `upsertShippingMethodAdjustments`.
- Tax lines: `addLineItemTaxLines`, `setLineItemTaxLines`, `upsertLineItemTaxLines`, `addShippingMethodTaxLines`, `setShippingMethodTaxLines`, `upsertShippingMethodTaxLines`.

### Events

- `cart.created`, `cart.updated`, `cart.customer_updated`, `cart.region_updated`, `cart.customer_transferred` (`CartWorkflowEvents`) are emitted by core-flows workflows, not the module.
- The module only emits internal `cart.<entity>.<action>` mutation events (e.g. `cart.line-item.created`).

### Module links (`packages/modules/link-modules/src/definitions`)

- Stored links: `Cart` <-> `PaymentCollection` (`cart.payment_collection`), `Cart` <-> `Promotion` (`cart.promotions`), `Order` <-> `Cart` (`order.cart` / `cart.order`).
- Read-only links (by ID columns): `cart.customer`, `cart.region`, `cart.sales_channel`, `cart.items.product`/`variant`, `shipping_methods.shipping_option`, line item adjustment `promotion`.

### Docs

- https://docs.medusajs.com/resources/commerce-modules/cart.md
- https://docs.medusajs.com/resources/commerce-modules/cart/concepts.md
- https://docs.medusajs.com/resources/commerce-modules/cart/cart-totals.md
- https://docs.medusajs.com/resources/commerce-modules/cart/promotions.md
- https://docs.medusajs.com/resources/commerce-modules/cart/tax-lines.md
- https://docs.medusajs.com/resources/commerce-modules/cart/links-to-other-modules.md
- https://docs.medusajs.com/resources/commerce-modules/cart/extend.md

## Development

```bash
yarn build
yarn test                  # src unit tests (none currently)
yarn test:integration      # integration-tests/__tests__/services/cart-module/index.spec.ts (Postgres)
yarn test:integration -t "<test name>"
yarn migration:create      # after any change to src/models; never hand-write migrations
```

## Gotchas

- `currency_code` is lowercased (`normalizeCurrencyCode`) on create and update.
- Totals are only computed when requested: selecting just `id` returns no `total`. Totals selection replaces any `items.*`/`shipping_methods.*` selects with full relations.
- `setLineItemAdjustments(cartId, adjustments)` / `setShippingMethodAdjustments` soft-delete every existing adjustment on the cart whose `id` isn't in the input, then upsert. Pass existing adjustments with `id` to keep them. `setLineItemTaxLines` / `setShippingMethodTaxLines` behave the same way.
- `addLineItemAdjustments(cartId, ...)` / `addShippingMethodAdjustments(cartId, ...)` throw `INVALID_DATA` if an `item_id` / `shipping_method_id` is not on that cart.
- The module does not validate prices, stock, or promotion rules; calling it directly bypasses that logic in the workflows.
