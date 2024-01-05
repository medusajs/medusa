---
description: 'Learn how to create a tax provider. You can create a tax provider in a Medusa backend or a plugin.'
addHowToData: true
---

# How to Override a Tax Calculation Strategy

In this document, you’ll learn how to override a tax calculation strategy.

## Overview

A tax calculation strategy is used to calculate taxes when calculating totals. The Medusa backend provides a tax calculation strategy that handles calculating the taxes accounting for defined tax rates, and settings such as whether tax-inclusive pricing is enabled.

You can override the tax calculation strategy to implement different calculation logic or to integrate a third-party service that handles the tax calculation. You can override it either in a Medusa backend setup or in a plugin.

---

## Step 1: Create Strategy Class

A tax calculation strategy should be defined in a TypeScript or JavaScript file created under the `src/strategies` directory. The class must also implement the `ITaxCalculationStrategy` interface imported from the `@medusajs/medusa` package.

For example, you can create the file `src/strategies/tax-calculation.ts` with the following content:

```ts title="src/strategies/tax-calculation.ts"
import { 
  ITaxCalculationStrategy,
  LineItem,
  LineItemTaxLine,
  ShippingMethodTaxLine,
  TaxCalculationContext,
} from "@medusajs/medusa"

class TaxCalculationStrategy 
  implements ITaxCalculationStrategy {

  async calculate(
    items: LineItem[], 
    taxLines: (ShippingMethodTaxLine | LineItemTaxLine)[], 
    calculationContext: TaxCalculationContext
  ): Promise<number> {
    throw new Error("Method not implemented.")
  }

}

export default TaxCalculationStrategy
```

Note that you add a basic implementation of the `calculate` method because it’s required by the `ITaxCalculationStrategy` interface. You’ll learn about the method later in the guide.

### Using a Constructor

You can use a constructor to access services and resources registered in the dependency container using dependency injection. For example:

```ts title="src/strategies/tax-calculation.ts"
// ...
import {
  LineItemService,
} from "@medusajs/medusa"

type InjectedDependencies = {
  lineItemService: LineItemService
}

class TaxCalculationStrategy 
  implements ITaxCalculationStrategy {

  protected readonly lineItemService_: LineItemService

  constructor({ lineItemService }: InjectedDependencies) {
    this.lineItemService_ = lineItemService
  }
    
  // ...
}
```

---

## Step 2: Implement the calculate Method

A tax calculation strategy is only required to implement the `calculate` method. This method is used whenever the totals are calculated.

:::tip

If automatic tax calculation is disabled, then the tax calculation strategy will only be used when taxes are calculated manually as explain [this guide](../storefront/manual-calculation.md).

:::

The `calculate` method expects three parameters:

- `items`: the first parameter is an array of [line item](../../../references/entities/classes/entities.LineItem.mdx) objects.
- `taxLines`: the second parameter is an array of either [shipping method tax line](../../../references/entities/classes/entities.ShippingMethodTaxLine.mdx) or [line item tax line](../../../references/entities/classes/entities.LineItemTaxLine.mdx) objects.
- `calculationContext`: an object holding the context of the tax calculation. The object has the following properties:
  - `shipping_address`: an optional address object used for shipping.
  - `customer`: an optional customer object.
  - `region`: an optional region object.
  - `is_return`: a boolean value that determines whether the taxes are being calculated for a return flow.
  - `shipping_methods`: an array of shipping methods being used in the current context.
  - `allocation_map`: an object that indicates the gift cards and discounts applied on line items. Each object key or property is an ID of a line item, and the value is an object having the following properties:
    - `gift_card`: an optional object indicating the gift card applied on the line item.
    - `discount`: an optional object indicating the discount applied on the line item.

The method returns a number, being the tax amount for the line items, tax lines, and context provided.

---

## Step 3: Run Build Command

In the directory of the Medusa backend, run the `build` command to transpile the files in the `src` directory into the `dist` directory:

```bash npm2yarn
npm run build
```

---

## Test it Out

Run your backend to test it out:

```bash npm2yarn
npx medusa develop
```

To test it out, you can simulate a checkout flow and check the calculated taxes to see if it matches the logic you implemented in the `calculate` method.

:::tip

As mentioned earlier, if automatic calculation of taxes is disabled in the region, you have to manually trigger tax calculation as explained in [this guide](../storefront/manual-calculation.md).

:::
