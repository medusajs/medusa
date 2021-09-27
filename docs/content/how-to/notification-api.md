---
title: Notifications and automated flows
---

# Notification API and how to structure email flows

### Introduction

Plugins offer a way to extend and integrate the core functionality of Medusa. For a walkthrough of the implementation details behind these, please see [Plugins in Medusa](https://docs.medusa-commerce.com/how-to/plugins).

Medusa makes it possible for plugins to implement the Notification API. The API allows for different types of implementations of notifications (emails, text messages, Slack messages, etc), that are sent as a reaction to events in Medusa. All Notifications are stored in the database with information about the receiver of the notification and what plugin was in charge of sending it. This allows merchants to resend notifications, but also gives an overview of what communication has been sent to customers.

### How it works

The Notification API works by subscribing to all events that are emitted to the Event Bus and channeling them through to notification plugins that listen to the events. In a plugin you can subscribe to a notification event by exporting a subscriber class that calls `notificationService.subscribe`:

```jsx
// src/subscribers/my-notification.js

class MyNotification {
  constructor({ notificationService }) {
    // Subscribe to order.placed events
    notificationService.subscribe("order.placed", "my-service");
  }
}

export default MyNotification;
```

The above code tells the notification service to send `order.placed` events to the `my-service` notification service implemented in your plugin.

For a plugin to work with the Notification API you must implement 2 methods `sendNotification` and `resendNotification`;

```jsx
// src/services/my-notification.js

class MyService extends NotificationService {
  static identifier = "my-service";

  constructor({ orderService }, options) {
    super();

    this.options_ = options;
    this.orderService_ = orderService;
  }

  async sendNotification(eventName, eventData, attachmentGenerator) {
    let sendData;
    switch (eventName) {
      case "order.placed":
        sendData = await this.orderService_.retrieve(eventData.id);
        break;
      default:
        // If the return value is undefined no notification will be stored
        return;
    }

    await CoolEmailSender.send({
      email: sendData.email,
      templateData: sendData,
    });

    return { to: sendData.email, data: sendData };
  }

  async resendNotification(notification, config, attachmentGenerator) {
    const recipient = config.to || notification.to;

    await CoolEmailSender.send({
      email: recipient,
      templateData: notification.data,
    });

    return { to: sendOptions.to, data: notification.data };
  }
}

export default MyService;
```

> **Note:** a notification service must have a static property called `identifier` this is used to determine which classes are called when subscribing to different events. In this case the service identifier is `my-service` so to subscribe to notifications you must use:
> `notificationService.subscribe([eventname], "my-service")`

The above class is an example implementation of a NotificationService. It uses a fictional email service called `CoolEmailSender` to send emails to a customer whenever an order is placed. The `sendNotification` implementation gets the event name and fetches relevant data based on what event is being processed; in this case it retrieves an order, which is later used when requesting `CoolEmailSender` to dispatch an email. The address to send the email to is likewise fetched from the order.

The return type of `sendNotification` and `resendNotification` is an object with `to` and `data`. The `to` prop should identify the receiver of the notification, in this case an email, but it could also be a phone number, an ID, a channel name or something similar depending on the type of notification provider. The `data` prop contains the data as it was gathered when the notification was sent; the same data will be provided if the notification is resent at a later point.

When `resendNotification` is called the original Notification is provided along with a config object. The config object may contain a `to` property that can be used to overwrite the original `to`.

## Creating automated notification flows

When running an ecommerce store you typically want to send communication to your customers when different events occur, these include messages like order confirmations and shipping updates. With Medusa you can create transactional notifications as a reaction to a wide spectrum of events, allowing you to automate communication and processes. An example of a flow that can be implemented using Medusa's Notification API is automated return flows. Below is an outline of how an automated return flow might work.

- Customer requests a return with `POST /store/returns`
- Notification Service listens for `order.return_requested` and sends email to the customer with a return invoice and return label generated by fulfillment provider
- Customer returns items triggering `return.recieved`
- Notification Service listens for `return.received` and sends email to the customer with confirmation that their items have been received and that a refund has been issued.

Check out `medusa-plugin-sendgrid` for an Notification API implementation that works with Sendgrid.
