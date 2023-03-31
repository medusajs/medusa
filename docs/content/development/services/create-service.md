---
description: 'Learn how to create a service in Medusa. This guide also includes how to use services in other services, subscribers, and endpoints.'
addHowToData: true
---

# Create a Service

In this document, you’ll learn how you can create a [Service](./overview.mdx) and use it across your Medusa backend just like any of the core services.

## Implementation

To create a service, create a TypeScript or JavaScript file in `src/services` to hold the service. The name of the file should be the registration name of the service without `Service` as it will be appended to it by default.

For example, if you want to create a service `helloService`, create the file `hello.ts` in `src/services` with the following content:

```ts title=/src/services/hello.ts
import { TransactionBaseService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

class HelloService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager
  getMessage() {
    return `Welcome to My Store!`
  }
}

export default HelloService
```

---

## Service Constructor

As the service extends the `TransactionBaseService` class, all services in Medusa’s core, as well as all your custom services, will be available in your service’s constructor using dependency injection.

So, if you want your service to use another service, simply add it as part of your constructor’s dependencies and set it to a field inside your service’s class:

```ts
class HelloService extends TransactionBaseService {
  private productService: ProductService

  constructor(container) {
    super(container)
    this.productService = container.productService
  }
  // ...
}
```

Then, you can use that service anywhere in your custom service:

```ts
class HelloService extends TransactionBaseService {
  // ...
  async getProductCount() {
    return await this.productService.count()
  }
}
```

---

## Use a Service

In this section, you'll learn how to use services throughout your Medusa backend. This includes both Medusa's services and your custom services.

:::note

Before using your service, make sure you run the `build` command:

```bash npm2yarn
npm run build
```

:::

### In a Service

To use your custom service in another custom service, you can have easy access to it in the dependencies injected to the constructor of your service:

```ts
class MyService extends TransactionBaseService {
  constructor(container) {
    super(container)
    this.helloService = container.helloService
  }
  // ...
}
```

### In an Endpoint

To use your custom service in an endpoint, you can use `req.scope.resolve` passing it the service’s registration name:

```ts
const helloService = req.scope.resolve("helloService")

res.json({
  message: helloService.getMessage(),
})
```

### In a Subscriber

To use your custom service in a subscriber, you can have easy access to it in the subscriber’s dependencies injected to the constructor of your subscriber:

```ts
class MySubscriber {
  constructor({ helloService, eventBusService }) {
    this.helloService = helloService
  }
  // ...
}
```

---

## See Also

- [Create a Plugin](../plugins/create.md)
