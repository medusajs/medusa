# LineItemAdjustmentService

Provides layer to manipulate line item adjustments.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`LineItemAdjustmentService`**

## Constructors

### constructor

**new LineItemAdjustmentService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`LineItemAdjustmentServiceProps`](../types/LineItemAdjustmentServiceProps.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L37)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### discountService

 `Private` `Readonly` **discountService**: [`DiscountService`](DiscountService.md)

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:35](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L35)

___

### lineItemAdjustmentRepo\_

 `Private` `Readonly` **lineItemAdjustmentRepo\_**: [`Repository`](Repository.md)<[`LineItemAdjustment`](LineItemAdjustment.md)\>

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L34)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`data`): `Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)\>

Creates a line item adjustment

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | [`Partial`](../types/Partial.md)<[`LineItemAdjustment`](LineItemAdjustment.md)\> | the line item adjustment to create |

#### Returns

`Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)\>

-`Promise`: line item adjustment
	-`LineItemAdjustment`: 

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:87](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L87)

___

### createAdjustmentForLineItem

**createAdjustmentForLineItem**(`cart`, `lineItem`): `Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)[]\>

Creates adjustment for a line item

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | [`Cart`](Cart.md) | the cart object holding discounts |
| `lineItem` | [`LineItem`](LineItem.md) | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)[]\>

-`Promise`: a line item adjustment or undefined if no adjustment was created
	-`LineItemAdjustment[]`: 
		-`LineItemAdjustment`: 

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:263](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L263)

___

### createAdjustments

**createAdjustments**(`cart`, `lineItem?`): `Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)[] \| [`LineItemAdjustment`](LineItemAdjustment.md)[][]\>

Creates adjustment for a line item

#### Parameters

| Name | Description |
| :------ | :------ |
| `cart` | [`Cart`](Cart.md) | the cart object holding discounts |
| `lineItem?` | [`LineItem`](LineItem.md) | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)[] \| [`LineItemAdjustment`](LineItemAdjustment.md)[][]\>

-`Promise`: if a lineItem was given, returns a line item adjustment or undefined if no adjustment was created
otherwise returns an array of line item adjustments for each line item in the cart
	-`LineItemAdjustment[] \| LineItemAdjustment[][]`: (optional) 

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:291](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L291)

___

### delete

**delete**(`selectorOrIds`): `Promise`<`void`\>

Deletes line item adjustments matching a selector

#### Parameters

| Name | Description |
| :------ | :------ |
| `selectorOrIds` | `string` \| `string`[] \| [`FilterableLineItemAdjustmentProps`](FilterableLineItemAdjustmentProps.md) & { `discount_id?`: [`FindOperator`](FindOperator.md)<``null`` \| `string`\>  } | the query object for find or the line item adjustment id |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the delete operation

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:154](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L154)

___

### generateAdjustments

**generateAdjustments**(`calculationContextData`, `generatedLineItem`, `context`): `Promise`<[`GeneratedAdjustment`](../types/GeneratedAdjustment.md)[]\>

Creates adjustment for a line item

#### Parameters

| Name | Description |
| :------ | :------ |
| `calculationContextData` | [`CalculationContextData`](../types/CalculationContextData.md) | the calculationContextData object holding discounts |
| `generatedLineItem` | [`LineItem`](LineItem.md) | the line item for which a line item adjustment might be created |
| `context` | [`AdjustmentContext`](../types/AdjustmentContext.md) | the line item for which a line item adjustment might be created |

#### Returns

`Promise`<[`GeneratedAdjustment`](../types/GeneratedAdjustment.md)[]\>

-`Promise`: a line item adjustment or undefined if no adjustment was created
	-`GeneratedAdjustment[]`: 
		-`GeneratedAdjustment`: 

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:189](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L189)

___

### list

**list**(`selector?`, `config?`): `Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)[]\>

Lists line item adjustments

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`FilterableLineItemAdjustmentProps`](FilterableLineItemAdjustmentProps.md) | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`LineItemAdjustment`](LineItemAdjustment.md)\> | the config to be used for find |

#### Returns

`Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)[]\>

-`Promise`: the result of the find operation
	-`LineItemAdjustment[]`: 
		-`LineItemAdjustment`: 

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:137](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L137)

___

### retrieve

**retrieve**(`lineItemAdjustmentId`, `config?`): `Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)\>

Retrieves a line item adjustment by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItemAdjustmentId` | `string` | the id of the line item adjustment to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`LineItemAdjustment`](LineItemAdjustment.md)\> | the config to retrieve the line item adjustment by |

#### Returns

`Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)\>

-`Promise`: the line item adjustment.
	-`LineItemAdjustment`: 

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:54](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L54)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`id`, `data`): `Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)\>

Creates a line item adjustment

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the line item adjustment id to update |
| `data` | [`Partial`](../types/Partial.md)<[`LineItemAdjustment`](LineItemAdjustment.md)\> | the line item adjustment to create |

#### Returns

`Promise`<[`LineItemAdjustment`](LineItemAdjustment.md)\>

-`Promise`: line item adjustment
	-`LineItemAdjustment`: 

#### Defined in

[packages/medusa/src/services/line-item-adjustment.ts:105](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/line-item-adjustment.ts#L105)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`LineItemAdjustmentService`](LineItemAdjustmentService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`LineItemAdjustmentService`](LineItemAdjustmentService.md)

-`LineItemAdjustmentService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
