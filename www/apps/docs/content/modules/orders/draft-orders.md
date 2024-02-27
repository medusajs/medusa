---
description: "Learn about draft orders, process around draft orders, and their relation to other entities in the Medusa backend."
---

# Draft Orders Architecture Overview

In this document, you’ll learn about draft orders, process around draft orders, and their relation to other entities in the Medusa backend.

## Overview

Merchants may need to manually create orders without any involvement from the customer. This can be useful if the order is being created through a channel that isn’t integrated within your commerce system, or for some reason the customer can’t create the order themselves.

In Medusa, these types of orders are called draft orders. An admin or a merchant can create a draft order that holds all the details of the order. Then, the draft order can be later transformed into an actual order.

---

## DraftOrder Entity Overview

Some of the `DraftOrder`'s attributes include:

- `status`: a string indicating the status of the draft order. Its values can be:
  - `open`: the draft order is created, but hasn’t been completed.
  - `completed`: the draft order is completed. A draft order is considered completed when the payment for the order has been captured and an order has been created from the draft order.
- `display_id`: a string that can be used as the displayed ID to customers and merchants.
- `canceled_at`: a date indicating when the draft order was canceled.
- `completed_at`: a date indicating when the draft order was completed.
- `no_notification_order`: a boolean indicating whether the customer should receive notifications when the order is updated.

There are other important attributes discussed in later sections. Check out the [full DraftOrder entity in the entities reference](../../references/entities/classes/entities.DraftOrder.mdx).

---

## How Draft Orders Work

You have full freedom in how you choose to implement creating draft orders. This section explains how it’s created in the Medusa backend using the [Create Draft Order](https://docs.medusajs.com/api/admin#draft-orders_postdraftorders) and [Register Payment](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersdraftorderregisterpayment) API Routes.

A draft order is created using the `DraftOrderService`'s [create method](../../references/services/classes/services.DraftOrderService.mdx#create). Within that method, a cart is created along with it. The cart is used to store the order’s details, such as the draft order’s items, shipping options, and more. The cart has the type `draft_order`.

Since the draft order is associated with a cart, the process implemented in the Medusa backend around completing the draft order is pretty similar to that of completing a cart.

The payment must be authorized before the cart can be completed, which can be done using the `CartService`'s [authorizePayment method](../../references/services/classes/services.CartService.mdx#authorizepayment). Once the payment is authorized, the order can be created using the `OrderService`'s [createFromCart method](../../references/services/classes/services.OrderService.mdx#createfromcart).

:::note

In the Register Payment API Route, the `system` payment method is used by default as the payment session of the cart. This means that the authorization and capturing of the payment don’t actually trigger any processes with existing payment processors integrated into your Medusa backend. It’s expected that the merchant will handle these processes manually.

:::

The draft order can then be completed using the `DraftOrderService`'s [registerCartCompletion method](../../references/services/classes/services.DraftOrderService.mdx#registercartcompletion). This would update its status to `completed` and would set the `order_id` attribute of the draft order. Finally, you can capture the payment of the order that was created using the `OrderService`'s [capturePayment method](../../references/services/classes/services.OrderService.mdx#capturepayment).

Once the order is created and the draft order is completed, the created order can be processed and handled the same as orders created by customers.

---

## Relation to Other Entities

### Cart

A draft order is associated with a [cart](../carts-and-checkout/cart.md) that is used to set the items in the draft order, shipping method, and more. A cart is represented by the `Cart` entity.

You can access the ID of the draft order’s cart using the `cart_id` attribute. You can also access the cart by expanding the `cart` relation and accessing `draft_order.cart`.

### Order

A draft order is associated with an [order](./orders.md) that is created once the draft order is completed. An order is represented by the `Order` entity.

You can access the ID of the order using the `order_id` attribute. You can also access the order by expanding the `order` relation and accessing `draft_order.order`.

---

## See Also

- [How to manage draft orders using REST APIs](./admin/manage-draft-orders.mdx)
- [Order Architecture Overview](./orders.md)
