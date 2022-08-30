# How to Create a Notification Provider

In this document, you’ll learn how to add a Notification Provider to your Medusa server. If you’re unfamiliar with the Notification architecture in Medusa, it is recommended to check out the [architecture overview](overview.md) first.

## Overview

A Notification Provider is the custom or third-party service used to handle sending alerts to customers or users when an event occurs.

For example, you can use SendGrid to send a confirmation email to a customer after they place an order. SendGrid in this example is a Notification Provider.

:::tip

If you’re interested in using SendGrid to send Notifications, you can use the [SendGrid](../../../add-plugins/sendgrid.mdx) plugin instead of using your own.

:::

Adding a Notification Provider is as simple as creating a [Service](../services/create-service.md) file in `src/services`. A Notification Provider is essentially a Service that extends the `NotificationService` from `medusa-interfaces`.

:::info

Notification Providers are loaded and installed at the server startup.

:::

After creating the Notification Provider Service, you must create a [Subscriber](../subscribers/create-subscriber.md) that subscribes the Notification Provider to specific events.

## Prerequisites

Before you start creating a Notification Provider, you need to install a [Medusa server](../../../quickstart/quick-start.md).

You also need to install and configure Redis. You can check out the documentation “[Set Up Your Development Environment](../../../tutorial/0-set-up-your-development-environment.mdx)” for help.

## Create a Notification Provider

The first step to creating a Notification Provider is to create a file in `src/services` with the following content:

```jsx
import { NotificationService } from "medusa-interfaces";

class EmailSenderService extends NotificationService {

}

export default EmailSenderService;
```

Where `EmailSenderService` is the name of your Notification Provider Service.

Notification Providers must extend `NotificationService` from `medusa-interfaces`.

:::info

Following the naming convention of Services, the name of the file should be the slug name of the Notification Provider, and the name of the class should be the camel case name of the Notification Provider suffixed with “Service”. In the example above, the name of the file should be `email-sender.js`. You can learn more in the [service documentation](../services/create-service.md).

:::

### identifier

Notification Provider Services must have a static property `identifier`.

The `NotificationProvider` entity has 2 properties: `identifier` and `is_installed`. The value of the `identifier` property in the Service class is used when the Notification Provider is created in the database.

The value of this property is also used later when you want to subscribe the Notification Provider to events in a Subscriber.

For example, in the class you created in the previous code snippet you can add the following property:

```jsx
static identifier = "email-sender";
```

### constructor

You can use the `constructor` of your Notification Provider to have access to different Services in Medusa through dependency injection.

You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the Service.

Additionally, if you’re creating your Notification Provider as an external plugin to be installed on any Medusa server and you want to access the options added for the plugin, you can access it in the constructor. The options are passed as a second parameter.

:::info

You can learn more about plugins and how to create them in the [Plugins](../plugins/overview.md) documentation.

:::

Continuing on with the previous example, if you want to use the [`OrderService`](../../../references/services/classes/OrderService.md) later when sending notifications, you can inject it into the constructor:

```jsx
constructor({ orderService }, options) {
  //you can access options here in case you're
  //using a plugin
  super();

  this.orderService = orderService;
}
```

### sendNotification

When an event is triggered that your Notification Provider is registered as a handler for, the [`NotificationService`](../../../references/services/classes/NotificationService.md) in Medusa’s core will execute the `sendNotification` method of your Notification Provider.

In this method, you can perform the necessary operation to send the Notification. Following the example above, you can send an email to the customer when they place an order.

This method receives 3 parameters:

