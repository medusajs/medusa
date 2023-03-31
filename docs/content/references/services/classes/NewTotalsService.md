# Class: NewTotalsService

## Hierarchy

- `TransactionBaseService`

  ↳ **`NewTotalsService`**

## Constructors

### constructor

• **new NewTotalsService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/new-totals.ts:68](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L68)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/new-totals.ts:65](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L65)

___

### manager\_

• `Protected` `Readonly` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/new-totals.ts:61](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L61)

___

### taxCalculationStrategy\_

• `Protected` `Readonly` **taxCalculationStrategy\_**: `ITaxCalculationStrategy`

#### Defined in

[packages/medusa/src/services/new-totals.ts:66](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L66)

___

### taxProviderService\_

• `Protected` `Readonly` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/new-totals.ts:64](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L64)

___

### transactionManager\_

• `Protected` `Readonly` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/new-totals.ts:62](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L62)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### getGiftCardTotals

▸ **getGiftCardTotals**(`giftCardableAmount`, `__namedParameters`): `Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

Calculate and return the gift cards totals

#### Parameters

| Name | Type |
| :------ | :------ |
| `giftCardableAmount` | `number` |
| `__namedParameters` | `Object` |
| `__namedParameters.giftCardTransactions?` | `GiftCardTransaction`[] |
| `__namedParameters.giftCards?` | `GiftCard`[] |
| `__namedParameters.region` | `Region` |

#### Returns

`Promise`<{ `tax_total`: `number` ; `total`: `number`  }\>

#### Defined in

[packages/medusa/src/services/new-totals.ts:445](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L445)

___

### getGiftCardTransactionsTotals

▸ **getGiftCardTransactionsTotals**(`__namedParameters`): `Object`

Calculate and return the gift cards totals based on their transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.giftCardTransactions` | `GiftCardTransaction`[] |
| `__namedParameters.region` | `Object` |
| `__namedParameters.region.gift_cards_taxable` | `boolean` |
| `__namedParameters.region.tax_rate` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `tax_total` | `number` |
| `total` | `number` |

#### Defined in

[packages/medusa/src/services/new-totals.ts:524](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L524)

___

### getLineItemRefund

▸ **getLineItemRefund**(`lineItem`, `__namedParameters`): `number`

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
| `__namedParameters` | `Object` |
| `__namedParameters.calculationContext` | `TaxCalculationContext` |
| `__namedParameters.taxRate?` | ``null`` \| `number` |

#### Returns

`number`

#### Defined in

[packages/medusa/src/services/new-totals.ts:331](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L331)

___

### getLineItemRefundLegacy

