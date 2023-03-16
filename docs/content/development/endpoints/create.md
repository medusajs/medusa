---
description: 'Learn how to create endpoints in Medusa. This guide also includes how to add CORS configurations, creating multiple endpoints, adding protected routes, and more.'
addHowToData: true
---

# How to Create Endpoints

In this document, you’ll learn how to create endpoints in Medusa.

## Overview

Custom endpoints are created under the `src/api` directory in your Medusa Backend. They're defined in a TypeScript or JavaScript file named `index` (for example, `index.ts`). This file should export a function that returns an Express router

They're then transpiled into the `/dist/api` directory to be consumed.

---

## Implementation

To create a new endpoint, start by creating a new file in `src/api` called `index.ts`. At its basic format, `index.ts` should look something like this:

```ts title=src/api/index.ts
import { Router } from "express"

export default (rootDirectory, pluginOptions) => {
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
- `pluginOptions` is an object that has your plugin's options. If your API route is not implemented in a plugin, then it will be an empty object.

### Endpoints Path

Your endpoint can be under any path you wish.

By Medusa’s conventions:

- All Storefront REST APIs are prefixed by `/store`. For example, the `/store/products` endpoint lets you retrieve the products to display them on your storefront.
- All Admin REST APIs are prefixed by `/admin`. For example, the `/admin/products` endpoint lets you retrieve the products to display them on your Admin.

You can also create endpoints that don't reside under these two prefixes, similar to the `hello` endpoint in the previous example.

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

## Create Multiple Endpoints

### Same File

You can add more than one endpoint in `src/api/index.ts`:

```ts title=src/api/index.ts
router.options("/store/hello", cors(storeCorsOptions))
router.get(
  "/store/hello", 
  cors(storeCorsOptions), 
  (req, res) => {
    res.json({
      message: "Welcome to Your Store!",
    })
  }
)

router.options("/admin/hello", cors(adminCorsOptions))
router.get(
  "/admin/hello",
  cors(adminCorsOptions),
  (req, res) => {
    res.json({
      message: "Welcome to Your Admin!",
    })
  }
)
```

### Multiple Files

Alternatively, you can add multiple files for each endpoint or set of endpoints for readability and easy maintenance.

To do that with the previous example, first, create the file `src/api/store.ts` with the following content:

```ts title=src/api/store.ts
import cors from "cors"
import { projectConfig } from "../../medusa-config"

export default (router) => {
  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  }
  router.options("/store/hello", cors(storeCorsOptions))
  router.get(
    "/store/hello", 
    cors(storeCorsOptions),
    (req, res) => {
      res.json({
        message: "Welcome to Your Store!",
      })
    }
  )
}
```

You export a function that receives an Express router as a parameter and adds the endpoint `store/hello` to it.

Next, create the file `src/api/admin.ts` with the following content:

```ts title=src/api/admin.ts
import cors from "cors"
import { projectConfig } from "../../medusa-config"

export default (router) => {
  const adminCorsOptions = {
    origin: projectConfig.admin_cors.split(","),
    credentials: true,
  }
  router.options("/admin/hello", cors(adminCorsOptions))
  router.get(
    "/admin/hello",
    cors(adminCorsOptions),
    (req, res) => {
      res.json({
        message: "Welcome to Your Admin!",
      })
    }
  )
}
```

Again, you export a function that receives an Express router as a parameter and adds the endpoint `admin/hello` to it.

Finally, in `src/api/index.ts` import the two functions at the beginning of the file:

```ts title=src/api/index.ts
import { Router } from "express"
import storeRoutes from "./store"
import adminRoutes from "./admin"
```

and in the exported function, call each of the functions passing them the Express router:

```ts title=src/api/index.ts
export default () => {
  const router = Router()

  storeRoutes(router)
  adminRoutes(router)

  return router
}
```

---

## Protected Routes

Protected routes are routes that should be accessible by logged-in customers or users only.

### Protect Store Routes

To make a storefront route protected, first, import the `authenticate-customer` middleware:

<!-- eslint-disable max-len -->

```ts
import 
  authenticate 
from "@medusajs/medusa/dist/api/middlewares/authenticate-customer"
```

Then, add the middleware to your route:

```ts
router.options("/store/hello", cors(corsOptions))
router.get("/store/hello", cors(corsOptions), authenticate(), 
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
import 
  authenticate 
from "@medusajs/medusa/dist/api/middlewares/authenticate"
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

Custom endpoints must be transpiled and moved to the `dist` directory before you can start consuming them. When you run your backend using the `medusa develop` command, it watches the files under `src` for any changes, then triggers the `build` command and restarts the server.

The build isn't triggerd though when the backend first starts running. So, make sure to run the `build` command before starting the backend:

```bash npm2yarn
npm run build
```

---

## See Also

- [Storefront API Reference](/api/store)
- [Admin API Reference](/api/admin)
