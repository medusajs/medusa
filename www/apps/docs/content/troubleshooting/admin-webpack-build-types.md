---
title: Admin Webpack Build Error
---

If you run the `build` command in your backend and you get an error message during the admin build process similar to the following:

```bash
The left-hand side of an assignment expression must be a variable or a property access.
```

Make sure that in your admin customizations (widget, UI route, or settings page) you're not using a type imported from `@medusajs/medusa`.

This is often the case if you're using a type or an enum necessary for a request sent with the JS Client or Medusa React library.

For example:

```ts
import { 
  Region, 
  ShippingOptionPriceType,
} from "@medusajs/medusa"
import type Medusa from "@medusajs/medusa-js"

export default async function prepareShippingOptions(
  client: Medusa, 
  region: Region
) {
  let { 
    shipping_options,
  } = await client.admin.shippingOptions.list({
    region_id: region.id,
  })
  if (!shipping_options.length) {
    shipping_options = [(
      await client.admin.shippingOptions.create({
        "name": "PostFake Standard",
        "region_id": region.id,
        "provider_id": "manual",
        "data": {
          "id": "manual-fulfillment",
        },
        // THIS CAUSES THE ERROR
        "price_type": ShippingOptionPriceType.FLAT_RATE,
        "amount": 1000,
      }
    )).shipping_option]
  }

  return shipping_options
}
```

In this case, you're using the `ShippingOptionPriceType` type to send a request with the JS Client.

Instead, change it to the string value. If you get a TypeScript error, you can add `// @ts-ignore` before the line:

```ts
import { 
  Region, 
  ShippingOptionPriceType,
} from "@medusajs/medusa"
import type Medusa from "@medusajs/medusa-js"

export default async function prepareShippingOptions(
  client: Medusa, 
  region: Region
) {
  let { 
    shipping_options,
  } = await client.admin.shippingOptions.list({
    region_id: region.id,
  })
  if (!shipping_options.length) {
    shipping_options = [(
      await client.admin.shippingOptions.create({
        "name": "PostFake Standard",
        "region_id": region.id,
        "provider_id": "manual",
        "data": {
          "id": "manual-fulfillment",
        },
        // @ts-expect-error can't use type from core
        "price_type": "flat_rate",
      "amount": 1000,
      }
    )).shipping_option]
  }

  return shipping_options
}
```
