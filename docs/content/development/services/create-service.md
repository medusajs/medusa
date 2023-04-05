---
description: 'Learn how to create a service in Medusa. This guide also includes how to use services in other services, subscribers, and endpoints.'
addHowToData: true
---

# How to Create a Service

In this document, you’ll learn how you can create a [Service](./overview.mdx) and use it across your Medusa backend just like any of the core services.

## Service Implementation

To create a service, create a TypeScript or JavaScript file in `src/services` to hold the service. The name of the file should be the name of the service without `Service`. This is essential as the file name is used when registering the service in the [dependency container](../fundamentals/dependency-injection.md), and `Service` is appended to the camel-case version of the file name automatically.

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

This service will be registered in the dependency container as `helloService`.

---

## Service Life Time

As the dependency container in Medusa is built on top of [awilix](https://github.com/jeffijoe/awilix), you can specify the [Lifetime](https://github.com/jeffijoe/awilix#lifetime-management) of a service. The lifetime is added as a static property to the service.

There are three lifetime types:

1. `Lifetime.TRANSIENT`: (default for custom services) when used, a new instance of the service is created everytime it is resolved in other resources from the dependency container.
2. `Lifetime.SCOPED`: when used, an instance of the service is created and reused in the scope of the dependency container. So, when the service is resolved in other resources that share that dependency container, the same instance of the service will be returned.
3. `Lifetime.SINGLETON`: (default for core services) when used, the service is always reused, regardless of the scope. An instance of the service is cached in the root container.

You can set the lifetime of your service by setting the `LIFE_TIME` static property:

```ts title=/src/services/hello.ts
import { TransactionBaseService } from "@medusajs/medusa"
import { Lifetime } from "awilix"

class HelloService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED

  // ...
}
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
