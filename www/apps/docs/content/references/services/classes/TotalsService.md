# TotalsService

A service that calculates total and subtotals for orders, carts etc..

**Implements**

## Hierarchy

- `TransactionBaseService`

  ↳ **`TotalsService`**

## Constructors

### constructor

**new TotalsService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `TotalsServiceProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/totals.ts:112](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L112)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/totals.ts:110](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L110)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### newTotalsService\_

 `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[medusa/src/services/totals.ts:108](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L108)

___

### taxCalculationStrategy\_

 `Protected` `Readonly` **taxCalculationStrategy\_**: `ITaxCalculationStrategy`

#### Defined in

[medusa/src/services/totals.ts:109](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L109)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/totals.ts:107](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L107)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### atomicPhase\_

`Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

Wraps some work within a transactional block. If the service already has
a transaction manager attached this will be reused, otherwise a new
transaction manager is created.

| Name |
| :------ |
| `TResult` | `object` |
| `TError` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### calculateDiscount\_

**calculateDiscount_**(`lineItem`, `variant`, `variantPrice`, `value`, `discountType`): `LineDiscount`

Calculates either fixed or percentage discount of a variant

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItem` | `LineItem` | id of line item |
| `variant` | `string` | id of variant in line item |
| `variantPrice` | `number` | price of the variant based on region |
| `value` | `number` | discount value |
| `discountType` | `DiscountRuleType` | the type of discount (fixed or percentage) |

#### Returns

`LineDiscount`

**Deprecated**

- in favour of DiscountService.calculateDiscountForLineItem

#### Defined in

[medusa/src/services/totals.ts:627](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L627)

___

### getAllocationItemDiscounts

**getAllocationItemDiscounts**(`discount`, `cart`): `LineDiscount`[]

If the rule of a discount has allocation="item", then we need
to calculate discount on each item in the cart. Furthermore, we need to
make sure to only apply the discount on valid variants. And finally we
return ether an array of percentages discounts or fixed discounts
alongside the variant on which the discount was applied.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discount` | `Discount` | the discount to which we do the calculation |
| `cart` | `Order` \| `Cart` | the cart to calculate discounts for |

#### Returns

`LineDiscount`[]

-`LineDiscount[]`: array of triples of lineitem, variant and applied discount

#### Defined in

[medusa/src/services/totals.ts:669](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L669)

___

### getAllocationMap

**getAllocationMap**(`orderOrCart`, `options?`): `Promise`<`LineAllocationsMap`\>

Gets a map of discounts and gift cards that apply to line items in an
order. The function calculates the amount of a discount or gift card that
applies to a specific line item.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderOrCart` | `object` | the order or cart to get an allocation map for |
| `orderOrCart.claims?` | `ClaimOrder`[] |
| `orderOrCart.discounts?` | `Discount`[] |
| `orderOrCart.items` | `LineItem`[] |
| `orderOrCart.swaps?` | `Swap`[] |
| `options` | `AllocationMapOptions` | controls what should be included in allocation map |

#### Returns

`Promise`<`LineAllocationsMap`\>

-`Promise`: the allocation map for the line items in the cart or order.

#### Defined in

[medusa/src/services/totals.ts:435](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L435)

___

### getCalculationContext

**getCalculationContext**(`calculationContextData`, `options?`): `Promise`<`TaxCalculationContext`\>

Prepares the calculation context for a tax total calculation.

#### Parameters

| Name | Description |
| :------ | :------ |
| `calculationContextData` | `CalculationContextData` | the calculationContextData to get the calculation context for |
| `options` | `CalculationContextOptions` | options to gather context by |

#### Returns

`Promise`<`TaxCalculationContext`\>

-`Promise`: the tax calculation context

#### Defined in

[medusa/src/services/totals.ts:1028](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L1028)

___

### getDiscountTotal

**getDiscountTotal**(`cartOrOrder`): `Promise`<`number`\>

Calculates the total discount amount for each of the different supported
discount types. If discounts aren't present or invalid returns 0.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` | the cart or order to calculate discounts for |

