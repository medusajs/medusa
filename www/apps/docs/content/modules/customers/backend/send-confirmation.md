---
description: 'Learn how to send a confirmation email to the customer after they sign up. This guide uses SendGrid as an example Notification provider.'
addHowToData: true
---

# How to Send Sign Up Confirmation Email

In this document, you’ll learn how to send a confirmation email to the customer after they sign up.

## Overview

When a customer registers, the event `customer.created` is triggered. You can then listen to this event in a subscriber to perform an action, such as send the customer a confirmation email.

This guide will explain how to create the subscriber and how to use SendGrid to send the confirmation email. SendGrid is only used to illustrate how the process works, but you’re free to use any other notification service.

---

## Prerequisites

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

Create the file `src/subscribers/customer-confirmation.ts` with the following content:

```ts title=src/subscribers/customer-confirmation.ts
type InjectedDependencies = {
  // TODO add necessary dependencies
}

class CustomerConfirmationSubscriber {
  constructor(container: InjectedDependencies) {
    // TODO subscribe to event
  }
}

export default CustomerConfirmationSubscriber
```

You’ll be adding in the next step the necessary dependencies to the subscriber.

:::note

You can learn more about dependency injection in [this documentation](../../../development/fundamentals/dependency-injection.md).

:::

---

## Step 2: Subscribe to the Event

In this step, you’ll subscribe to the `customer.created` event to send the customer a confirmation email.

There are two ways to do this:

### Method 1: Using the NotificationService

If the notification provider you’re using already implements the logic to handle this event, you can subscribe to the event using the `NotificationService`:

```ts title=src/subscribers/customer-confirmation.ts
import { NotificationService } from "@medusajs/medusa"

type InjectedDependencies = {
  notificationService: NotificationService
}

class CustomerConfirmationSubscriber {
  constructor({ notificationService }: InjectedDependencies) {
    notificationService.subscribe(
      "customer.created", 
      "<NOTIFICATION_PROVIDER_IDENTIFIER>"
    )
  }
}

export default CustomerConfirmationSubscriber
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider.

:::note

You can learn more about handling events with the Notification Service using [this documentation](../../../development/notification/create-notification-provider.md).

:::

### Method 2: Using the EventBusService

If the notification provider you’re using isn’t configured to handle this event, or you want to implement some other custom logic, you can subscribe to the event using the `EventBusService`:

```ts title=src/subscribers/customer-confirmation.ts
import { Customer, EventBusService } from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService
}

class CustomerConfirmationSubscriber {
  constructor({ eventBusService }: InjectedDependencies) {
    eventBusService.subscribe(
      "customer.created", 
      this.handleCustomerConfirmation
    )
  }

  handleCustomerConfirmation = async (data: Customer) => {
    // TODO: handle event
  }
}

export default CustomerConfirmationSubscriber
```

When using this method, you’ll have to handle the logic of sending the confirmation email to the customer inside the handler function, which in this case is `handleCustomerConfirmation`.

## Step 3: Handle the Event

The `handleCustomerConfirmation` method receives a `data` object as a parameter which is a payload emitted when the event was triggered. This object is the entire customer object. So, you can find in it fields like `first_name`, `last_name`, `email`, and more.

In this method, you should typically send an email to the customer. You can place any content in the email, such as welcoming them to your store or thanking them for registering.

### Example: Using SendGrid

For example, you can implement this subscriber to send emails using SendGrid:

```ts title=src/subscribers/customer-confirmation.ts
import { Customer, EventBusService } from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService,
  sendgridService: any
}

class CustomerConfirmationSubscriber {
  protected sendGridService: any

  constructor({
    eventBusService,
    sendgridService,
  }: InjectedDependencies) {
    this.sendGridService = sendgridService
    eventBusService.subscribe(
      "customer.created", 
      this.handleCustomerConfirmation
    )
  }

  handleCustomerConfirmation = async (data: Customer) => {
    this.sendGridService.sendEmail({
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
}

export default CustomerConfirmationSubscriber
```

Notice that you should replace the values in the object passed to the `sendEmail` method:

- `templateId`: Should be the ID of your confirmation email template in SendGrid.
- `from`: Should be the from email.
- `to`: Should be the customer’s email.
- `data`: Should be an object holding any data that should be passed to your SendGrid email template.
