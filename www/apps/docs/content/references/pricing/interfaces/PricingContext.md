---
displayed_sidebar: pricingReference
---

# PricingContext

Used to specify the context to calculate prices. For example, you can specify the currency code to calculate prices in.

**Example**

```ts
To calculate prices
```

## Properties

### context

 `Optional` **context**: [`Record`](../types/Record.md)<`string`, `string` \| `number`\>

an object whose keys are the name of the context attribute. Its value can be a string or a number. For example, you can pass the `currency_code` property with its value being the currency code to calculate the price in.
Another example is passing the `quantity` property to calculate the price for that specified quantity, which finds a price set whose `min_quantity` and `max_quantity` conditions match the specified quantity.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:23](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L23)
