# Create a Service

In this document, you’ll learn how you can create a [Service](./overview.md) and use it across your Medusa server just like any of the core services.

## Implementation

To create a service, you should create a JavaScript file in `src/services` to hold the service. The name of the file should be the registration name of the service without `Service` as it will be appended to it by default.

For example, if you want to create a service `helloService`, create the file `hello.js` in `src/services` with the following content:

```js
import { TransactionBaseService } from '@medusajs/medusa';

class HelloService extends TransactionBaseService {
  getMessage() {
    return `Welcome to My Store!`
  }
}

export default HelloService
```

## Service Constructor

As the service extends the `TransactionBaseService` class, all services in Medusa’s core, as well as all your custom services, will be available in your service’s constructor using dependency injection.

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

## Using a Service

You can use core and custom services throughout your Medusa server.

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
