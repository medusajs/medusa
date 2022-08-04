# Class: TotalsService

## Hierarchy

- `TransactionBaseService`<[`TotalsService`](TotalsService.md)\>

  ↳ **`TotalsService`**

## Constructors

### constructor

• **new TotalsService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `TotalsServiceProps` |

#### Overrides

TransactionBaseService&lt;TotalsService\&gt;.constructor

#### Defined in

[services/totals.ts:99](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L99)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/totals.ts:93](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L93)

___

### taxCalculationStrategy\_

• `Private` **taxCalculationStrategy\_**: `ITaxCalculationStrategy`

#### Defined in

[services/totals.ts:97](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L97)

___

### taxProviderService\_

• `Private` **taxProviderService\_**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[services/totals.ts:96](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L96)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/totals.ts:94](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L94)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

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

[services/totals.ts:567](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L567)

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

[services/totals.ts:609](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L609)

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

[services/totals.ts:390](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L390)

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

[services/totals.ts:972](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L972)

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

[services/totals.ts:938](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L938)

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

[services/totals.ts:866](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L866)

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

[services/totals.ts:851](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L851)

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

[services/totals.ts:660](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L660)

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

[services/totals.ts:637](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L637)

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

[services/totals.ts:622](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L622)

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

[services/totals.ts:482](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L482)

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

[services/totals.ts:820](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L820)

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

[services/totals.ts:706](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L706)

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

[services/totals.ts:145](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L145)

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

[services/totals.ts:526](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L526)

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

[services/totals.ts:467](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L467)

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

[services/totals.ts:179](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L179)

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

[services/totals.ts:286](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L286)

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

[services/totals.ts:262](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L262)

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

[services/totals.ts:160](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L160)

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

[services/totals.ts:301](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L301)

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

[services/totals.ts:122](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L122)

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

[services/totals.ts:1002](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/totals.ts#L1002)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
