---
description: 'Learn about the available events and their data payloads in Medusa. Events can be used to perform an action when the events are triggered.'
---

# Events Reference

This document details all events in Medusa, when they are triggered, and what data your handler method will receive when the event is triggered.

## Prerequisites

It is assumed you’re already familiar with [Subscribers in Medusa and how to listen to events](./create-subscriber.md). You can then use the name of events from this documentation in your subscriber to listen to events.

---

## Legend

Events in this document are listed under the entity they’re associated with. They’re listed in a table of three columns:

1. **Event Name:** The name you use to subscribe a handler for the event.
2. **Description:** When this event is triggered.
3. **Event Data Payload**: The data your handler receives as a parameter.

---

## Batch Jobs Events

This section holds all events related to batch jobs.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`batch.created`

</td>
<td>
Triggered when a batch job is created.
</td>
<td>
Object of the following format:

```js noReport noCopy
{
  id // string ID of batch job
}
```

</td>
</tr>

<tr>
<td>

`batch.updated`

</td>
<td>
Triggered when a batch job is updated.
</td>
<td>
Object of the following format:

```js noReport noCopy
{
  id // string ID of batch job
}
```

</td>
</tr>

<tr>
<td>

`batch.canceled`

</td>
<td>
Triggered when a batch job is canceled.
</td>
<td>
Object of the following format:

```js noReport noCopy
{
  id // string ID of batch job
}
```

</td>
</tr>

<tr>
<td>

`batch.pre_processed`

</td>
<td>

Triggered after the `preProcessBatchJob` of a batch job stategy is done executing.

</td>
<td>
Object of the following format:

```js noReport noCopy
{
  id // string ID of batch job
}
```

</td>
</tr>

<tr>
<td>

`batch.confirmed`

</td>
<td>

Triggered after the batch job is done pre-processing and the batch job is not in dry-run mode.

</td>
<td>
Object of the following format:

```js noReport noCopy
{
  id // string ID of batch job
}
```

</td>
</tr>

<tr>
<td>

`batch.processing`

</td>
<td>
Triggered when a batch job starts processing after it's confirmed.
</td>
<td>
Object of the following format:

```js noReport noCopy
{
  id // string ID of batch job
}
```

</td>
</tr>

<tr>
<td>

`batch.completed`

</td>
<td>
Triggered when a batch job is done processing and is completed.
</td>
<td>
Object of the following format:

```js noReport noCopy
{
  id // string ID of batch job
}
```

</td>
</tr>

<tr>
<td>

`batch.failed`

</td>
<td>
Triggered when an error occurs while running a batch job and the batch job fails.
</td>
<td>
Object of the following format:

```js noReport noCopy
{
  id // string ID of batch job
}
```

</td>
</tr>

</tbody>
</table>

---

## Cart Events

This section holds all events related to a cart.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>

<tr>
<td>

`cart.customer_updated`

</td>
<td>
Triggered when a cart is associated with a different email than it was already associated with, or if a customer logs in after adding items to their cart as a guest.
</td>
<td>
The cart ID passed as a string parameter.
</td>
</tr>

<tr>
<td>

`cart.created`

</td>
<td>
Triggered when a cart is created.
</td>
<td>
Object of the following format:

```js noReport noCopy
{
  id // string ID of cart
}
```

</td>
</tr>

<tr>
<td>

`cart.updated`

</td>
<td>

Triggered when a cart and data associated with it (payment sessions, shipping methods, user details, etc…) are updated.

</td>
<td>

