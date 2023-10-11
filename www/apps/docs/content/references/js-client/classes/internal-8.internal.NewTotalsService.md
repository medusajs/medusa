---
displayed_sidebar: jsClientSidebar
---

# Class: NewTotalsService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).NewTotalsService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`NewTotalsService`**

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

packages/medusa/dist/services/new-totals.d.ts:42

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### taxCalculationStrategy\_

• `Protected` `Readonly` **taxCalculationStrategy\_**: [`ITaxCalculationStrategy`](../interfaces/internal-8.internal.ITaxCalculationStrategy.md)

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:43

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:41

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

### getGiftCardTotals

▸ **getGiftCardTotals**(`giftCardableAmount`, `«destructured»`): `Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

Calculate and return the gift cards totals

#### Parameters

| Name | Type |
| :------ | :------ |
| `giftCardableAmount` | `number` |
| `«destructured»` | `Object` |
| › `giftCardTransactions?` | [`GiftCardTransaction`](../modules/internal-8.md#giftcardtransaction)[] |
| › `giftCards?` | [`GiftCard`](internal-3.GiftCard.md)[] |
| › `region` | [`Region`](internal-3.Region.md) |

#### Returns

`Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:123

___

### getGiftCardTransactionsTotals

▸ **getGiftCardTransactionsTotals**(`«destructured»`): `Object`

Calculate and return the gift cards totals based on their transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `giftCardTransactions` | [`GiftCardTransaction`](../modules/internal-8.md#giftcardtransaction)[] |
| › `region` | `Object` |
| › `region.gift_cards_taxable` | `boolean` |
| › `region.tax_rate` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `tax_total` | `number` |
| `total` | `number` |

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:136

___

### getLineItemRefund

▸ **getLineItemRefund**(`lineItem`, `«destructured»`): `number`

Return the amount that can be refund on a line item

#### Parameters

| Name | Type |
| :------ | :------ |
| `lineItem` | `Object` |
| `lineItem.id` | `string` |
| `lineItem.includes_tax` | `boolean` |
| `lineItem.quantity` | `number` |
| `lineItem.tax_lines` | [`LineItemTaxLine`](internal-3.LineItemTaxLine.md)[] |
| `lineItem.unit_price` | `number` |
| `«destructured»` | `Object` |
| › `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) |
| › `taxRate?` | ``null`` \| `number` |

#### Returns

`number`

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:91

___

### getLineItemRefundLegacy

▸ `Protected` **getLineItemRefundLegacy**(`lineItem`, `«destructured»`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lineItem` | `Object` |
| `lineItem.id` | `string` |
| `lineItem.includes_tax` | `boolean` |
| `lineItem.quantity` | `number` |
| `lineItem.unit_price` | `number` |
| `«destructured»` | `Object` |
| › `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) |
| › `taxRate` | `number` |

#### Returns

`number`

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:107

___

### getLineItemTotals

▸ **getLineItemTotals**(`items`, `«destructured»`): `Promise`<{ `[lineItemId: string]`: [`LineItemTotals`](../modules/internal-8.md#lineitemtotals);  }\>

Calculate and return the items totals for either the legacy calculation or the new calculation

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | [`LineItem`](internal-3.LineItem.md) \| [`LineItem`](internal-3.LineItem.md)[] |
| `«destructured»` | `Object` |
| › `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) |
| › `includeTax?` | `boolean` |
| › `taxRate?` | ``null`` \| `number` |

#### Returns

