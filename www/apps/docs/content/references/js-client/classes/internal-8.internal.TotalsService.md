---
displayed_sidebar: jsClientSidebar
---

# Class: TotalsService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).TotalsService

A service that calculates total and subtotals for orders, carts etc..

**`Implements`**

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`TotalsService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/totals.d.ts:72

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### newTotalsService\_

• `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](internal-8.internal.NewTotalsService.md)

#### Defined in

packages/medusa/dist/services/totals.d.ts:70

___

### taxCalculationStrategy\_

• `Protected` `Readonly` **taxCalculationStrategy\_**: [`ITaxCalculationStrategy`](../interfaces/internal-8.internal.ITaxCalculationStrategy.md)

#### Defined in

packages/medusa/dist/services/totals.d.ts:71

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Defined in

packages/medusa/dist/services/totals.d.ts:69

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### calculateDiscount\_

▸ **calculateDiscount_**(`lineItem`, `variant`, `variantPrice`, `value`, `discountType`): [`LineDiscount`](../modules/internal-8.md#linediscount)

Calculates either fixed or percentage discount of a variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItem` | [`LineItem`](internal-3.LineItem.md) | id of line item |
| `variant` | `string` | id of variant in line item |
| `variantPrice` | `number` | price of the variant based on region |
| `value` | `number` | discount value |
| `discountType` | [`DiscountRuleType`](../enums/internal-3.DiscountRuleType.md) | the type of discount (fixed or percentage) |

#### Returns

[`LineDiscount`](../modules/internal-8.md#linediscount)

triples of lineitem, variant and applied discount

**`Deprecated`**

- in favour of DiscountService.calculateDiscountForLineItem

#### Defined in

packages/medusa/dist/services/totals.d.ts:171

___

### getAllocationItemDiscounts

▸ **getAllocationItemDiscounts**(`discount`, `cart`): [`LineDiscount`](../modules/internal-8.md#linediscount)[]

If the rule of a discount has allocation="item", then we need
to calculate discount on each item in the cart. Furthermore, we need to
make sure to only apply the discount on valid variants. And finally we
return ether an array of percentages discounts or fixed discounts
alongside the variant on which the discount was applied.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `discount` | [`Discount`](internal-3.Discount.md) | the discount to which we do the calculation |
| `cart` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | the cart to calculate discounts for |

#### Returns

[`LineDiscount`](../modules/internal-8.md#linediscount)[]

array of triples of lineitem, variant and applied discount

#### Defined in

packages/medusa/dist/services/totals.d.ts:182

___

### getAllocationMap

▸ **getAllocationMap**(`orderOrCart`, `options?`): `Promise`<[`LineAllocationsMap`](../modules/internal-8.md#lineallocationsmap)\>

Gets a map of discounts and gift cards that apply to line items in an
order. The function calculates the amount of a discount or gift card that
applies to a specific line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orderOrCart` | `Object` | the order or cart to get an allocation map for |
| `orderOrCart.claims?` | [`ClaimOrder`](internal-3.ClaimOrder.md)[] | - |
| `orderOrCart.discounts?` | [`Discount`](internal-3.Discount.md)[] | - |
| `orderOrCart.items` | [`LineItem`](internal-3.LineItem.md)[] | - |
| `orderOrCart.swaps?` | [`Swap`](internal-3.Swap.md)[] | - |
| `options?` | [`AllocationMapOptions`](../modules/internal-8.md#allocationmapoptions) | controls what should be included in allocation map |

#### Returns

`Promise`<[`LineAllocationsMap`](../modules/internal-8.md#lineallocationsmap)\>

the allocation map for the line items in the cart or order.

#### Defined in

packages/medusa/dist/services/totals.d.ts:133

___

### getCalculationContext

▸ **getCalculationContext**(`calculationContextData`, `options?`): `Promise`<[`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext)\>

Prepares the calculation context for a tax total calculation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `calculationContextData` | [`CalculationContextData`](../modules/internal-8.md#calculationcontextdata) | the calculationContextData to get the calculation context for |
| `options?` | [`CalculationContextOptions`](../modules/internal-8.md#calculationcontextoptions) | options to gather context by |

#### Returns

`Promise`<[`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext)\>

the tax calculation context

#### Defined in

packages/medusa/dist/services/totals.d.ts:247

___

### getDiscountTotal

▸ **getDiscountTotal**(`cartOrOrder`): `Promise`<`number`\>

Calculates the total discount amount for each of the different supported
discount types. If discounts aren't present or invalid returns 0.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | the cart or order to calculate discounts for |

#### Returns

`Promise`<`number`\>

the total discounts amount

#### Defined in

packages/medusa/dist/services/totals.d.ts:240

___

### getGiftCardTotal

▸ **getGiftCardTotal**(`cartOrOrder`, `opts?`): `Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

Gets the gift card amount on a cart or order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | the cart or order to get gift card amount for |
| `opts?` | `Object` | - |
| `opts.gift_cardable?` | `number` | - |

#### Returns

`Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

the gift card amount applied to the cart or order

#### Defined in

packages/medusa/dist/services/totals.d.ts:228

___

### getGiftCardableAmount

▸ **getGiftCardableAmount**(`cartOrOrder`): `Promise`<`number`\>

Gets the amount that can be gift carded on a cart. In regions where gift
cards are taxable this amount should exclude taxes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | the cart or order to get gift card amount for |

#### Returns

`Promise`<`number`\>

the gift card amount applied to the cart or order

#### Defined in

packages/medusa/dist/services/totals.d.ts:222

___

### getLineDiscounts

▸ **getLineDiscounts**(`cartOrOrder`, `discount?`): [`LineDiscountAmount`](../modules/internal-8.md#linediscountamount)[]

Returns the discount amount allocated to the line items of an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | `Object` | the cart or order to get line discount allocations for |
| `cartOrOrder.claims?` | [`ClaimOrder`](internal-3.ClaimOrder.md)[] | - |
| `cartOrOrder.items` | [`LineItem`](internal-3.LineItem.md)[] | - |
| `cartOrOrder.swaps?` | [`Swap`](internal-3.Swap.md)[] | - |
| `discount?` | [`Discount`](internal-3.Discount.md) | the discount to use as context for the calculation |

#### Returns

[`LineDiscountAmount`](../modules/internal-8.md#linediscountamount)[]

the allocations that the discount has on the items in the cart or
  order

#### Defined in

packages/medusa/dist/services/totals.d.ts:192

___

### getLineItemAdjustmentsTotal

▸ **getLineItemAdjustmentsTotal**(`cartOrOrder`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) |

#### Returns

`number`

#### Defined in

packages/medusa/dist/services/totals.d.ts:184

___

### getLineItemDiscountAdjustment

▸ **getLineItemDiscountAdjustment**(`lineItem`, `discount`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lineItem` | [`LineItem`](internal-3.LineItem.md) |
| `discount` | [`Discount`](internal-3.Discount.md) |

#### Returns

`number`

#### Defined in

packages/medusa/dist/services/totals.d.ts:183

___

### getLineItemRefund

▸ **getLineItemRefund**(`order`, `lineItem`): `Promise`<`number`\>

The amount that can be refunded for a given line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | order to use as context for the calculation |
| `lineItem` | [`LineItem`](internal-3.LineItem.md) | the line item to calculate the refund amount for. |

#### Returns

`Promise`<`number`\>

the line item refund amount.

#### Defined in

packages/medusa/dist/services/totals.d.ts:151

___

### getLineItemTotal

▸ **getLineItemTotal**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<`number`\>

Gets a total for a line item. The total can take gift cards, discounts and
taxes into account. This can be controlled through the options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItem` | [`LineItem`](internal-3.LineItem.md) | the line item to calculate a total for |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | the cart or order to use as context for the calculation |
| `options?` | [`GetLineItemTotalOptions`](../modules/internal-8.md#getlineitemtotaloptions) | the options to use for the calculation |

#### Returns

`Promise`<`number`\>

the line item total

#### Defined in

packages/medusa/dist/services/totals.d.ts:215

___

### getLineItemTotals

▸ **getLineItemTotals**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<[`LineItemTotals`](../modules/internal-8.md#lineitemtotals-1)\>

Breaks down the totals related to a line item; these are the subtotal, the
amount of discount applied to the line item, the amount of a gift card
applied to a line item and the amount of tax applied to a line item.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItem` | [`LineItem`](internal-3.LineItem.md) | the line item to calculate totals for |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | the cart or order to use as context for the calculation |
| `options?` | [`LineItemTotalsOptions`](../modules/internal-8.md#lineitemtotalsoptions) | the options to evaluate the line item totals for |

#### Returns

`Promise`<[`LineItemTotals`](../modules/internal-8.md#lineitemtotals-1)\>

the breakdown of the line item totals

#### Defined in

packages/medusa/dist/services/totals.d.ts:206

___

### getPaidTotal

▸ **getPaidTotal**(`order`): `number`

Gets the total payments made on an order

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to calculate paid amount for |

#### Returns

`number`

the total paid amount

#### Defined in

packages/medusa/dist/services/totals.d.ts:86

___

### getRefundTotal

▸ **getRefundTotal**(`order`, `lineItems`): `Promise`<`number`\>

Calculates refund total of line items.
If any of the items to return have been discounted, we need to
apply the discount again before refunding them.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | cart or order to calculate subtotal for |
| `lineItems` | [`LineItem`](internal-3.LineItem.md)[] | the line items to calculate refund total for |

#### Returns

`Promise`<`number`\>

the calculated subtotal

#### Defined in

packages/medusa/dist/services/totals.d.ts:160

___

### getRefundedTotal

▸ **getRefundedTotal**(`order`): `number`

Gets the total refund amount for an order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to get total refund amount for. |

#### Returns

`number`

the total refunded amount for an order.

#### Defined in

packages/medusa/dist/services/totals.d.ts:144

___

### getShippingMethodTotals

▸ **getShippingMethodTotals**(`shippingMethod`, `cartOrOrder`, `opts?`): `Promise`<[`ShippingMethodTotals`](../modules/internal-8.md#shippingmethodtotals-1)\>

Gets the totals breakdown for a shipping method. Fetches tax lines if not
already provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethod` | [`ShippingMethod`](internal-3.ShippingMethod.md) | the shipping method to get totals breakdown for. |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | the cart or order to use as context for the breakdown |
| `opts?` | [`GetShippingMethodTotalsOptions`](../modules/internal-8.md#getshippingmethodtotalsoptions) | options for what should be included |

#### Returns

`Promise`<[`ShippingMethodTotals`](../modules/internal-8.md#shippingmethodtotals-1)\>

An object that breaks down the totals for the shipping method

#### Defined in

packages/medusa/dist/services/totals.d.ts:102

___

### getShippingTotal

▸ **getShippingTotal**(`cartOrOrder`): `Promise`<`number`\>

Calculates shipping total

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | cart or order to calculate subtotal for |

#### Returns

`Promise`<`number`\>

shipping total

#### Defined in

packages/medusa/dist/services/totals.d.ts:115

___

### getSubtotal

▸ **getSubtotal**(`cartOrOrder`, `opts?`): `Promise`<`number`\>

Calculates subtotal of a given cart or order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | cart or order to calculate subtotal for |
| `opts?` | [`SubtotalOptions`](../modules/internal-8.md#subtotaloptions) | options |

#### Returns

`Promise`<`number`\>

the calculated subtotal

#### Defined in

packages/medusa/dist/services/totals.d.ts:109

___

### getSwapTotal

▸ **getSwapTotal**(`order`): `number`

The total paid for swaps. May be negative in case of negative swap
difference.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `order` | [`Order`](internal-3.Order.md) | the order to calculate swap total for |

#### Returns

`number`

the swap total

#### Defined in

packages/medusa/dist/services/totals.d.ts:93

___

### getTaxTotal

▸ **getTaxTotal**(`cartOrOrder`, `forceTaxes?`): `Promise`<``null`` \| `number`\>

Calculates tax total
Currently based on the Danish tax system

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | cart or order to calculate tax total for |
| `forceTaxes?` | `boolean` | whether taxes should be calculated regardless of region settings |

#### Returns

`Promise`<``null`` \| `number`\>

tax total

#### Defined in

packages/medusa/dist/services/totals.d.ts:124

___

### getTotal

▸ **getTotal**(`cartOrOrder`, `options?`): `Promise`<`number`\>

Calculates total of a given cart or order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | [`Order`](internal-3.Order.md) \| [`Cart`](internal-3.Cart.md) | object to calculate total for |
| `options?` | [`GetTotalsOptions`](../modules/internal-8.md#gettotalsoptions) | options to calculate by |

#### Returns

`Promise`<`number`\>

the calculated subtotal

#### Defined in

packages/medusa/dist/services/totals.d.ts:80

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

packages/medusa/dist/services/totals.d.ts:253

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`TotalsService`](internal-8.internal.TotalsService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`TotalsService`](internal-8.internal.TotalsService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
