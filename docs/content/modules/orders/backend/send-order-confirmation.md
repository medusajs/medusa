---
description: 'Learn how to send an order confirmation email to the customer. This guide uses SendGrid as an example Notification provider.'
addHowToData: true
---

# How to Send Order Confirmation Email

In this document, you’ll learn how to send an order confirmation email to the customer.

## Overview

When an order is placed, the `order.placed` event is triggered. You can listen to this event in a subscriber to perform an action, such as send the customer an order confirmation email.

This guide explains how to create the subscriber and how to use SendGrid to send the confirmation email. SendGrid is only used to illustrate how the process works, but you’re free to use any other notification service.

:::note

SendGrid is already configured to send emails when an order has been placed. So, by installing and configuring the plugin, you don't need to actually handle sending the order confirmation email. It's used as an example here to illustrate the process only.

:::

---

## Prerequisites

### Medusa Backend

It’s assumed you already have the Medusa backend installed. If not, you can either use the [create-medusa-app command](../../../create-medusa-app.mdx) to install different Medusa tools, including the backend, or [install the backend only](../../../development/backend/install.mdx).

### Event Bus Module

The event bus module trigger the event to the listening subscribers. So, it’s required to have an event bus module installed and configured on your Medusa backend.

The [Local Event Bus module](../../../development/events/modules/local.md) works in a development environment. For production, it’s recommended to use the [Redis Event Bus module](../../../development/events/modules/redis.md).

### Notification Provider

As mentioned in the overview, this guide illustrates how to send the email using SendGrid. If you intend to follow along, you must have the [SendGrid plugin](../../../plugins/notifications/sendgrid.mdx) installed and configured.

You can also find other available Notification provider plugins in the [Plugins directory](https://medusajs.com/plugins/), or [create your own](../../../development/notification/create-notification-provider.md).

---

## Step 1: Create the Subscriber

To subscribe to and handle an event, you must create a subscriber.

:::note

You can learn more about subscribers in the [Subscribers documentation](../../../development/events/subscribers.mdx).

:::

Create the file `src/subscribers/order-confirmation.ts` with the following content:

```ts title=src/subscribers/order-confirmation.ts
type InjectedDependencies = {
  // TODO add necessary dependencies
}

class OrderConfirmationSubscriber {
  constructor(container: InjectedDependencies) {
    // TODO subscribe to event
  }
}

export default OrderConfirmationSubscriber
```

You’ll be adding in the next step the necessary dependencies to the subscriber.

:::note

You can learn more about dependency injection in [this documentation](../../../development/fundamentals/dependency-injection.md).

:::

---

## Step 2: Subscribe to the Event

In this step, you’ll subscribe to the `order.placed` event to send the customer an order confirmation email.

There are two ways to do this:

### Method 1: Using the NotificationService

If the notification provider you’re using already implements the logic to handle this event, you can subscribe to the event using the `NotificationService`:

```ts title=src/subscribers/order-confirmation.ts
import { NotificationService } from "@medusajs/medusa"

type InjectedDependencies = {
  notificationService: NotificationService
}

class OrderConfirmationSubscriber {
  constructor({ notificationService }: InjectedDependencies) {
    notificationService.subscribe(
      "order.placed", 
      "<NOTIFICATION_PROVIDER_IDENTIFIER>"
    )
  }
}

export default OrderConfirmationSubscriber
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider.

:::note

You can learn more about handling events with the Notification Service using [this documentation](../../../development/notification/create-notification-provider.md).

:::

### Method 2: Using the EventBusService

If the notification provider you’re using isn’t configured to handle this event, or you want to implement some other custom logic, you can subscribe to the event using the `EventBusService`:

```ts title=src/subscribers/order-confirmation.ts
import { EventBusService } from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService
}

class OrderConfirmationSubscriber {
  constructor({ eventBusService }: InjectedDependencies) {
    eventBusService.subscribe(
      "order.placed", 
      this.handleOrderConfirmation
    )
  }

  handleOrderConfirmation = async (
    data: Record<string, any>
  ) => {
    // TODO: handle event
  }
}

export default OrderConfirmationSubscriber
```

When using this method, you’ll have to handle the logic of sending the order confirmation email to the customer inside the handler function, which in this case is `handleOrderConfirmation`.

## Step 3: Handle the Event

The `handleOrderConfirmation` event receives a `data` object as a parameter. This object holds two properties:

- `id`: the ID of the order that was placed.
- `no_notification`: a boolean value indicating whether the customer should receive notifications about the order or not.

In this method, you should typically send an email to the customer if `no_notification` is enabled.

To retrieve the order's details, you can add the `OrderService` into `InjectedDependencies` and use it within `handleOrderConfirmation`. For example:

```ts title=src/subscribers/order-confirmation.ts
import { EventBusService, OrderService } from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService
  orderService: OrderService
}

class OrderConfirmationSubscriber {
  protected readonly orderService_: OrderService

  constructor({ 
    eventBusService, 
    orderService,
  }: InjectedDependencies) {
    this.orderService_ = orderService
    eventBusService.subscribe(
      "order.placed", 
      this.handleOrderConfirmation
    )
  }

  handleOrderConfirmation = async (
    data: Record<string, any>
  ) => {
    const order = await this.orderService_.retrieve(data.id, {
      // you can include other relations as well
      relations: ["items"],
    })
    // TODO: handle event
  }
}

export default OrderConfirmationSubscriber
```

After retrieving the order, you can add the logic necessary to send the email. In the email, you can include any content you want. For example, you can show the order's items or the order's status.

### Example: Using SendGrid

:::note

This example is only used to illustrate how the functionality can be implemented. As mentioned in the introduction, there's actually no need to implement this subscriber if you have the SendGrid plugin installed and configured, as it will automatically handle it.

:::

For example, you can implement this subscriber to send emails using SendGrid:

```ts title=src/subscribers/order-confirmation.ts
import { EventBusService, OrderService } from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService
  orderService: OrderService
  sendgridService: any
}

class OrderConfirmationSubscriber {
  protected readonly orderService_: OrderService
  protected readonly sendgridService_: any

  constructor({ 
    eventBusService, 
    orderService, 
    sendgridService,
  }: InjectedDependencies) {
    this.orderService_ = orderService
    this.sendgridService_ = sendgridService
    eventBusService.subscribe(
      "order.placed", 
      this.handleOrderConfirmation
    )
  }

  handleOrderConfirmation = async (
    data: Record<string, any>
  ) => {
    const order = await this.orderService_.retrieve(data.id, {
      // you can include other relations as well
      relations: ["items"],
    })
    this.sendgridService_.sendEmail({
      templateId: "order-confirmation",
      from: "hello@medusajs.com",
      to: order.email,
      data: {
        // any data necessary for your template...
        items: order.items,
        status: order.status,
      },
    })
  }
}

export default OrderConfirmationSubscriber
```

Notice that you should replace the values in the object passed to the `sendEmail` method:

- `templateId`: Should be the ID of your order confirmation email template in SendGrid.
- `from`: Should be the from email.
- `to`: Should be the email associated with the order.
- `data`: Should be an object holding any data that should be passed to your SendGrid email template.
