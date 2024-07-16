---
description: "Learn about the orders architecture, how they’re created, and their relation to other entities."
---

# Orders Architecture Overview

In this document, you’ll learn about the orders architecture, how they’re created, and their relation to other entities.

## Overview

Orders are placed by customers who purchase items from your store. They involve intricate commerce operations related to inventory, fulfillment, payment, and more.

Medusa supports order features such as order editing, creating swaps for orders, returning orders, and more. These features allow merchants to handle and automate Return Merchandise Authorization (RMA) flows.

:::note

As the Order domain is large in features and details, some features such as Returns or Swaps will not be discussed within this documentation page. Instead, they’ll be discussed in their own documentation pages.

:::

---

## Order Entity Overview

Some of the attributes of the `Order` entity include:

- `fulfillment_status`: a string indicating the status of the order’s fulfillment. Its possible values can determine whether all items have been fulfilled, shipped, or returned.
- `payment_status`: a string indicating the status of the order’s payment. Its possible values can determine whether the payment of the order has been captured or refunded.
- `status`: a string indicating the overall status of the order. Its values can be:
  - `pending`: this is the default status of the order after it has been created.
  - `completed`: the order is marked as completed. A merchant typically marks the order as completed after the order has been fulfilled and paid.
  - `archived`: the order is archived. This status can only be attained after the order has been completed or refunded.
  - `canceled`: the order has been canceled. An order can’t be canceled if it has been refunded or if any of its relations, such as fulfillment or swaps, are not canceled.
- `display_id`: a string indicating an incremental ID that can be displayed to the customer or internally to merchants.
- `canceled_at`: a date indicating when the order was canceled.
- `no_notification`: a boolean value indicating whether the customer should receive notifications when the order is updated.
- `external_id`: a string indicating an ID of the order in an external system. This can be useful if you’re migrating your orders from another commerce system or you’re linking your order to a third-party service.

There are other important attributes discussed in later sections. Check out the full [Order entity in the entities reference](../../references/entities/classes/entities.Order.mdx).

---

## How are Orders Created

You have full freedom in how you create your orders. Within the Medusa backend, there are two defined ways when an order is created:

