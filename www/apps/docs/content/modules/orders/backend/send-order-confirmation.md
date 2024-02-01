---
description: 'Learn how to send an order confirmation email to the customer. This guide uses SendGrid as an example Notification provider.'
addHowToData: true
---

# How to Send Order Confirmation Email

In this document, you’ll learn how to send an order confirmation email to the customer.

## Overview

When an order is placed, the `order.placed` event is triggered. You can listen to this event in a subscriber to perform an action, such as send the customer an order confirmation email.

This guide explains how you can listen to the `order.placed` event to send an email to the customer.

---

## Prerequisites

### Event Bus Module

The event bus module trigger the event to the listening subscribers. So, it’s required to have an event bus module installed and configured on your Medusa backend.

The [Local Event Bus module](../../../development/events/modules/local.md) works in a development environment. For production, it’s recommended to use the [Redis Event Bus module](../../../development/events/modules/redis.md).

### Notification Provider

As mentioned in the overview, this guide illustrates how to send the email using SendGrid. If you intend to follow along, you must have the [SendGrid plugin](../../../plugins/notifications/sendgrid.mdx) installed and configured.

You can also find other available Notification provider plugins in the [Plugins directory](https://medusajs.com/plugins/), or [create your own](../../../references/notification/classes/notification.AbstractNotificationService.mdx).

---

## Method 1: Using a Subscriber

To subscribe to an event, you must create a [subscriber](../../../development/events/subscribers.mdx).

Create the file `src/subscribers/order-placed.ts` with the following content:

```ts title="src/subscribers/order-placed.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  OrderService,
} from "@medusajs/medusa"

export default async function handleOrderPlaced({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  // TODO: handle event
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
  context: {
    subscriberId: "order-placed-handler",
  },
}
```

In this file, you export a configuration object indicating that the subscriber is listening to the `OrderService.Events.PLACED` (or `order.placed`) event.

You also export a handler function `handleCustomerConfirmation`. In the parameter it receives, the `data` object is the payload emitted when the event was triggered, which is an object that includes the ID of the order in the `id` property.

In this method, you should typically send an email to the customer. You can place any content in the email, such as the order's items and total.

### Example: Using SendGrid

:::note

This example is only used to illustrate how the functionality can be implemented. The SendGrid plugin automatically handles sending an email when an order is placed once you install and configure the plugin in your backend.

:::

For example, you can implement this subscriber to send emails using [SendGrid](../../../plugins/notifications/sendgrid.mdx):

```ts title="src/subscribers/order-placed.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  OrderService,
} from "@medusajs/medusa"

export default async function handleOrderPlaced({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  const sendGridService = container.resolve("sendgridService")
  const orderService: OrderService = container.resolve(
    "orderService"
  )

  const order = await orderService.retrieve(data.id, {
    // you can include other relations as well
    relations: ["items"],
  })

  sendGridService.sendEmail({
    templateId: "order-confirmation",
    from: "hello@medusajs.com",
    to: order.email,
    dynamic_template_data: {
      // any data necessary for your template...
      items: order.items,
      status: order.status,
    },
  })
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
  context: {
    subscriberId: "order-placed-handler",
  },
}
```

Notice that you should replace the values in the object passed to the `sendEmail` method:

- `templateId`: Should be the ID of your confirmation email template in SendGrid.
- `from`: Should be the from email.
- `to`: Should be the customer’s email.
- `data`: Should be an object holding any data that should be passed to your SendGrid email template.

---

## Method 2: Using the NotificationService

If the notification provider you’re using already implements the logic to handle this event, you can create a [Loader](../../../development/loaders/overview.mdx) to subscribe the Notification provider to the `order.placed` event.

For example:

```ts title="src/loaders/customer-confirmation.ts"
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
    "order.placed", 
    "<NOTIFICATION_PROVIDER_IDENTIFIER>"
  )
}
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider. For example, `sendgrid`.

:::note

You can learn more about handling events with the Notification Service using [this documentation](../../../references/notification/classes/notification.AbstractNotificationService.mdx).

:::
