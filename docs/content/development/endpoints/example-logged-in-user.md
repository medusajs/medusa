---
description: 'In this document, you’ll see an example of how you can use middlewares and endpoints to register the logged-in user in the dependency container of your commerce application.'
addHowToData: true
---

# Example: Access Logged-In User

In this document, you’ll see an example of how you can use middlewares and endpoints to register the logged-in user in the dependency container of your commerce application. You can then access the logged-in user in other resources, such as services.

This guide showcases how to register the logged-in admin user, but you can apply the same steps if you want to register the current customer.

This documentation does not explain the basics of [middlewares](./add-middleware.md) and [endpoints](./create.md). You can refer to their respective guides for more details about each.

## Step 1: Create the Middleware

Create the file `src/api/middlewareds/logged-in-user.ts` with the following content:

```tsx
import { User, UserService } from "@medusajs/medusa";

export async function registerLoggedInUser(req, res, next) {
  let loggedInUser: User | null = null

  if (req.user && req.user.userId) {
    const userService = req.scope.resolve('userService') as UserService
    loggedInUser = await userService.retrieve(req.user.userId)
  }

  req.scope.register({
    loggedInUser: {
      resolve: () => loggedInUser,
     },
   });
  
  next();
}
```

This retrieves the ID of the current user to retrieve an instance of it, then registers it in the scope under the name `loggedInUser`.

---

## Step 2: Apply Middleware on Endpoint

Create the file `src/api/routes/create-product.ts` with the following content:

```tsx
import cors from "cors"
import { Router } from "express"
import { registerLoggedInUser } from "../middlewares/logged-in-user"

const router = Router()

export default function (adminCorsOptions) {
  // This router will be applied before the core routes. Therefore, the middleware will be executed
  // before the create product handler is hit
  router.use("/admin/products", cors(adminCorsOptions), registerLoggedInUser)
  return router
}
```

In the example above, the middleware is applied on the `/admin/products` core endpoint. However, you can apply it on any other endpoint. You can also apply it to custom endpoints.

For endpoints that require Cross-Origin Resource Origin (CORS) options, such as core endpoints, you must pass the CORS options to the middleware as well since it will be executed before the underlying endpoint.

---

## Step 3: Register Endpoint in the API

Create the file `index.ts` with the following content:

```tsx
import configLoader from "@medusajs/medusa/dist/loaders/config"
import createProductRouter from "./routes/create-product"

export default async function (rootDirectory: string) {
  const config = await configLoader(rootDirectory)

  const adminCors = {
    origin: config.projectConfig.admin_cors.split(","),
    credentials: true,
  }

  const productRouters = [
    createProductRouter(adminCors)
  ]

  return [...productRouters]
}
```

This exports an array of endpoints, one of them being the product endpoint that you applied the middleware on in the second step. You can export more endpoints as well.

---

## Step 4: Use in a Service

You can now access the logged-in user in a service. For example:

```tsx
import { Lifetime } from "awilix"
import { TransactionBaseService, User } from "@medusajs/medusa"

export default class HelloService extends TransactionBaseService {
  // The default life time for a core service is SINGLETON
  static LIFE_TIME = Lifetime.SCOPED

  protected readonly loggedInUser_: User | null

  constructor(container, options) {
    super(...arguments)

    this.loggedInUser_ = container.loggedInUser
  }

	//...
}
```

This accesses the `loggedInUser` in a custom service. It’s important to change the lifetime of the service to `Lifetime.SCOPED`. You can learn more about the service lifetime in the [Create Service documentation](../services/create-service.md).

---

## Step 5: Test it Out

To test out your implementation, run the following command in the root directory of the Medusa backend to transpile your changes:

```tsx
npm run build
```

Then, run your backend with the following command:

```tsx
npm run start
```

If you try accessing the endpoints you added the middleware to, you should see your implementation working as expected.