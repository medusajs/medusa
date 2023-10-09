---
description: 'Learn how to send a gift card code to the customer. Once the customer purchases a gift card, an email can be sent with the code so that they can redeem the gift card.'
addHowToData: true
---

# How to Send Gift Card Code to Customer

In this document, you’ll learn how to send a customer the gift card code they purchased.

## Overview

Once the customer purchases a gift card, they should receive the code of the gift card so that they can use it in future purchases.

Typically, the code would be sent by email, however, you’re free to choose how you deliver the gift card code to the customer.

This document shows you how to track when a gift card has been purchased so that you can send its code to the customer.

:::tip

You can alternatively use the [SendGrid](../../../plugins/notifications/sendgrid.mdx) plugin, which handles sending the email automatically.

:::

---

## Prerequisites

### Medusa Components

It's assumed that you already have a Medusa backend installed and set up. If not, you can follow the [quickstart guide](../../../development/backend/install.mdx) to get started. The Medusa backend must also have an event bus module installed, which is available when using the default Medusa backend starter.

### Notification Provider

To send an email or another type of notification method, you must have a notification provider installed or configured. You can either install an existing plugin or [create your own](../../../development/notification/create-notification-provider.md).

---

## Step 1: Create a Subscriber

To subscribe to and handle an event, you must create a subscriber.

:::info

You can learn more about subscribers in the [Subscribers](../../../development/events/subscribers.mdx) documentation.

:::

Create the file `src/subscribers/gift-card.ts` with the following content:

```ts title=src/subscribers/gift-card.ts
type InjectedDependencies = {
  // TODO add necessary dependencies
}

class GiftCardSubscriber {
  constructor(container: InjectedDependencies) {
    // TODO subscribe to event
  }
}

export default GiftCardSubscriber
```

You’ll be adding in the next step the necessary dependencies to the subscriber.

:::info

You can learn more about [dependency injection](../../../development/fundamentals/dependency-injection.md) in this documentation.

:::

---

## Step 2: Subscribe to the Event

In this step, you’ll subscribe to the event `gift_card.created` to send the customer a notification about their gift card.

There are two ways to do this:

### Method 1: Using the NotificationService

If the notification provider you’re using already implements the logic to handle this event, you can subscribe to the event using the `NotificationService`:

```ts title=src/subscribers/gift-card.ts
import { NotificationService } from "@medusajs/medusa"

type InjectedDependencies = {
  notificationService: NotificationService
}

class GiftCardSubscriber {
  constructor({ notificationService }: InjectedDependencies) {
    notificationService.subscribe(
      "gift_card.created", 
      "<NOTIFICATION_PROVIDER_IDENTIFIER>"
    )
  }
}

export default GiftCardSubscriber
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider. For example, if you’re using SendGrid, the identifier is `sendgrid`.

:::info

You can learn more about handling events with the Notification Service using [this documentation](../../../development/notification/create-notification-provider.md).

:::

### Method 2: Using the EventBusService

If the notification provider you’re using isn’t configured to handle this event, or you want to implement some other custom logic, you can subscribe to the event using the `EventBusService`:

```ts title=src/subscribers/gift-card.ts
import { 
  EventBusService,
  GiftCardService,
} from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService
  giftCardService: GiftCardService
}

class GiftCardSubscriber {
  giftCardService: GiftCardService

  constructor({ 
    eventBusService, 
    giftCardService, 
  }: InjectedDependencies) {
    this.giftCardService = giftCardService
    eventBusService.subscribe(
      "gift_card.created", this.handleGiftCard)
  }

  handleGiftCard = async (data) => {
    const giftCard = await this.giftCardService.retrieve(
      data.id
    )
    // TODO send customer the gift card code
  }
}

export default GiftCardSubscriber
```

When using this method, you’ll have to handle the logic of sending the code to the customer inside the handler function, which in this case is `handleGiftCard`.

The `handleGiftCard` event receives a `data` object as a parameter. This object holds the `id` property which is the ID of the gift card. You can retrieve the full gift card object using the [GiftCardService](../../../references/services/classes/GiftCardService.md)