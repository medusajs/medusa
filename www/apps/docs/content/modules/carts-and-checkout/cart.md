---
description: 'Learn about the Cart entity, its relation to other entities, and how the cart completion process is implemented.'
---

# Cart Architecture Overview

In this document, you’ll learn about the Cart entity, its relation to other entities, and how the cart completion strategy is implemented.

## Overview

The cart allows customers to go from browsing products to completing an order. Many actions can be performed on a cart, like adding line items, applying discounts, creating shipping methods, and more before eventually completing it and creating an [Order](../orders/orders.md).

---

## Cart Entity Overview

A cart is represented by the `Cart` entity. Some of the `Cart` entity’s attributes include:

- `email`: The email the cart is associated with.
- `type`: A string indicating what the cart is used for. Its value can be:
  - `default` if the cart is used to place an order.
  - `swap` if the cart is used to create and register a swap
  - `draft_order` if the cart is used to create and complete a draft order.
  - `payment_link` if the cart is used for a payment link.
  - `claim` if the cart is used to create a claim.
- `completed_at`: the date the cart was completed. A completed cart means that it has been used for its main purpose. For example, if the cart is used to place an order, then a completed cart means that the order was placed.
- `payment_authorized_at`: the date a payment was authorized.

There are other important attributes discussed in later sections. Check out the [full Cart entity in the entities reference](../../references/entities/classes/entities.Cart.mdx).

---

## Cart Totals Calculation

