# MoneyAmountDTO

A money amount's data. A money amount represents a price.

## Properties

### amount

 `Optional` **amount**: `number`

The price of this money amount.

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:19

___

### currency

 `Optional` **currency**: [`CurrencyDTO`](CurrencyDTO.md)

The money amount's currency. Since this is a relation, it will only be retrieved if it's passed to the `relations` array of the find-configuration options.

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:18

___

### currency\_code

 `Optional` **currency\_code**: `string`

The currency code of this money amount.

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:17

___

### id

 **id**: `string`

The ID of the money amount.

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:16

___

### max\_quantity

 `Optional` **max\_quantity**: `number`

The maximum quantity required to be purchased for this price to be applied.

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:21

___

### min\_quantity

 `Optional` **min\_quantity**: `number`

The minimum quantity required to be purchased for this price to be applied.

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:20
