---
addHowToData: true
---

# Discount Generator

In this document, you’ll learn how to install the Discount Generator plugin on your Medusa backend.

## Overview

In Medusa, merchants can create dynamic discounts that act as a template for other discounts. With dynamic discounts, merchants don't have to repeat certain conditions every time they want to create a new discount.

The discount generator plugin allows merchants and developers to generate new discounts from a dynamic discount. This can be done either by envoking the `/discount-code` API Route or using the `DiscountGeneratorService`.

---

## Prerequisites

Before you follow this guide, you must have a Medusa backend installed. If not, you can follow the [quickstart guide](../../create-medusa-app.mdx) to learn how to do it.

---

## Install Plugin

In the directory of your Medusa backend, run the following command to install the plugin:

```bash npm2yarn
npm install medusa-plugin-discount-generator
```

Finally, add the plugin to the `plugins` array in `medusa-config.js`:

```js title="medusa-config.js"
const plugins = [
  // ...
  {
    resolve: `medusa-plugin-discount-generator`,
  },
]
```

---

## Test the Plugin

### Using the API Route

The plugin registers a `POST` API Route `/discount-code`. The API Route accepts in the request body the parameter `discount_code` which is a string indicating the code of the dynamic discount to generate a new discount from. The API Route then creates the new discount from the dynamic discount and returns it in the response.

So, to test out the API Route, run the following command in the root of your project to start the Medusa backend:

```bash
npx medusa develop
```

Then, create a dynamic discount. You can do that either using the [Medusa Admin](../../user-guide/discounts/create.mdx) which is available (if installed) at `http://localhost:7001` after starting the backend, or using the [Admin REST APIs](../../modules/discounts/admin/manage-discounts.mdx).

After that, send a `POST` request to the `/discount-code` API Route, passing the `discount_code` parameter in the request body with the value being the code of the dynamic discount you just created. A new discount will be created with the same attributes as the dynamic discount code and returned in the response.

### Using the DiscountGeneratorService

After installing the plugin, the `DiscountGeneratorService` is registered in the [dependency container](../../development/fundamentals/dependency-injection.md). So, you can resolve and use it in custom services, API Routes, or other resources.

The `DiscountGeneratorService` has one method `generateDiscount`. This method requires passing the code of a dynamic discount as a parameter. It then creates a new discount having the same attributes as the dynamic discount, but with a different, random code.

Here's an example of using the service in an API Route:

```ts title="src/api/store/generate-discount-code/route.ts"
import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"

export const POST = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  // skipping validation for simplicity
  const { dynamicCode } = req.body
  const discountGenerator = req.scope.resolve(
    "discountGeneratorService"
  )
  const code = await discountGenerator.generateDiscount(
    dynamicCode
  )

  res.json({
    code,
  })
}
```
