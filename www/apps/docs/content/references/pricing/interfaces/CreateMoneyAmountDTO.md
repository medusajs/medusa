---
displayed_sidebar: pricingReference
---

# CreateMoneyAmountDTO

* 

An object that holds data to create a money amount.

## Hierarchy

- **`CreateMoneyAmountDTO`**

  ↳ [`CreatePricesDTO`](CreatePricesDTO.md)

## Properties

### amount

 `Optional` **amount**: `number`

A number indicating the amount of this money amount.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:41](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L41)

___

### currency

 `Optional` **currency**: [`CreateCurrencyDTO`](CreateCurrencyDTO.md)

An object of type [CurrencyDTO](CurrencyDTO.md) that holds the details of the money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:40](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L40)

___

### currency\_code

 **currency\_code**: `string`

A string that indicates the currency code of this money amount.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:39](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L39)

___

### id

 `Optional` **id**: `string`

A string that indicates the ID of the money amount.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:38](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L38)

___

### max\_quantity

 `Optional` **max\_quantity**: `number`

A number that indicates the maximum quantity required to be purchased for this money amount to be applied.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:43](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L43)

___

### min\_quantity

 `Optional` **min\_quantity**: `number`

A number that indicates the minimum quantity required to be purchased for this money amount to be applied.

#### Defined in

[packages/types/src/pricing/common/money-amount.ts:42](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/money-amount.ts#L42)