1. Using a cart: The customer adds products to their cart and go through the checkout process to place the order. Learn about the [cart completion process here](../carts-and-checkout/cart.md#cart-completion-process).
2. Using draft orders: the merchant can create draft orders without the customer’s involvement. This includes a very similar process of adding products to the draft order, supplying the shipping and billing addresses, and more. The draft order can later be turned into a regular order.

---

## Payments in Orders

In the cart completion process, or when you use the `OrderService`'s method [createFromCart](../../references/services/classes/services.OrderService.mdx#createfromcart), the cart’s payment is also associated with the order by setting the `order_id` of the payment to the newly created order’s ID.

An order can have more than one payment. You can access the order’s payments by expanding the `payments` relation and accessing `order.payments`.

By default, the payment will be authorized but not captured. Some payment processor plugins, such as the Stripe plugin, allow changing this behavior to automatically capture the payment. You can also do that within your custom payment processor.

In the default scenario, the merchant would have to capture that payment manually, which would change the `payment_status` of the order. The payment can be captured using the `PaymentService`'s [capture method](../../references/services/classes/services.PaymentService.mdx#capture).

After a payment has been captured, it can be refunded either fully or a specific amount of it. This is useful if items of an order has been returned or swapped, or if an order has been edited. The payment can be refunded using the `PaymentService`'s [refund method](../../references/services/classes/services.PaymentService.mdx#refund).

The Medusa backend also provides payment admin APIs that you can use to retrieve, capture, and refund the payment.

---

## Fulfillments in Orders

After an order is placed, you can create [fulfillments](./fulfillments.md) for the items in the order. You can fulfill all items or some items. A fulfillment is represented by the `Fulfillment` entity, and it’s associated with the order through the `order_id` attribute of the fulfillment.

Creating fulfillments changes the `fulfillment_status` of the order. If all items were fulfilled, the status changes to `fulfilled`. If only some items are fulfilled, the status changes to `partially_fulfilled`.

You can access an order’s fulfillments by expanding the `fulfillments` relation and accessing `order.fulfillments`.

After a fulfillment is created, you can mark it as shipped. This would change the `fulfillment_status` of the order to `shipped` if all items were shipped, or `partially_shipped` if only some items were shipped.

A fulfillment can instead be canceled, changing the `fulfillment_status` to `canceled`.

If one or some items in an order are returned, the `fulfillment_status` is set to `partially_returned`. If all items were returned, the `fulfillment_status` is set to `returned`.

The Medusa backend provides these functionalities through the admin APIs. You can also use the `OrderService`'s methods to perform these functionalities in a custom flow, such as the [createFulfillment](../../references/services/classes/services.OrderService.mdx#createfulfillment) or [createShipment](../../references/services/classes/services.OrderService.mdx#createshipment) methods.

---

## Order Totals Calculations

By default, the `Order` entity doesn’t hold any details regarding the totals. These are computed and added to the order instance using the `OrderService`'s [decorateTotals method](../../references/services/classes/services.OrderService.mdx#decoratetotals). There's also a dedicated method in the `OrderService`, [retrieveWithTotals](../../references/services/classes/services.OrderService.mdx#retrievewithtotals), attaching the totals to the order instance automatically. It is recommended to use this method by default when you need to retrieve the order.

The order’s totals are calculated based on the content and context of the order. This includes the order’s region, whether tax-inclusive pricing is enabled, the chosen shipping methods, and more.

The calculated order’s totals include:

- `shipping_total`: The total of the chosen shipping methods, with taxes.
- `discount_total`: The total of the applied discounts.
- `raw_discount_total`: The total of the applied discounts without rounding.
- `item_tax_total`: The total applied taxes on the order’s items.
- `gift_card_total`: The total gift card amount applied on the order. If there are any taxes applied on the gift cards, they’re deducted from the total.
- `gift_card_tax_total`: The total taxes applied on the order’s gift cards.
- `tax_total`: The total taxes applied (the sum of `shipping_tax_total`, `item_tax_total`, and `gift_card_tax_total`).
- `subtotal`: The total of the items without taxes or discounts.
- `refunded_total`: the total amount refunded to the customer, if any.
- `paid_total`: the total amount paid by the customer.
- `refundable_amount`: the amount that can be refunded to the customer. This would be the subtraction of `refunded_total` from `paid_total`.
- `total`: The overall total of the order.

:::note

If you have tax-inclusive pricing enabled, you can learn about other available total fields [here](../taxes/inclusive-pricing.md#retrieving-tax-amounts).

:::

The order’s totals are retrieved by default in all the order’s [store](https://docs.medusajs.com/api/store#orders) and [admin](https://docs.medusajs.com/api/admin#orders) APIs.

---

## Order Edits

After an order has been placed, it can be edited to add, remove, or change ordered items.

:::tip

Order Edits don't cover edits to other details in the order, such as the shipping address, as these can be done by the admin at any point. This is only focused on the line items in the cart.

:::

Typically, a merchant would edit the order and send the edit request to the customer with the changes being made. Any additional payments required can be made when the customer accepts the order edit. 

A merchant may also choose to force the edit on the order, by-passing the customer’s confirmation.

![https://res.cloudinary.com/dza7lstvk/image/upload/fl_lossy/f_auto/r_16/ar_16:9,c_pad/v1/Medusa%20Docs/Diagrams/order-edit_mcnfc3.jpg?_a=ATFGlAA0](https://res.cloudinary.com/dza7lstvk/image/upload/fl_lossy/f_auto/r_16/ar_16:9,c_pad/v1/Medusa%20Docs/Diagrams/order-edit_mcnfc3.jpg?_a=ATFGlAA0)

Although this process is implemented in this flow within the Medusa backend, there is no requirement for you to actually follow it. For example, you can allow the customer or a third-party service to create and manage the order edit.

The Medusa backend provides the [order edit admin APIs](https://docs.medusajs.com/api/admin#order-edits), but you can also use the [OrderEditService](../../references/services/classes/services.OrderEditService.mdx) to perform the same functionalities in a custom flow.

Order edits are represented by the `OrderEdit` entity. This entity is linked to the order through the `order_id` attribute. You can access an order’s edits by expanding the `edits` relation and accessing `order.edits`. Notice that an order can have multiple edits during its lifecycle, but it can’t have more than one ongoing edit.

Some of the `OrderEdit`'s other attributes include:

- `internal_note`: a string that can hold a note to be visible only internally.
- `created_by`: a string that typically should hold the ID of who created the order edit. For example, if the merchant created the order edit, it should hold the ID of a `User`. There are no restrictions on what this attribute can hold, so you can also add here third-party IDs or names if necessary.
- `requested_by`: a string that typically should hold the ID of who requested the order edit. Similar to the `created_by` attribute, there are no restrictions on what value this attribute can actually hold.
- `confirmed_by`: a string that typically should hold the ID of who confirmed the order edit. Similar to the `created_by` attribute, there are no restrictions on what value this attribute can actually hold.
- `declined_by`: a string that typically should hold the ID of who declined the order edit. Similar to the `created_by` attribute, there are no restrictions on what value this attribute can actually hold.

There are other attributes explained in other sections. You can also check out the full [OrderEdit entity in the entities reference](../../references/entities/classes/entities.OrderEdit.mdx).

### Item Changes

Changes to the items in the orders are stored in the `OrderItemChange` entity. Some of this entity’s attributes include:

- `order_edit_id`: The ID of the order edit this item change is linked to. The order edit can also be accessed by expanding the `order_edit` relation and accessing `itemChange.order_edit`.
- `type`: a string indicating the type of change being made. Its value can be:
  - `item_add` meaning that a new item is being added to the order.
  - `item_remove` meaning that an item in the order is being removed.
  - `item_update` meaning that an item in the order is being updated. For example, its quantity is being changed.
- `original_line_item_id`: The ID of the line item that this item change is targeting. This would be the item that should be deleted or updated. If a new item is being added, then this attribute will be null. The line item can also be accessed by expanding the `original_line_item` relation and accessing `itemChange.original_line_item`.
- `line_item_id`: the ID of the new line item to replace the original one. This line item would hold the changes that should be applied on the original line item. The line item can also be accessed by expanding the `line_item` relation and accessing `itemChange.line_item`.

When the order edit is confirmed, the original line items are no longer linked to the order. On the other hand, the new line items are linked to the new order. The items’ history is preserved through the order edits. So, you can access the previous state of an order and its items by accessing `order.edits`.

### PaymentCollection

If the order edit requires additional payments from the customer, they are stored in a payment collection. A payment collection allows bundling more than one payment related to a single entity or flow. It is represented by the `PaymentCollection` entity, which has the following relations:

- `payment_sessions`: the payment sessions that are linked to the payment collection. Payment sessions are linked to a payment provider and are used to hold the status of a payment in a flow, such as the checkout flow.
- `payments`: the payments that are linked to the payment collection. Payments are authorized amounts by the customer that can later be processed. For example, you can capture or refund a payment.

For order edits, you can authorize the entire payment collection that holds additional required payments when the customer confirms the order edit.

---

## Automating RMA Flows

Medusa provides the necessary infrastructure and tooling that allows automating RMA flows. Entities involved in the RMA flows can include:

- Returns: Return an item from the customer to the merchant.
- Swap: Swap an item with another. This involves returning the original item from the customer and shipping a new item to the customer.
- Claim: Allow a customer to refund or replace an item in their order if it’s faulty or for other reasons.

The Medusa backend facilitates automating these flows by allowing the customer to submit a [return](https://docs.medusajs.com/api/store#returns_postreturns) or [swap](https://docs.medusajs.com/api/store#swaps_postswaps) requests through the store APIs. The merchant can then review and handle these requests. This eliminates the need for the customer to perform the same action through customer support or other means.

You can also integrate these flows within bigger processes that trigger requesting or creating these flows. It can be done through core APIs, [custom API Routes](../../development/api-routes/overview.mdx), or [custom services](../../development/services/overview.mdx). You can also listen to events related to orders such as [Order](../../development/events/events-list.md#order-events) or [Swap](../../development/events/events-list.md#swap-events) events with [subscribers](../../development/events/subscribers.mdx) to perform asynchronous actions.

---

## Relations to Other Entities

This section includes relations that weren’t mentioned in other sections.

### Cart

An order can be associated with a [cart](../carts-and-checkout/overview.mdx), which is the cart it is created from. A cart is represented by the `Cart` entity.

You can access the cart’s ID using the `cart_id` attribute. You can also access the cart by expanding the `cart` relation and accessing `order.cart`.

### LineItem

An order has items, which are represented by the `LineItem` entity. These are typically the same line items created in the cart, with the `order_id` attribute of the line item set to the ID of the order.

You can access an order’s items by expanding the `items` relation and accessing `order.items`.

### Customer

An order is associated with the [customer](../customers/overview.mdx) that placed the order. A customer is represented by the `Customer` entity.

You can access the customer’s ID using the `customer_id` attribute. You can also access the customer by expanding the `customer` relation and accessing `order.customer`.

### SalesChannel

An order can belong to a [sales channel](../sales-channels/overview.mdx). This typically would be the sales channel of the cart the order was created from. A sales channel is represented by the `SalesChannel` entity.

The sales channel’s ID is stored in the `sales_channel_id` attribute of the order. You can also access the sales channel by expanding the `sales_channel` relation and accessing `order.sales_channel`.

### Region

An order belongs to a [region](../regions-and-currencies/overview.mdx). Typically, this would be the region of the cart the order is created from. A region is represented by the `Region` entity.

You can access the region’s ID using the `region_id` attribute. You can also access the region by expanding the `region` relation and accessing `order.region`.

### Currency

An order is associated to a [currency](../regions-and-currencies/overview.mdx). Typically, this would be the currency of the region the order belongs to. A currency is represented by the `Currency` entity.

You can access the currency code using the `currency_code` attribute. You can also access the currency by expanding the `currency` relation and accessing `order.currency`.

### Billing Address

An order can have a billing address, which is represented by the `Address` entity.

You can access the billing address’s ID using the `billing_address_id` attribute. You can also access the billing address by expanding the `billing_address` relation and accessing `order.billing_address`.

### Shipping Address

An order can have a shipping address, which is represented by the `Address` entity.

You can access the shipping address’s ID using the `shipping_address_id` attribute. You can also access the shipping address by expanding the `shipping_address` relation and accessing `order.shipping_address`.

### Discount

[Discounts](../discounts/overview.mdx) can be applied on an order. Typically, these would be the discounts that were applied on the cart associated with the order. A discount is represented by the `Discount` entity.

You can access the order’s discounts by expanding the `discounts` relation and accessing `order.discounts`.

### GiftCard

[Gift cards](../gift-cards/overview.mdx) can be applied on an order. Typically, these would be the gift cards that were applied on the cart associated with the order. A gift card is represented by the `GiftCard` entity.

You can access the order’s gift cards by expanding the `gift_cards` relation and accessing `order.gift_cards`.

### GiftCardTransaction

A gift card transaction is created when a gift card is used on the cart. It is used to deduct an amount from the original balance of the gift card after the order is placed, and to keep track of the history of a gift card’s transactions. It’s represented by the `GiftCardTransaction` entity and it’s associated with the order’s ID using the `order_id` attribute on the entity.

You can access an order’s gift card transactions by expanding the `gift_card_transactions` relation and accessing `order.gift_card_transactions`.

### ShippingMethod

An order is associated with [shipping methods](../carts-and-checkout/shipping.md#shipping-method). Typically, these would be the shipping methods chosen during checkout. An order can have more than one shipping method. A shipping method is represented by the `ShippingMethod` entity.

You can access the order’s shipping method by expanding the `shipping_methods` relation and accessing `order.shipping_methods`.

### Returns

An order can be associated with more than one [return](./returns.md). For example, a customer may request to return items separately or gradually. A return is represented by the `Return` entity.

You can access the order’s returns by expanding the `returns` relation and accessing `order.returns`.

### ClaimOrder

An order can be associated with more than one [claim](./claims.md). A claim is represented by the `ClaimOrder` entity.

You can access the order’s claims by expanding the `claims` relation and accessing `order.claims`.

### Refund

An order can be associated with more than one refund. A refund is represented by the `Refund` entity.

You can access the order’s refunds by expanding the `refunds` relation and accessing `order.refunds`.

### Swap

An order can be associated with more than one [swap](./swaps.md). A swap is represented by the `Swap` entity.

You can access the order’s swaps by expanding the `swap` relation and accessing `order.swap`.

### DraftOrder

An order can be associated with a [draft order](./draft-orders.md). This would be the draft order that the order was created from.

The draft order’s ID is stored in the `draft_order_id` attribute. You can also access the draft order by expanding the `draft_order` relation and accessing `order.draft_order`.

---

## See Also

- [How to manage orders](./admin/manage-orders.mdx)
- [How to edit an order](./admin/edit-order.mdx)
- [How to handle order edits on the storefront](./storefront/handle-order-edits.mdx)
- [How to Implement Claim Order Flow in the storefront](./storefront/implement-claim-order.mdx)
