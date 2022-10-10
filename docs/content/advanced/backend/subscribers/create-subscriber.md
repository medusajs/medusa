# Create a Subscriber

In this document, you’ll learn how to create a [Subscriber](overview.md) in your Medusa server that listens to events to perform an action.

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

## What’s Next

- [View the list of all events](events-list.md)
- [Learn how to create a service.](/advanced/backend/services/create-service)
