The events system in Medusa is built on a publish/subscribe architecture. Events are published by the core when certain actions take place. Those events can be subscribed to, which means, that a reactive action is performed asynchronously. It is useful in a variety of scenarios including but not limited to processing heavy jobs in the background and reacting to specific events in a custom project or plugin. 

### Publishing and subscribing

The `EventBusService` is responsible for publishing and processing events.

> The current implementation of the `EventBusService` is powered by Redis. We will soon introduce an event bus module, allowing you to use any pub/sub provider. Therefore, the following documentation is based on the Redis implementation. Still, the general purpose and flows of the `EventBusService` will remain the same with the module implementation.

The `EventBusService` exposes two methods in its public API for event processing; `emit` and `subscribe`. The former will take your event, add it to a Bull queue (powered by Redis) as a job, and process it asynchronously. The latter will attach a listener/subscriber to the specificed event, which is run upon processing it. In this document, the terms event and job are used interchangeably.

The signature of each method and an example can be seen below:

**Emit**
```ts
// signature
async emit<T>(eventName: string, data: T, options: Record<string, unknown> & EmitOptions = { attempts: 1 }): Promise<StagedJob | void>

// example
eventBusService.emit("product.created", { id: "prod_id" }, { attempts: 2 })
```
In the example above, the `EventBusService` emits event `product.created`, that contains the id of a product. Additionally, the `options` argument is used to configure the number of times a job is run - default is one - which kicks in  in case a subscriber fails to process it - here pass `attemps: 2` which means it is retried once. More on that later.

**Subscribe**
```ts
// signature
subscribe(event: string | symbol, subscriber: Subscriber, context: SubscriberContext): this

// example
eventBusService.subscribe("product.created", (data) => console.log(data.id))
```
In the example above, the `EventBusService` subscribes to event `product.created` and writes the id to the server log upon processing it. The method takes a third optional argument, `context`, that allows you to configure the id of the subscriber. More on that later.

Learn more about [subscribers and see concrete implementations](https://docs.medusajs.com/advanced/backend/subscribers/create-subscriber). 

### Processing
In the `EventBusService` service, you'll find the `worker_` method, which defines the logic run on each job in the queue. By default, all subscribers to that event (job) are retrieved and for each of the them, the stored job data - provided in emit - is passed to them.

**Retrying**
A subscriber might fail to process an event. This could happen because the subscriber communicates with a third party service currently down or due an error in the logic of the subscriber. In some cases, you might want to retry those failed subscribers. 

As briefly described previously, you can pass options when emitting an event, that are used to configure how the queue worker processes your job. If you pass  `attempts` upon emitting the event, the processing of the event is retried. 

Aside from `attempts`, there are other options to futher configure the retry mechanism:

IMPORTANT: If you have more than one subscriber attached to a single event, you are required to define subscriber ids that allows the `EventBusService` to differentiate between them when retrying the job-processing. Otherwise, **all** subscribers are run again, which can lead to data inconsistencies or general unwanted behavior in your system. Conversely, you might want all subscribers to run on every retry, and in that case, the ids are redundant. 

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

Subscriber ids are defined as part of the third argument to the `subscribe` method:

```ts
eventBusService.subscribe("product.created", (data) => console.log(data), "my-unique-subscriber")
```

Visit the [Bull documentation](https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd) to learn more about these.

### Database transactions

Transactions in Medusa provides us with ACID guarantees for operations in the core, and they are used extensively throughout the project. In many cases, services typically update resources in the database **and** emits an event within a transactional operation. To protect us against these events causing data inconsistencies - e.g. an event is picked up by a plugin to use in a third party service, but the transaction fails - the concept of a staged job has been introduced. 

Instead of events being processed immediately, they are stored in the database as a staged job until they are ready i.e. the transaction has succeeded. This rather complex logic is abstracted away from the consumers of the `EventBusService`, but the flow of events is exemplified below - here in the case of an API request:

1. API request starts
2. Transaction is initiated
3. Service layer performs some logic
4. Events are emitted and stored in the database for eventual processing
5. Transaction is committed
6. API request ends
7. Events in the database become visible

To pull staged jobs from the database, a separate enqueuer polls the database every 3 seconds to discover new visible jobs. These jobs are then added to the queue and processed as described in the Processing section of the document. 

This pattern is heavily inspired by the [Transactionally-staged Job Drain described in this blog post](https://brandur.org/job-drain). 



