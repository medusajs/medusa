# Class: NewTotalsService

## Hierarchy

- `TransactionBaseService`

  ↳ **`NewTotalsService`**

## Constructors

### constructor

• **new NewTotalsService**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/new-totals.ts:67](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L67)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/new-totals.ts:64](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L64)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### taxCalculationStrategy\_

• `Protected` `Readonly` **taxCalculationStrategy\_**: `ITaxCalculationStrategy`

#### Defined in

[medusa/src/services/new-totals.ts:65](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L65)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/new-totals.ts:63](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L63)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### getGiftCardTotals

▸ **getGiftCardTotals**(`giftCardableAmount`, `«destructured»`): `Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

Calculate and return the gift cards totals

#### Parameters

| Name | Type |
| :------ | :------ |
| `giftCardableAmount` | `number` |
| `«destructured»` | `Object` |
| › `giftCardTransactions?` | `GiftCardTransaction`[] |
| › `giftCards?` | `GiftCard`[] |
| › `region` | `Region` |

#### Returns

`Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

#### Defined in

[medusa/src/services/new-totals.ts:447](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L447)

___

### getGiftCardTransactionsTotals

▸ **getGiftCardTransactionsTotals**(`«destructured»`): `Object`

Calculate and return the gift cards totals based on their transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `giftCardTransactions` | `GiftCardTransaction`[] |
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

[medusa/src/services/new-totals.ts:526](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L526)

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
| `lineItem.tax_lines` | `LineItemTaxLine`[] |
| `lineItem.unit_price` | `number` |
| `«destructured»` | `Object` |
| › `calculationContext` | `TaxCalculationContext` |
| › `taxRate?` | ``null`` \| `number` |

#### Returns

`number`

#### Defined in

[medusa/src/services/new-totals.ts:333](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L333)

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
| › `calculationContext` | `TaxCalculationContext` |
| › `taxRate` | `number` |

#### Returns

`number`

#### Defined in

[medusa/src/services/new-totals.ts:403](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L403)

___

### getLineItemTotals

▸ **getLineItemTotals**(`items`, `«destructured»`): `Promise`<{ `[lineItemId: string]`: `LineItemTotals`;  }\>

Calculate and return the items totals for either the legacy calculation or the new calculation

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | `LineItem` \| `LineItem`[] |
| `«destructured»` | `Object` |
| › `calculationContext` | `TaxCalculationContext` |
| › `includeTax?` | `boolean` |
| › `taxRate?` | ``null`` \| `number` |

#### Returns

`Promise`<{ `[lineItemId: string]`: `LineItemTotals`;  }\>

#### Defined in

[medusa/src/services/new-totals.ts:87](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L87)

___

### getLineItemTotalsLegacy

▸ `Protected` **getLineItemTotalsLegacy**(`item`, `«destructured»`): `Promise`<`LineItemTotals`\>

Calculate and return the legacy calculated totals using the tax rate

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `LineItem` |
| `«destructured»` | `Object` |
| › `calculationContext` | `TaxCalculationContext` |
| › `lineItemAllocation` | `Object` |
| › `lineItemAllocation.discount?` | `DiscountAllocation` |
| › `lineItemAllocation.gift_card?` | `GiftCardAllocation` |
| › `taxRate` | `number` |

#### Returns

`Promise`<`LineItemTotals`\>

#### Defined in

[medusa/src/services/new-totals.ts:254](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L254)

___

### getLineItemTotals\_

▸ `Protected` **getLineItemTotals_**(`item`, `«destructured»`): `Promise`<`LineItemTotals`\>

Calculate and return the totals for an item

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `LineItem` |
| `«destructured»` | `Object` |
| › `calculationContext` | `TaxCalculationContext` |
| › `includeTax?` | `boolean` |
| › `lineItemAllocation` | `Object` |
| › `lineItemAllocation.discount?` | `DiscountAllocation` |
| › `lineItemAllocation.gift_card?` | `GiftCardAllocation` |
| › `taxLines?` | `LineItemTaxLine`[] |

#### Returns

`Promise`<`LineItemTotals`\>

#### Defined in

[medusa/src/services/new-totals.ts:147](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L147)

___

### getShippingMethodTotals

▸ **getShippingMethodTotals**(`shippingMethods`, `«destructured»`): `Promise`<{ `[shippingMethodId: string]`: `ShippingMethodTotals`;  }\>

Calculate and return the shipping methods totals for either the legacy calculation or the new calculation

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethods` | `ShippingMethod` \| `ShippingMethod`[] |
| `«destructured»` | `Object` |
| › `calculationContext` | `TaxCalculationContext` |
| › `discounts?` | `Discount`[] |
| › `includeTax?` | `boolean` |
| › `taxRate?` | ``null`` \| `number` |

#### Returns

`Promise`<{ `[shippingMethodId: string]`: `ShippingMethodTotals`;  }\>

#### Defined in

[medusa/src/services/new-totals.ts:572](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L572)

___

### getShippingMethodTotalsLegacy

▸ `Protected` **getShippingMethodTotalsLegacy**(`shippingMethod`, `«destructured»`): `Promise`<`ShippingMethodTotals`\>

Calculate and return the shipping method totals legacy using the tax rate

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethod` | `ShippingMethod` |
| `«destructured»` | `Object` |
| › `calculationContext` | `TaxCalculationContext` |
| › `discounts?` | `Discount`[] |
| › `taxRate` | `number` |

#### Returns

`Promise`<`ShippingMethodTotals`\>

#### Defined in

[medusa/src/services/new-totals.ts:729](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L729)

___

### getShippingMethodTotals\_

▸ `Protected` **getShippingMethodTotals_**(`shippingMethod`, `«destructured»`): `Promise`<`ShippingMethodTotals`\>

Calculate and return the shipping method totals

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethod` | `ShippingMethod` |
| `«destructured»` | `Object` |
| › `calculationContext` | `TaxCalculationContext` |
| › `discounts?` | `Discount`[] |
| › `includeTax?` | `boolean` |
| › `taxLines?` | `ShippingMethodTaxLine`[] |

#### Returns

`Promise`<`ShippingMethodTotals`\>

#### Defined in

[medusa/src/services/new-totals.ts:646](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/new-totals.ts#L646)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`NewTotalsService`](NewTotalsService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`NewTotalsService`](NewTotalsService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