1. `eventName`: This is the name of the event that was triggered. For example, `order.placed`.
2. `eventData`: This is the data payload of the event that was triggered. For example, if the `order.placed` event is triggered, the `eventData` object contains the property `id` which is the ID of the order that was placed.
3. `attachmentGenerator`: If you’ve previously attached a generator to the `NotificationService` using the [`registerAttachmentGenerator`](../../../references/services/classes/NotificationService.md#registerattachmentgenerator) method, you have access to it here. You can use the `attachmentGenerator` to generate on-demand invoices or other documents. The default value of this parameter is null.

:::info

You can learn more about what events are triggered in Medusa and their data payload in the [Events List](../subscribers/events-list.md) documentation.

:::

This method must return an object containing two properties:

1. `to`: a string that represents the receiver of the Notification. For example, if you sent an email to the customer then `to` is the email address of the customer. In other cases, it might be a phone number or a username.
2. `data`: an object that contains the data used to send the Notification. For example, if you sent an order confirmation email to the customer, then the `data` object might include the order items or the subject of the email. This `data` is necessary if the notification is resent later as you can use the same data.

Continuing with the previous example you can have the following implementation of the `sendNotification` method:

```jsx
async sendNotification(eventName, eventData, attachmentGenerator) {
  if (eventName === 'order.placed') {
    //retrieve order
    const order = await this.orderService.retrieve(eventData.id);
    //TODO send email

    console.log('Notification sent');
    return {
      to: order.email,
      data: {
        //any data necessary to send the email
        //for example:
        subject: 'You placed a new order!',
        items: order.items
      }
    };
  }
}
```

In this code snippet, you check first if the event is `order.placed`. This can be helpful if you’re handling multiple events using the same Notification Provider.

You then retrieve the order using the ID and send the email. Here, the logic related to sending the email is not implemented as it is generally specific to your Notification Provider.

Finally, you return an object with the `to` property set to the customer email and the `data` property is an object that contains data necessary to send the email such as a `subject` or `items`.

:::note

The `to` and `data` properties are used in the `NotificationService` in Medusa’s core to create a new `Notification` record in the database. You can learn more about the `Notification` entity in the [Architecture Overview](overview.md#notification-entity-overview) documentation.

:::

### resendNotification

Using the [Resend Notification endpoint](https://docs.medusajs.com/api/admin/#tag/Notification/operation/PostNotificationsNotificationResend), an admin user can resend a Notification to the customer. The [`NotificationService`](../../../references/services/classes/NotificationService.md) in Medusa’s core then executes the `resendNotification` method in your Notification Provider.

This method receives 3 parameters:

1. `notification`: This is the original Notification record that was created after you sent the notification with `sendNotification`. You can get an overview of the entity and its attributes in the [architecture overview](overview.md#notification-entity-overview), but most notably it includes the `to` and `data` attributes which are populated originally using the `to` and `data` properties of the object you return in `sendNotification`.
2. `config`: In the Resend Notification endpoint you may specify an alternative receiver of the notification using the `to` request body parameter. For example, you may want to resend the order confirmation email to a different email. If that’s the case, you have access to it in the `config` parameter object. Otherwise, `config` will be an empty object.
3. `attachmentGenerator`: If you’ve previously attached a generator to the Notification Service using the [`registerAttachmentGenerator`](../../../references/services/classes/NotificationService.md#registerattachmentgenerator) method, you have access to it here. You can use the `attachmentGenerator` to generate on-demand invoices or other documents. The default value of this parameter is null.

Similarly to the `sendNotification` method, this method must return an object containing two properties:

1. `to`: a string that represents the receiver of the Notification. You can either return the same `to` available in the `notification` parameter or the updated one in the `config` parameter.
2. `data`: an object that contains the data used to send the Notification. You can either return the same `data` in the `notification` parameter or make any necessary updates to it.

Continuing with the previous example you can have the following implementation of the `resendNotification` method:

```jsx
resendNotification(notification, config, attachmentGenerator) {
  //check if the receiver of the notification should be changed
  const to = config.to ? config.to : notification.to;

  //TODO resend the notification using the same data that is saved under notification.data

  console.log('Notification resent');
  return {
    to,
    data: notification.data //you can also make changes to the data
  }
}
```

In the above snippet, you check if the `to` should be changed by checking if the `config` parameter has a `to` property. Otherwise, you keep the same `to` address stored in the `notification` parameter.

You then resend the email. Here, the logic related to sending the email is not implemented as it is generally specific to your Notification Provider.

Finally, you return an object with the `to` property set to the email (either new or old) and the `data` property is the same data used before to send the original notification. you can alternatively make any changes to the data.

:::note

The `to` and `data` properties are used in the `NotificationService` in Medusa’s core to create a new `Notification` record in the database. No changes are made to the original `Notification` record created after the `sendNotification` method. This new record is associated with the original `Notification` record using the `parent_id` attribute in the entity. You can learn more about the `Notification` entity in the [Architecture Overview](overview.md#notification-entity-overview) documentation.

:::

## Create a Subscriber

After creating your Notification Provider Service, you must create a Subscriber that registers this Service as a notification handler of events.

:::note

This section will not cover the basics of Subscribers. You can read the [Subscribers](../subscribers/create-subscriber.md) documentation to learn more about them and how to create them.

:::

Following the previous example, to make sure the `email-sender` Notification Provider handles the `order.placed` event, create the file `src/subscribers/notification.js` with the following content:

```jsx
class NotificationSubscriber {
  constructor({ notificationService }) {
    notificationService.subscribe('order.placed', 'email-sender');
  }
}

export default NotificationSubscriber;
```

This subscriber accesses the `notificationService` using dependency injection. The `notificationService` contains a `subscribe` method that accepts 2 parameters. The first one is the name of the event to subscribe to, and the second is the identifier of the Notification Provider that is subscribing to that event.

:::tip

Notice that the value of the `identifier` static property defined in the `EmailSenderService` is used to register the Notification Provider to handle the `order.placed` event.

:::

## Test Sending Notifications with your Notification Provider

Make sure you've configured Redis with your Medusa server as explained in the Prerequisites section and that the Redis service is running.

Then, start by running your Medusa server:

```bash
npm run start
```

Then, place an order either using the [REST APIs](https://docs.medusajs.com/api/store) or using the storefront.

:::tip

If you don’t have a storefront installed you can get started with either our [Next.js](../../../starters/nextjs-medusa-starter.md) or [Gatsby](../../../starters/gatsby-medusa-starter.md) starter storefronts in minutes.

:::

After placing an order, you can see in your console the message “Notification Sent”. If you added your own notification sending logic, you should receive an email or alternatively the type of notification you’ve set up.

## Test Resending Notifications with your Notification Provider

To test resending a notification, first, retrieve the ID of the notification you just sent using the [List Notifications admin endpoint](https://docs.medusajs.com/api/admin/#tag/Notification/operation/GetNotifications). You can pass as a body parameter the `to` or `event_name` parameters to filter out the notification you just sent.

:::tip

You must be authenticated as an admin user before sending this request. You can use the [Authenticate a User](https://docs.medusajs.com/api/admin) endpoint to get authenticated.

:::

![List Notifications Request](https://i.imgur.com/iF1rZX1.png)

Then, send a request to the [Resend Notification](https://docs.medusajs.com/api/admin/#tag/Notification/operation/PostNotificationsNotificationResend) endpoint using the ID retrieved from the previous request. You can pass the `to` parameter in the body to change the receiver of the notification. You should see the message “Notification Resent” in your console and if you implemented your own logic for resending the notification it will be resent.

![Resend Notifications Request](https://i.imgur.com/0zFfPed.png)

This request returns the same notification object as the List Notifications endpoint, but it now has a new object in the `resends` array. This is the resent notification. If you supplied a `to` parameter in the request body, you should see its value in the `to` property of the resent notification object.

## What’s Next 🚀

- Check out the [list of events](../subscribers/events-list.md) you can listen to.
- Check out the [SendGrid](../../../add-plugins/sendgrid.mdx) plugin for easy integration of email notifications.
- Learn how to [create your own plugin](../plugins/create.md).
- Learn more about [Subscribers](../subscribers/create-subscriber.md) and [Services](../services/create-service.md).
