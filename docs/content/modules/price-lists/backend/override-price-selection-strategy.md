---
description: 'Learn how to override the price selection strategy. The price selection strategy is used to determine the best price based on a specific context.'
addHowToData: true
---

# How to Override Price Selection Strategy

In this document, you’ll learn how to override Medusa’s price selection strategy to create a custom pricing strategy.

:::note

If you’re interested in learning what a price selection strategy is and how it works, check out [this documentation](../price-selection-strategy.md) instead.

:::

## 1. Create Class

Create a TypeScript or JavaScript file in `src/strategies` of your Medusa backend project with a class that extends the `AbstractPriceSelectionStrategy` class:

```ts title=src/strategies/price.ts
import { 
  AbstractPriceSelectionStrategy, 
  IPriceSelectionStrategy, 
  PriceSelectionContext, 
  PriceSelectionResult,
} from "@medusajs/medusa"

import { EntityManager } from "typeorm"

export default class MyStrategy extends 
  AbstractPriceSelectionStrategy {
    withTransaction(
      manager: EntityManager
    ): IPriceSelectionStrategy {
      if (!manager) {
        return this
      }

      return new MyStrategy()
    }

    async calculateVariantPrice(
      variant_id: string,
      context: PriceSelectionContext
    ): Promise<PriceSelectionResult> {
      // TODO
    }
}
```

You can use services or repositories in the strategy by adding them to the constructor and updating the parameters passed to the `MyStrategy` constructor in `withTransaction`. For example:

```ts
import { 
  AbstractPriceSelectionStrategy, 
  CustomerService, 
  IPriceSelectionStrategy, 
  PriceSelectionContext, 
  PriceSelectionResult, 
} from "@medusajs/medusa"

export default class MyStrategy extends 
  AbstractPriceSelectionStrategy {
    private customerService: CustomerService

    constructor({
      customerService,
    }) {
      super()
      this.customerService = customerService
    }

    withTransaction(
      manager: EntityManager
    ): IPriceSelectionStrategy {
      if (!manager) {
        return this
      }

      return new MyStrategy({
        customerService: this.customerService,
      })
    }
    // ...
}
```

---

## 2. Implement calculateVariantPrice

Implement the price selection strategy you want inside the `calculateVariantPrice` method.

This method accepts the variant ID as a first parameter and the [context](../price-selection-strategy.md#context-object) object as a second parameter.

This method must return an object having the following fields:

```ts noReport
{
  originalPrice, // number | null
  calculatedPrice, // number | null
  prices // MoneyAmount[]
}
```

You can learn more about optional properties and the meaning behind every property [here](../price-selection-strategy.md#calculatevariantprice-method).

---

## 3. Run Build Command

In your terminal, run the build command to transpile the files in the `src` directory into the `dist` directory:

```bash npm2yarn
npm run build
```

---

## Test it Out

Run your backend to test it out:

```bash npm2yarn
npm run start
```

Then, try out your strategy using any of the [Products](/api/store/#tag/Product) or [Carts](/api/store/#tag/Cart) endpoints which include retrieving product variants and line items respectively. You should then see the prices in the response based on your implemented strategy.