`Promise`<{ `[lineItemId: string]`: [`LineItemTotals`](../modules/internal-8.md#lineitemtotals);  }\>

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:52

___

### getLineItemTotalsLegacy

▸ `Protected` **getLineItemTotalsLegacy**(`item`, `«destructured»`): `Promise`<[`LineItemTotals`](../modules/internal-8.md#lineitemtotals)\>

Calculate and return the legacy calculated totals using the tax rate

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`LineItem`](internal-3.LineItem.md) |
| `«destructured»` | `Object` |
| › `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) |
| › `lineItemAllocation` | `Object` |
| › `lineItemAllocation.discount?` | [`DiscountAllocation`](../modules/internal-8.md#discountallocation) |
| › `lineItemAllocation.gift_card?` | [`GiftCardAllocation`](../modules/internal-8.md#giftcardallocation) |
| › `taxRate` | `number` |

#### Returns

`Promise`<[`LineItemTotals`](../modules/internal-8.md#lineitemtotals)\>

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:80

___

### getLineItemTotals\_

▸ `Protected` **getLineItemTotals_**(`item`, `«destructured»`): `Promise`<[`LineItemTotals`](../modules/internal-8.md#lineitemtotals)\>

Calculate and return the totals for an item

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`LineItem`](internal-3.LineItem.md) |
| `«destructured»` | `Object` |
| › `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) |
| › `includeTax?` | `boolean` |
| › `lineItemAllocation` | `Object` |
| › `lineItemAllocation.discount?` | [`DiscountAllocation`](../modules/internal-8.md#discountallocation) |
| › `lineItemAllocation.gift_card?` | [`GiftCardAllocation`](../modules/internal-8.md#giftcardallocation) |
| › `taxLines?` | [`LineItemTaxLine`](internal-3.LineItemTaxLine.md)[] |

#### Returns

`Promise`<[`LineItemTotals`](../modules/internal-8.md#lineitemtotals)\>

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:67

___

### getShippingMethodTotals

▸ **getShippingMethodTotals**(`shippingMethods`, `«destructured»`): `Promise`<{ `[shippingMethodId: string]`: [`ShippingMethodTotals`](../modules/internal-8.md#shippingmethodtotals);  }\>

Calculate and return the shipping methods totals for either the legacy calculation or the new calculation

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethods` | [`ShippingMethod`](internal-3.ShippingMethod.md) \| [`ShippingMethod`](internal-3.ShippingMethod.md)[] |
| `«destructured»` | `Object` |
| › `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) |
| › `discounts?` | [`Discount`](internal-3.Discount.md)[] |
| › `includeTax?` | `boolean` |
| › `taxRate?` | ``null`` \| `number` |

#### Returns

`Promise`<{ `[shippingMethodId: string]`: [`ShippingMethodTotals`](../modules/internal-8.md#shippingmethodtotals);  }\>

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:154

___

### getShippingMethodTotalsLegacy

▸ `Protected` **getShippingMethodTotalsLegacy**(`shippingMethod`, `«destructured»`): `Promise`<[`ShippingMethodTotals`](../modules/internal-8.md#shippingmethodtotals)\>

Calculate and return the shipping method totals legacy using the tax rate

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethod` | [`ShippingMethod`](internal-3.ShippingMethod.md) |
| `«destructured»` | `Object` |
| › `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) |
| › `discounts?` | [`Discount`](internal-3.Discount.md)[] |
| › `taxRate` | `number` |

#### Returns

`Promise`<[`ShippingMethodTotals`](../modules/internal-8.md#shippingmethodtotals)\>

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:183

___

### getShippingMethodTotals\_

▸ `Protected` **getShippingMethodTotals_**(`shippingMethod`, `«destructured»`): `Promise`<[`ShippingMethodTotals`](../modules/internal-8.md#shippingmethodtotals)\>

Calculate and return the shipping method totals

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethod` | [`ShippingMethod`](internal-3.ShippingMethod.md) |
| `«destructured»` | `Object` |
| › `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) |
| › `discounts?` | [`Discount`](internal-3.Discount.md)[] |
| › `includeTax?` | `boolean` |
| › `taxLines?` | [`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md)[] |

#### Returns

`Promise`<[`ShippingMethodTotals`](../modules/internal-8.md#shippingmethodtotals)\>

#### Defined in

packages/medusa/dist/services/new-totals.d.ts:170

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

▸ **withTransaction**(`transactionManager?`): [`NewTotalsService`](internal-8.internal.NewTotalsService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`NewTotalsService`](internal-8.internal.NewTotalsService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
