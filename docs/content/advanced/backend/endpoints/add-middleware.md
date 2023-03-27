---
description: 'Learn how to add a middleware in Medusa. A middleware is a function that has access to the request and response objects and can be used to perform actions around an endpoint.'
addHowToData: true
---

# How to Add a Middleware

In this document, you’ll learn how to add a middleware to an existing or custom route in Medusa.

## Overview

As the Medusa server is built on top of [Express](https://expressjs.com/), Express’s features can be utilized during your development with Medusa.

One feature in particular is adding a [middleware](http://expressjs.com/en/guide/using-middleware.html#using-middleware). A middleware is a function that has access to the request and response objects.

A middleware can be used to perform an action when an endpoint is called or modify the response, among other usages.

You can add a middleware to an existing route in the Medusa server, a route in a plugin, or your custom routes.

---

## Add a Middleware

Adding a middleware is very similar to adding a custom endpoint. The middleware must be created either in the `src/api/index.ts` entry point, or other TypeScript or JavaScript files imported into `src/api/index.ts`.

:::info

Learn more about creating custom endpoints in [this documentation](./add.md).

:::

The following code snippet is an example of adding a middleware:

```ts title=src/api/index.ts
import { Router } from "express"

export default () => {
  const router = Router()

  router.use("/store/products", (req, res, next) => {
      // / perform an action when retrieving products
      next()
  })

  return router
}
```

This code snippet adds a middleware to the [List Products](/api/store/#tag/Product/operation/GetProducts) endpoint. In the middleware function, you can perform any action.

Then, you must call the `next` method received as a third parameter in the middleware function to ensure that the endpoint executes after the middleware.

:::info

You can learn more about Middlewares and their capabilities in [Express’s documentation](http://expressjs.com/en/guide/using-middleware.html#using-middleware).

:::

---

## Building Files

Similar to custom endpoints, you must transpile the files under `src` into the `dist` directory for the server to load them.

To do that, run the following command before running the Medusa server:

```bash npm2yarn
npm run build
```

---

## See Also

- [Create an Endpoint](./add.md)
- [Store API reference](/api/store)
- [Admin API reference](/api/admin)
