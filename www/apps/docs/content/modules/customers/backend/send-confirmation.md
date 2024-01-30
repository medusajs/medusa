---
description: 'Learn how to send a confirmation email to the customer after they sign up. This guide uses SendGrid as an example Notification provider.'
addHowToData: true
---

# How to Send Sign Up Confirmation Email

In this document, you’ll learn how to send a confirmation email to the customer after they sign up.

## Overview

When a customer registers, the event `customer.created` is triggered. You can then listen to this event in a subscriber to perform an action, such as send the customer a confirmation email. 

Alternatively, you can use subscribe a Notification Provider to the event, if the Notification Provider Service implements the logic to handle the event.

This guide will explain how to create the subscriber and how to use SendGrid to send the confirmation email. SendGrid is only used to illustrate how the process works, but you’re free to use any other notification service.

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

Create the file `src/subscribers/customer-confirmation.ts` with the following content:

```ts title="src/subscribers/customer-confirmation.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  CustomerService,
} from "@medusajs/medusa"

export default async function handleCustomerCreated({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  // TODO: handle event
}

export const config: SubscriberConfig = {
  event: CustomerService.Events.CREATED,
  context: {
    subscriberId: "customer-created-handler",
  },
}
```

In this file, you export a configuration object indicating that the subscriber is listening to the `CustomerService.Events.CREATED` (or `customer.created`) event.

You also export a handler function `handleCustomerConfirmation`. In the parameter it receives, the `data` object is the payload emitted when the event was triggered, which is the entire customer object. So, you can find in it fields like `first_name`, `last_name`, `email`, and more.

In this method, you should typically send an email to the customer. You can place any content in the email, such as welcoming them to your store or thanking them for registering.

### Example: Using SendGrid

For example, you can implement this subscriber to send emails using [SendGrid](../../../plugins/notifications/sendgrid.mdx):

```ts title="src/subscribers/customer-confirmation.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  CustomerService,
} from "@medusajs/medusa"

export default async function handleCustomerCreated({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  const sendGridService = container.resolve("sendgridService")

  sendGridService.sendEmail({
    templateId: "customer-confirmation",
    from: "hello@medusajs.com",
    to: data.email,
    dynamic_template_data: {
      // any data necessary for your template...
      first_name: data.first_name,
      last_name: data.last_name,
    },
  })
}

export const config: SubscriberConfig = {
  event: CustomerService.Events.CREATED,
  context: {
    subscriberId: "customer-created-handler",
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

If the notification provider you’re using already implements the logic to handle this event, you can create a [Loader](../../../development/loaders/overview.mdx) to subscribe the Notification provider to the `customer.created` event.

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
    "customer.created", 
    "<NOTIFICATION_PROVIDER_IDENTIFIER>"
  )
}
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider. For example, `sendgrid`.

:::note

You can learn more about handling events with the Notification Service using [this documentation](../../../references/notification/classes/notification.AbstractNotificationService.mdx).

:::
