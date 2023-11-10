# PricingContext

The context to calculate prices. For example, you can specify the currency code to calculate prices in.

## Properties

### context

 `Optional` **context**: Record<`string`, `string` \| `number`\>

an object whose keys are the name of the context attribute. Its value can be a string or a number. For example, you can pass the `currency_code` property with its value being the currency code to calculate the price in.
Another example is passing the `quantity` property to calculate the price for that specified quantity, which finds a price set whose `min_quantity` and `max_quantity` conditions match the specified quantity.

#### Defined in

packages/types/dist/pricing/common/price-set.d.ts:15
