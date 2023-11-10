# CreatePricesDTO

The prices to create part of a price set.

## Hierarchy

- [`CreateMoneyAmountDTO`](CreateMoneyAmountDTO.md)

  ↳ **`CreatePricesDTO`**

## Properties

### amount

 `Optional` **amount**: `number`

The amount of this money amount.

#### Inherited from

[CreateMoneyAmountDTO](CreateMoneyAmountDTO.md).[amount](CreateMoneyAmountDTO.md#amount)

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:39

___

### currency

 `Optional` **currency**: [`CreateCurrencyDTO`](CreateCurrencyDTO.md)

The currency of this money amount.

#### Inherited from

[CreateMoneyAmountDTO](CreateMoneyAmountDTO.md).[currency](CreateMoneyAmountDTO.md#currency)

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:38

___

### currency\_code

 **currency\_code**: `string`

The currency code of this money amount.

#### Inherited from

[CreateMoneyAmountDTO](CreateMoneyAmountDTO.md).[currency_code](CreateMoneyAmountDTO.md#currency_code)

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:37

___

### id

 `Optional` **id**: `string`

The ID of the money amount.

#### Inherited from

[CreateMoneyAmountDTO](CreateMoneyAmountDTO.md).[id](CreateMoneyAmountDTO.md#id)

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:36

___

### max\_quantity

 `Optional` **max\_quantity**: ``null`` \| `number`

The maximum quantity required to be purchased for this money amount to be applied.

#### Inherited from

[CreateMoneyAmountDTO](CreateMoneyAmountDTO.md).[max_quantity](CreateMoneyAmountDTO.md#max_quantity)

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:41

___

### min\_quantity

 `Optional` **min\_quantity**: ``null`` \| `number`

The minimum quantity required to be purchased for this money amount to be applied.

#### Inherited from

[CreateMoneyAmountDTO](CreateMoneyAmountDTO.md).[min_quantity](CreateMoneyAmountDTO.md#min_quantity)

#### Defined in

packages/types/dist/pricing/common/money-amount.d.ts:40

___

### rules

 **rules**: Record<`string`, `string`\>

The rules to add to the price. The object's keys are rule types' `rule_attribute` attribute, and values are the value of that rule associated with this price.

#### Defined in

packages/types/dist/pricing/common/price-set.d.ts:82