An object with at least the ID of the cart, however, in most cases the entire cart model is available. You can refer to the [Cart entity](https://github.com/medusajs/medusa/blob/master/packages/medusa/src/models/cart.ts) for an idea of what fields to expect.

</td>
</tr>

</tbody>
</table>

---

## Claim Events

This section holds all events related to claims.

<table class="reference-table">

<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`claim.created`

</td>
<td>

Triggered when a claim is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of claim
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`claim.updated`

</td>
<td>

Triggered when a claim is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of claim
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`claim.canceled`

</td>
<td>

Triggered when a claim is canceled.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of claim
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`claim.fulfillment_created`

</td>
<td>

Triggered when fulfillment is created for a claim.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of claim
  fulfillment_id, // string ID of the fulfillment created
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`claim.shipment_created`

</td>
<td>

Triggered when a claim fulfillment is set as “shipped”.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of claim
  fulfillment_id, // string ID of the fulfillment created
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`claim.refund_processed`

</td>
<td>

Triggered when a claim of type “refunded” has been refunded.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of claim
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

</tbody>
</table>

---

## Claim Item Events

This section holds all events related to claim items.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`claim_item.created`

</td>
<td>

Triggered when claim items are created and associated with a claim. This happens during the creation of claims.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of claim item
}
```

</td>
</tr>

<tr>
<td>

`claim_item.updated`

</td>
<td>

Triggered when a claim item is updated. This happens when a claim is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of claim item
}
```

</td>
</tr>

<tr>
<td>

`claim_item.canceled`

</td>
<td>

Triggered when a claim is canceled.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of claim item
}
```

</td>
</tr>

</tbody>
</table>

---

## Currency Events

This section holds all events related to currencies.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`currency.updated`

</td>
<td>

Triggered when a currency is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  code // string 3 character ISO code of the updated currency.
}
```

</td>
</tr>

</tbody>
</table>

---

## Customer Events

This section holds all events related to customers.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`customer.created`

</td>
<td>

Triggered when a customer is created.

</td>
<td>

The entire customer passed as an object. You can refer to the [Customer entity](https://github.com/medusajs/medusa/blob/master/packages/medusa/src/models/customer.ts) for an idea of what fields to expect.

</td>
</tr>

<tr>
<td>

`customer.updated`

</td>
<td>

Triggered when a customer is updated including their information or password, or when a customer account is created that is associated with an existing email (for example, if a customer placed an order with their email as a guest, then created an account with that email).

</td>
<td>

The entire customer passed as an object. You can refer to the [Customer entity](https://github.com/medusajs/medusa/blob/master/packages/medusa/src/models/customer.ts) for an idea of what fields to expect.

</td>
</tr>

<tr>
<td>

`customer.password_reset`

</td>
<td>

Triggered when a customer requests to reset their password.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of customer
  email, // string email of the customer
  first_name, // string first name of the customer
  last_name, // string last name of the customer
  token // string reset password token
}
```

</td>
</tr>

</tbody>
</table>

---

## Draft Order Events

This section holds all events related to draft orders.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`draft_order.created`

</td>
<td>

Triggered when a draft order is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of draft order
}
```

</td>
</tr>

<tr>
<td>

`draft_order.updated`

</td>
<td>

Triggered when a draft order and data associated with it (email, billing address, discount, etc…) are updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of draft order
}
```

</td>
</tr>

</tbody>
</table>

---

## Gift Card Events

This section holds all events related to gift cards.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`gift_card.created`

</td>

<td>

Triggered when a gift card is created.

</td>

<td>

Object of the following format:

```
{
  id //string ID of gift card
}
```

</td>
</tr>
</tbody>
</table>

---

## Inventory Item Events

This section holds all events related to inventory items.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`inventory-item.created`

</td>
<td>

Triggered when an inventory item is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the inventory item
}
```

</td>
</tr>
<tr>
<td>

`inventory-item.updated`

</td>
<td>

Triggered when an inventory item is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the inventory item
}
```

</td>
</tr>
<tr>
<td>

`inventory-item.deleted`

</td>
<td>

Triggered when an inventory item is deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the inventory item
}
```

</td>
</tr>
</tbody>
</table>

---

## Inventory Level Events

This section holds all events related to inventory levels.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`inventory-level.created`

</td>
<td>

Triggered when an inventory level is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the inventory level
}
```

</td>
</tr>
<tr>
<td>

`inventory-level.updated`

</td>
<td>

Triggered when an inventory level is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the inventory level
}
```

</td>
</tr>
<tr>
<td>

`inventory-level.deleted`

</td>
<td>

