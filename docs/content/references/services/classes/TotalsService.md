# Class: TotalsService

A service that calculates total and subtotals for orders, carts etc..

**`implements`** {BaseService}

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

[services/totals.ts:90](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L90)

## Properties

### taxCalculationStrategy\_

• `Private` **taxCalculationStrategy\_**: `ITaxCalculationStrategy`

#### Defined in

[services/totals.ts:88](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L88)

___

### taxProviderService\_

• `Private` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[services/totals.ts:87](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L87)

## Methods

### calculateDiscount\_

▸ **calculateDiscount_**(`lineItem`, `variant`, `variantPrice`, `value`, `discountType`): `LineDiscount`

Calculates either fixed or percentage discount of a variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItem` | `LineItem` | id of line item |
| `variant` | `string` | id of variant in line item |
| `variantPrice` | `number` | price of the variant based on region |
| `value` | `number` | discount value |
| `discountType` | `DiscountRuleType` | the type of discount (fixed or percentage) |

#### Returns

`LineDiscount`

triples of lineitem, variant and applied discount

#### Defined in

[services/totals.ts:545](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L545)

___

### getAllocationItemDiscounts

▸ **getAllocationItemDiscounts**(`discount`, `cart`): `LineDiscount`[]

If the rule of a discount has allocation="item", then we need
to calculate discount on each item in the cart. Furthermore, we need to
make sure to only apply the discount on valid variants. And finally we
return ether an array of percentages discounts or fixed discounts
alongside the variant on which the discount was applied.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discount` | `Discount` | the discount to which we do the calculation |
| `cart` | `Cart` \| `Order` | the cart to calculate discounts for |

#### Returns

`LineDiscount`[]

array of triples of lineitem, variant and applied discount

#### Defined in

[services/totals.ts:587](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L587)

___

### getAllocationMap

▸ **getAllocationMap**(`orderOrCart`, `options?`): `LineAllocationsMap`

Gets a map of discounts and gift cards that apply to line items in an
order. The function calculates the amount of a discount or gift card that
applies to a specific line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderOrCart` | `Cart` \| `Order` | the order or cart to get an allocation map for |
| `options` | `AllocationMapOptions` | controls what should be included in allocation map |

#### Returns

`LineAllocationsMap`

the allocation map for the line items in the cart or order.

#### Defined in

[services/totals.ts:368](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L368)

___

### getCalculationContext

▸ **getCalculationContext**(`cartOrOrder`, `options?`): `TaxCalculationContext`

Prepares the calculation context for a tax total calculation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to get the calculation context for |
| `options` | `CalculationContextOptions` | options to gather context by |

#### Returns

`TaxCalculationContext`

the tax calculation context

#### Defined in

[services/totals.ts:892](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L892)

___

### getDiscountTotal

▸ **getDiscountTotal**(`cartOrOrder`): `number`

Calculates the total discount amount for each of the different supported
discount types. If discounts aren't present or invalid returns 0.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to calculate discounts for |

#### Returns

`number`

the total discounts amount

#### Defined in

[services/totals.ts:858](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L858)

___

### getGiftCardTotal

▸ **getGiftCardTotal**(`cartOrOrder`): `number`

Gets the gift card amount on a cart or order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to get gift card amount for |

#### Returns

`number`

the gift card amount applied to the cart or order

#### Defined in

[services/totals.ts:830](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L830)

___

### getLineDiscounts

▸ **getLineDiscounts**(`cartOrOrder`, `discount`): `LineDiscountAmount`[]

Returns the discount amount allocated to the line items of an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to get line discount allocations for |
| `discount` | `Discount` | the discount to use as context for the calculation |

#### Returns

`LineDiscountAmount`[]

the allocations that the discount has on the items in the cart or
  order

#### Defined in

[services/totals.ts:638](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L638)

___

### getLineItemAdjustmentsTotal

▸ **getLineItemAdjustmentsTotal**(`cartOrOrder`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` |

#### Returns

`number`

#### Defined in

[services/totals.ts:615](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L615)

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

[services/totals.ts:600](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L600)

___

### getLineItemRefund

▸ **getLineItemRefund**(`order`, `lineItem`): `number`

The amount that can be refunded for a given line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | order to use as context for the calculation |
| `lineItem` | `LineItem` | the line item to calculate the refund amount for. |

#### Returns

`number`

the line item refund amount.

#### Defined in

[services/totals.ts:460](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L460)

___

### getLineItemTotal

▸ **getLineItemTotal**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<`number`\>

