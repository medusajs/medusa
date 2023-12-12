---
description: "Learn about returns, how the return process is implemented in the Medusa backend, and a return’s relation to other entities."
---

# Returns Architecture Overview

In this document, you’ll learn about returns, how the return process is implemented in the Medusa backend, and a return’s relation to other entities.

## Overview

After a customer receives an item they ordered, they might want to return it back. This process includes returning the item into the commerce store, and refunding the payment back to the customer.

The Medusa core provides the necessary implementation and functionalities that allow you to integrate this process into your store and automate the Return Merchandise Authorization (RMA) flow.

---

## Return Entity Overview

Some of the `Return` entity’s attributes include:

- `status`: A string indicating the status of the return. Its value can be one of the following:
  - `requested`: The customer requested the return.
  - `requires_action`: The return couldn’t be marked as received because there’s a mismatch between the items specified in the return request and the received items.
  - `received`: the merchant marks the return as received.
  - `canceled`: the merchant canceled the return.
- `refund_amount`: A number indicating the amount that should be refunded.
- `received_at`: the date indicating when the return was marked as received.
- `no_notification`: a boolean value indicating whether the customer should receive notification updates when there are any changes in the return.
- `shipping_data`: this is a JSONB object that can hold any data related to the fulfillment associated with the return.

There are other important attributes discussed in later sections. Check out the [full Return entity in the entities reference](../../references/entities/classes/entities.Return.mdx).

---

## Returns Process

Returns can be created in three ways:

1. Created directly, typically by a client or customer.
2. Created automatically and linked to a swap when a swap is created. You can learn more about the overall swap process in the [Swaps documentation](./swaps.md). The Mark Return as Received section applies for swaps as well.
3. Created automatically and linked to a claim when a claim is created. You can learn more about the overall claim process in the [Claims documentation] The Mark Return as Received section applies for claims as well.

### Idempotency Key

An Idempotency Key is a unique key associated with a return. It is generated when the return creation process is started by the customer and can be used to retry the return creation safely if an error occurs. The idempotency key is stored in the `Return` entity in the attribute `idempotency_key`.

You can learn more about idempotency keys [here](../../development/idempotency-key/overview.mdx).

### Return Creation Process Through the Customer

This section explains how the return is created by the customer or any type of client. This is the process created within the Medusa core.

The following process occurs within the Create Return storefront API Route:

![Return Client Process Flowchart](https://res.cloudinary.com/dza7lstvk/image/upload/v1681994516/Medusa%20Docs/Diagrams/return-client-process_evbjf5.jpg)

1. The customer creates a return, specifying the items they want to return and optionally the shipping option they want to use to return the items. This is done using the `ReturnService`'s [create method](../../references/services/classes/services.ReturnService.mdx#create).
2. If they specify the return shipping option they want to use, a shipping method is created from the chosen shipping option and the return is automatically fulfilled in the backend using the `ReturnService`'s [fulfill method](../../references/services/classes/services.ReturnService.mdx#fulfill).

After this process, the return will be available for the merchant or the admin to view and handle it. The merchant can either mark the return as received or cancel the return.

### Mark Return as Received Process

Marking a return as received would refund the amount to the customer and adjust the store’s inventory for the returned items.

The following process occurs within the [Receive Return admin API Route](https://docs.medusajs.com/api/admin#returns_postreturnsreturnreceive):

![Receive Return Process Flowchart](https://res.cloudinary.com/dza7lstvk/image/upload/v1681996834/Medusa%20Docs/Diagrams/return-admin-process_e99skk.jpg)

1. The return is marked as received using the `ReturnService`'s receive method. In this method:
    1. The return’s status is checked to ensure it’s not canceled or received. If so, the process is terminated with an error.
    2. The received items are validated to ensure they match the items that were previously requested to be returned. If there’s a mismatch, the return’s status is set to `requires_more`. This is useful in situations where a custom refund amount is requested, but the returned items don’t match the requested items.
    3. If there’s no mismatch issue, the return’s status is set to `received`.
    4. The inventory of the returned items is adjusted using the `ProductVariantInventoryService`'s [method adjustInventory](../../references/services/classes/services.ProductVariantInventoryService.mdx#adjustinventory)
2. After the return is marked as received, if the return is associated with a swap, the `SwapService`'s [registerReceived method](../../references/services/classes/services.SwapService.mdx#registerreceived) is used to validate the return, emit the swap event `received`, and return the swap.
3. On the other hand, after the return is marked as received, if the return is associated with an order, the `OrderService`'s [registerReturnReceived method](../../references/services/classes/services.OrderService.mdx#registerreturnreceived). In this method:
    1. If the amount that is expected to be refunded is greater than the amount that can be refunded, the `fulfillment_status` of the order is set to `requires_action`. And the process is terminated.
    2. If there are no validation issues, the payment is refunded and the fulfillment status is set to `returned` if all items of the order were returned, or `partially_returned` if only some items were returned.

### Cancel a Return

The merchant can cancel a return if it hasn’t be marked as `received` before. This can be done either using the `ReturnService`'s [cancel method](../../references/services/classes/services.ReturnService.mdx#cancel) or using the [Cancel Return API Route](https://docs.medusajs.com/api/admin#returns_postreturnsreturncancel).

Canceling a return would change its status to canceled.

---

## RMA Automation with Returns

Giving the client control over the creation of a return allows businesses to automate their RMA flow.

The client, typically the customer, creates the return, and specifies the shipping option they’ll use to return the item. The admin, typically the merchant, can view the requested return, mark it as received, and refund the payment to the customer. The core will also take care of adjusting the inventory automatically.

![RMA Automation Flowchart](https://res.cloudinary.com/dza7lstvk/image/upload/v1681996158/Medusa%20Docs/Diagrams/rma-automation-return_prleib.jpg)

This removes any friction and support required between the client and the admin.

---

## Relation to Other Entities

This section includes relations that weren’t mentioned in other sections.

## Order

The return can be associated with an [order](./orders.md). An order is represented by the `Order` entity.

You can access the order’s ID using the `order_id` property. You can also access the order by expanding the `order` relation and accessing `return.order`.

### Swap

The return can be associated with a [swap](./swaps.md). A swap is represented by the `Swap` entity.

You can access the swap’s ID using the `swap_id` property. You can also access the swap by expanding the `swap` relation and accessing `return.swap`.

### ClaimOrder

The return can be associated with a [claim](./claims.md). A claim is represented by the `ClaimOrder` entity.

You can access the claim’s ID using the `claim_order_id` property. You can also access the claim by expanding the `claim_order` relation and accessing `return.claim_order`.

### ShippingMethod

The return can be associated with a [shipping method](../carts-and-checkout/shipping.md#shipping-method). This would be the shipping method the customer chose when they created the swap. A shipping method is represented by the `ShippingMethod` entity.

You can access the shipping method by expanding the `shipping_method` relation and accessing `return.shipping_method`.

---

## See Also

- [How to manage returns](./admin/manage-returns.mdx)
- [Orders architecture overview](./orders.md)
- [Swaps architecture overview](./swaps.md)
- [Claims architecture overview](./claims.md)