#### Returns

`Promise`<`number`\>

-`Promise`: the total discounts amount
	-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:1006](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L1006)

___

### getGiftCardTotal

**getGiftCardTotal**(`cartOrOrder`, `opts?`): `Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

Gets the gift card amount on a cart or order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` | the cart or order to get gift card amount for |
| `opts` | `object` |
| `opts.gift_cardable?` | `number` |

#### Returns

`Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

-`Promise`: the gift card amount applied to the cart or order
	-``object``: (optional) 

#### Defined in

[medusa/src/services/totals.ts:975](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L975)

___

### getGiftCardableAmount

**getGiftCardableAmount**(`cartOrOrder`): `Promise`<`number`\>

Gets the amount that can be gift carded on a cart. In regions where gift
cards are taxable this amount should exclude taxes.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` | the cart or order to get gift card amount for |

#### Returns

`Promise`<`number`\>

-`Promise`: the gift card amount applied to the cart or order
	-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:958](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L958)

___

### getLineDiscounts

**getLineDiscounts**(`cartOrOrder`, `discount?`): `LineDiscountAmount`[]

Returns the discount amount allocated to the line items of an order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | `object` | the cart or order to get line discount allocations for |
| `cartOrOrder.claims?` | `ClaimOrder`[] |
| `cartOrOrder.items` | `LineItem`[] |
| `cartOrOrder.swaps?` | `Swap`[] |
| `discount?` | `Discount` | the discount to use as context for the calculation |

#### Returns

`LineDiscountAmount`[]

-`LineDiscountAmount[]`: the allocations that the discount has on the items in the cart or
  order

#### Defined in

[medusa/src/services/totals.ts:720](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L720)

___

### getLineItemAdjustmentsTotal

**getLineItemAdjustmentsTotal**(`cartOrOrder`): `number`

#### Parameters

| Name |
| :------ |
| `cartOrOrder` | `Order` \| `Cart` |

#### Returns

`number`

-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:697](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L697)

___

### getLineItemDiscountAdjustment

**getLineItemDiscountAdjustment**(`lineItem`, `discount`): `number`

#### Parameters

| Name |
| :------ |
| `lineItem` | `LineItem` |
| `discount` | `Discount` |

#### Returns

`number`

-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:682](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L682)

___

### getLineItemRefund

**getLineItemRefund**(`order`, `lineItem`): `Promise`<`number`\>

The amount that can be refunded for a given line item.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | `Order` | order to use as context for the calculation |
| `lineItem` | `LineItem` | the line item to calculate the refund amount for. |

#### Returns

`Promise`<`number`\>

-`Promise`: the line item refund amount.
	-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:504](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L504)

___

### getLineItemTotal

**getLineItemTotal**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<`number`\>

Gets a total for a line item. The total can take gift cards, discounts and
taxes into account. This can be controlled through the options.

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItem` | `LineItem` | the line item to calculate a total for |
| `cartOrOrder` | `Order` \| `Cart` | the cart or order to use as context for the calculation |
| `options` | `GetLineItemTotalOptions` | the options to use for the calculation |

#### Returns

`Promise`<`number`\>

-`Promise`: the line item total
	-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:931](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L931)

___

### getLineItemTotals

**getLineItemTotals**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<`LineItemTotals`\>

Breaks down the totals related to a line item; these are the subtotal, the
amount of discount applied to the line item, the amount of a gift card
applied to a line item and the amount of tax applied to a line item.

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItem` | `LineItem` | the line item to calculate totals for |
| `cartOrOrder` | `Order` \| `Cart` | the cart or order to use as context for the calculation |
| `options` | `LineItemTotalsOptions` | the options to evaluate the line item totals for |

#### Returns

`Promise`<`LineItemTotals`\>

-`Promise`: the breakdown of the line item totals

#### Defined in

[medusa/src/services/totals.ts:776](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L776)

___

### getPaidTotal

**getPaidTotal**(`order`): `number`

Gets the total payments made on an order

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | `Order` | the order to calculate paid amount for |

#### Returns

