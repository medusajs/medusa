---
description: 'Learn how to send a gift card code to the customer. Once the customer purchases a gift card, an email can be sent with the code so that they can redeem the gift card.'
addHowToData: true
---

# How to Send Gift Card Code to Customer

In this document, you’ll learn how to send a customer the gift card code they purchased.

## Overview

Once the customer purchases a gift card, they should receive the code of the gift card so that they can use it in future purchases.

Typically, the code would be sent by email, however, you’re free to choose how you deliver the gift card code to the customer.

This document shows you how to track when a gift card is purchased so that you can send its code to the customer.

:::tip

You can alternatively use the [SendGrid](../../../plugins/notifications/sendgrid.mdx) plugin, which handles sending the email automatically.

:::

---

## Prerequisites

### Medusa Components

It's assumed that you already have a Medusa backend installed and set up. If not, you can follow the [quickstart guide](../../../development/backend/install.mdx) to get started. The Medusa backend must also have an event bus module installed, which is available when using the default Medusa backend starter.

### Notification Provider

To send an email or another type of notification method, you must have a notification provider installed or configured. You can either install an [existing plugin](../../../plugins/notifications/index.mdx) or [create your own](../../../references/notification/classes/notification.AbstractNotificationService.mdx).

---

## Method 1: Using a Subscriber

To subscribe to and handle an event, you must create a [subscriber](../../../development/events/subscribers.mdx).

Create the file `src/subscribers/gift-card.ts` with the following content:

```ts title="src/subscribers/gift-card.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  GiftCardService,
} from "@medusajs/medusa"

export default async function handleGiftCardCreated({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  // TODO: handle event
}

export const config: SubscriberConfig = {
  event: GiftCardService.Events.CREATED,
  context: {
    subscriberId: "gift-card-created-handler",
  },
}
```

In this file, you export a configuration object indicating that the subscriber is listening to the `GiftCardService.Events.CREATED` (or `gift_card.created`) event.

You also export a handler function `handleGiftCardCreated`. In the parameter it receives, the `data` object is the payload emitted when the event was triggered, which is an object containing the ID of the gift card in the `id` property.

In this method, you should typically send an email to the customer. You can place any content in the email, such as the code of the gift card.

### Example: Using SendGrid

For example, you can implement this subscriber to send emails using [SendGrid](../../../plugins/notifications/sendgrid.mdx):

```ts title="src/subscribers/gift-card.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  GiftCardService,
} from "@medusajs/medusa"

export default async function handleGiftCardCreated({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  const sendGridService = container.resolve("sendgridService")
  const giftCardService: GiftCardService = container.resolve(
    "giftCardService"
  )

  const giftCard = await giftCardService.retrieve(data.id, {
    relations: ["order"],
  })

  sendGridService.sendEmail({
    templateId: "gift-card-created",
    from: "hello@medusajs.com",
    to: giftCard.order.email,
    dynamic_template_data: {
      // any data necessary for your template...
      code: giftCard.code,
    },
  })
}

export const config: SubscriberConfig = {
  event: GiftCardService.Events.CREATED,
  context: {
    subscriberId: "gift-card-created-handler",
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

If the notification provider you’re using already implements the logic to handle this event, you can create a [Loader](../../../development/loaders/overview.mdx) to subscribe the Notification provider to the `gift_card.created` event.

For example:

```ts title="src/loaders/gift-card-event.ts"
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
    "gift_card.created", 
    "<NOTIFICATION_PROVIDER_IDENTIFIER>"
  )
}
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider. For example, `sendgrid`.

:::note

You can learn more about handling events with the Notification Service using [this documentation](../../../references/notification/classes/notification.AbstractNotificationService.mdx).

:::
