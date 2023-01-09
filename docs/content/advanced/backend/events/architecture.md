# Events Architecture

In this document, you'll learn how the events system is implemented in Medusa.

## Overview

The events system in Medusa is built on a publish/subscribe architecture. The Medusa core publishes events when certain actions take place.

Those events can be subscribed to using subscribers. When you subscribe to an event, you can perform a task asynchronusly every time the event is triggered.

:::info

You can learn more about subscribers and their use cases in the [Subscribers](../subscribers/overview.md) documentation.

:::

---

## Publishing and Subscribing

The `EventBusService` is responsible for publishing and processing events.

:::note

The current implementation of the `EventBusService` is powered by Redis. However, an upcoming version of Medusa introduces an event bus module. This will allow you to use any publishing and subscribing provider. That will not change the general purpose and flow of the `EventBusService`.

:::

The `EventBusService` exposes two methods in its public API for event processing; `emit` and `subscribe`.

### emit

The `emit` method accepts as a first parameter the event name. It adds it to a Bull queue (powered by Redis) as a job, and processes it asynchronously.

The second parameter contains any data that should be emitted with the event. Subscribers that handle the event will receive that data as a method parameter.

The third parameter is an options object. It accepts options related to the number of retries if a subscriber handling the event fails, the delay time, and more. The options are explained in a [later section](#retrying-handlers)

The `emit` method has the following signature:

```ts
export default class EventBusService {
 // ...
 async emit<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown> & EmitOptions = { attempts: 1 }
  ): Promise<StagedJob | void>
}
```

Here's an example of how you can emit an event using the `EventBusService`:

```ts
eventBusService.emit(
 "product.created", 
 { id: "prod_..." }, 
 { attempts: 2 }
)
```

The `EventBusService` emits the event `product.created` by passing the event name as a first argument. An object is passed as a second argument which is the data passed to the event handler methods in subscribers. This object contains the ID of the product.

Options are passed in the third argument. The `attempt` property specifies how many times the subscriber should be retried if it fails (by default it's one).

### subscribe

The `subscribe` method will attach a handler method to the specified event, which is run when the event is triggered. It is usually used insde a subscriber class.

The `subscribe` method accepts the event name as the first parameter. This is the event that the handler method will attach to.

The second parameter is the handler method that will be triggered when the event is emitted.

The third parameter is an optional `context` parameter. It allows you to configure the ID of the handler method.

The `subscribe` method has the following signature:

```ts
export default class EventBusService {
 // ...
 subscribe(
    event: string | symbol,
    subscriber: Subscriber,
    context?: SubscriberContext
  ): this
}
```

Here's an example of how you can subscribe to an event using the `EventBusService`:

```ts title=src/subscribers/my.ts
import { EventBusService } from "@medusajs/medusa"

class MySubscriber {
 constructor({
  eventBusService: EventBusService,
 }) {
  eventBusService.subscribe("product.created", (data) => {
   // TODO handle event
   console.log(data.id)
  })
 }
}
```

In the constructor of a subscriber, you use the `EventBusService` to subscribe to the event `product.created`. In the handler method, you can perform a task every time the product is created. Notice how the handler method accepts the `data` as a parameter as explain in the previous section.

:::note

You can learn more about how to create a subscriber in [this documentation](../subscribers/create-subscriber.md)

:::

---

## Processing Events

In the `EventBusService` service, the `worker_` method defines the logic run for each event emitted into the queue.

By default, all handler methods to that event are retrieved and, for each of the them, the stored data provided as a second parameter in `emit` is passed as an argument.

---

## Retrying Handlers

A handler method might fail to process an event. This could happen because it communicates with a third party service currently down or due to an error in its logic.

In some cases, you might want to retry those failed handlers.

As briefly explained earlier, you can pass options when emitting an event as a third argument that are used to configure how the queue worker processes your job. If you pass  `attempts` upon emitting the event, the processing of a handler method is retried when it fails.

Aside from `attempts`, there are other options to futher configure the retry mechanism:

```ts
type EmitOptions = {
 delay?: number
 attempts: number
 backoff?: {
  type: "fixed" | "exponential"
  delay: number
 }
}
```

Here's what each of these options mean:

- `delay`: delay the triggering of the handler methods by a number of milliseconds.
- `attempts`: the number of times a subscriber handler should be retried when it fails.
- `backoff`: the wait time between each retry

### Note on Subscriber IDs

If you have more than one handler methods attached to a single event, or if you have multiple server instances running, you must pass a subscriber ID as a third parameter to the `subscribe` method. This allows the `EventBusService` to differentiate between handler methods when retrying a failed one.

If a subscriber ID is not passed on subscription, all handler methods are run again. This can lead to data inconsistencies or general unwanted behavior in your system.

On the other hand, if you want all handler methods to run again when one of them fails, you can omit passing a subscriber ID.

An example of passing a subscriber ID:

```ts title=src/subscribers/my.ts
import { EventBusService } from "@medusajs/medusa"

class MySubscriber {
 constructor({
  eventBusService: EventBusService,
 }) {
  eventBusService.subscribe(
   "product.created", 
   (data) => {
    // TODO handle event
    console.log(data.id)
   },
   "my-unique-subscriber")
 }
}
```

:::info

You can learn more about subscriber IDs in [Bull's documentation](https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd).

:::

---

## Database transactions

<!-- vale docs.Acronyms = NO -->

Transactions in Medusa ensure atomicity, consistency, isolation, and durability, or ACID, guarantees for operations in the Medusa core.

<!-- vale docs.Acronyms = YES -->

In many cases, [services](../services/overview.md) typically update resources in the database and emit an event within a transactional operation. To ensure that these events don't cause data inconsistencies (for example, a plugin subscribes to an event to contact a third-party service, but the transaction fails) the concept of a staged job is introduced.

Instead of events being processed immediately, they're stored in the database as a staged job until they're ready. In other words, until the transaction has succeeded.

This rather complex logic is abstracted away from the consumers of the `EventBusService`, but here's an example of the flow when an API request is made:

1. API request starts.
2. Transaction is initiated.
3. Service layer performs some logic.
4. Events are emitted and stored in the database for eventual processing.
5. Transaction is committed.
6. API request ends.
7. Events in the database become visible.

To pull staged jobs from the database, a separate enqueuer polls the database every three seconds to discover new visible jobs. These jobs are then added to the queue and processed as described in the [Processing](#processing-events) section earlier.

:::info

This pattern is heavily inspired by the [Transactionally-staged Job Drain described in this blog post](https://brandur.org/job-drain).

:::

---

## See Also

- [Events reference](../subscribers/events-list.md)
- [Subscribers overview](../subscribers/overview.md)
- [How to create a subscriber](../subscribers/create-subscriber.md)