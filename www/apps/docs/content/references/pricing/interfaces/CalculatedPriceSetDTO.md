---
displayed_sidebar: pricingReference
---

# CalculatedPriceSetDTO

An object that holds the details of a calculated price set.

## Properties

### amount

 **amount**: ``null`` \| `number`

a number indicating the calculated amount. It can possibly be `null` if there's no price set up for the provided context.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:66](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L66)

___

### currency\_code

 **currency\_code**: ``null`` \| `string`

a string indicating the currency code of the calculated price. It can possibly be `null`.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:67](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L67)

___

### id

 **id**: `string`

a string indicating the ID of the price set.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:65](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L65)

___

### max\_quantity

 **max\_quantity**: ``null`` \| `number`

a number indicaitng the maximum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:69](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L69)

___

### min\_quantity

 **min\_quantity**: ``null`` \| `number`

a number indicaitng the minimum quantity required to be purchased for this price to apply. It's set if the `quantity` property is provided in the context. Otherwise, its value will be `null`.

#### Defined in

[packages/types/src/pricing/common/price-set.ts:68](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/pricing/common/price-set.ts#L68)
