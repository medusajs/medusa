# TotalsService

A service that calculates total and subtotals for orders, carts etc..

**Implements**

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`TotalsService`**

## Constructors

### constructor

**new TotalsService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`TotalsServiceProps`](../index.md#totalsserviceprops) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/totals.ts:112](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L112)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](FlagRouter.md)

#### Defined in

[packages/medusa/src/services/totals.ts:110](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L110)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### newTotalsService\_

 `Protected` `Readonly` **newTotalsService\_**: [`NewTotalsService`](NewTotalsService.md)

#### Defined in

[packages/medusa/src/services/totals.ts:108](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L108)

___

### taxCalculationStrategy\_

 `Protected` `Readonly` **taxCalculationStrategy\_**: [`ITaxCalculationStrategy`](../interfaces/ITaxCalculationStrategy.md)

#### Defined in

[packages/medusa/src/services/totals.ts:109](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L109)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/totals.ts:107](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L107)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### calculateDiscount\_

**calculateDiscount_**(`lineItem`, `variant`, `variantPrice`, `value`, `discountType`): [`LineDiscount`](../index.md#linediscount)

Calculates either fixed or percentage discount of a variant

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItem` | [`LineItem`](LineItem.md) | id of line item |
| `variant` | `string` | id of variant in line item |
| `variantPrice` | `number` | price of the variant based on region |
| `value` | `number` | discount value |
| `discountType` | [`DiscountRuleType`](../enums/DiscountRuleType.md) | the type of discount (fixed or percentage) |

#### Returns

[`LineDiscount`](../index.md#linediscount)

-`LineDiscount`: Associates a line item and discount allocation.
	-`amount`: 
	-`lineItem`: Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits.
		-`adjustments`: The details of the item's adjustments, which are available when a discount is applied on the item.
		-`allow_discounts`: (default: true) Flag to indicate if the Line Item should be included when doing discount calculations.
		-`cart`: The details of the cart that the line item may belongs to.
		-`cart_id`: The ID of the cart that the line item may belongs to.
		-`claim_order`: The details of the claim that the line item may belong to.
		-`claim_order_id`: The ID of the claim that the line item may belong to.
		-`created_at`: The date with timezone at which the resource was created.
		-`description`: A more detailed description of the contents of the Line Item.
		-`discount_total`: (optional) The total of discount of the line item rounded
		-`fulfilled_quantity`: The quantity of the Line Item that has been fulfilled.
		-`gift_card_total`: (optional) The total of the gift card of the line item
		-`has_shipping`: Flag to indicate if the Line Item has fulfillment associated with it.
		-`id`: The line item's ID
		-`includes_tax`: (default: false) Indicates if the line item unit_price include tax
		-`is_giftcard`: (default: false) Flag to indicate if the Line Item is a Gift Card.
		-`is_return`: (default: false) Is the item being returned
		-`metadata`: An optional key-value map with additional details
		-`order`: The details of the order that the line item may belongs to.
		-`order_edit`: (optional) The details of the order edit.
		-`order_edit_id`: (optional) The ID of the order edit that the item may belong to.
		-`order_id`: The ID of the order that the line item may belongs to.
		-`original_item_id`: (optional) The ID of the original line item. This is useful if the line item belongs to a resource that references an order, such as a return or an order edit.
		-`original_tax_total`: (optional) The original tax total amount of the line item
		-`original_total`: (optional) The original total amount of the line item
		-`product_id`: 
		-`quantity`: The quantity of the content in the Line Item.
		-`raw_discount_total`: (optional) The total of discount of the line item
		-`refundable`: (optional) The amount that can be refunded from the given Line Item. Takes taxes and discounts into consideration.
		-`returned_quantity`: The quantity of the Line Item that has been returned.
		-`shipped_quantity`: The quantity of the Line Item that has been shipped.
		-`should_merge`: (default: true) Flag to indicate if new Line Items with the same variant should be merged or added as an additional Line Item.
		-`subtotal`: (optional) The subtotal of the line item
		-`swap`: The details of the swap that the line item may belong to.
		-`swap_id`: The ID of the swap that the line item may belong to.
		-`tax_lines`: The details of the item's tax lines.
		-`tax_total`: (optional) The total of tax of the line item
		-`thumbnail`: A URL string to a small image of the contents of the Line Item.
		-`title`: The title of the Line Item.
		-`total`: (optional) The total amount of the line item
		-`unit_price`: The price of one unit of the content in the Line Item. This should be in the currency defined by the Cart/Order/Swap/Claim that the Line Item belongs to.
		-`updated_at`: The date with timezone at which the resource was updated.
		-`variant`: The details of the product variant that this item was created from.
		-`variant_id`: The id of the Product Variant contained in the Line Item.
	-`variant`: 

**Deprecated**

- in favour of DiscountService.calculateDiscountForLineItem

#### Defined in

[packages/medusa/src/services/totals.ts:627](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L627)

___

### getAllocationItemDiscounts

**getAllocationItemDiscounts**(`discount`, `cart`): [`LineDiscount`](../index.md#linediscount)[]

If the rule of a discount has allocation="item", then we need
to calculate discount on each item in the cart. Furthermore, we need to
make sure to only apply the discount on valid variants. And finally we
return ether an array of percentages discounts or fixed discounts
alongside the variant on which the discount was applied.

#### Parameters

| Name | Description |
| :------ | :------ |
| `discount` | [`Discount`](Discount.md) | the discount to which we do the calculation |
| `cart` | [`Order`](Order.md) \| [`Cart`](Cart.md) | the cart to calculate discounts for |

#### Returns

[`LineDiscount`](../index.md#linediscount)[]

-`LineDiscount[]`: array of triples of lineitem, variant and applied discount
	-`LineDiscount`: Associates a line item and discount allocation.
		-`amount`: 
		-`lineItem`: Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits.
		-`variant`: 

#### Defined in

[packages/medusa/src/services/totals.ts:669](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L669)

___

### getAllocationMap

**getAllocationMap**(`orderOrCart`, `options?`): `Promise`<[`LineAllocationsMap`](../index.md#lineallocationsmap)\>

Gets a map of discounts and gift cards that apply to line items in an
order. The function calculates the amount of a discount or gift card that
applies to a specific line item.

#### Parameters

| Name | Description |
| :------ | :------ |
| `orderOrCart` | `object` | the order or cart to get an allocation map for |
| `orderOrCart.claims?` | [`ClaimOrder`](ClaimOrder.md)[] |
| `orderOrCart.discounts?` | [`Discount`](Discount.md)[] |
| `orderOrCart.items` | [`LineItem`](LineItem.md)[] |
| `orderOrCart.swaps?` | [`Swap`](Swap.md)[] |
| `options` | [`AllocationMapOptions`](../index.md#allocationmapoptions) | controls what should be included in allocation map |

#### Returns

`Promise`<[`LineAllocationsMap`](../index.md#lineallocationsmap)\>

-`Promise`: the allocation map for the line items in the cart or order.
	-`LineAllocationsMap`: A map of line item ids and its corresponding gift card and discount allocations
		-`__type`: 

#### Defined in

[packages/medusa/src/services/totals.ts:435](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L435)

___

### getCalculationContext

**getCalculationContext**(`calculationContextData`, `options?`): `Promise`<[`TaxCalculationContext`](../index.md#taxcalculationcontext)\>

Prepares the calculation context for a tax total calculation.

#### Parameters

| Name | Description |
| :------ | :------ |
| `calculationContextData` | [`CalculationContextData`](../index.md#calculationcontextdata) | the calculationContextData to get the calculation context for |
| `options` | [`CalculationContextOptions`](../index.md#calculationcontextoptions) | options to gather context by |

#### Returns

`Promise`<[`TaxCalculationContext`](../index.md#taxcalculationcontext)\>

-`Promise`: the tax calculation context
	-`TaxCalculationContext`: Information relevant to a tax calculation, such as the shipping address where the items are going.
		-`allocation_map`: 
		-`customer`: A customer can make purchases in your store and manage their profile.
		-`is_return`: 
		-`region`: A region holds settings specific to a geographical location, including the currency, tax rates, and fulfillment and payment providers. A Region can consist of multiple countries to accomodate common shopping settings across countries.
		-`shipping_address`: 
		-`shipping_methods`: 

#### Defined in

[packages/medusa/src/services/totals.ts:1028](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L1028)

___

### getDiscountTotal

**getDiscountTotal**(`cartOrOrder`): `Promise`<`number`\>

Calculates the total discount amount for each of the different supported
discount types. If discounts aren't present or invalid returns 0.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | the cart or order to calculate discounts for |

#### Returns

`Promise`<`number`\>

-`Promise`: the total discounts amount
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:1006](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L1006)

___

### getGiftCardTotal

**getGiftCardTotal**(`cartOrOrder`, `opts?`): `Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

Gets the gift card amount on a cart or order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | the cart or order to get gift card amount for |
| `opts` | `object` |
| `opts.gift_cardable?` | `number` |

#### Returns

`Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

-`Promise`: the gift card amount applied to the cart or order
	-``object``: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:975](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L975)

___

### getGiftCardableAmount

**getGiftCardableAmount**(`cartOrOrder`): `Promise`<`number`\>

Gets the amount that can be gift carded on a cart. In regions where gift
cards are taxable this amount should exclude taxes.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | the cart or order to get gift card amount for |

#### Returns

`Promise`<`number`\>

-`Promise`: the gift card amount applied to the cart or order
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:958](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L958)

___

### getLineDiscounts

**getLineDiscounts**(`cartOrOrder`, `discount?`): [`LineDiscountAmount`](../index.md#linediscountamount)[]

Returns the discount amount allocated to the line items of an order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | `object` | the cart or order to get line discount allocations for |
| `cartOrOrder.claims?` | [`ClaimOrder`](ClaimOrder.md)[] |
| `cartOrOrder.items` | [`LineItem`](LineItem.md)[] |
| `cartOrOrder.swaps?` | [`Swap`](Swap.md)[] |
| `discount?` | [`Discount`](Discount.md) | the discount to use as context for the calculation |

#### Returns

[`LineDiscountAmount`](../index.md#linediscountamount)[]

-`LineDiscountAmount[]`: the allocations that the discount has on the items in the cart or
  order
	-`LineDiscountAmount`: Associates a line item and discount allocation.
		-`amount`: 
		-`customAdjustmentsAmount`: 
		-`item`: Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits.

#### Defined in

[packages/medusa/src/services/totals.ts:720](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L720)

___

### getLineItemAdjustmentsTotal

**getLineItemAdjustmentsTotal**(`cartOrOrder`): `number`

#### Parameters

| Name |
| :------ |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) |

#### Returns

`number`

-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:697](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L697)

___

### getLineItemDiscountAdjustment

**getLineItemDiscountAdjustment**(`lineItem`, `discount`): `number`

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItem` | [`LineItem`](LineItem.md) | Line Items are created when a product is added to a Cart. When Line Items are purchased they will get copied to the resulting order, swap, or claim, and can eventually be referenced in Fulfillments and Returns. Line items may also be used for order edits. |
| `discount` | [`Discount`](Discount.md) | A discount can be applied to a cart for promotional purposes. |

#### Returns

`number`

-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:682](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L682)

