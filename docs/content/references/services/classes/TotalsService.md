# Class: TotalsService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`TotalsService`**

## Constructors

### constructor

• **new TotalsService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `TotalsServiceProps` |

#### Overrides

BaseService.constructor

#### Defined in

[services/totals.ts:90](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L90)

## Properties

### taxCalculationStrategy\_

• `Private` **taxCalculationStrategy\_**: `ITaxCalculationStrategy`

#### Defined in

[services/totals.ts:88](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L88)

___

### taxProviderService\_

• `Private` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[services/totals.ts:87](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L87)

## Methods

### calculateDiscount\_

▸ **calculateDiscount_**(`lineItem`, `variant`, `variantPrice`, `value`, `discountType`): `LineDiscount`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItem` | `LineItem` |  |
| `variant` | `string` |  |
| `variantPrice` | `number` |  |
| `value` | `number` |  |
| `discountType` | `DiscountRuleType` |  |

#### Returns

`LineDiscount`

#### Defined in

[services/totals.ts:553](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L553)

___

### getAllocationItemDiscounts

▸ **getAllocationItemDiscounts**(`discount`, `cart`): `LineDiscount`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discount` | `Discount` |  |
| `cart` | `Order` \| `Cart` |  |

#### Returns

`LineDiscount`[]

#### Defined in

[services/totals.ts:595](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L595)

___

### getAllocationMap

▸ **getAllocationMap**(`orderOrCart`, `options?`): `LineAllocationsMap`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderOrCart` | `Order` \| `Cart` |  |
| `options` | `AllocationMapOptions` |  |

#### Returns

`LineAllocationsMap`

#### Defined in

[services/totals.ts:376](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L376)

___

### getCalculationContext

▸ **getCalculationContext**(`cartOrOrder`, `options?`): `TaxCalculationContext`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` |  |
| `options` | `CalculationContextOptions` |  |

#### Returns

`TaxCalculationContext`

#### Defined in

[services/totals.ts:959](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L959)

___

### getDiscountTotal

▸ **getDiscountTotal**(`cartOrOrder`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` |  |

#### Returns

`number`

#### Defined in

[services/totals.ts:925](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L925)

___

### getGiftCardTotal

▸ **getGiftCardTotal**(`cartOrOrder`): `Object`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` |  |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `tax_total` | `number` |
| `total` | `number` |

#### Defined in

[services/totals.ts:853](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L853)

___

### getGiftCardableAmount

▸ **getGiftCardableAmount**(`cartOrOrder`): `Promise`<`number`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` |  |

#### Returns

`Promise`<`number`\>

#### Defined in

[services/totals.ts:838](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L838)

___

### getLineDiscounts

▸ **getLineDiscounts**(`cartOrOrder`, `discount`): `LineDiscountAmount`[]

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` |  |
| `discount` | `Discount` |  |

#### Returns

`LineDiscountAmount`[]

#### Defined in

[services/totals.ts:646](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L646)

___

### getLineItemAdjustmentsTotal

▸ **getLineItemAdjustmentsTotal**(`cartOrOrder`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` |

#### Returns

`number`

#### Defined in

[services/totals.ts:623](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L623)

___

### getLineItemDiscountAdjustment

▸ **getLineItemDiscountAdjustment**(`lineItem`, `discount`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lineItem` | `LineItem` |
| `discount` | `Discount` |

#### Returns

`number`

#### Defined in

[services/totals.ts:608](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L608)

___

### getLineItemRefund

▸ **getLineItemRefund**(`order`, `lineItem`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |
| `lineItem` | `LineItem` |  |

#### Returns

`number`

#### Defined in

[services/totals.ts:468](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L468)

___

### getLineItemTotal

▸ **getLineItemTotal**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<`number`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItem` | `LineItem` |  |
| `cartOrOrder` | `Order` \| `Cart` |  |
| `options` | `GetLineItemTotalOptions` |  |

#### Returns

`Promise`<`number`\>

#### Defined in

[services/totals.ts:807](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L807)

___

### getLineItemTotals

▸ **getLineItemTotals**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<`LineItemTotals`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItem` | `LineItem` |  |
| `cartOrOrder` | `Order` \| `Cart` |  |
| `options` | `LineItemTotalsOptions` |  |

#### Returns

`Promise`<`LineItemTotals`\>

#### Defined in

[services/totals.ts:692](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L692)

___

### getPaidTotal

▸ **getPaidTotal**(`order`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |

#### Returns

`number`

#### Defined in

[services/totals.ts:129](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L129)

___

### getRefundTotal

▸ **getRefundTotal**(`order`, `lineItems`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |
| `lineItems` | `LineItem`[] |  |

#### Returns

`number`

#### Defined in

[services/totals.ts:512](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L512)

___

### getRefundedTotal

▸ **getRefundedTotal**(`order`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |

#### Returns

`number`

#### Defined in

[services/totals.ts:453](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L453)

___

### getShippingMethodTotals

▸ **getShippingMethodTotals**(`shippingMethod`, `cartOrOrder`, `opts?`): `Promise`<`ShippingMethodTotals`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethod` | `ShippingMethod` |  |
| `cartOrOrder` | `Order` \| `Cart` |  |
| `opts` | `GetShippingMethodTotalsOptions` |  |

#### Returns

`Promise`<`ShippingMethodTotals`\>

#### Defined in

[services/totals.ts:163](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L163)

___

### getShippingTotal

▸ **getShippingTotal**(`cartOrOrder`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` |  |

#### Returns

`number`

#### Defined in

[services/totals.ts:271](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L271)

___

### getSubtotal

▸ **getSubtotal**(`cartOrOrder`, `opts?`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` |  |
| `opts` | `SubtotalOptions` |  |

#### Returns

`number`

#### Defined in

[services/totals.ts:247](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L247)

___

### getSwapTotal

▸ **getSwapTotal**(`order`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` |  |

#### Returns

`number`

#### Defined in

[services/totals.ts:144](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L144)

___

### getTaxTotal

▸ **getTaxTotal**(`cartOrOrder`, `forceTaxes?`): `Promise`<``null`` \| `number`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` | `undefined` |  |
| `forceTaxes` | `boolean` | `false` |  |

#### Returns

`Promise`<``null`` \| `number`\>

#### Defined in

[services/totals.ts:286](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L286)

___

### getTotal

▸ **getTotal**(`cartOrOrder`, `options?`): `Promise`<`number`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` |  |
| `options` | `GetTotalsOptions` |  |

#### Returns

`Promise`<`number`\>

#### Defined in

[services/totals.ts:106](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L106)

___

### rounded

▸ **rounded**(`value`): `number`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` |  |

#### Returns

`number`

#### Defined in

[services/totals.ts:989](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/totals.ts#L989)
