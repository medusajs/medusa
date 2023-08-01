---
description: 'Learn how to create endpoints in Medusa. This guide also includes how to add CORS configurations, creating multiple endpoints, adding protected routes, and more.'
addHowToData: true
---

# How to Create Endpoints

In this document, you’ll learn how to create endpoints in Medusa.

## Overview

Custom endpoints are created under the `src/api` directory in your Medusa Backend. They're defined in a TypeScript or JavaScript file named `index` (for example, `index.ts`). This file should export a function that returns an Express router or an array of routes and middlewares.

To consume the custom endpoints in your Medusa backend, you must transpile them with the `build` command before starting your backend.

---

## Implementation

To create a new endpoint, start by creating a new file in `src/api` called `index.ts`. At its basic format, `index.ts` should look something like this:

```ts title=src/api/index.ts
import { Router } from "express"

export default (rootDirectory, options) => {
  const router = Router()

  router.get("/hello", (req, res) => {
    res.json({
      message: "Welcome to My Store!",
    })
  })

  return router
}
```

This exports a function that returns an Express router. The function receives two parameters:

- `rootDirectory` is the absolute path to the root directory that your backend is running from.
- `options` is an object that contains the configurations exported from `medusa-config.js`. If your API route is part of a plugin, then it will contain the plugin's options instead.

### Defining Multiple Routes or Middlewares

Instead of returning an Express router in the function, you can return an array of routes and [middlewares](./add-middleware.mdx).

For example:

```ts title=src/api/index.ts
import { Router } from "express"

export default (rootDirectory, options) => {
  const router = Router()

  router.get("/hello", (req, res) => {
    res.json({
      message: "Welcome to My Store!",
    })
  })

  // you can also define the middleware
  // in another file and import it
  const middleware = (res, req, next) => {
    // TODO define global middleware
    console.log("hello from middleware")
    next()
  }

  const anotherRouter = Router()
  anotherRouter.get("/store/*", (req, res, next) => {
    // TODO perform an actions for all store endpoints
    next()
  })

  return [middleware, router, anotherRouter]
}
```

This allows you to export multiple routers and middlewares from the same file. You can also import the routers, routes, and middlewares from other files, then import them in `src/api/index.ts` instead of defining them within the same file.

### Endpoints Path

Your endpoint can be under any path you wish.

By Medusa’s conventions:

- All Storefront REST APIs are prefixed by `/store`. For example, the `/store/products` endpoint lets you retrieve the products to display them on your storefront.
- All Admin REST APIs are prefixed by `/admin`. For example, the `/admin/products` endpoint lets you retrieve the products to display them on your Admin.

You can also create endpoints that don't reside under these two prefixes, similar to the `hello` endpoint in the previous example.

---

## Retrieve Medusa Config

As mentioned, the second parameter `options` includes the configurations exported from `medusa-config.js`. However, in plugins it only includes the plugin's options.

If you need to access the Medusa configuration in your endpoint, you can use the `getConfigFile` method imported from `medusa-core-utils`. It accepts the following parameters:

1. `rootDirectory`: The first parameter is a string indicating root directory of your Medusa backend.
2. `config`: The second parameter is a string indicating the name of the config file, which should be `medusa-config` unless you change it.

The function returns an object with the following properties:

1. `configModule`: An object containing the configurations exported from `medusa-config.js`.
2. `configFilePath`: A string indicating absolute path to the configuration file.
3. `error`: if any errors occur, they'll be included as the value of this property. Otherwise, its value will be `undefined`.

Here's an example of retrieving the configurations within an endpoint using `getConfigFile`:

```ts title=src/api/index.ts
import { Router } from "express"
import { ConfigModule } from "@medusajs/medusa"
import { getConfigFile } from "medusa-core-utils"

export default (rootDirectory) => {
  const router = Router()
  const { configModule } = getConfigFile<ConfigModule>(
    rootDirectory,
    "medusa-config"
  )

  router.get("/store-cors", (req, res) => {
    res.json({
      store_cors: configModule.projectConfig.store_cors,
    })
  })

  return router
}
```

Notice that `getConfigFile` is a generic function. So, if you're using TypeScript, you should pass it the type `ConfigModule` imported from `@medusajs/medusa`.

If you're accessing custom configurations, you'll need to create a new type that defines these configurations. For example:

```ts title=src/api/index.ts
import { Router } from "express"
import { ConfigModule } from "@medusajs/medusa"
import { getConfigFile } from "medusa-core-utils"

type MyConfigModule = ConfigModule & {
  projectConfig: {
    custom_config?: string
  }
}

export default (rootDirectory) => {
  const router = Router()
  const { configModule } = getConfigFile<MyConfigModule>(
    rootDirectory,
    "medusa-config"
  )

  router.get("/hello", (req, res) => {
    res.json({
      custom_config: configModule.projectConfig.custom_config,
    })
  })

  return router
}
```

---

## CORS Configuration