___

### getLineItemRefund

**getLineItemRefund**(`order`, `lineItem`): `Promise`<`number`\>

The amount that can be refunded for a given line item.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | order to use as context for the calculation |
| `lineItem` | [`LineItem`](LineItem.md) | the line item to calculate the refund amount for. |

#### Returns

`Promise`<`number`\>

-`Promise`: the line item refund amount.
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:504](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L504)

___

### getLineItemTotal

**getLineItemTotal**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<`number`\>

Gets a total for a line item. The total can take gift cards, discounts and
taxes into account. This can be controlled through the options.

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItem` | [`LineItem`](LineItem.md) | the line item to calculate a total for |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | the cart or order to use as context for the calculation |
| `options` | [`GetLineItemTotalOptions`](../index.md#getlineitemtotaloptions) | the options to use for the calculation |

#### Returns

`Promise`<`number`\>

-`Promise`: the line item total
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:931](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L931)

___

### getLineItemTotals

**getLineItemTotals**(`lineItem`, `cartOrOrder`, `options?`): `Promise`<[`LineItemTotals`](../index.md#lineitemtotals-1)\>

Breaks down the totals related to a line item; these are the subtotal, the
amount of discount applied to the line item, the amount of a gift card
applied to a line item and the amount of tax applied to a line item.

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItem` | [`LineItem`](LineItem.md) | the line item to calculate totals for |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | the cart or order to use as context for the calculation |
| `options` | [`LineItemTotalsOptions`](../index.md#lineitemtotalsoptions) | the options to evaluate the line item totals for |

#### Returns

`Promise`<[`LineItemTotals`](../index.md#lineitemtotals-1)\>

-`Promise`: the breakdown of the line item totals
	-`LineItemTotals`: 
		-`discount_total`: 
		-`original_tax_total`: 
		-`original_total`: 
		-`quantity`: 
		-`raw_discount_total`: 
		-`subtotal`: 
		-`tax_lines`: 
		-`tax_total`: 
		-`total`: 
		-`unit_price`: 

#### Defined in

[packages/medusa/src/services/totals.ts:776](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L776)

___

### getPaidTotal

**getPaidTotal**(`order`): `number`

Gets the total payments made on an order

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to calculate paid amount for |

#### Returns

`number`

-`number`: (optional) the total paid amount

#### Defined in

[packages/medusa/src/services/totals.ts:157](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L157)

___

### getRefundTotal

**getRefundTotal**(`order`, `lineItems`): `Promise`<`number`\>

Calculates refund total of line items.
If any of the items to return have been discounted, we need to
apply the discount again before refunding them.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | cart or order to calculate subtotal for |
| `lineItems` | [`LineItem`](LineItem.md)[] | the line items to calculate refund total for |

#### Returns

`Promise`<`number`\>

-`Promise`: the calculated subtotal
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:583](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L583)

___

### getRefundedTotal

**getRefundedTotal**(`order`): `number`

Gets the total refund amount for an order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to get total refund amount for. |

#### Returns

`number`

-`number`: (optional) the total refunded amount for an order.

#### Defined in

[packages/medusa/src/services/totals.ts:489](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L489)

___

### getShippingMethodTotals

**getShippingMethodTotals**(`shippingMethod`, `cartOrOrder`, `opts?`): `Promise`<[`ShippingMethodTotals`](../index.md#shippingmethodtotals-1)\>

Gets the totals breakdown for a shipping method. Fetches tax lines if not
already provided.

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingMethod` | [`ShippingMethod`](ShippingMethod.md) | the shipping method to get totals breakdown for. |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | the cart or order to use as context for the breakdown |
| `opts` | [`GetShippingMethodTotalsOptions`](../index.md#getshippingmethodtotalsoptions) | options for what should be included |

#### Returns

`Promise`<[`ShippingMethodTotals`](../index.md#shippingmethodtotals-1)\>

-`Promise`: An object that breaks down the totals for the shipping method
	-`ShippingMethodTotals`: 
		-`original_tax_total`: 
		-`original_total`: 
		-`price`: 
		-`subtotal`: 
		-`tax_lines`: 
		-`tax_total`: 
		-`total`: 

#### Defined in

[packages/medusa/src/services/totals.ts:191](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L191)

___

### getShippingTotal

**getShippingTotal**(`cartOrOrder`): `Promise`<`number`\>

Calculates shipping total

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | cart or order to calculate subtotal for |

#### Returns

`Promise`<`number`\>

-`Promise`: shipping total
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:319](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L319)

___

### getSubtotal

**getSubtotal**(`cartOrOrder`, `opts?`): `Promise`<`number`\>

Calculates subtotal of a given cart or order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | cart or order to calculate subtotal for |
| `opts` | [`SubtotalOptions`](../index.md#subtotaloptions) | options |

#### Returns

`Promise`<`number`\>

-`Promise`: the calculated subtotal
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:283](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L283)

___

### getSwapTotal

**getSwapTotal**(`order`): `number`

The total paid for swaps. May be negative in case of negative swap
difference.

#### Parameters

| Name | Description |
| :------ | :------ |
| `order` | [`Order`](Order.md) | the order to calculate swap total for |

#### Returns

`number`

-`number`: (optional) the swap total

#### Defined in

[packages/medusa/src/services/totals.ts:172](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L172)

___

### getTaxTotal

**getTaxTotal**(`cartOrOrder`, `forceTaxes?`): `Promise`<``null`` \| `number`\>

Calculates tax total
Currently based on the Danish tax system

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | cart or order to calculate tax total for |
| `forceTaxes` | `boolean` | false | whether taxes should be calculated regardless of region settings |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: tax total
	-```null`` \| number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:346](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L346)

___

### getTotal

**getTotal**(`cartOrOrder`, `options?`): `Promise`<`number`\>

Calculates total of a given cart or order.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrOrder` | [`Order`](Order.md) \| [`Cart`](Cart.md) | object to calculate total for |
| `options` | [`GetTotalsOptions`](../index.md#gettotalsoptions) | options to calculate by |

#### Returns

`Promise`<`number`\>

-`Promise`: the calculated subtotal
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/totals.ts:134](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L134)

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

[packages/medusa/src/services/totals.ts:1058](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/totals.ts#L1058)

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

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`TotalsService`](TotalsService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`TotalsService`](TotalsService.md)

-`TotalsService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
