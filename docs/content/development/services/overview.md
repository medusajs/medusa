---
description: 'Learn what Services are in Medusa. Services represent bundled helper methods that you want to use across your commerce application.'
---

# Services

In this document, you'll learn about what Services are in Medusa.

## What are Services

Services in Medusa represent bundled helper methods that you want to use across your commerce application. By convention, they represent a certain entity or functionality in Medusa.

For example, you can use Medusa’s `productService` to get the list of products, as well as perform other functionalities related to products. There’s also an `authService` that provides functionalities like authenticating customers and users.

In the Medusa backend, custom services are TypeScript or JavaScript files located in the `src/services` directory. Each service should be a class that extends the `TransactionBaseService` class from the core Medusa package `@medusajs/medusa`. Each file you create in `src/services` should hold one service and export it.

The file name is important as it determines the name of the service when you need to use it elsewhere. The name of the service will be registered as the camel-case version of the file name + `Service` at the end of the name.

For example, if the file name is `hello.ts`, the service will be registered as `helloService`. If the file name is `hello-world.ts`, the service name will be registered as `helloWorldService`.

The registration name of the service is important, as you’ll be referring to it when you want to get access to the service using dependency injection or in routes.

The service must then be transpiled using the `build` command, which moves them to the `dist` directory, to be used across your commerce application.

:::tip

If you're creating a service in a plugin, learn more about the required structure [here](../plugins/create.md#plugin-structure).

:::

---

## See Also

- [Create a Service](./create-service.md)
- [Services Reference](../../references/services/classes/AuthService)