Triggered when an inventory level is deleted, which can be done either directly using its ID or based on the ID of a location. The returned ID depends on how the inventory level was deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // (optional) string ID of the inventory level, available if it was deleted directly
  location_id // (optional) string ID of location, available if level was deleted by location ID
}
```

</td>
</tr>
</tbody>
</table>

---

## Invite Events

This section holds all events related to invites.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`invite.created`

</td>
<td>

Triggered when an invite is created for a user to join the admin team.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of invite
  token, // string token generated to validate the invited user
  user_email // string email of invited user
}
```

</td>
</tr>
</tbody>
</table>

---

## Note Events

This section holds all events related to notes.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`note.created`

</td>
<td>

Triggered when a note is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of note
}
```

</td>
</tr>

<tr>
<td>

`note.updated`

</td>
<td>

Triggered when a note is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of note
}
```

</td>
</tr>

<tr>
<td>

`note.deleted`

</td>
<td>

Triggered when a note is deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of note
}
```

</td>
</tr>

</tbody>
</table>

---

## App Authentication Events

This section holds all events related to app authentications.

:::note

Event names of app authentication are scoped specifically towards each application. When listening to these events, you must replace `<APP>` with the name of the application you’re targeting.

:::

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`oauth.token_generated.<APP>`

</td>
<td>

Triggered when a token is generated for an application.

</td>
<td>

The returned data from the method `generateToken` in the auth handler service of the application.

</td>
</tr>

<tr>
<td>

`oauth.token_refreshed.<APP>`

</td>
<td>

Triggered when the token of an application is refreshed.

</td>
<td>

The returned data from the method `refreshToken` in the auth handler service of the application.

</td>
</tr>


</tbody>
</table>

---

## Order Events

This section holds all events related to orders.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`order.placed`

</td>
<td>

Triggered when a new order is placed.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.updated`

</td>
<td>

Triggered when an order and data associated with it (shipping method, shipping address, etc…) are updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  no_notification // (optional) boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.canceled`

</td>
<td>

Triggered when an order is canceled.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.completed`

</td>
<td>

Triggered when an order is completed.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.orders_claimed`

</td>
<td>

Triggered when an order is claimed.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, //string ID of order
}
```

</td>
</tr>

<tr>
<td>

`order.gift_card_created`

</td>
<td>

Triggered when a gift card in an order is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of order
}
```

</td>
</tr>

<tr>
<td>

`order.payment_captured`

</td>
<td>

Triggered when the payment of an order is captured.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.payment_capture_failed`

</td>
<td>

Triggered when capturing the payment of an order fails.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  payment_id, // string ID of Payment
  error, // string error message
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.fulfillment_created`

</td>
<td>

Triggered when fulfillment is created for an order.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  fulfillment_id, // string ID of fulfillment
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.shipment_created`

</td>
<td>

Triggered when a shipment is created for fulfillment and the fulfillment is registered as “shipped”.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  fulfillment_id, // string ID of fulfillment
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.fulfillment_canceled`

</td>
<td>

Triggered when fulfillment of an order is canceled.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  fulfillment_id, // string ID of fulfillment
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.return_requested`

</td>
<td>

Triggered when a return of an order is requested.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  return_id, // string ID of return
  no_notification // (optional) boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.items_returned`

</td>
<td>

Triggered when the items of an order have been returned and the order has been registered as “returned”.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  return_id, // string ID of return
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.return_action_required`

</td>
<td>

Triggered when the order is being registered as “returned” but there are additional actions required related to refunding the payment.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  return_id, // string ID of return
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.refund_created`

</td>
<td>

Triggered when the order’s payment is refunded.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of order
  refund_id, // string ID of refund
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`order.refund_failed`

</td>
<td>

Triggered when the refund of the order’s payment fails.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, //string ID of order
}
```

</td>
</tr>

<tr>
<td>

`order.swap_created`

</td>
<td>

Triggered when a swap for an order is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, //string ID of order
}
```

</td>
</tr>

</tbody>
</table>

---

## Order Edit Events

This section holds all events related to order edits.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`order-edit.created`

</td>
<td>

Triggered when a order edit is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, //string ID of order edit
}
```

</td>
</tr>

<tr>
<td>

`order-edit.updated`

</td>
<td>

Triggered when an order edit is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, //string ID of order edit
}
```

