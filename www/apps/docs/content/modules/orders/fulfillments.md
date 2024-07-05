---
description: "Learn about Fulfillments, how they’re used in your Medusa backend, and their relation to other entities."
---

# Fulfillments Architecture Overview

In this document, you’ll learn about Fulfillments, how they’re used in your Medusa backend, and their relation to other entities.

## Overview

Fulfillments are used to ship items, typically to a customer. Fulfillments can be used in orders, returns, swaps, and more.

Fulfillments are processed within Medusa by a [fulfillment provider](../../references/fulfillment/classes/fulfillment.AbstractFulfillmentService.mdx). The fulfillment provider handles creating, validating, and processing the fulfillment, among other functionalities. Typically, a fulfillment provider would be integrated with a third-party service that handles the actual shipping of the items.

When a fulfillment is created for one or more item, shipments can then be created for that fulfillment. These shipments can then be tracked using tracking numbers, providing customers and merchants accurate details about a shipment.

---

## Fulfillment Entity Overview

Some of the `Fulfillment` entity’s attributes include:

- `provider_id`: a string indicating the ID of the fulfillment provider that processes this fulfillment. You can also access the provider by expanding the `provider` relation and accessing `fulfillment.provider`.
- `location_id`: a string indicating where the fulfillment is being made from. When paired with the Stock Location Module in the Medusa backend, this would be the ID of a `StockLocation`.
- `no_notification`: a boolean value indicating whether the customer should receive notifications for fulfillment updates.
- `data`: an object that can hold any data relevant for the fulfillment provider.
- `shipped_at`: a date indicating when the fulfillment was shipped.
- `canceled_at`: a date indicating when the fulfillment was canceled.

There are other important attributes discussed in later sections. Check out the [full Fulfillment entity in the entities reference](../../references/entities/classes/entities.Fulfillment.mdx).

---

## TrackingLink Entity Overview

When a shipment is created from a fulfillment, it is represented by the `TrackingLink` entity. This entity has the following attributes:

- `tracking_number`: a string indicating a tracking number that allows customers and merchants to track the status of the shipment. Typically, this would be a tracking number retrieved from a third-party fulfillment service.
- `url`: an optional string indicating a URL that can be used to track the shipment.
- `fulfillment_id`: The ID of the fulfillment this tracking link is associated with. You can also access the fulfillment by expanding the `fulfillment` relation and accessing `tracking_link.fulfillment`.

You can access the tracking numbers of a fulfillment in the `tracking_numbers` attribute. You can also access the tracking links by expanding the `tracking_links` relation and accessing `fulfillment.tracking_link`.

---

## Fulfillments in Other Processes

This section explains how a fulfillment can play a role in processes related to other entities and flows.

### Orders

A fulfillment is used to ship the items to the customer. Typically, the merchant would create a fulfillment, then create a shipment (tracking link) from that fulfillment.

If a fulfillment is created for an order, it’s associated with the order using the `order_id` attribute. You can also access the fulfillment’s order by expanding the `order` relation and accessing `fulfillment.order`.

A fulfillment’s status is stored in the `Order` entity’s `fulfillment_status` attribute, which can be one of the following values:

- `not_fulfilled`: no fulfillment has been created for the order.
- `partially_fulfilled`: fulfillments have been created for some items in the order, but not all.
- `fulfilled`: fulfillments have been created for all items in the order.
- `partially_shipped`: shipments have been created for fulfillments, but not for all items in the order.
- `shipped`: shipments have been created for fulfillments for all items in the order.
- `partially_returned`: some items in the order have been returned.
- `returned`: all items in the order have been returned.
- `canceled`: the fulfillment has been canceled.
- `requires_action`: a fulfillment has been created, but it requires some additional action.

You can learn more about how fulfillments are used in orders in the [Orders Architecture documentation](./orders.md#fulfillments-in-orders).

### Returns

A fulfillment is used to return the item from the customer. Typically, the fulfillment process for returns would be automated, as the customer is expected to handle it.

If a fulfillment is created for a return, it’s associated with the order and not with the return. The order’s `fulfillment_status` will be either `partially_returned` or `returned`, based on how many items were returned.

### Swaps

A fulfillment is used to send customers new items as part of a swap. Typically, the merchant would create a fulfillment, then create a shipment (tracking link) from that fulfillment.

If a fulfillment is created for a swap, it’s associated with the swap using the `swap_id` attribute. You can also access the fulfillment’s swap by expanding the `swap` relation and accessing `fulfillment.swap`.

A fulfillment’s status is stored in the `Swap` entity’s `fulfillment_status` attribute, which can be one of the following values:

- `not_fulfilled`: no fulfillment has been created for the swap.
- `fulfilled`: a fulfillment has been created for the swap.
- `partially_shipped`: shipments have been created for fulfillments, but not for all items in the swap.
- `shipped`: shipments have been created for the fulfillment for all items in the swap.
- `canceled`: the fulfillment has been canceled.
- `requires_action`: the fulfillment has been created, but it requires some additional action.

You can learn more about fulfillments are used in swaps in the [Swaps Architecture documentation](./swaps.md#handling-swap-fulfillment).

### Claims

A fulfillment is used to send customers additional items as part of a claim. Typically, the merchant would create a fulfillment, then create a shipment (tracking link) from that fulfillment.

If a fulfillment is created for a claim, it’s associated with the claim using the `claim_order_id` attribute. You can also access the fulfillment’s claim by expanding the `claim_order` relation and accessing `fulfillment.claim_order`.

A fulfillment’s status is stored in the `Claim` entity’s `fulfillment_status` attribute, which can be one of the following values:

- `not_fulfilled`: no fulfillment has been created for the claim.
- `partially_fulfilled`: fulfillments have been created for some items in the claim, but not all.
- `fulfilled`: fulfillments have been created for all the items in the claim.
- `partially_shipped`: shipments have been created for fulfillments, but not for all items in the claim.
- `shipped`: shipments have been created for the fulfillment for all items in the claim.
- `canceled`: the fulfillment has been canceled.
- `requires_action`: the fulfillment has been created, but it requires some additional action.

You can learn more about fulfillments are used in claims in the [Claims Architecture documentation](./claims.md#fulfill-a-claim).

---

## See Also

- [Orders architecture overview](./orders.md)
- [Swaps architecture overview](./swaps.md)
- [Claims architecture overview](./claims.md)
- [Returns architecture overview](./returns.md)
