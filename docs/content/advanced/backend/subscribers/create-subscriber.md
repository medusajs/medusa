---

title: Create a Subscriber

---

# Create a Subscriber

In this document, you’ll learn how you create a subscriber in your Medusa server that listens to events to perform an action.

## Overview

In Medusa, there are events that are emitted when a certain action occurs. For example, if a customer places an order, the `order.placed` event is emitted with the order data. 

The purpose of these events is to allow other parts of the platform, or third-party integrations, to listen to those events and perform a certain action. That is done by creating subscribers.

Subscribers register handlers for an events and allows you to perform an action when that event occurs. For example, if you want to send your customer an email when they place an order, then you can listen to the `order.placed` event and send the email when the event is emitted.

Natively in Medusa there are subscribers to handle different events. However, you can also create your own custom subscribers. 

Custom subscribers reside in your project's `src/subscribers` directory. Files here should export classes, which will be treated as subscribers by Medusa. By convention, the class name should end with `Subscriber` and the file name should be the camel-case version of the class name without `Subscriber`. For example, the `WelcomeSubscriber` class is in the file `src/subscribers/welcome.js`.

Whenever an event is emitted, the subscriber’s registered handler method is executed. The handler method receives as a parameter an object that holds data related to the event. For example, if an order is placed the `order.placed` event will be emitted and all the handlers will receive the order id in the parameter object.

## Prerequisites

Medusa's event system works by pushing data to a Queue that each handler then gets notified of. The queuing system is based on Redis and you will therefore need to make sure that [Redis](https://redis.io) is installed and configured for your Medusa project.

Then, you need to set your Redis URL in your Medusa server. By default, the Redis URL is `redis://localhost:6379`. If you use a different one, set the following environment variable in `.env`:

```bash
REDIS_URL=<YOUR_REDIS_URL>
```

After that, in `medusa-config.js`, you’ll need to comment out the following line:

```jsx
module.exports = {
  projectConfig: {
    redis_url: REDIS_URL, //this line is commented out
    ...
  }
}
```

After that, you are able to listen to events on your server.

## Implementation

After creating the file under `src/subscribers`, in the constructor of your subscriber, you should listen to events using `eventBusService.subscribe` , where `eventBusService` is a service injected into your subscriber’s constructor. 

The `eventBusService.subscribe` method receives the name of the event as a first parameter and as a second parameter a method in your subscriber that will handle this event.

For example, here is the `OrderNotifierSubscriber` class which is created in `src/subscribers/orderNotifier.js`:

```jsx
class OrderNotifierSubscriber {
  constructor({ eventBusService }) {
    eventBusService.subscribe("order.placed", this.handleOrder);
  }

  handleOrder = async (data) => {
    console.log("New Order: " + data.id)
  };
}

export default OrderNotifierSubscriber;
```

This subscriber will register the method `handleOrder` as one of the handlers of the `order.placed` event. The method `handleOrder` will be executed every time an order is placed, and it will receive the order ID in the `data` parameter. You can then use the order’s details to perform any kind of task you need.

:::note

The `data` object will not contain other order data. Only the ID of the order. You can retrieve the order information using the `orderService`.

:::

## Using Services in Subscribers

You can access any service through the dependencies injected to your subscriber’s constructor. 

For example:

```jsx
constructor({ productService, eventBusService }) {
    this.productService = productService;

    eventBusService.subscribe("order.placed", this.handleOrder);
}
```

You can then use `this.productService` anywhere in your subscriber’s methods.

## What’s Next 🚀

- [Learn how to create a service.](/advanced/backend/services/create-service)
