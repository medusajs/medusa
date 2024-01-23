---
description: 'Learn how to create a subscriber in Medusa. You can use subscribers to implement functionalities like sending an order confirmation email.'
addHowToData: true
---

# How to Create a Subscriber

In this document, you’ll learn how to create a [Subscriber](./subscribers.mdx) in Medusa that listens to events to perform an action.

:::tip

v1.18 of `@medusajs/medusa` introduced a new approach to create a subscriber. If you're looking for the old guide, you can find it [here](./create-subscriber-deprecated.md). However, it's highly recommended you follow this new approach, as the old one is deprecated.

:::

## Implementation

A subscriber is a TypeScript or JavaScript file that is created under `src/subscribers`. It can be created under subdirectories of `src/subscribers` as well. For example, you can place all subscribers to product events under the `src/subscribers/products` directory.

The subscriber file exports a default handler function, and the subscriber's configurations.

For example:

```ts title="src/subscribers/product-update-handler.ts"
import { 
  ProductService,
  type SubscriberConfig, 
  type SubscriberArgs, 
} from "@medusajs/medusa"

export default async function productUpdateHandler({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, any>>) {
  const productService: ProductService = container.resolve(
    "productService"
  )

  const { id } = data

  const product = await productService.retrieve(id)

  // do something with the product...
}

export const config: SubscriberConfig = {
  event: ProductService.Events.UPDATED,
  context: {
    subscriberId: "product-update-handler",
  },
}
```

### Subscriber Configuration

The exported configuration object of type `SubscriberConfig` must include the following properties:

- `event`: A string or an array of strings, each being the name of the event that the subscriber handler function listens to.
- `context`: An object that defines the context of the subscriber. It can accept any properties along with the `subscriberId` property. Learn more about the subscriber ID and the context object in [this section](#context-with-subscriber-id).

### Subscriber Handler Function

The default-export of the subscriber file is a handler function that is executed when the events specified in the exported configuration is triggered.

The function accepts a parameter of type `SubscriberArgs`, which has the following properties:

- `data`: The data payload of the emitted event. Its type is different for each event. So, make sure to check the [events reference](./events-list.md) for the expected payload of the events your subscriber listens to. You can then pass the expected payload type as a type parameter to `SubscriberArgs`, for example, `Record<string, string>`.
- `eventName`: A string indicating the name of the event. This is useful if your subscriber listens to more than one event and you want to differentiate between them.
- `container`: The [dependency container](../fundamentals/dependency-injection.md) that allows you to resolve Medusa resources, such as services.
- `pluginOptions`: When the subscriber is created within a plugin, this object holds the plugin's options defined in the [Medusa configurations](../../references/medusa_config/interfaces/medusa_config.ConfigModule.mdx).

---

## Context with Subscriber ID

The `context` property of the subscriber configuration object is passed to the `eventBusService`. You can pass the `subscriberId` and any custom data in it.

:::note

The subscriber ID is useful when there is more than one handler function attached to a single event or if you have multiple Medusa backends running. This allows the events bus service to differentiate between handler functions when retrying a failed one, avoiding retrying all subscribers which can lead to data inconsistencies or general unwanted behavior in your system.

:::

### Inferred Subscriber ID

If you don't pass a subscriber ID to the subscriber configurations, the name of the subscriber function is used as the subscriber ID. If the subscriber function is an anonymous function, the name of the subscriber file is used instead.

---

## Caveats for Local Event Bus

If you use the `event-bus-local` as your event bus service, note the following:

- The `subscriberId` passed in the context is overwritten to a random ID when using `event-bus-local`. So, setting the subscriber ID in the context won't have any effect in this case.
- The `eventName` passed to the handler function will be `undefined` when using `event-bus-local` as it doesn't pass the event name properly.

:::note

While the local event bus is a good option for development, it's highly recommended to use the [Redis Event Module](./modules/redis.md) in production.

:::

---

## Retrieve Medusa Configurations

Within your subscriber, you may need to access the Medusa configuration exported from `medusa-config.js`. To do that, you can access `configModule` using dependency injection.

For example:

```ts title="src/subscribers/product-update-handler.ts"
import { 
  ProductService,
  type SubscriberConfig, 
  type SubscriberArgs,
  type ConfigModule, 
} from "@medusajs/medusa"

export default async function productUpdateHandler({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs) {
  const configModule: ConfigModule = container.resolve(
    "configModule"
  )
  
  // ...
}

export const config: SubscriberConfig = {
  event: ProductService.Events.UPDATED,
  context: {
    subscriberId: "product-update-handler",
  },
}
```

---

## See Also

- [Example: send order confirmation email](../../modules/orders/backend/send-order-confirmation.md)
- [Example: send registration confirmation email](../../modules/customers/backend/send-confirmation.md)
- [Create a Plugin](../plugins/create.mdx)