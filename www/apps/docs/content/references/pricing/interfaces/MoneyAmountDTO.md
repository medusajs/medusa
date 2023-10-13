---
displayed_sidebar: pricingReference
---

# MoneyAmountDTO

An object that holds prices, which typically belong to a price set.

## Properties

### amount

 `Optional` **amount**: `number`

A number indicating the amount of this price.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:20](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L20)

___

### currency

 `Optional` **currency**: [`CurrencyDTO`](CurrencyDTO.md)

An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the price's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:19](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L19)

___

### currency\_code

 `Optional` **currency\_code**: `string`

A string that indicates the currency code of this price.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:18](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L18)

___

### id

 **id**: `string`

A string that indicates the ID of the money amount. A money amount represents a price.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:17](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L17)

___

### max\_quantity

 `Optional` **max\_quantity**: `number`

A number that indicates the maximum quantity required to be purchased for this price to be applied.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:22](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L22)

___

### min\_quantity

 `Optional` **min\_quantity**: `number`

A number that indicates the minimum quantity required to be purchased for this price to be applied.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:21](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L21)
