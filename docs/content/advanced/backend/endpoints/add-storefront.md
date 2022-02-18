---
title: Add Endpoint for Storefront
---

# Add Endpoint for Storefront

In this document, you’ll learn how to add a custom endpoint in the Backend that you can use from the Storefront.

## Overview

Custom endpoints reside under the `src/api` directory in your Medusa Backend. To define a new endpoint, you can add the file `index.js` under the `src/api` directory. This file should export a function that returns an Express router.

Your endpoint can be under any path you wish. By Medusa’s conventions, all Storefront REST APIs are prefixed by `/store`. For example, the `/store/products` lets you retrieve the products to display them on your storefront.

## Implementation

To create a new endpoint, start by creating a new file in `src/api` called `index.js`. At its basic format, `index.js` should look something like this:

```js
import { Router } from "express"

export default () => {
  const router = Router()

  router.get("/store/hello", (req, res) => {
    res.json({
      message: "Welcome to My Store!"
    })
  })

  return router
}
```

This exports a function that returns an Express router. In that function, you can create one or more endpoints. In the example above, you create the endpoint `/store/hello`.

Now, if you run your server and send a request to `/store/hello`, you will receive a JSON response message.

> Custom endpoints are compiled into the `dist` directory of your Backend when you run your server using `medusa develop`, while it’s running, and when you run `npm run build`.

## Multiple Endpoints

### Same File

You can add more than one endpoints in `src/api/index.js`:

```js
router.get("/store/hello", (req, res) => {
  res.json({
    message: "Welcome to My Store!"
  })
})

router.get("/store/bye", (req, res) => {
  res.json({
    message: "Come back again!"
  })
})
```

### Multiple Files

Alternatively, you can add multiple files for each endpoint or set of endpoints for readability and easy maintenance.

To do that with the previous example, first, create the file `src/api/hello.js` with the following content:

```js
export default (router) => {
  router.get("/store/hello", (req, res) => {
    res.json({
      message: "Welcome to My Store!"
    })
  })
}
```

You export a function that receives an Express router as a parameter and adds the endpoint `store/hello` to it.

Next, create the file `src/api/bye.js` with the following content:

```js
export default (router) => {
  router.get("/store/bye", (req, res) => {
    res.json({
      message: "Come back again!"
    })
  })
}
```

Again, you export a function that receives an Express router as a parameter and adds the endpoint `store/bye` to it.

Finally, in `src/api/index.js` import the two functions at the beginning of the file:

```js
import helloRoute from "./hello"
import byeRoute from "./bye"
```

and in the exported function, call each of the functions passing them the Express router:

```js
export default () => {
  const router = Router()

  helloRoute(router)
  byeRoute(router)

  return router
}
```

## Use Services

Services in Medusa bundle a set of functionalities into one class. Then, you can use that class anywhere in your Backend. For example, you can use the `ProductService` to retrieve products or perform operations like creating or updating a product.

You can retrieve any registered service in your endpoint using `req.scope.resolve` passing it the service’s registration name.

Here’s an example of an endpoint that retrieves the count of products in your store:

```js
router.get('/store/products/count', (req, res) => {
    const productService = req.scope.resolve('productService')

    productService
      .count()
      .then((count) => {
        res.json({
          count
        })
      })
  })
```

The `productService` has a `count` method that returns a Promise. This Promise resolves to the count of the products. You return a JSON of the product count.

## Protected Routes

Protected routes are routes that should be accessible by logged-in customers only.

To make a route protected, first, import the `authenticate` middleware:

```js
import authenticate from '@medusajs/medusa/dist/api/middlewares/authenticate'
```

Then, add the middleware to your route:

```jsx
router.get('/store/products/count', authenticate(), (req, res) => {
  //...
})
```

Now, only authenticated users can access this endpoint.

### Accessing Current Customer

You can get the logged-in customer’s ID using `req.user`:

```jsx
const id = req.user.customer_id
```

To get the customer’s details, you can use the `customerService`:

```jsx
const id = req.user.customer_id
const customerService = req.scope.resolve("customerService")

const customer = await customerService.retrieve(id)
```

## What’s Next :rocket:

- [Check out the API reference for all available endpoints.](https://docs.medusajs.com/api/store)