If you’re adding a storefront or admin endpoint and you want to access these endpoints from the storefront or Medusa admin, you need to pass your endpoints Cross-Origin Resource Origin (CORS) options using the `cors` package.

First, you need to import the necessary utility functions and types from Medusa's packages with the `cors` library:

```ts
import { 
  getConfigFile, 
  parseCorsOrigins,
} from "medusa-core-utils"
import { 
  ConfigModule, 
} from "@medusajs/medusa/dist/types/global"
import cors from "cors"
```

Next, in the exported function, retrieve the CORS configurations of your backend using the utility functions you imported:

```ts
export default (rootDirectory) => {
  // ...

  const { configModule } = 
    getConfigFile<ConfigModule>(rootDirectory, "medusa-config")
  const { projectConfig } = configModule

  // ....
}
```

Then, create an object that will hold the CORS configurations. If it’s a storefront endpoint, pass the `origin` property storefront options:

```ts
const corsOptions = {
  origin: projectConfig.store_cors.split(","),
  credentials: true,
}
```

If it’s an admin endpoint, pass the `origin` property admin options:

```ts
const corsOptions = {
  origin: projectConfig.admin_cors.split(","),
  credentials: true,
}
```

Finally, for each route you add, create an `OPTIONS` request and add `cors` as a middleware for the route passing it the CORS option:

```ts
router.options("/admin/hello", cors(corsOptions))
router.get("/admin/hello", cors(corsOptions), (req, res) => {
  // ...
})
```

---

## Parse Request Body Parameters

If you want to accept request body parameters, you need to pass express middlewares that parse the payload type to your router.

For example:

```ts
import bodyParser from "body-parser"
import express, { Router } from "express"


export default (rootDirectory, pluginOptions) => {
  const router = Router()

  router.use(express.json())
  router.use(express.urlencoded({ extended: true }))

  router.post("/store/hello", (req, res) => {
    res.json({
      message: req.body.name,
    })
  })

  return router
}
```

In the code snippet above, you use the following middlewares:

- `express.json()`: parses requests with JSON payloads
- `express.urlencoded()`: parses requests with urlencoded payloads.

You can learn about other available middlewares in the [Express documentation](https://expressjs.com/en/api.html#express).

---

## Protected Routes

Protected routes are routes that should be accessible by logged-in customers or users only.

### Protect Store Routes

To make a storefront route protected, first, import the `authenticateCustomer` middleware:

<!-- eslint-disable max-len -->

```ts
import { authenticateCustomer } from "@medusajs/medusa"
```

Then, add the middleware to your route:

```ts
router.options("/store/hello", cors(corsOptions))
router.get(
  "/store/hello",
  cors(corsOptions),
  authenticateCustomer(), 
  async (req, res) => {
    if (req.user) {
      // user is logged in
      // to get customer id: req.user.customer_id
    }
    // ...
  }
)
```

Please note that the endpoint is still accessible by all users, however, you’ll be able to access the current logged-in customer if there’s any.

To disallow guest customers from accessing the endpoint, you can throw an error if `req.user` is `false`.

### Protect Admin Routes

To make an admin route protected, first, import the `authenticate` middleware:

<!-- eslint-disable max-len -->

```ts
import { authenticate } from "@medusajs/medusa"
```

Then, add the middleware to your route:

```ts
router.options("/admin/products/count", cors(corsOptions))
router.get(
  "/admin/products/count", 
  cors(corsOptions), 
  authenticate(),
  async (req, res) => {
    // access current user
    const id = req.user.userId
    const userService = req.scope.resolve("userService")
      
    const user = await userService.retrieve(id)
    // ...
  }
)
```

Now, only authenticated users can access this endpoint.

---

## Use Services

Services in Medusa bundle a set of functionalities into one class. Then, you can use that class anywhere in your backend. For example, you can use the `ProductService` to retrieve products or perform operations like creating or updating a product.

You can retrieve any registered service in your endpoint using `req.scope.resolve` passing it the service’s registration name.

Here’s an example of an endpoint that retrieves the count of products in your store:

```ts
router.get(
  "/admin/products/count",
  cors(corsOptions),
  authenticate(),
  (req, res) => {
    const productService = req.scope.resolve("productService")

    productService.count().then((count) => {
      res.json({
        count,
      })
    })
  }
)
```

The `productService` has a `count` method that returns a Promise. This Promise resolves to the count of the products. You return a JSON of the product count.

---

## Building Files

Custom endpoints must be transpiled and moved to the `dist` directory before you can start consuming them. When you run your backend using either the `medusa develop` or `npx @medusajs/medusa-cli develop` commands, it watches the files under `src` for any changes, then triggers the `build` command and restarts the server.

The build isn't triggered though when the backend first starts running. So, make sure to run the `build` command before starting the backend:

```bash npm2yarn
npm run build
```

---

## See Also

- [Storefront API Reference](/api/store)
- [Admin API Reference](/api/admin)
