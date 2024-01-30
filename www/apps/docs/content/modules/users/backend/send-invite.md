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

You can also find other available Notification provider plugins in the [Plugins directory](https://medusajs.com/plugins/), or [create your own](../../../references/notification/classes/notification.AbstractNotificationService.mdx).

---

## Method 1: Using a Subscriber

To subscribe to an event, you must create a [subscriber](../../../development/events/subscribers.mdx).

Create the file `src/subscribers/invite-created.ts` with the following content:

```ts title="src/subscribers/invite-created.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
} from "@medusajs/medusa"

export default async function handleInviteCreated({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  // TODO: handle event
}

export const config: SubscriberConfig = {
  event: "invite.created",
  context: {
    subscriberId: "invite-created-handler",
  },
}
```

In this file, you export a configuration object indicating that the subscriber is listening to the `invite.created` event.

You also export a handler function `handleInviteCreated`. In the parameter it receives, the `data` object is the payload emitted when the event was triggered, which is an object of the following format:

```ts
{
  // string - ID of invite
  id
  // string - token generated to validate the invited user
  token,
  // string - email of invited user
  user_email
}
```

In this method, you should typically send an email to the user. You can place any content in the email, but should mainly include the invite token.

### Example: Using SendGrid

For example, you can implement this subscriber to send emails using SendGrid:

```ts title="src/subscribers/invite.ts"
import { 
  type SubscriberConfig, 
  type SubscriberArgs,
} from "@medusajs/medusa"

export default async function handleInviteCreated({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, string>>) {
  const sendGridService = container.resolve("sendgridService")

  sendGridService.sendEmail({
    templateId: "send-invite",
    from: "hello@medusajs.com",
    to: data.user_email,
    dynamic_template_data: {
      // any data necessary for your template...
      token: data.token,
    },
  })
}

export const config: SubscriberConfig = {
  event: "invite.created",
  context: {
    subscriberId: "invite-created-handler",
  },
}
```

Notice that you should replace the values in the object passed to the `sendEmail` method:

- `templateId`: Should be the ID of your invitation email template in SendGrid.
- `from`: Should be the from email.
- `to`: Should be the invited user’s email.
- `data`: Should be an object holding any data that should be passed to your SendGrid email template. In the example above, you pass the token, which you can use in the SendGrid template to format the frontend link (for example, `<FRONTEND_LINK>/invite?token={{token}}`, where `<FRONTEND_LINK>` is your frontend’s hostname.)

---

## Method 2: Using the NotificationService

If the notification provider you’re using already implements the logic to handle this event, you can create a [Loader](../../../development/loaders/overview.mdx) to subscribe the Notification provider to the `invite.created` event.

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
    "invite.created", 
    "<NOTIFICATION_PROVIDER_IDENTIFIER>"
  )
}
```

Where `<NOTIFICATION_PROVIDER_IDENTIFIER>` is the identifier for your notification provider. For example, `sendgrid`.

:::note

You can learn more about handling events with the Notification Service using [this documentation](../../../references/notification/classes/notification.AbstractNotificationService.mdx).

:::
