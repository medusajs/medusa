---
description: 'Learn how to handle the order claim event in the Medusa backend. When the event is triggered, you can send an email to the customer to inform them about it.'
addHowToData: true
---

# How to Handle Order Claim Event

In this document, you’ll learn how to handle the order claim event and send a confirmation email when the event is triggered.

## Overview

When a guest customer places an order, the order isn't associated with a customer. It's associated with an email address.

After the customer registers, later on, they can claim that order by providing the order’s ID.

When the customer requests to claim the order, the event `order-update-token.created` is triggered on the Medusa backend. This event should be used to send the customer a confirmation email.

In this document, you’ll learn how to handle the `order-update-token.created` event on the backend to send the customer a confirmation email.

---

## Prerequisites

### Medusa Components

It's assumed that you already have a Medusa backend installed and set up. If not, you can follow the [quickstart guide](../../../development/backend/install.mdx) to get started. The Medusa backend must also have an event bus module installed, which is available when using the default Medusa backend starter.

### Notification Provider

To send an email or another type of notification method, you must have a notification provider installed or configured. You can either install an existing plugin or [create your own](../../../references/notification/classes/notification.AbstractNotificationService.mdx).

This document has an example using the [SendGrid](../../../plugins/notifications/sendgrid.mdx) plugin.

---

## Method 1: Using a Subscriber

To subscribe to an event, you must create a subscriber.

:::note

You can learn more about subscribers in the [Subscribers documentation](../../../development/events/subscribers.mdx).

:::

Create the file `src/subscribers/order-claim.ts` with the following content:

```ts title="src/subscribers/order-claim.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
} from "@medusajs/medusa"

export default async function handleOrderClaim({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  // TODO: handle event
}

export const config: SubscriberConfig = {
  event: "order-update-token.created",
  context: {
    subscriberId: "customer-created-handler",
  },
}
```

In this file, you export a configuration object indicating that the subscriber is listening to the `order-update-token.created` event.

You also export a handler function `handleOrderClaim`. In the parameter it receives, the `data` object is the payload emitted when the event was triggered, which is an object of the following format:

```ts
data = {
  // string - email of order
  old_email,
  // string - ID of customer
  new_customer_id,
  // array of string - IDs of orders
  orders,
  // string - token used for verification
  token,
}
```

In this method, you should typically send an email to the customer. You can place any content in the email, but should mainly include the link to confirm claiming the order.

### Example: Using SendGrid

For example, you can implement this subscriber to send emails using SendGrid:

```ts title="src/subscribers/order-claim.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
} from "@medusajs/medusa"

export default async function handleOrderClaim({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  const sendGridService = container.resolve("sendgridService")

  sendGridService.sendEmail({
    templateId: "order-claim-confirmation",
    from: "hello@medusajs.com",
    to: data.old_email,
    dynamic_template_data: {
      link: 
        `http://example.com/confirm-order-claim/${data.token}`,
      // other data...
    },
  })
}

export const config: SubscriberConfig = {
  event: "order-update-token.created",
  context: {
    subscriberId: "customer-created-handler",
  },
}
```

Notice how the `token` is passed to the storefront link as a parameter.

---

## Method 2: Using the NotificationService

If the notification provider you’re using already implements the logic to handle this event, you can create a [Loader](../../../development/loaders/overview.mdx) to subscribe the Notification provider to the `order-update-token.created` event.

For example:

```ts title="src/loaders/order-claim.ts"
import { 
  MedusaContainer, 
  NotificationService,
} from "@medusajs/medusa"

export default async (
  container: MedusaContainer
): Promise<void> => {
  const notificationService = container.resolve<
    NotificationService
  >("notificationService")

  notificationService.subscribe(
    "order-update-token.created", 
    "<NOTIFICATION_PROVIDER_IDENTIFIER>"
  )
}
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider. For example, `sendgrid`.

:::note

You can learn more about handling events with the Notification Service using [this documentation](../../../references/notification/classes/notification.AbstractNotificationService.mdx).

:::

---

## See Also

- [Implement claim-order flow in your storefront](../storefront/implement-claim-order.mdx)
