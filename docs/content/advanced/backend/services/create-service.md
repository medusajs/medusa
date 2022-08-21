---
title: Create a Service
---

# Create a Service

In this document, you’ll learn how you can create a service and use it across your Medusa server just like any of the core services.

## Overview

Services in Medusa represent bundled helper methods that you want to use across your server. By convention, they represent a certain entity or functionality in your server.

For example, you can use Medusa’s `productService` to get the list of products, as well as perform other functionalities related to products. There’s also an `authService` that provides functionalities like authenticating customers and users.

Custom services reside in the `src/services` directory of your Medusa Server installation. Each service should be a class that extends the `BaseService` class from `medusa-interfaces`.

Each file you create in `src/services` should hold one service and export it.

The file name is important as it determines the name of the service when you need to use it elsewhere. The name of the service will be registered as the camel-case version of the file name + `Service` at the end of the name.

For example, if the file name is `hello.js`, the service will be registered as `helloService`. If the file name is `hello-world.js`, the service name will be registered as `helloWorldService`.

The registration name of the service is important, as you’ll be referring to it when you want to get access to the service using dependency injection or in routes.

## Implementation

To create a service, you should create a JavaScript file in `src/services` to hold the service. The name of the file should be the registration name of the service without `Service` as it will be appended to it by default.

For example, if you want to create a service `helloService`, create the file `hello.js` in `src/services` with the following content:

```js
import { BaseService } from "medusa-interfaces"

class HelloService extends BaseService {
  getMessage() {
    return `Welcome to My Store!`
  }
}

export default HelloService
```

## Service Constructor

As the service extends the `BaseService` class, all services in Medusa’s core, as well as all your custom services, will be available in your service’s constructor using dependency injection.

So, if you want your service to use another service, simply add it as part of your constructor’s dependencies and set it to a field inside your service’s class:

```js
productService;

constructor({ productService }) {
  super();
  this.productService = productService;
}
```

Then, you can use that service anywhere in your custom service:

```js
async getProductCount() {
  return await this.productService.count();
}
```

## Using your Custom Service

You can use your custom service throughout your Medusa server just like you would use any of the core services.

:::note

Before using your service, make sure you run the `build` command:

```bash npm2yarn
npm run build
```

:::

### In a Service

To use your custom service in another custom service, you can have easy access to it in the dependencies injected to the constructor of your service:

```js
constructor({ helloService }) {
  super();
  this.helloService = helloService;
}
```

### In an Endpoint

To use your custom service in an endpoint, you can use `req.scope.resolve` passing it the service’s registration name:

```js
const helloService = req.scope.resolve("helloService")

res.json({
  message: helloService.getMessage(),
})
```

### In a Subscriber

To use your custom service in a subscriber, you can have easy access to it in the subscriber’s dependencies injected to the constructor of your subscriber:

```js
constructor({ helloService, eventBusService }) {
  this.helloService = helloService;
}
```

## What’s Next 🚀

- Check out the [Services Reference](/references/services/classes/AuthService) to see a list of all services in Medusa.
- [Learn How to Create an Endpoint.](/advanced/backend/endpoints/add-storefront)
