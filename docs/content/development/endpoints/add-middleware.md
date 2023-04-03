---
description: 'Learn how to add a middleware in Medusa. A middleware is a function that has access to the request and response objects and can be used to perform actions around an endpoint.'
addHowToData: true
---

# Middlewares

In this document, you’ll learn how to add a middleware to an existing or custom route in Medusa.

## Overview

As the Medusa backend is built on top of [Express](https://expressjs.com/), Express’s features can be utilized during your development with Medusa.

One feature in particular is adding a [middleware](http://expressjs.com/en/guide/using-middleware.html#using-middleware). A middleware is a function that has access to the request and response objects.

A middleware can be used to perform an action when an endpoint is called or modify the response, among other usages.

You can add a middleware to an existing route in the Medusa backend, a route in a plugin, or your custom routes.

---

## How to Add a Middleware

### Step 1: Create the Middleware File

You can organize your middlewares as you see fit, but it's recommended to create Middlewares in the `src/api/middlewares` directory. It's recommended to create each middleware in a different file.

Each file should export a middleware function that accepts three parameters:

1. The first one is an Express request object. It can be used to get details related to the request or resolve resources from the dependency container.
2. The second one is an Express response object. It can be used to modify the response, or in some cases return a response without executing the associated endpoint.
3. The third one is a next middleware function that ensures that other middlewares and the associated endpoint are executed.

:::info

You can learn more about Middlewares and their capabilities in [Express’s documentation](http://expressjs.com/en/guide/using-middleware.html#using-middleware).

:::

Here's an example of a middleware:

```ts title=src/api/middlewares/custom-middleware.ts
export function customMiddleware(req, res, next) {
  // TODO perform an action
  
  next()
}
```

### Step 2: Apply Middleware on an Endpoint

To apply a middleware on any endpoint, you can use the same router defined in `src/api/index.ts` or any other router that is used or exported by `src/api/index.ts`. For example:

:::warning

The examples used here don't apply Cross-Origin Resource Origin (CORS) options for simplicity. Make sure to apply them, especially for core routes, as explained in the [Create Endpoint](./create.md#cors-configuration) documentation.

:::

```ts title=src/api/index.ts
import { Router } from "express"
import { 
  customMiddleware,
} from "./middlewares/custom-middleware"

export default (rootDirectory, pluginOptions) => {
  const router = Router()

  // custom route
  router.get("/hello", (req, res) => {
    res.json({
      message: "Welcome to My Store!",
    })
  })

  // middleware for the custom route
  router.use("/hello", customMiddleware)

  // middleware for core route
  router.use("/store/products", customMiddleware)

  return router
}
```

## Step 3: Building Files

Similar to custom endpoints, you must transpile the files under `src` into the `dist` directory for the backend to load them.

To do that, run the following command before running the Medusa backend:

```bash npm2yarn
npm run build
```

You can then test that the middleware is working by running the backend.

---

## Registering New Resources in Dependency Container

In some cases, you may need to register a resource to use within your commerce application. For example, you may want to register the logged-in user to access it in other services. You can do that in your middleware.

:::tip

If you want to register a logged-in user and access it in your resources, you can check out [this example guide](./example-logged-in-user.md).

:::

To register a new resource in the dependency container, use the `req.scope.register` method:

```ts title=src/api/middlewares/custom-middleware.ts
export function customMiddleware(req, res, next) {
  // TODO perform an action
  
  req.scope.register({
    customResource: {
      resolve: () => "my custom resource",
    },
  })

  next()
}
```

You can then load this new resource within other resources. For example, to load it in a service:

<!-- eslint-disable prefer-rest-params -->

```ts title=src/services/custom-service.ts
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

Notice that you have to wrap your usage of the new resource in a try-catch block when you use it in a constructor. This is to avoid errors that can arise when the backend first loads, as the resource is not registered yet.

### Note About Services Lifetime

If you want to access new registrations in the dependency container within a service, you must set the lifetime of the service either to `Lifetime.SCOPED` or `Lifetime.TRANSIENT`.  Services that have a `Lifetime.SINGLETON` lifetime can't access new registrations since they're resolved and cached in the root dependency container beforehand. You can learn more in the [Create Services documentation](../services/create-service.md#service-life-time).

For custom services, no additional action is required as the default lifetime is `Lifetime.TRANSIENT`. However, if you extend a core service, you must change the lifetime since the default lifetime for core services is `Lifetime.SINGLETON`.

For example:

<!-- eslint-disable prefer-rest-params -->

```ts
import { Lifetime } from "awilix"
import { 
  ProductService as MedusaProductService,
} from "@medusajs/medusa"

// extending ProductService from the core
class ProductService extends MedusaProductService {
  // The default life time for a core service is SINGLETON
  static LIFE_TIME = Lifetime.SCOPED

  constructor(container, options) {
    super(...arguments)

    // use the registered resource.
    try {
      container.customResource
    } catch (e) {
      // avoid errors when the backend first loads
    }
  }

  // ...
}

export default ProductService
```

---

## See Also

- [Store API reference](/api/store)
- [Admin API reference](/api/admin)