</td>
</tr>

<tr>
<td>

`order-edit.canceled`

</td>
<td>

Triggered when an order edit is canceled.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, //string ID of order edit
}
```

</td>
</tr>

<tr>
<td>

`order-edit.declined`

</td>
<td>

Triggered when an order edit is declined.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, //string ID of order edit
}
```

</td>
</tr>

<tr>
<td>

`order-edit.requested`

</td>
<td>

Triggered when an order edit is requested.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of order edit
}
```

</td>
</tr>

<tr>
<td>

`order-edit.confirmed`

</td>
<td>

Triggered when an order edit is confirmed.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, //string ID of order edit
}
```

</td>
</tr>

</tbody>
</table>

---

## Order Edit Item Changes Events

This section holds all events related to order edit item changes.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`order-edit-item-change.CREATED`

</td>
<td>

Triggered when an order edit item change is created.

</td>
<td>

```js noReport noCopy
{
  id // string ID of item change
}
```

</td>
</tr>

<tr>
<td>

`order-edit-item-change.DELETED`

</td>
<td>

Triggered when an order edit item change is deleted.

</td>
<td>

```js noReport noCopy
{
  id // string ID of item change
}
```

</td>
</tr>

</tbody>
</table>

---

## Payment Events

This section holds all events related to payment.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>

<tr>
<td>

`payment.created`

</td>
<td>

Triggered when a payment is created.

</td>
<td>

The entire payment passed as an object. You can refer to the [Payment entity](../../references/entities/classes/Payment.md) for an idea of what fields to expect.

</td>
</tr>

<tr>
<td>

`payment.updated`

</td>
<td>

Triggered when a payment is updated.

</td>
<td>

The entire payment passed as an object. You can refer to the [Payment entity](../../references/entities/classes/Payment.md) for an idea of what fields to expect.

</td>
</tr>

<tr>
<td>

`payment.payment_captured`

</td>
<td>

Triggered when a payment is captured.

</td>
<td>

The entire payment passed as an object. You can refer to the [Payment entity](../../references/entities/classes/Payment.md) for an idea of what fields to expect.

</td>
</tr>

<tr>
<td>

`payment.payment_capture_failed`

</td>
<td>

Triggered when the capturing of a payment fails.

</td>
<td>

The entire payment passed as an object. You can refer to the [Payment entity](../../references/entities/classes/Payment.md) for an idea of what fields to expect.

In addition, an error object is passed within the same object as the Payment Processor:

```js noReport noCopy
{
  id, //string ID of payment
  //... other payment fields
  error: {
    name, //string
    nessage, //string
    stack, //(optional) string
  }
}
```

</td>
</tr>

<tr>
<td>

`payment.payment_refund_created`

</td>
<td>

Triggered when a refund of a payment is created.

</td>
<td>

The entire refund passed as an object. You can refer to the [Refund entity](../../references/entities/classes/Refund.md) for an idea of what fields to expect.

</td>
</tr>

<tr>
<td>

`payment.payment_refund_failed`

</td>
<td>

Triggered when a payment's refund fails.

</td>
<td>

The entire payment passed as an object. You can refer to the [Payment entity](../../references/entities/classes/Payment.md) for an idea of what fields to expect.

</td>
</tr>

</tbody>
</table>

---

## Payment Collection Events

This section holds all events related to payment collections.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>

<tr>
<td>

`payment-collection.created`

</td>
<td>

Triggered when a payment collection is created.

</td>
<td>

The entire payment collection passed as an object. You can refer to the [Payment Collection entity](../../references/entities/classes/PaymentCollection.md) for an idea of what fields to expect.

</td>
</tr>

<tr>
<td>

`payment-collection.updated`

</td>
<td>

Triggered when a payment collection is update.

</td>
<td>

The entire payment collection passed as an object. You can refer to the [Payment Collection entity](../../references/entities/classes/PaymentCollection.md) for an idea of what fields to expect.

</td>
</tr>

<tr>
<td>

`payment-collection.deleted`

</td>
<td>

Triggered when a payment collection is deleted.

</td>
<td>

