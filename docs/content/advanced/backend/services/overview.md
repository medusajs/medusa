# Services

In this document, you'll learn about what Services are in Medusa.

## What are Services

Services in Medusa represent bundled helper methods that you want to use across your server. By convention, they represent a certain entity or functionality in your server.

For example, you can use Medusa’s `productService` to get the list of products, as well as perform other functionalities related to products. There’s also an `authService` that provides functionalities like authenticating customers and users.

Custom services reside in the `src/services` directory of your Medusa Server installation. Each service should be a class that extends the `TransactionBaseService` class from the core Medusa package `@medusajs/medusa`.

Each file you create in `src/services` should hold one service and export it.

The file name is important as it determines the name of the service when you need to use it elsewhere. The name of the service will be registered as the camel-case version of the file name + `Service` at the end of the name.

For example, if the file name is `hello.js`, the service will be registered as `helloService`. If the file name is `hello-world.js`, the service name will be registered as `helloWorldService`.

The registration name of the service is important, as you’ll be referring to it when you want to get access to the service using dependency injection or in routes.

## What's Next

- Learn [how to create a service](./create-service.md)
- Check out the [Services Reference](/references/services/classes/AuthService) to see a list of all services in Medusa.
