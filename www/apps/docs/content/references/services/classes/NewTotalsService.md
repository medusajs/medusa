# NewTotalsService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`NewTotalsService`**

## Constructors

### constructor

**new NewTotalsService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-15) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/new-totals.ts:67](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L67)

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

[packages/medusa/src/services/new-totals.ts:64](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L64)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### taxCalculationStrategy\_

 `Protected` `Readonly` **taxCalculationStrategy\_**: [`ITaxCalculationStrategy`](../interfaces/ITaxCalculationStrategy.md)

#### Defined in

[packages/medusa/src/services/new-totals.ts:65](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L65)

___

### taxProviderService\_

 `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/new-totals.ts:63](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L63)

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

### getGiftCardTotals

**getGiftCardTotals**(`giftCardableAmount`, `«destructured»`): `Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

Calculate and return the gift cards totals

#### Parameters

| Name | Description |
| :------ | :------ |
| `giftCardableAmount` | `number` |
| `«destructured»` | `object` |
| › `giftCardTransactions?` | [`GiftCardTransaction`](../index.md#giftcardtransaction)[] |
| › `giftCards?` | [`GiftCard`](GiftCard.md)[] |
| › `region` | [`Region`](Region.md) | A region holds settings specific to a geographical location, including the currency, tax rates, and fulfillment and payment providers. A Region can consist of multiple countries to accomodate common shopping settings across countries. |

#### Returns

`Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

-`Promise`: 
	-``object``: (optional) 

#### Defined in

[packages/medusa/src/services/new-totals.ts:447](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L447)

___

### getGiftCardTransactionsTotals

**getGiftCardTransactionsTotals**(`«destructured»`): { `tax_total`: `number` ; `total`: `number`  }

Calculate and return the gift cards totals based on their transactions

#### Parameters

| Name |
| :------ |
| `«destructured»` | `object` |
| › `giftCardTransactions` | [`GiftCardTransaction`](../index.md#giftcardtransaction)[] |
| › `region` | `object` |
| › `region.gift_cards_taxable` | `boolean` |
| › `region.tax_rate` | `number` |

#### Returns

`object`

-``object``: (optional) 

| Name | Type |
| :------ | :------ |
| `tax_total` | `number` |
| `total` | `number` |

#### Defined in

[packages/medusa/src/services/new-totals.ts:526](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L526)

___

### getGiftCardableAmount

**getGiftCardableAmount**(`«destructured»`): `number`

#### Parameters

| Name |
| :------ |
| `«destructured»` | `object` |
| › `discount_total` | `number` |
| › `gift_cards_taxable?` | `boolean` |
| › `shipping_total` | `number` |
| › `subtotal` | `number` |
| › `tax_total` | `number` |

#### Returns

`number`

-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/new-totals.ts:638](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L638)

___

### getLineItemRefund

**getLineItemRefund**(`lineItem`, `«destructured»`): `number`

Return the amount that can be refund on a line item

#### Parameters

| Name |
| :------ |
| `lineItem` | `object` |
| `lineItem.id` | `string` |
| `lineItem.includes_tax` | `boolean` |
| `lineItem.quantity` | `number` |
| `lineItem.tax_lines` | [`LineItemTaxLine`](LineItemTaxLine.md)[] |
| `lineItem.unit_price` | `number` |
| `«destructured»` | `object` |
| › `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) |
| › `taxRate?` | ``null`` \| `number` |

#### Returns

`number`

-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/new-totals.ts:333](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L333)

___

### getLineItemRefundLegacy

`Protected` **getLineItemRefundLegacy**(`lineItem`, `«destructured»`): `number`

#### Parameters

| Name |
| :------ |
| `lineItem` | `object` |
| `lineItem.id` | `string` |
| `lineItem.includes_tax` | `boolean` |
| `lineItem.quantity` | `number` |
| `lineItem.unit_price` | `number` |
| `«destructured»` | `object` |
| › `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) |
| › `taxRate` | `number` |

#### Returns

`number`

-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/new-totals.ts:403](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L403)

___

### getLineItemTotals

**getLineItemTotals**(`items`, `«destructured»`): `Promise`<{ `[lineItemId: string]`: [`LineItemTotals`](../index.md#lineitemtotals);  }\>

Calculate and return the items totals for either the legacy calculation or the new calculation

#### Parameters

| Name |
| :------ |
| `items` | [`LineItem`](LineItem.md) \| [`LineItem`](LineItem.md)[] |
| `«destructured»` | `object` |
| › `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) |
| › `includeTax?` | `boolean` |
| › `taxRate?` | ``null`` \| `number` |

#### Returns

