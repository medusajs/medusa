# PriceSetMoneyAmountDTO

A price set money amount's data.

## Properties

### id

 **id**: `string`

The ID of a price set money amount.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount.d.ts:16

___

### money\_amount

 `Optional` **money\_amount**: [`MoneyAmountDTO`](MoneyAmountDTO.md)

The money amount associated with the price set money amount. It may only be available if the relation `money_amount` is expanded.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount.d.ts:21

___

### price\_rules

 `Optional` **price\_rules**: [`PriceRuleDTO`](PriceRuleDTO.md)[]

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount.d.ts:20

___

### price\_set

 `Optional` **price\_set**: [`PriceSetDTO`](PriceSetDTO.md)

The price set associated with the price set money amount. It may only be available if the relation `price_set` is expanded.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount.d.ts:18

___

### price\_set\_id

 `Optional` **price\_set\_id**: `string`

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount.d.ts:19

___

### title

 `Optional` **title**: `string`

The title of the price set money amount.

#### Defined in

packages/types/dist/pricing/common/price-set-money-amount.d.ts:17
