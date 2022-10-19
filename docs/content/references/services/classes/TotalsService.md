# Class: TotalsService

A service that calculates total and subtotals for orders, carts etc..

**`Implements`**

## Hierarchy

- `TransactionBaseService`

  ↳ **`TotalsService`**

## Constructors

### constructor

• **new TotalsService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `TotalsServiceProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/totals.ts:108](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L108)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/totals.ts:106](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L106)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/totals.ts:101](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L101)

___

### taxCalculationStrategy\_

• `Protected` `Readonly` **taxCalculationStrategy\_**: `ITaxCalculationStrategy`

#### Defined in

[packages/medusa/src/services/totals.ts:105](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L105)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/totals.ts:104](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L104)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/totals.ts:102](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L102)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

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

[packages/medusa/src/services/totals.ts:609](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L609)

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

[packages/medusa/src/services/totals.ts:651](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L651)

___

### getAllocationMap

▸ **getAllocationMap**(`orderOrCart`, `options?`): `Promise`<`LineAllocationsMap`\>

Gets a map of discounts and gift cards that apply to line items in an
order. The function calculates the amount of a discount or gift card that
applies to a specific line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderOrCart` | `Cart` \| `Order` | the order or cart to get an allocation map for |
| `options` | `AllocationMapOptions` | controls what should be included in allocation map |

#### Returns

`Promise`<`LineAllocationsMap`\>

the allocation map for the line items in the cart or order.

#### Defined in

[packages/medusa/src/services/totals.ts:431](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L431)

___

### getCalculationContext

▸ **getCalculationContext**(`cartOrOrder`, `options?`): `Promise`<`TaxCalculationContext`\>

Prepares the calculation context for a tax total calculation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to get the calculation context for |
| `options` | `CalculationContextOptions` | options to gather context by |

#### Returns

`Promise`<`TaxCalculationContext`\>

the tax calculation context

#### Defined in

[packages/medusa/src/services/totals.ts:1065](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L1065)

___

### getDiscountTotal

▸ **getDiscountTotal**(`cartOrOrder`): `Promise`<`number`\>

Calculates the total discount amount for each of the different supported
discount types. If discounts aren't present or invalid returns 0.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to calculate discounts for |

#### Returns

`Promise`<`number`\>

the total discounts amount

#### Defined in

[packages/medusa/src/services/totals.ts:1035](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L1035)

___

### getGiftCardTotal

▸ **getGiftCardTotal**(`cartOrOrder`, `opts?`): `Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

Gets the gift card amount on a cart or order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to get gift card amount for |
| `opts` | `Object` | - |
| `opts.gift_cardable?` | `number` | - |

#### Returns

`Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

the gift card amount applied to the cart or order

#### Defined in

[packages/medusa/src/services/totals.ts:952](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L952)

___

### getGiftCardableAmount

▸ **getGiftCardableAmount**(`cartOrOrder`): `Promise`<`number`\>

Gets the amount that can be gift carded on a cart. In regions where gift
cards are taxable this amount should exclude taxes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | the cart or order to get gift card amount for |

#### Returns

`Promise`<`number`\>

the gift card amount applied to the cart or order

#### Defined in

[packages/medusa/src/services/totals.ts:935](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L935)

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

[packages/medusa/src/services/totals.ts:702](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L702)

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

[packages/medusa/src/services/totals.ts:679](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L679)

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

[packages/medusa/src/services/totals.ts:664](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L664)

___

### getLineItemRefund

▸ **getLineItemRefund**(`order`, `lineItem`): `Promise`<`number`\>

The amount that can be refunded for a given line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | order to use as context for the calculation |
| `lineItem` | `LineItem` | the line item to calculate the refund amount for. |

#### Returns

`Promise`<`number`\>

the line item refund amount.

#### Defined in

[packages/medusa/src/services/totals.ts:487](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L487)

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

[packages/medusa/src/services/totals.ts:908](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L908)

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

[packages/medusa/src/services/totals.ts:748](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L748)

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

[packages/medusa/src/services/totals.ts:153](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L153)

___

### getRefundTotal

▸ **getRefundTotal**(`order`, `lineItems`): `Promise`<`number`\>

Calculates refund total of line items.
If any of the items to return have been discounted, we need to
apply the discount again before refunding them.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | `Order` | cart or order to calculate subtotal for |
| `lineItems` | `LineItem`[] | the line items to calculate refund total for |

#### Returns

`Promise`<`number`\>

the calculated subtotal

#### Defined in

[packages/medusa/src/services/totals.ts:566](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L566)

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

[packages/medusa/src/services/totals.ts:472](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L472)

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

[packages/medusa/src/services/totals.ts:187](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L187)

___

### getShippingTotal

▸ **getShippingTotal**(`cartOrOrder`): `Promise`<`number`\>

Calculates shipping total

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | cart or order to calculate subtotal for |

#### Returns

`Promise`<`number`\>

shipping total

#### Defined in

[packages/medusa/src/services/totals.ts:315](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L315)

___

### getSubtotal

▸ **getSubtotal**(`cartOrOrder`, `opts?`): `Promise`<`number`\>

Calculates subtotal of a given cart or order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Cart` \| `Order` | cart or order to calculate subtotal for |
| `opts` | `SubtotalOptions` | options |

#### Returns

`Promise`<`number`\>

the calculated subtotal

#### Defined in

[packages/medusa/src/services/totals.ts:279](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L279)

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

[packages/medusa/src/services/totals.ts:168](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L168)

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

[packages/medusa/src/services/totals.ts:342](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L342)

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

[packages/medusa/src/services/totals.ts:130](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L130)

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

[packages/medusa/src/services/totals.ts:1095](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/services/totals.ts#L1095)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`TotalsService`](TotalsService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`TotalsService`](TotalsService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/35df4962f/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
