---
description: 'In this document, you’ll learn how to create an events module, then test and publish the module as an NPM package.'
addHowToData: true
---

# Create Events Module

In this document, you’ll learn how to create an events module.

## Overview

Medusa provides ready-made modules for events, including the local and Redis modules. If you prefer another technology used for managing events, you can build a module locally and use it in your Medusa backend. You can also publish to NPM and reuse it across multiple Medusa backend instances.

In this document, you’ll learn how to build your own Medusa events module, mainly focusing on creating the event bus service and the available methods you need to implement within your module.

---

## (Optional) Step 0: Prepare Module Directory

Before you start implementing your module, it's recommended to prepare the directory or project holding your custom implementation.

You can refer to the [Project Preparation step in the Create Module documentation](../modules/create.mdx#optional-step-0-project-preparation) to learn how to do that.

---

## Step 1: Create the Service

Create the file `services/event-bus-custom.ts` which will hold your event bus service. Note that the name of the file is recommended to be in the format `event-bus-<service_name>` where `<service_name>` is the name of the service you’re integrating. For example, `event-bus-redis`.

Add the following content to the file:

```ts title=services/event-bus-custom.ts
import { EmitData, EventBusTypes } from "@medusajs/types"
import { AbstractEventBusModuleService } from "@medusajs/utils"

class CustomEventBus extends AbstractEventBusModuleService {
  async emit<T>(
    eventName: string, 
    data: T, 
    options: Record<string, unknown>
  ): Promise<void>;
  async emit<T>(data: EmitData<T>[]): Promise<void>;
  async emit(
    eventName: unknown, 
    data?: unknown, 
    options?: unknown
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

export default CustomEventBus
```

This creates the class `CustomEventBus` that implements the `AbstractEventBusModuleService` class imported from `@medusajs/utils`. Feel free to rename the class to what’s relevant for your event bus service.

In the class you must implement the `emit` method. You can optionally implement the `subscribe` and `unsubscribe` methods.

---

## Step 2: Implement Methods

### Note About the eventToSubscribersMap Property

The `AbstractEventBusModuleService` implements two methods for handling subscription: `subscribe` and `unsubscribe`. In these methods, the subscribed handler methods are managed within a class property `eventToSubscribersMap`, which is a JavaScript Map. They map keys are the event names, whereas the value of each key is an array of subscribed handler methods.

In your custom implementation, you can use this property to manage the subscribed handler methods. For example, you can get the subscribers of a method using the `get` method of the map:

```ts
const eventSubscribers = 
  this.eventToSubscribersMap.get(eventName) || []
```

Alternatively, you can implement custom logic for the `subscribe` and `unsubscribe` events, which is explained later in this guide.

### constructor

The `constructor` method of a service allows you to prepare any third-party client or service necessary to be used in other methods. It also allows you to get access to the module’s options which are typically defined in `medusa-config.js`, and to other services and resources in the Medusa backend using [dependency injection](../fundamentals/dependency-injection.md).

Here’s an example of how you can use the `constructor` to store the options of your module:

<!-- eslint-disable prefer-rest-params -->

```ts title=services/event-bus-custom.ts
class CustomEventBus extends AbstractEventBusModuleService {
  protected readonly moduleOptions: Record<string, any>

  constructor({
    // inject resources from the Medusa backend
    // for example, you can inject the logger
    logger,
  }, options) {
    super(...arguments)
    this.moduleOptions = options
  }

  // ...
}
```

### emit

The `emit` method is used to push an event from Medusa into your messaging system. Typically, the subscribers to that event would then pick up the message and execute their asynchronous tasks.

The `emit` method has two different signatures:

1. The first signature accepts three parameters. The first parameter is `eventName` being a required string indicating the name of the event to trigger. The second parameter is `data` being the optional data to send to subscribers of that event. The third optional parameter `options` which can be used to pass options specific to the event bus.
2. The second signature accepts one parameter, which is an array of objects having three properties: `eventName`, `data`, and `options`. These are the same as the parameters that can be passed in the first signature. This signature allows emitting more than one event.

The `options` parameter depends on the event bus integrating. For example, the Redis event bus accept the following options:

```ts title=services/event-bus-custom.ts
type JobData<T> = {
  eventName: string
  data: T
  completedSubscriberIds?: string[] | undefined
}
```

You can implement your method in a way that supports both signatures by checking the type of the first input. For example:

```ts title=services/event-bus-custom.ts
class CustomEventBus extends AbstractEventBusModuleService {
  // ...
  async emit<T>(
    eventName: string, 
    data: T, 
    options: Record<string, unknown>
  ): Promise<void>;
  async emit<T>(data: EmitData<T>[]): Promise<void>;
  async emit<T>(
    eventOrData: string | EmitData<T>[], 
    data?: T, 
    options: Record<string, unknown> = {}
  ): Promise<void> {
    const isBulkEmit = Array.isArray(eventOrData)
    
    // emit event
  }
}
```

### (optional) subscribe

As mentioned earlier, this method is already implemented in the `AbstractEventBusModuleService` class. This section explains how you can implement your custom subscribe logic if necessary.

The `subscribe` method attaches a handler method to the specified event, which is run when the event is triggered. It is typically used inside a subscriber class.

The  `subscribe` method accepts three parameters:

1. The first parameter `eventName` is a required string. It indicates which event the handler method is subscribing to.
2. The second parameter `subscriber` is a required function that performs an action when the event is triggered.
3. The third parameter `context` is an optional object that has the property `subscriberId`. Subscriber IDs are useful to differentiate between handler methods when retrying a failed method. It’s also useful for unsubscribing an event handler. Note that if you must implement the mechanism around assigning IDs to subscribers when you override the `subscribe` method.

The implementation of this method depends on the service you’re using for the event bus:

```ts title=services/event-bus-custom.ts
class CustomEventBus extends AbstractEventBusModuleService {
  // ...
  subscribe(
    eventName: string | symbol, 
    subscriber: EventBusTypes.Subscriber, 
    context?: EventBusTypes.SubscriberContext): this {
    // TODO implement subscription
  }
}
```

### (optional) unsubscribe

As mentioned earlier, this method is already implemented in the `AbstractEventBusModuleService` class. This section explains how you can implement your custom unsubscribe logic if necessary.

The `unsubscribe` method is used to unsubscribe a handler method from an event.

The `unsubscribe` method accepts three parameters:

1. The first parameter `eventName` is a required string. It indicates which event the handler method is unsubscribing from.
2. The second parameter `subscriber` is a required function that was initially subscribed to the event.
3. The third parameter `context` is an optional object that has the property `subscriberId`. It can be used to specify the ID of the subscriber to unsubscribe.

The implementation of this method depends on the service you’re using for the event bus:

```ts title=services/event-bus-custom.ts
class CustomEventBus extends AbstractEventBusModuleService {
  // ...
  unsubscribe(
    eventName: string | symbol, 
    subscriber: EventBusTypes.Subscriber, 
    context?: EventBusTypes.SubscriberContext): this {
    // TODO implement subscription
  }
}
```

---

## Step 3: Export the Service

After implementing the event bus service, you must export it so that the Medusa backend can use it.

Create the file `index.ts` with the following content:

```ts title=services/event-bus-custom.ts
import { ModuleExports } from "@medusajs/modules-sdk"

import { CustomEventBus } from "./services"

const service = CustomEventBus

const moduleDefinition: ModuleExports = {
  service,
}

export default moduleDefinition
```

This exports a module definition, which requires at least a `service`. If you named your service something other than `CustomEventBus`, make sure to replace it with that.

You can learn more about what other properties you can export in your module definition in the [Create a Module documentation](../modules/create.mdx#step-2-export-module).

---

## Step 4: Test your Module

You can test your module in the Medusa backend by referencing it in the configurations.

To do that, add the module to the exported configuration in `medusa-config.js` as follows:

```js title=medusa-config.js
module.exports = {
  // ...
  modules: { 
    // ...
    cacheService: {
        resolve: "path/to/custom-module", 
        options: { 
          // any necessary options
        },
      },
    },
}
```

Make sure to replace the `path/to/custom-module` with a relative path from your Medusa backend to your module. You can learn more about module reference in the [Create Module documentation](../modules/create.mdx#module-reference).

You can also add any necessary options to the module.

Then, to test the module, run the Medusa backend which also runs your module:

```bash npm2yarn
npm run start
```

---

## (Optional) Step 5: Publish your Module

You can publish your events module to NPM. This can be useful if you want to reuse your module across Medusa backend instances, or want to allow other developers to use it.

You can refer to the [Publish Module documentation](../modules/publish.md) to learn how to publish your module.
