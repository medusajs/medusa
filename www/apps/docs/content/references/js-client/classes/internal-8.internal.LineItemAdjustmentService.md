---
displayed_sidebar: jsClientSidebar
---

# Class: LineItemAdjustmentService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).LineItemAdjustmentService

Provides layer to manipulate line item adjustments.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`LineItemAdjustmentService`**

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

### discountService

• `Private` `Readonly` **discountService**: `any`

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:29

___

### lineItemAdjustmentRepo\_

• `Private` `Readonly` **lineItemAdjustmentRepo\_**: `any`

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:28

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

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

### create

▸ **create**(`data`): `Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\>

Creates a line item adjustment

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`Partial`](../modules/internal-8.md#partial)<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\> | the line item adjustment to create |

#### Returns

`Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\>

line item adjustment

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:43

___

### createAdjustmentForLineItem

▸ **createAdjustmentForLineItem**(`cart`, `lineItem`): `Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)[]\>

Creates adjustment for a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart object holding discounts |
| `lineItem` | [`LineItem`](internal-3.LineItem.md) | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)[]\>

a line item adjustment or undefined if no adjustment was created

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:80

___

### createAdjustments

▸ **createAdjustments**(`cart`, `lineItem?`): `Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)[] \| [`LineItemAdjustment`](internal-3.LineItemAdjustment.md)[][]\>

Creates adjustment for a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cart` | [`Cart`](internal-3.Cart.md) | the cart object holding discounts |
| `lineItem?` | [`LineItem`](internal-3.LineItem.md) | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)[] \| [`LineItemAdjustment`](internal-3.LineItemAdjustment.md)[][]\>

if a lineItem was given, returns a line item adjustment or undefined if no adjustment was created
otherwise returns an array of line item adjustments for each line item in the cart

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:88

___

### delete

▸ **delete**(`selectorOrIds`): `Promise`<`void`\>

Deletes line item adjustments matching a selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selectorOrIds` | `string` \| `string`[] \| [`FilterableLineItemAdjustmentProps`](internal-8.FilterableLineItemAdjustmentProps.md) & { `discount_id?`: `FindOperator`<``null`` \| `string`\>  } | the query object for find or the line item adjustment id |

#### Returns

`Promise`<`void`\>

the result of the delete operation

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:63

___

### generateAdjustments

▸ **generateAdjustments**(`calculationContextData`, `generatedLineItem`, `context`): `Promise`<[`GeneratedAdjustment`](../modules/internal-8.md#generatedadjustment)[]\>

Creates adjustment for a line item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `calculationContextData` | [`CalculationContextData`](../modules/internal-8.md#calculationcontextdata) | the calculationContextData object holding discounts |
| `generatedLineItem` | [`LineItem`](internal-3.LineItem.md) | the line item for which a line item adjustment might be created |
| `context` | [`AdjustmentContext`](../modules/internal-8.md#adjustmentcontext) | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<[`GeneratedAdjustment`](../modules/internal-8.md#generatedadjustment)[]\>

a line item adjustment or undefined if no adjustment was created

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:73

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)[]\>

Lists line item adjustments

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`FilterableLineItemAdjustmentProps`](internal-8.FilterableLineItemAdjustmentProps.md) | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\> | the config to be used for find |

#### Returns

`Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:57

___

### retrieve

▸ **retrieve**(`lineItemAdjustmentId`, `config?`): `Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\>

Retrieves a line item adjustment by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItemAdjustmentId` | `string` | the id of the line item adjustment to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\> | the config to retrieve the line item adjustment by |

#### Returns

`Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\>

the line item adjustment.

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:37

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

### update

▸ **update**(`id`, `data`): `Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\>

Creates a line item adjustment

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the line item adjustment id to update |
| `data` | [`Partial`](../modules/internal-8.md#partial)<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\> | the line item adjustment to create |

#### Returns

`Promise`<[`LineItemAdjustment`](internal-3.LineItemAdjustment.md)\>

line item adjustment

#### Defined in

packages/medusa/dist/services/line-item-adjustment.d.ts:50

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`LineItemAdjustmentService`](internal-8.internal.LineItemAdjustmentService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`LineItemAdjustmentService`](internal-8.internal.LineItemAdjustmentService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