▸ `Protected` **getLineItemRefundLegacy**(`lineItem`, `__namedParameters`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `lineItem` | `Object` |
| `lineItem.id` | `string` |
| `lineItem.includes_tax` | `boolean` |
| `lineItem.quantity` | `number` |
| `lineItem.unit_price` | `number` |
| `__namedParameters` | `Object` |
| `__namedParameters.calculationContext` | `TaxCalculationContext` |
| `__namedParameters.taxRate` | `number` |

#### Returns

`number`

#### Defined in

[packages/medusa/src/services/new-totals.ts:401](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L401)

___

### getLineItemTotals

▸ **getLineItemTotals**(`items`, `__namedParameters`): `Promise`<{ `[lineItemId: string]`: `LineItemTotals`;  }\>

Calculate and return the items totals for either the legacy calculation or the new calculation

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | `LineItem` \| `LineItem`[] |
| `__namedParameters` | `Object` |
| `__namedParameters.calculationContext` | `TaxCalculationContext` |
| `__namedParameters.includeTax?` | `boolean` |
| `__namedParameters.taxRate?` | ``null`` \| `number` |

#### Returns

`Promise`<{ `[lineItemId: string]`: `LineItemTotals`;  }\>

#### Defined in

[packages/medusa/src/services/new-totals.ts:90](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L90)

___

### getLineItemTotalsLegacy

▸ `Protected` **getLineItemTotalsLegacy**(`item`, `__namedParameters`): `Promise`<`LineItemTotals`\>

Calculate and return the legacy calculated totals using the tax rate

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `LineItem` |
| `__namedParameters` | `Object` |
| `__namedParameters.calculationContext` | `TaxCalculationContext` |
| `__namedParameters.lineItemAllocation` | `Object` |
| `__namedParameters.lineItemAllocation.discount?` | `DiscountAllocation` |
| `__namedParameters.lineItemAllocation.gift_card?` | `GiftCardAllocation` |
| `__namedParameters.taxRate` | `number` |

#### Returns

`Promise`<`LineItemTotals`\>

#### Defined in

[packages/medusa/src/services/new-totals.ts:255](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L255)

___

### getLineItemTotals\_

▸ `Protected` **getLineItemTotals_**(`item`, `__namedParameters`): `Promise`<`LineItemTotals`\>

Calculate and return the totals for an item

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `LineItem` |
| `__namedParameters` | `Object` |
| `__namedParameters.calculationContext` | `TaxCalculationContext` |
| `__namedParameters.includeTax?` | `boolean` |
| `__namedParameters.lineItemAllocation` | `Object` |
| `__namedParameters.lineItemAllocation.discount?` | `DiscountAllocation` |
| `__namedParameters.lineItemAllocation.gift_card?` | `GiftCardAllocation` |
| `__namedParameters.taxLines?` | `LineItemTaxLine`[] |

#### Returns

`Promise`<`LineItemTotals`\>

#### Defined in

[packages/medusa/src/services/new-totals.ts:151](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L151)

___

### getShippingMethodTotals

▸ **getShippingMethodTotals**(`shippingMethods`, `__namedParameters`): `Promise`<{ `[shippingMethodId: string]`: `ShippingMethodTotals`;  }\>

Calculate and return the shipping methods totals for either the legacy calculation or the new calculation

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethods` | `ShippingMethod` \| `ShippingMethod`[] |
| `__namedParameters` | `Object` |
| `__namedParameters.calculationContext` | `TaxCalculationContext` |
| `__namedParameters.discounts?` | `Discount`[] |
| `__namedParameters.includeTax?` | `boolean` |
| `__namedParameters.taxRate?` | ``null`` \| `number` |

#### Returns

`Promise`<{ `[shippingMethodId: string]`: `ShippingMethodTotals`;  }\>

#### Defined in

[packages/medusa/src/services/new-totals.ts:570](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L570)

___

### getShippingMethodTotalsLegacy

▸ `Protected` **getShippingMethodTotalsLegacy**(`shippingMethod`, `__namedParameters`): `Promise`<`ShippingMethodTotals`\>

Calculate and return the shipping method totals legacy using teh tax rate

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethod` | `ShippingMethod` |
| `__namedParameters` | `Object` |
| `__namedParameters.calculationContext` | `TaxCalculationContext` |
| `__namedParameters.discounts?` | `Discount`[] |
| `__namedParameters.taxRate` | `number` |

#### Returns

`Promise`<`ShippingMethodTotals`\>

#### Defined in

[packages/medusa/src/services/new-totals.ts:728](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L728)

___

### getShippingMethodTotals\_

▸ `Protected` **getShippingMethodTotals_**(`shippingMethod`, `__namedParameters`): `Promise`<`ShippingMethodTotals`\>

Calculate and return the shipping method totals

#### Parameters

| Name | Type |
| :------ | :------ |
| `shippingMethod` | `ShippingMethod` |
| `__namedParameters` | `Object` |
| `__namedParameters.calculationContext` | `TaxCalculationContext` |
| `__namedParameters.discounts?` | `Discount`[] |
| `__namedParameters.includeTax?` | `boolean` |
| `__namedParameters.taxLines?` | `ShippingMethodTaxLine`[] |

#### Returns

`Promise`<`ShippingMethodTotals`\>

#### Defined in

[packages/medusa/src/services/new-totals.ts:645](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/new-totals.ts#L645)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