`number`

-`number`: (optional) the total paid amount

#### Defined in

[medusa/src/services/totals.ts:157](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L157)

___

### getRefundTotal

**getRefundTotal**(`order`, `lineItems`): `Promise`<`number`\>

Calculates refund total of line items.
If any of the items to return have been discounted, we need to
apply the discount again before refunding them.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | `Order` | cart or order to calculate subtotal for |
| `lineItems` | `LineItem`[] | the line items to calculate refund total for |

#### Returns

`Promise`<`number`\>

-`Promise`: the calculated subtotal
	-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:583](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L583)

___

### getRefundedTotal

**getRefundedTotal**(`order`): `number`

Gets the total refund amount for an order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | `Order` | the order to get total refund amount for. |

#### Returns

`number`

-`number`: (optional) the total refunded amount for an order.

#### Defined in

[medusa/src/services/totals.ts:489](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L489)

___

### getShippingMethodTotals

**getShippingMethodTotals**(`shippingMethod`, `cartOrOrder`, `opts?`): `Promise`<`ShippingMethodTotals`\>

Gets the totals breakdown for a shipping method. Fetches tax lines if not
already provided.

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingMethod` | `ShippingMethod` | the shipping method to get totals breakdown for. |
| `cartOrOrder` | `Order` \| `Cart` | the cart or order to use as context for the breakdown |
| `opts` | `GetShippingMethodTotalsOptions` | options for what should be included |

#### Returns

`Promise`<`ShippingMethodTotals`\>

-`Promise`: An object that breaks down the totals for the shipping method

#### Defined in

[medusa/src/services/totals.ts:191](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L191)

___

### getShippingTotal

**getShippingTotal**(`cartOrOrder`): `Promise`<`number`\>

Calculates shipping total

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` | cart or order to calculate subtotal for |

#### Returns

`Promise`<`number`\>

-`Promise`: shipping total
	-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:319](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L319)

___

### getSubtotal

**getSubtotal**(`cartOrOrder`, `opts?`): `Promise`<`number`\>

Calculates subtotal of a given cart or order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` | cart or order to calculate subtotal for |
| `opts` | `SubtotalOptions` | options |

#### Returns

`Promise`<`number`\>

-`Promise`: the calculated subtotal
	-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:283](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L283)

___

### getSwapTotal

**getSwapTotal**(`order`): `number`

The total paid for swaps. May be negative in case of negative swap
difference.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | `Order` | the order to calculate swap total for |

#### Returns

`number`

-`number`: (optional) the swap total

#### Defined in

[medusa/src/services/totals.ts:172](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L172)

___

### getTaxTotal

**getTaxTotal**(`cartOrOrder`, `forceTaxes?`): `Promise`<``null`` \| `number`\>

Calculates tax total
Currently based on the Danish tax system

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` | cart or order to calculate tax total for |
| `forceTaxes` | `boolean` | `false` | whether taxes should be calculated regardless of region settings |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: tax total
	-```null`` \| number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:346](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L346)

___

### getTotal

**getTotal**(`cartOrOrder`, `options?`): `Promise`<`number`\>

Calculates total of a given cart or order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | `Order` \| `Cart` | object to calculate total for |
| `options` | `GetTotalsOptions` | options to calculate by |

#### Returns

`Promise`<`number`\>

-`Promise`: the calculated subtotal
	-`number`: (optional) 

#### Defined in

[medusa/src/services/totals.ts:134](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L134)

___

### rounded

**rounded**(`value`): `number`

Rounds a number using Math.round.

#### Parameters

| Name | Description |
| :------ | :------ |
| `value` | `number` | the value to round |

#### Returns

`number`

-`number`: (optional) the rounded value

#### Defined in

[medusa/src/services/totals.ts:1058](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/services/totals.ts#L1058)

___

### shouldRetryTransaction\_

`Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name |
| :------ |
| `err` | Record<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

-`boolean`: (optional) 

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`TotalsService`](TotalsService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`TotalsService`](TotalsService.md)

-`TotalsService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/18f706afc/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
