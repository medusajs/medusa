---
description: 'Learn how to manually calculate taxes during checkout in the Medusa backend. There are different methods including using endpoints or services.'
addHowToData: true
---

# Calculate Taxes Manually in Checkout

In this document, you’ll learn how to manually calculate taxes during checkout if you have automatic tax calculation disabled in a region.

## Overview

By default, taxes are automatically calculated by Medusa during checkout. This behavior can be disabled for a region using the Admin APIs or the Medusa admin to limit the requests being sent to a tax provider.

If you disable this behavior, you must manually trigger taxes calculation. When taxes are calculated, this means that requests will be sent to the tax provider to retrieve the tax rates.

---

## How to Manually Calculate Taxes in Checkout

This section explores different ways you can calculate taxes based on your purpose.

### Use Calculate Cart Taxes Endpoint

The [Calculate Cart Taxes](/api/store/#tag/Cart/operation/PostCartsCartTaxes) endpoint forces the calculation of taxes for a cart during checkout. This bypasses the option set in admin to not calculate taxes automatically, which results in sending requests to the tax provider.

This calculates and retrieves the taxes on the cart and each of the line items in that cart.

### Use CartService's retrieve Method

The `CartService` class has a method `retrieve` that gets a cart by ID. In that method, taxes are calculated only if automatic taxes calculation is enabled for the region the cart belongs to.

You can, however, force calculating the taxes of the cart by passing in the third parameter an option containing the key `force_taxes` with its value set to `true`.

For example:

```ts
cartService.retrieve(
  "cart_01G8Z...",
  { },
  {
    force_taxes: true,
  }
)
```

:::tip

You can learn how to [retrieve and use services](../../../development/services/create-service.md#using-your-custom-service) in this documentation.

:::

### Use CartService's decorateTotals Method

Another way you can use the `CartService` to calculate taxes is using the method `decorateTotals`:

```jsx

export default () => {
  // ...

  router.get("/store/line-taxes", async (req, res) => {
    // example of retrieving cart
    const cartService = req.scope.resolve("cartService")
    const cart = await cartService.retrieve(cart_id)
    
    // ...
    // retrieve taxes of line items
    const data = await decorateTotals(cart, {
      force_taxes: true,
    })
    
    return res.status(200).json({ cart: data })
  })
}
```

The `decorateTotals` method accepts the cart as a first parameter and an options object as a second parameter. If you set `force_taxes` to `true` in that object, the totals of the line items can be retrieved regardless of whether the automatic calculation is enabled in the line item’s region.

### Use TotalsService

You can calculate and retrieve taxes of line items using the `getLineItemTotals` method available in the `TotalService` class. All you need to do is pass in the third argument to that method an options object with the key `include_tax` set to true:

```jsx
const itemTotals = await totalsService
  .getLineItemTotals(item, cart, {
    include_tax: true,
  })
```

:::tip

You can learn how to [retrieve and use services](../../../development/services/create-service.md#using-your-custom-service) in this documentation.

:::