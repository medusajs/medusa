---
description: 'Learn how to handle the order claim event in the Medusa backend. When the event is triggered, you can send an email to the customer to inform them about it.'
addHowToData: true
---

# How to Handle Order Claim Event

In this document, you’ll learn how to handle the order claim event and send a confirmation email when the event is triggered.

## Overview

When a guest customer places an order, the order is not associated with a customer. It is associated with an email address.

After the customer registers, later on, they can claim that order by providing the order’s ID.

When the customer requests to claim the order, the event `order-update-token.created` is triggered on the Medusa backend. This event should be used to send the customer a confirmation email.

### What You’ll Learn

In this document, you’ll learn how to handle the `order-update-token.created` event on the backend to send the customer a confirmation email.

---

## Prerequisites

### Medusa Components

It's assumed that you already have a Medusa backend installed and set up. If not, you can follow the [quickstart guide](../../../development/backend/install.mdx) to get started. The Medusa backend must also have an event bus module installed, which is available when using the default Medusa backend starter.

### Notification Provider

To send an email or another type of notification method, you must have a notification provider installed or configured. You can either install an existing plugin or [create your own](../../../development/notification/create-notification-provider.md).

This document has an example using the [SendGrid](../../../plugins/notifications/sendgrid.mdx) plugin.

---

## Step 1: Create a Subscriber

To subscribe to and handle an event, you must create a subscriber.

:::tip

You can learn more about subscribers in the [Subscribers](../../../development/events/subscribers.mdx) documentation.

:::

Create the file `src/subscribers/claim-order.ts` with the following content:

```ts title=src/subscribers/claim-order.ts
type InjectedDependencies = {
  // TODO add necessary dependencies
}

class ClaimOrderSubscriber {
  constructor(container: InjectedDependencies) {
    // TODO subscribe to event
  }
}

export default ClaimOrderSubscriber
```

You’ll be adding in the next step the necessary dependencies to the subscriber.

:::info

You can learn more about [dependency injection](../../../development/fundamentals/dependency-injection.md) in this documentation.

:::

---

## Step 2: Subscribe to the Event

In this step, you’ll subscribe to the `order-update-token.created` event to send the customer a notification about their order edit.

There are two ways to do this:

### Method 1: Using the NotificationService

If the notification provider you’re using already implements the logic to handle this event, you can subscribe to the event using the `NotificationService`:

```ts title=src/subscribers/claim-order.ts
import { NotificationService } from "@medusajs/medusa"

type InjectedDependencies = {
  notificationService: NotificationService
}

class ClaimOrderSubscriber {
  constructor({ notificationService }: InjectedDependencies) {
    notificationService.subscribe(
      "order-update-token.created", 
      "<NOTIFICATION_PROVIDER_IDENTIFIER>"
    )
  }
}

export default ClaimOrderSubscriber
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider.

:::info

You can learn more about handling events with the Notification Service using [this documentation](../../../development/notification/create-notification-provider.md).

:::

### Method 2: Using the EventBusService

If the notification provider you’re using isn’t configured to handle this event, or you want to implement some other custom logic, you can subscribe to the event using the `EventBusService`:

```ts title=src/subscribers/claim-order.ts
import { EventBusService } from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService
}

class ClaimOrderSubscriber {
  constructor({ eventBusService }: InjectedDependencies) {
    eventBusService.subscribe(
      "order-update-token.created", 
      this.handleRequestClaimOrder
    )
  }

  handleRequestClaimOrder = async (data) => {
    // TODO: handle event
  }
}

export default ClaimOrderSubscriber
```

When using this method, you’ll have to handle the logic of sending the confirmation email to the customer inside the handler function, which in this case is `handleRequestClaimOrder`.

The `handleRequestClaimOrder` event receives a `data` object as a parameter. This object holds the following properties:

1. `old_email`: The email associated with the orders.
2. `new_customer_id`: The ID of the customer claiming the orders.
3. `orders`: An array of the order IDs that the customer is requesting to claim.
4. `token`: A verification token. This token is used to later verify the claim request and associate the order with the customer.

In this method, you should typically send an email to the customer’s old email. In the email, you should link to a page in your storefront and pass the `token` as a parameter.

The page would then send a request to the backend to verify that the `token` is valid and associate the order with the customer. You can read more about how to implement this in your storefront in [this documentation](../storefront/implement-claim-order.mdx).

---

## Example: Using SendGrid

For example, you can implement this subscriber to send emails using SendGrid:

<!-- eslint-disable max-len -->

```ts title=src/subscribers/claim-order.ts
import { EventBusService } from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService,
  sendgridService: any
}

class ClaimOrderSubscriber {
  protected sendGridService: any

  constructor({
    eventBusService,
    sendgridService,
  }: InjectedDependencies) {
    this.sendGridService = sendgridService
    eventBusService.subscribe(
      "order-update-token.created",
      this.handleRequestClaimOrder
    )
  }

  
  handleRequestClaimOrder = async (data) => {
    this.sendGridService.sendEmail({
      templateId: "order-claim-confirmation",
      from: "hello@medusajs.com",
      to: data.old_email,
      data: {
        link: `http://example.com/confirm-order-claim/${data.token}`,
        // other data...
      },
    })
  }
}

export default ClaimOrderSubscriber
```

Notice how the `token` is passed to the storefront link as a parameter.

---

## See Also

- [Implement claim-order flow in your storefront](../storefront/implement-claim-order.mdx)
