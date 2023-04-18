---
description: 'Learn how to create a subscriber in Medusa. You can use subscribers to implement functionalities like sending an order confirmation email.'
addHowToData: true
---

# How to Create a Subscriber

In this document, you’ll learn how to create a [Subscriber](./subscribers.mdx) in Medusa that listens to events to perform an action.

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

:::tip

For the `order.placed` event, the `data` object won't contain other order data. Only the ID of the order. You can retrieve the order information using the `orderService`.

:::

### Subscriber ID

The `subscribe` method of the `eventBusService` accepts a third optional parameter which is a context object. This object has a property `subscriberId` with its value being a string. This ID is useful when there is more than one handler method attached to a single event or if you have multiple Medusa backends running. This allows the events bus service to differentiate between handler methods when retrying a failed one.
If a subscriber ID is not passed on subscription, all handler methods are run again. This can lead to data inconsistencies or general unwanted behavior in your system. On the other hand, if you want all handler methods to run again when one of them fails, you can omit passing a subscriber ID.

An example of using the subscribe method with the third parameter:

```ts
eventBusService.subscribe("order.placed", this.handleOrder, {
  subscriberId: "my-unique-subscriber",
})
```

---

## Using Services in Subscribers

You can access any service through the dependencies injected to your subscriber’s constructor.

For example:

```ts title=src/subscribers/orderNotifier.ts
class OrderNotifierSubscriber {
  constructor({ productService, eventBusService }) {
      this.productService = productService

      eventBusService.subscribe(
        "order.placed", 
        this.handleOrder
      )
  }
  // ...
}
```

You can then use `this.productService` anywhere in your subscriber’s methods. For example:

```ts title=src/subscribers/orderNotifier.ts
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

- [Create a Plugin](../plugins/create.md)