The entire payment collection passed as an object. You can refer to the [Payment Collection entity](../../references/entities/classes/PaymentCollection.md) for an idea of what fields to expect.

</td>
</tr>

<tr>
<td>

`payment-collection.payment_authorized`

</td>
<td>

Triggered when a payment collection is either marked authorized or its payment session is authorized.

</td>
<td>

The entire payment collection passed as an object. You can refer to the [Payment Collection entity](../../references/entities/classes/PaymentCollection.md) for an idea of what fields to expect.

</td>
</tr>

</tbody>
</table>

---

## Product Events

This section holds all events related to products.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>

<tr>
<td>

`product.created`

</td>
<td>

Triggered when a product is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of product
}
```

</td>
</tr>

<tr>
<td>

`product.updated`

</td>
<td>

Triggered when a product and data associated with it (options, variant orders, etc…) is updated.

</td>
<td>

The entire product passed as an object. You can refer to the [Product entity](../../references/entities/classes/Product.md) for an idea of what fields to expect.

In one case, when the `/admin/products/{id}` endpoint is used to update the product, the payload is an object of the following format:

```js noReport noCopy
{
  id, // id of product
  fields // an array of field names that were updated
}
```

</td>
</tr>

<tr>
<td>

`product.deleted`

</td>
<td>

Triggered when a product is deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of product
}
```

</td>
</tr>

</tbody>
</table>

---

## Product Category Events

This section holds all events related to product categories.

:::note

Product Category feature is currently in beta mode and guarded by a feature flag. You can learn how to enable it in the [Product Categories documentation](../../modules/products/categories.md).

:::

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`product-category.created`

</td>
<td>

Triggered when a product category is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of category
}
```

</td>
</tr>

<tr>
<td>

`product-category.updated`

</td>
<td>

Triggered when a product category is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of category
}
```

</td>
</tr>

<tr>
<td>

`product-category.deleted`

</td>
<td>

Triggered when a product category is deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of category
}
```

</td>
</tr>

</tbody>
</table>

---

## Product Variant Events

This section holds all events related to product variants.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`product-variant.created`

</td>
<td>

Triggered when a product variant is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of variant
  product_id // string ID of product
}
```

</td>
</tr>

<tr>
<td>

`product-variant.updated`

</td>
<td>

Triggered when a product variant is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of variant
  product_id, // string ID of product
  fields // array of names of updated fields
}
```

</td>
</tr>

<tr>
<td>

`product-variant.deleted`

</td>
<td>

Triggered when a product variant is deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of variant
  product_id, // string ID of product
  metadata // object of the `metadata` field of the variant
}
```

</td>
</tr>

</tbody>
</table>

---

## Publishable API Key Events

This section holds all events related to publishable API keys.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>

<tr>
<td>

`publishable_api_key.created`

</td>
<td>

Triggered when a publishable API key is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of publishable API key
}
```

</td>
</tr>

<tr>
<td>

`publishable_api_key.revoked`

</td>
<td>

Triggered when a publishable API key is revoked.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of publishable API key
}
```

</td>
</tr>

</tbody>
</table>

---

## Region Events

This section holds all events related to regions.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`region.created`

</td>
<td>

Triggered when a region is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of region
}
```

</td>
</tr>

<tr>
<td>

`region.updated`

</td>
<td>

Triggered when a region or data associated with it (countries, fulfillment providers, etc…) are updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of region
  fields // array of names of updated fields
}
```

</td>
</tr>

<tr>
<td>

`region.deleted`

</td>
<td>

Triggered when a region is deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of region
}
```

</td>
</tr>
</tbody>
</table>

---

## Reservation Item Events

This section holds all events related to reservation items.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`reservation-item.created`

</td>
<td>

Triggered when a reservation item is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the reservation item
}
```

</td>
</tr>
<tr>
<td>

`reservation-item.updated`

</td>
<td>

Triggered when an reservation item is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the reservation item
}
```

</td>
</tr>
<tr>
<td>

`reservation-item.deleted`

</td>
<td>

Triggered when a reservation item is deleted, which can be done either directly using its ID or based on the ID of a location or a line item. The returned ID depends on how the reservation item was deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // (optional) string ID of the reservation item, available if it was deleted directly
  location_id // (optional) string ID of location, available if item was deleted by location ID
  line_item_id // (optional) string ID of line item, available if reservation item was deleted by line item ID
}
```

