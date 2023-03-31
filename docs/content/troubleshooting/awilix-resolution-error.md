# AwilixResolutionError: Could Not Resolve X

This troubleshooting guide will help you figure out the different situations that can cause an `AwilixResolutionError`.

## Option 1: Service Lifetime

If you're registering a custom resource within a middleware, for example a logged-in user, then make sure that all services that are using it have their `LIFE_TIME` static property either set to `Lifetime.SCOPED` or `Lifetime.TRANSIENT`. This mainly applies for services in the core Medusa package, as, by default, their lifetime is `Lifetime.SINGLETON`.

For example:

```ts
import { Lifetime } from "awilix"
import { 
  ProductService as MedusaProductService,
} from "@medusajs/medusa"

// extending ProductService from the core
class ProductService extends MedusaProductService {
  // The default life time for a core service is SINGLETON
  static LIFE_TIME = Lifetime.SCOPED

  // ...
}

export default ProductService
```

This may require you to extend a service as explained in [this documentation](../development/services/extend-service.md) if necessary.

If you're unsure which service you need to change its `LIFE_TIME` property, it should be mentioned along with the `AwilixResolutionError` message. For example:

```bash noCopy noReport
AwilixResolutionError: Could not resolve 'loggedInUser'.

Resolution path: cartService -> productService -> loggedInUser
```

As shown in the resolution path, you must change the `LIFE_TIME` property of both `cartService` and `productService` to `Lifetime.SCOPED` or `Lifetime.TRANSIENT`.

You can learn about the service lifetime in the [Create a Service documentation](../development/services/create-service.md).

## Option 2: Using Try-Catch Block with Custom Registration

When you register a custom resource using a middleware, make sure that when you use it in a service's constructor you wrap it in a try-catch block. This can cause an error when the Medusa backend first runs, especially if the service is used within a subscriber. Subscribers are built the first time the Medusa backend runs, meaning that their dependencies are registered at that point. Since your custom resource hasn't been registered at this point, it will cause an `AwilixResolutionError` when the backend tries to resolve it.

For that reason, and to avoid other similar situations, make sure to always wrap your custom resources in a try-catch block when you use them inside the constructor of a service. For example:

<!-- eslint-disable prefer-rest-params -->

```ts
import { TransactionBaseService } from "@medusajs/medusa"

class CustomService extends TransactionBaseService {

  constructor(container, options) {
    super(...arguments)

    // use the registered resource.
    try {
      container.customResource
    } catch (e) {
      // avoid errors when the backend first loads
    }
  }
}

export default CustomService
```

You can learn more about this in the [Middlewares documentation](../development/endpoints/add-middleware.md).

## Option 3: Error on A Fresh Installation

If you get the error on a fresh installation of the Medusa backend, or you haven't made any customizations that would cause this error, try to remove the `node_modules` directory, then run the following command in the root directory of the Medusa backend to re-install the dependencies:

```bash npm2yarn
npm install
```