---
description: 'Learn how to create a subscriber in the Medusa server. You can use subscribers to implement functionalities like sending an order confirmation email.'
addHowToData: true
---

# How to Create a Subscriber

In this document, you’ll learn how to create a [Subscriber](overview.md) in your Medusa server that listens to events to perform an action.

## Prerequisites

Medusa's event system works by pushing data to a Queue that each handler then gets notified of. The queuing system is based on Redis, so it's required for subscribers to work.

You can learn how to [install Redis](../../../tutorial/0-set-up-your-development-environment.mdx#redis) and [configure it with Medusa](../../../usage/configurations.md#redis) before you get started.

---

## Implementation

A subscriber is a TypeScript or JavaScript file that is created under `src/subscribers`. Its file name, by convension, should be the class name of the subscriber without the word `Subscriber`. For example, if the subscriber is `HelloSubscriber`, the file name should be `hello.ts`.

After creating the file under `src/subscribers`, in the constructor of your subscriber, listen to events using `eventBusService.subscribe` , where `eventBusService` is a service injected into your subscriber’s constructor.

The `eventBusService.subscribe` method receives the name of the event as a first parameter and as a second parameter a method in your subscriber that will handle this event.

For example, here is the `OrderNotifierSubscriber` class created in `src/subscribers/orderNotifier.ts`:

```ts title=src/subscribers/orderNotifier.ts
class OrderNotifierSubscriber {
  constructor({ eventBusService }) {
    eventBusService.subscribe("order.placed", this.handleOrder)
  }

  handleOrder = async (data) => {
    console.log("New Order: " + data.id)
  }
}

export default OrderNotifierSubscriber
```

This subscriber registers the method `handleOrder` as one of the handlers of the `order.placed` event. The method `handleOrder` will be executed every time an order is placed. It receives the order ID in the `data` parameter. You can then use the order’s details to perform any kind of task you need.

:::note

The `data` object won't contain other order data. Only the ID of the order. You can retrieve the order information using the `orderService`.

:::

---

## Using Services in Subscribers

You can access any service through the dependencies injected to your subscriber’s constructor.

For example:

```ts
class OrderNotifierSubscriber {
  constructor({ productService, eventBusService }) {
      this.productService = productService

      eventBusService.subscribe("order.placed", this.handleOrder)
  }
  // ...
}
```

You can then use `this.productService` anywhere in your subscriber’s methods. For example:

```ts
class OrderNotifierSubscriber {
  // ...
  handleOrder = async (data) => {
    // ...
    const product = this.productService.list()
  }
}
```

:::note

When using attributes defined in the subscriber, such as the `productService` in the example above, you must use an arrow function to declare the method. Otherwise, the attribute will be undefined when used.

:::

---

## See Also

- [Events reference](events-list.md)
- [Create a Service](../services/create-service)
