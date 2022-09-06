# Architecture Overview

This document gives an overview of the notification architecture and how it works.

## Introduction

Medusa provides a Notification API to mainly handle sending and resending notifications when an event occurs. For example, sending an email to the customer when they place an order.

The Notification architecture is made up of 2 main components: the Notification Provider and the Notification. Simply put, the Notification Provider handles the sending and resending of a Notification.

## Notification Provider

A Notification Provider is a provider that handles sending and resending of notifications. You can either create and integrate your own provider or install a Notification Provider through a third-party plugin.

An example of a notification provider is SendGrid. When an order is placed, the SendGrid plugin sends an email to the customer.

### How Notification Provider is Created

A Notification Provider is essentially a Medusa [Service](../services/create-service.md) with a unique identifier, and it extends the [`NotificationService`](../../../references/services/classes/NotificationService.md) provided by the `medusa-interfaces` package. It can be created as part of a [Plugin](../plugins/overview.md), or it can be created just as a Service file in your Medusa server.

As a developer, you mainly work with the Notification Provider when integrating a third-party service that handles notifications in Medusa.

When you run your Medusa server, the Notification Provider is registered on your server if it isn’t already. This means that it will be inserted into the `notification_provider` table in your database.

### NotificationProvider Entity Overview

The `NotificationProvider` entity only has 2 attributes: `id` and `is_installed`.

`id` is the value of the static property `identifier` defined inside the notification Service class.

`is_installed` indicates whether the Notification Provider is installed or not. When you install a Notification Provider, the value of this attribute is `true`.

If you installed a Notification provider and then removed the Service files or plugin that registered the Notification Provider, the Notification Provider remains in your database, but the value of the `is_installed` field changes to `false`.

## Notification

A notification is a form of an alert sent to the customers or users to inform them of an action that has occurred. For example, if an order is placed, the notification, in this case, can be an email that confirms their order and lists the order details.

Notifications can take on other forms such as an SMS or a Slack message.

### How Notification is Created

Notifications are created in the `NotificationService` class in Medusa’s core after the Notification has been handled by the Notification Provider. 

The data and additional details that the Notification Provider returns to the `NotificationService` is used to fill some of the attributes of the Notification in the database.

A Notification also represents a resent notification. So, when a notification is resent, a new one is created that references the original Notification as a parent. This Notification is also created by the `NotificationService` class.

### Notification Entity Overview

The 2 most important properties in the `Notification` entity are the `to` and `data` properties. 

The `to` property is a string that represents the receiver of the Notification. For example, if the Notification was sent to an email address, the `to` property holds the email address the Notification was sent to.

The `to` property can alternatively be a phone number or a chat username. It depends on the Notification Provider and how it sends the Notification.

The `data` property is an object that holds all the data necessary to send the Notification. For example, in the case of an order confirmation Notification, it can hold data related to the order.

The `data` property is useful when a notification is resent later. The same `data` can be used to resend the notification.

In the case of resent notifications, the resent notification has a `parent_id` set to the ID of the original Notification. The value of the `parent_id` property in the original Notification is `null`.

The `Notification` entity has some properties that determine the context of this Notification. This includes the `event_name` property which is the event that triggered the sending of this notification.

Additionally, the `resource_type` property is used to determine what resource this event is associated with. For example, if the `event_name` is `order.placed`, the `resource_type` is `order`.

You can also access the specific resource using the `resource_id` property, which is the ID of the resource. So, in case of the `order.placed` event, the `resource_id` is the ID of the order that was created.

The `Notification` entity also includes properties related to the receiver of the Notification. In case the receiver is a customer, the `customer_id` property is used to identify which customer.

## Automating Flows with Notifications

With Medusa you can create notifications as a reaction to a wide spectrum of events, allowing you to automate communication and processes. 

An example of a flow that can be implemented using Medusa's Notification API is automated return flows:

- A customer requests a return by sending a `POST` request to the `/store/returns` endpoint.
- The Notification Provider listens to the `order.return_requested` event and sends an email to the customer with a return invoice and return label generated by the Fulfillment Provider.
- The customer returns the items triggering the `return.recieved` event.
- The Notification Provider listens to the `return.received` event and sends an email to the customer with confirmation that their items have been received and that a refund has been issued.

## What’s Next 🚀

- Learn how to [create your own Notification Provider](how-to-create-notification-provider.md).
- Check out the [list of events](../subscribers/events-list.md) in Medusa.
- Check the [`NotificationService`](../../../references/services/classes/NotificationService.md) API reference for more details on how it works.
- Check out the [SendGrid](../../../add-plugins/sendgrid.mdx) Notification plugin.
- Learn more about [Subscribers](../subscribers/create-subscriber.md) and [Services](../services/create-service.md) in Medusa.