By default, the `Cart` entity doesn’t hold any details regarding the totals. These are computed and added to the cart instance using the `CartService`'s [decorateTotals method](../../references/services/classes/services.CartService.mdx#decoratetotals). There's also a dedicated method in the `CartService`, [retrieveWithTotals](../../references/services/classes/services.CartService.mdx#retrieveWithTotals), attaching the totals automatically. It is recommended to use this method by default when you need to retrieve the cart. 

The cart’s totals are calculated based on the content and context of the cart. This includes the selected region, whether tax-inclusive pricing is enabled, the chosen shipping methods, and more.

The calculated cart’s totals include:

- `shipping_total`: The total of the chosen shipping methods, with taxes.
- `shipping_tax_total`: The applied taxes on the shipping total.
- `discount_total`: The total of the applied discounts.
- `raw_discount_total`: The total of the applied discounts without rounding.
- `item_tax_total`: The total applied taxes on the cart’s items.
- `tax_total`: The total taxes applied (the sum of `shipping_tax_total` and `item_tax_total`).
- `gift_card_total`: The total gift card amount applied on the cart. If there are any taxes applied on the gift cards, they’re deducted from the total.
- `gift_card_tax_total`: The total taxes applied on the cart’s gift cards.
- `subtotal`: The total of the items without taxes or discounts.
- `total`: The overall total of the cart.

:::note

If you have tax-inclusive pricing enabled, you can learn about other available total fields [here](../taxes/inclusive-pricing.md#retrieving-tax-amounts).

:::

The cart’s totals are retrieved by default in all the [cart’s store APIs](https://docs.medusajs.com/api/store#carts).

---

## Cart Completion

The cart completion functionality is implemented inside the strategy `cartCompletionStrategy`. This allows you to customize how the process is implemented in your store.

You can initiate the cart completion process by sending a request to the [Complete Cart API Route](https://docs.medusajs.com/api/store#carts_postcartscartcomplete).

### Idempotency Key

An Idempotency Key is a unique key associated with a cart. It is generated when the cart completion process is started and can be used to retry cart completion safely if an error occurs. The idempotency key is stored in the Cart entity under the attribute `idempotency_key`.

You can learn more about idempotency keys [here](../../development/idempotency-key/overview.mdx).

### Cart Completion Process

:::tip

You can learn how to override the cart completion strategy [here](./backend/cart-completion-strategy.md).

:::

![Cart Completion Flowchart](https://res.cloudinary.com/dza7lstvk/image/upload/v1681828705/Medusa%20Docs/Diagrams/cart-completion_atqkhg.jpg)

The process is implemented as follows:

1. When the idempotency key’s recovery point is set to `started`, the tax lines are created for the items in the cart. This is done using the `CartService`'s [createTaxLines method](../../references/services/classes/services.CartService.mdx#createtaxlines). If that is completed with no errors, the recovery point is set to `tax_lines_created` and the process continues.
2. When the idempotency key’s recovery point is set to `tax_lines_created`, the payment is authorized using the `CartService`'s method [authorizePayment](../../references/services/classes/services.CartService.mdx#authorizepayment). If the payment requires more action or is pending authorization, then the tax lines that were created in the previous steps are deleted and the cart completion process is terminated. Once the payment is authorized, the process can be restarted.
3. When the idempotency key’s recovery point is set to `payment_authorized`, tax lines are created again the same way as the first step. Then, the inventory of each of the items in the cart is confirmed using the `ProductVariantInventoryService`'s method [confirmInventory](../../references/services/classes/services.ProductVariantInventoryService.mdx#confirminventory). If an item is in stock, the quantity is reserved using the `ProductVariantInventoryService`'s method [reserveQuantity](../../references/services/classes/services.ProductVariantInventoryService.mdx#reservequantity). If an item is out of stock, any item reservations that were created are deleted, the payment is canceled, and an error is thrown, terminating the cart completion process. If all item quantities are confirmed to be available:
    1. If the cart belongs to a swap (the `type` attribute is set to `swap`), the swap is registered as completed using the `SwapService`'s [registerCartCompletion method](../../references/services/classes/services.SwapService.mdx#registercartcompletion) and the inventory item reservations are removed using the Inventory Module. The process ends successfully here for a swap.
    2. If the cart belongs to an order, the order is created using the `OrderService`'s method [createFromCart](../../references/services/classes/services.OrderService.mdx#createfromcart). The order is then retrieved and sent in the response.
4. Once the process detailed above is done, the idempotency key’s recovery point is set to `finished`.

---

## Cart’s Relation to Other Entities

### Region

A cart is associated with a [region](../regions-and-currencies/regions.md), which is represented by the `Region` entity. This ensures the prices, discounts, and other conditions that depend on the region are accurate for a customer.

The region’s ID is stored in the `Cart` entity under the attribute `region_id`. You can also access the region by expanding the `region` relation and accessing `cart.region`.

### Sales Channel

A [sales channel](../sales-channels/sales-channels.md) indicates different selling points a business offers its products in. It is represented by the `SalesChannel` entity.

A cart can be associated with a sales channel. When adding products to the cart, it’s important that the cart and the product belong to the same sales channel.

The sales channel’s ID is stored in the `sales_channel_id` attribute of the `Cart` entity. You can also access the sales channel by expanding the `sales_channel` relation and accessing `cart.sales_channel`.

### Address

A cart can have a shipping and a billing address, both represented by the `Address` entity.

The billing address’s ID is stored in the `billing_address_id` attribute of the `Cart` entity. You can also access the billing address by expanding the `billing_address` relation and accessing `cart.billing_address`.

The shipping address’s ID is stored in the `shipping_address_id` attribute of the `Cart` entity. You can also access the shipping address by expanding the `shipping_address` relation and accessing `cart.shipping_address`.

### LineItem

Products added to the cart are represented by the `LineItem` entity. You can access the cart’s items by expanding the `items` relation and accessing `cart.items`.

### Discount

[Discounts](../discounts/discounts.md) can be added to the cart to deduct the cart’s total. A discount is represented by the `Discount` entity.

You can access the discounts applied on a cart by expanding the `discounts` relation and accessing `cart.discounts`.

### GiftCard

[Gift cards](../gift-cards/gift-cards.md) can be applied on a cart to benefit from a pre-paid balance during payment. A gift card is represented by the `GiftCard` entity.

You can access the gift cards applied on a cart by expanding the `gift_cards` relation and accessing `cart.gift_cards`.

### Customer

A cart can be associated with either a logged-in [customer](../customers/customers.md) or a guest customer, both represented by the `Customer` entity.

You can access the customer by expanding the `customer` relation and accessing `cart.customer`.

### PaymentSession

A payment session is an available payment method that the customer can use during the checkout process. It is represented by the `PaymentSession` entity.

A cart can have multiple payment sessions that the customer can choose from. You can access the payment sessions by expanding the `payment_sessions` relation and accessing `cart.payment_sessions`.

You can also access the currently selected payment session through `cart.payment_session`.

### Payment

A payment is the authorized amount required to complete the cart. It is represented by the `Payment` entity.

The ID of the payment is stored in the `payment_id` attribute of the `Cart` entity. You can also access the payment by expanding the `payment` relation and accessing `cart.payment`.

### ShippingMethod

A shipping method indicates the chosen shipping method used to fulfill the order created later. It is represented by the `ShippingMethod` entity.

A cart can have more than one shipping method. You can access the shipping methods by expanding the `shipping_methods` relation and accessing `cart.shipping_methods`.

---

## See Also

- [How to override the cart completion strategy](./backend/cart-completion-strategy.md)
- [How to implement the cart functionality in a storefront](./storefront/implement-cart.mdx)
- [How to implement the checkout flow in a storefront](./storefront/implement-checkout-flow.mdx)
