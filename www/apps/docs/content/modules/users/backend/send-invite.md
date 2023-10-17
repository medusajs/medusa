---
description: "Learn how to send an invitation email to an invited user. This guide uses SendGrid as an example."
addHowToData: true
---

# How to Send an Invitation Email

In this document, you’ll learn how to send an invitation email to an invited user.

## Overview

Users can be invited to join a store by other users. When a new invite is created, the `invite.created` event is triggered. This event is also triggered when an invite is resent.

This guide explains how to subscribe to that event and send an email to the new user with the invitation link. The guide uses SendGrid as an example of illustration, but you can use any other notification service.

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

:::tip

You can learn more about subscribers in the [Subscribers documentation](../../../development/events/subscribers.mdx).

:::

Create the file `src/subscribers/invite.ts` with the following content:

```ts title=src/subscribers/invite.ts
type InjectedDependencies = {
  // TODO add necessary dependencies
}

class InviteSubscriber {
  constructor(container: InjectedDependencies) {
    // TODO subscribe to event
  }
}

export default InviteSubscriber
```

You’ll be adding in the next step the necessary dependencies to the subscriber.

:::tip

You can learn more about dependency injection in [this documentation](../../../development/fundamentals/dependency-injection.md).

:::

---

## Step 2: Subscribe to the Event

In this step, you’ll subscribe to the `invite.created` event to send the user the invitation email.

There are two ways to do this:

### Method 1: Using the NotificationService

If the notification provider you’re using already implements the logic to handle this event, you can subscribe to the event using the `NotificationService`:

```ts title=src/subscribers/invite.ts
import { NotificationService } from "@medusajs/medusa"

type InjectedDependencies = {
  notificationService: NotificationService
}

class InviteSubscriber {
  constructor({ notificationService }: InjectedDependencies) {
    notificationService.subscribe(
      "invite.created", 
      "<NOTIFICATION_PROVIDER_IDENTIFIER>"
    )
  }
}

export default InviteSubscriber
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider.

:::tip

You can learn more about handling events with the Notification Service using [this documentation](../../../development/notification/create-notification-provider.md).

:::

### Method 2: Using the EventBusService

If the notification provider you’re using isn’t configured to handle this event, or you want to implement some other custom logic, you can subscribe to the event using the `EventBusService`:

```ts title=src/subscribers/invite.ts
import { EventBusService } from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService
}

class InviteSubscriber {
  constructor({ eventBusService }: InjectedDependencies) {
    eventBusService.subscribe(
      "invite.created", 
      this.handleInvite
    )
  }

  handleInvite = async (data: Record<string, any>) => {
    // TODO: handle event
  }
}

export default InviteSubscriber
```

When using this method, you’ll have to handle the logic of sending the invitation email inside the handler function, which in this case is `handleInvite`.

---

## Step 3: Handle the Event

The `handleInvite` method receives a `data` object as a parameter which is a payload emitted when the event was triggered. This object has the following properties:

- `id`: a string indicating the ID of the invite.
- `token`: a string indicating the token of the invite. This token is useful to pass along to a frontend link that can be used to accept the invite.
- `user_email`: a string indicating the email of the invited user.

In this method, you should typically send an email to the invited user. You can place any content in the email, but typically you would include a link to your frontend that allows the invited user to enter their details and accept the invite.

### Example: Using SendGrid

For example, you can implement this subscriber to send emails using SendGrid:

```ts title=src/subscribers/invite.ts
import { EventBusService } from "@medusajs/medusa"

type InjectedDependencies = {
  eventBusService: EventBusService
  sendgridService: any
}

class InviteSubscriber {
  protected sendGridService: any

  constructor({ 
    eventBusService,
    sendgridService, 
  }: InjectedDependencies) {
    this.sendGridService = sendgridService
    eventBusService.subscribe(
      "invite.created", 
      this.handleInvite
    )
  }

  handleInvite = async (data: Record<string, any>) => {
    this.sendGridService.sendEmail({
      templateId: "send-invite",
      from: "hello@medusajs.com",
      to: data.user_email,
      dynamic_template_data: {
        // any data necessary for your template...
        token: data.token,
      },
    })
  }
}

export default InviteSubscriber
```

Notice that you should replace the values in the object passed to the `sendEmail` method:

- `templateId`: Should be the ID of your invitation email template in SendGrid.
- `from`: Should be the from email.
- `to`: Should be the invited user’s email.
- `data`: Should be an object holding any data that should be passed to your SendGrid email template. In the example above, you pass the token, which you can use in the SendGrid template to format the frontend link (for example, `<FRONTEND_LINK>/invite?token={{token}}`, where `<FRONTEND_LINK>` is your frontend’s hostname.)