</td>
</tr>
</tbody>
</table>

---

## Sales Channel Events

This section holds all events related to sales channels.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`sales_channel.created`

</td>
<td>

Triggered when a sales channel is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of sales channel
}
```

</td>
</tr>

<tr>
<td>

`sales_channel.updated`

</td>
<td>

Triggered when a sales channel is updated

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, //string ID of sales channel
}
```

</td>
</tr>

<tr>
<td>

`sales_channel.deleted`

</td>
<td>

Triggered when a sales channel is deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of sales channel
}
```

</td>
</tr>
</tbody>
</table>

---

## Stock Location Events

This section holds all events related to stock locations.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`stock-location.created`

</td>
<td>

Triggered when a stock location is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the stock location
}
```

</td>
</tr>
<tr>
<td>

`stock-location.updated`

</td>
<td>

Triggered when an stock location is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the stock location
}
```

</td>
</tr>
<tr>
<td>

`stock-location.deleted`

</td>
<td>

Triggered when a stock location is deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of the stock location
}
```

</td>
</tr>
</tbody>
</table>

---

## Swap Events

This section holds all events related to swaps.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`swap.created`

</td>
<td>

Triggered when a swap is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of swap
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`swap.received`

</td>
<td>

Triggered when a swap is registered as received.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of swap
  order_id, // string ID of order
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`swap.fulfillment_created`

</td>
<td>

Triggered when fulfillment is created for a swap.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of swap
  fulfillment_id, // string ID of fulfillment
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`swap.shipment_created`

</td>
<td>

Triggered when a shipment is created for a swap and the fulfillment associated with it is set as “shipped”.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of swap
  fulfillment_id, // string ID of fulfillment
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`swap.payment_completed`

</td>
<td>

Triggered when payment is completed for a swap which happens when the cart associated with the swap is registered as completed.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of swap
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`swap.payment_captured`

</td>
<td>

Triggered when the payment is captured for a swap.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of swap
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`swap.payment_capture_failed`

</td>
<td>

Triggered when the capturing of the payment of a swap fails.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of swap
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`swap.refund_processed`

</td>
<td>

Triggered when a swap’s amount difference is processed and refunded.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of swap
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

<tr>
<td>

`swap.process_refund_failed`

</td>
<td>

Triggered when processing and refunding a swap’s amount difference fails.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id, // string ID of swap
  no_notification // boolean indicating whether a notification should be sent
}
```

</td>
</tr>

</tbody>
</table>

---

## Token Events

This section holds all events related to tokens.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`order-update-token.created`

</td>
<td>

Triggered when a customer requests to claim an order and a token is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  old_email, //string email of order
  new_customer_id, //string ID of customer
  orders, //array of string IDs of orders
  token, //string token used for verification
}
```

</td>
</tr>

</tbody>
</table>

---

## User Events

This section holds all events related to users.

<table class="reference-table">
<thead>
<tr>
<th>
Event Name
</th>
<th>
Description
</th>
<th>
Event Data Payload
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`user.created`

</td>
<td>

Triggered when a user is created.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of user
}
```

</td>
</tr>

<tr>
<td>

`user.updated`

</td>
<td>

Triggered when a user is updated.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of user
}
```

</td>
</tr>

<tr>
<td>

`user.password_reset`

</td>
<td>

Triggered when a user requests to reset their password.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  email, // string email of user requesting to reset their password
  token // token create to reset the password
}
```

</td>
</tr>

<tr>
<td>

`user.deleted`

</td>
<td>

Triggered when a user is deleted.

</td>
<td>

Object of the following format:

```js noReport noCopy
{
  id // string ID of user
}
```

</td>
</tr>
</tbody>
</table>

---

## See Also

- [Events overview](./index.mdx)
- [Use services in subscribers](./create-subscriber.md#using-services-in-subscribers)
- [Create a notification provider](../notification/overview.mdx)
