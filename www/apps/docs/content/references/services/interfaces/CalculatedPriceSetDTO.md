# CalculatedPriceSetDTO

A calculated price set's data.

## Properties

### amount

 **amount**: ``null`` \| `number`

The calculated amount. It can possibly be `null` if there's no price set up for the provided context.

#### Defined in

packages/types/dist/pricing/common/price-set.d.ts:55

___

### currency\_code

 **currency\_code**: ``null`` \| `string`

The currency code of the calculated price. It can possibly be `null`.

#### Defined in

packages/types/dist/pricing/common/price-set.d.ts:56

___

### id

 **id**: `string`

The ID of the price set.

#### Defined in

packages/types/dist/pricing/common/price-set.d.ts:54

___

### max\_quantity

 **max\_quantity**: ``null`` \| `number`

The maximum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.

#### Defined in

packages/types/dist/pricing/common/price-set.d.ts:58

___

### min\_quantity

 **min\_quantity**: ``null`` \| `number`

The minimum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.

#### Defined in

packages/types/dist/pricing/common/price-set.d.ts:57