Gets a total for a line item. The total can take gift cards, discounts and
taxes into account. This can be controlled through the options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItem` | `LineItem` | the line item to calculate a total for |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to use as context for the calculation |
| `options` | `GetLineItemTotalOptions` | the options to use for the calculation |

#### Returns

`Promise`<`number`\>

the line item total

#### Defined in

[services/totals.ts:800](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L800)

___

### getLineItemTotals

▸ **getLineItemTotals**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<`LineItemTotals`\>

Breaks down the totals related to a line item; these are the subtotal, the
amount of discount applied to the line item, the amount of a gift card
applied to a line item and the amount of tax applied to a line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItem` | `LineItem` | the line item to calculate totals for |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to use as context for the calculation |
| `options` | `LineItemTotalsOptions` | the options to evaluate the line item totals for |

#### Returns

`Promise`<`LineItemTotals`\>

the breakdown of the line item totals

#### Defined in

[services/totals.ts:684](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L684)

___

### getPaidTotal

▸ **getPaidTotal**(`order`): `number`

Gets the total payments made on an order

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to calculate paid amount for |

#### Returns

`number`

the total paid amount

#### Defined in

[services/totals.ts:125](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L125)

___

### getRefundTotal

▸ **getRefundTotal**(`order`, `lineItems`): `number`

Calculates refund total of line items.
If any of the items to return have been discounted, we need to
apply the discount again before refunding them.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | cart or order to calculate subtotal for |
| `lineItems` | `LineItem`[] | the line items to calculate refund total for |

#### Returns

`number`

the calculated subtotal

#### Defined in

[services/totals.ts:504](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L504)

___

### getRefundedTotal

▸ **getRefundedTotal**(`order`): `number`

Gets the total refund amount for an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to get total refund amount for. |

#### Returns

`number`

the total refunded amount for an order.

#### Defined in

[services/totals.ts:445](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L445)

___

### getShippingMethodTotals

▸ **getShippingMethodTotals**(`shippingMethod`, `cartOrOrder`, `opts?`): `Promise`<`ShippingMethodTotals`\>

Gets the totals breakdown for a shipping method. Fetches tax lines if not
already provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethod` | `ShippingMethod` | the shipping method to get totals breakdown for. |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to use as context for the breakdown |
| `opts` | `GetShippingMethodTotalsOptions` | options for what should be included |

#### Returns

`Promise`<`ShippingMethodTotals`\>

An object that breaks down the totals for the shipping method

#### Defined in

[services/totals.ts:159](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L159)

___

### getShippingTotal

▸ **getShippingTotal**(`cartOrOrder`): `number`

Calculates shipping total

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | cart or order to calculate subtotal for |

#### Returns

`number`

shipping total

#### Defined in

[services/totals.ts:267](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L267)

___

### getSubtotal

▸ **getSubtotal**(`cartOrOrder`, `opts?`): `number`

Calculates subtotal of a given cart or order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | cart or order to calculate subtotal for |
| `opts` | `SubtotalOptions` | options |

#### Returns

`number`

the calculated subtotal

#### Defined in

[services/totals.ts:243](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L243)

___

### getSwapTotal

▸ **getSwapTotal**(`order`): `number`

The total paid for swaps. May be negative in case of negative swap
difference.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | the order to calculate swap total for |

#### Returns

`number`

the swap total

#### Defined in

[services/totals.ts:140](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L140)

___

### getTaxTotal

▸ **getTaxTotal**(`cartOrOrder`, `forceTaxes?`): `Promise`<``null`` \| `number`\>

Calculates tax total
Currently based on the Danish tax system

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | `undefined` | cart or order to calculate tax total for |
| `forceTaxes` | `boolean` | `false` | whether taxes should be calculated regardless   of region settings |

#### Returns

`Promise`<``null`` \| `number`\>

tax total

#### Defined in

[services/totals.ts:282](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L282)

___

### getTotal

▸ **getTotal**(`cartOrOrder`, `options?`): `Promise`<`number`\>

Calculates subtotal of a given cart or order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | object to calculate total for |
| `options` | `GetTotalsOptions` | options to calculate by |

#### Returns

`Promise`<`number`\>

the calculated subtotal

#### Defined in

[services/totals.ts:106](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L106)

___

### rounded

▸ **rounded**(`value`): `number`

Rounds a number using Math.round.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` | the value to round |

#### Returns

`number`

the rounded value

#### Defined in

[services/totals.ts:922](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/totals.ts#L922)