`Promise`<{ `[lineItemId: string]`: [`LineItemTotals`](../index.md#lineitemtotals);  }\>

-`Promise`: 
	-``object``: (optional) 

#### Defined in

[packages/medusa/src/services/new-totals.ts:87](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L87)

___

### getLineItemTotalsLegacy

`Protected` **getLineItemTotalsLegacy**(`item`, `«destructured»`): `Promise`<[`LineItemTotals`](../index.md#lineitemtotals)\>

Calculate and return the legacy calculated totals using the tax rate

#### Parameters

| Name |
| :------ |
| `item` | [`LineItem`](LineItem.md) |
| `«destructured»` | `object` |
| › `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) |
| › `lineItemAllocation` | `object` |
| › `lineItemAllocation.discount?` | [`DiscountAllocation`](../index.md#discountallocation) |
| › `lineItemAllocation.gift_card?` | [`GiftCardAllocation`](../index.md#giftcardallocation) |
| › `taxRate` | `number` |

#### Returns

`Promise`<[`LineItemTotals`](../index.md#lineitemtotals)\>

-`Promise`: 
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

[packages/medusa/src/services/new-totals.ts:254](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L254)

___

### getLineItemTotals\_

`Protected` **getLineItemTotals_**(`item`, `«destructured»`): `Promise`<[`LineItemTotals`](../index.md#lineitemtotals)\>

Calculate and return the totals for an item

#### Parameters

| Name |
| :------ |
| `item` | [`LineItem`](LineItem.md) |
| `«destructured»` | `object` |
| › `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) |
| › `includeTax?` | `boolean` |
| › `lineItemAllocation` | `object` |
| › `lineItemAllocation.discount?` | [`DiscountAllocation`](../index.md#discountallocation) |
| › `lineItemAllocation.gift_card?` | [`GiftCardAllocation`](../index.md#giftcardallocation) |
| › `taxLines?` | [`LineItemTaxLine`](LineItemTaxLine.md)[] |

#### Returns

`Promise`<[`LineItemTotals`](../index.md#lineitemtotals)\>

-`Promise`: 
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

[packages/medusa/src/services/new-totals.ts:147](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L147)

___

### getShippingMethodTotals

**getShippingMethodTotals**(`shippingMethods`, `«destructured»`): `Promise`<{ `[shippingMethodId: string]`: [`ShippingMethodTotals`](../index.md#shippingmethodtotals);  }\>

Calculate and return the shipping methods totals for either the legacy calculation or the new calculation

#### Parameters

| Name |
| :------ |
| `shippingMethods` | [`ShippingMethod`](ShippingMethod.md) \| [`ShippingMethod`](ShippingMethod.md)[] |
| `«destructured»` | `object` |
| › `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) |
| › `discounts?` | [`Discount`](Discount.md)[] |
| › `includeTax?` | `boolean` |
| › `taxRate?` | ``null`` \| `number` |

#### Returns

`Promise`<{ `[shippingMethodId: string]`: [`ShippingMethodTotals`](../index.md#shippingmethodtotals);  }\>

-`Promise`: 
	-``object``: (optional) 

#### Defined in

[packages/medusa/src/services/new-totals.ts:572](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L572)

___

### getShippingMethodTotalsLegacy

`Protected` **getShippingMethodTotalsLegacy**(`shippingMethod`, `«destructured»`): `Promise`<[`ShippingMethodTotals`](../index.md#shippingmethodtotals)\>

Calculate and return the shipping method totals legacy using the tax rate

#### Parameters

| Name |
| :------ |
| `shippingMethod` | [`ShippingMethod`](ShippingMethod.md) |
| `«destructured»` | `object` |
| › `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) |
| › `discounts?` | [`Discount`](Discount.md)[] |
| › `taxRate` | `number` |

#### Returns

`Promise`<[`ShippingMethodTotals`](../index.md#shippingmethodtotals)\>

-`Promise`: 
	-`ShippingMethodTotals`: 
		-`original_tax_total`: 
		-`original_total`: 
		-`price`: 
		-`subtotal`: 
		-`tax_lines`: 
		-`tax_total`: 
		-`total`: 

#### Defined in

[packages/medusa/src/services/new-totals.ts:749](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L749)

___

### getShippingMethodTotals\_

`Protected` **getShippingMethodTotals_**(`shippingMethod`, `«destructured»`): `Promise`<[`ShippingMethodTotals`](../index.md#shippingmethodtotals)\>

Calculate and return the shipping method totals

#### Parameters

| Name |
| :------ |
| `shippingMethod` | [`ShippingMethod`](ShippingMethod.md) |
| `«destructured»` | `object` |
| › `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) |
| › `discounts?` | [`Discount`](Discount.md)[] |
| › `includeTax?` | `boolean` |
| › `taxLines?` | [`ShippingMethodTaxLine`](ShippingMethodTaxLine.md)[] |

#### Returns

`Promise`<[`ShippingMethodTotals`](../index.md#shippingmethodtotals)\>

-`Promise`: 
	-`ShippingMethodTotals`: 
		-`original_tax_total`: 
		-`original_total`: 
		-`price`: 
		-`subtotal`: 
		-`tax_lines`: 
		-`tax_total`: 
		-`total`: 

#### Defined in

[packages/medusa/src/services/new-totals.ts:666](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/new-totals.ts#L666)

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

**withTransaction**(`transactionManager?`): [`NewTotalsService`](NewTotalsService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`NewTotalsService`](NewTotalsService.md)

-`default`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
