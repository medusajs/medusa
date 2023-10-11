---
displayed_sidebar: jsClientSidebar
---

# Class: DiscountConditionService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).DiscountConditionService

Provides layer to manipulate discount conditions.

**`Implements`**

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`DiscountConditionService`**

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

### discountConditionRepository\_

• `Protected` `Readonly` **discountConditionRepository\_**: `Repository`<[`DiscountCondition`](internal-3.DiscountCondition.md)\> & { `addConditionResources`: (`conditionId`: `string`, `resourceIds`: (`string` \| { `id`: `string`  })[], `type`: [`DiscountConditionType`](../enums/internal-3.DiscountConditionType.md), `overrideExisting?`: `boolean`) => `Promise`<([`DiscountConditionCustomerGroup`](internal-8.internal.DiscountConditionCustomerGroup.md) \| [`DiscountConditionProduct`](internal-8.internal.DiscountConditionProduct.md) \| [`DiscountConditionProductCollection`](internal-8.internal.DiscountConditionProductCollection.md) \| [`DiscountConditionProductTag`](internal-8.internal.DiscountConditionProductTag.md) \| [`DiscountConditionProductType`](internal-8.internal.DiscountConditionProductType.md))[]\> ; `canApplyForCustomer`: (`discountRuleId`: `string`, `customerId`: `string`) => `Promise`<`boolean`\> ; `findOneWithDiscount`: (`conditionId`: `string`, `discountId`: `string`) => `Promise`<`undefined` \| [`DiscountCondition`](internal-3.DiscountCondition.md) & { `discount`: [`Discount`](internal-3.Discount.md)  }\> ; `getJoinTableResourceIdentifiers`: (`type`: `string`) => { `conditionTable`: [`DiscountConditionResourceType`](../modules/internal-8.md#discountconditionresourcetype) ; `joinTable`: `string` ; `joinTableForeignKey`: [`DiscountConditionJoinTableForeignKey`](../enums/internal-8.DiscountConditionJoinTableForeignKey.md) ; `joinTableKey`: `string` ; `relatedTable`: `string` ; `resourceKey`: `string`  } ; `isValidForProduct`: (`discountRuleId`: `string`, `productId`: `string`) => `Promise`<`boolean`\> ; `queryConditionTable`: (`__namedParameters`: { `conditionId`: `any` ; `resourceId`: `any` ; `type`: `any`  }) => `Promise`<`number`\> ; `removeConditionResources`: (`id`: `string`, `type`: [`DiscountConditionType`](../enums/internal-3.DiscountConditionType.md), `resourceIds`: (`string` \| { `id`: `string`  })[]) => `Promise`<`void` \| `DeleteResult`\>  }

#### Defined in

packages/medusa/dist/services/discount-condition.d.ts:18

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/discount-condition.d.ts:19

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

### delete

▸ **delete**(`discountConditionId`): `Promise`<`void` \| [`DiscountCondition`](internal-3.DiscountCondition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `discountConditionId` | `string` |

#### Returns

`Promise`<`void` \| [`DiscountCondition`](internal-3.DiscountCondition.md)\>

#### Defined in

packages/medusa/dist/services/discount-condition.d.ts:32

___

### removeResources

▸ **removeResources**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`Omit`](../modules/internal-1.md#omit)<[`DiscountConditionInput`](../modules/internal-8.md#discountconditioninput), ``"id"``\> & { `id`: `string`  } |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/discount-condition.d.ts:29

___

### retrieve

▸ **retrieve**(`conditionId`, `config?`): `Promise`<[`DiscountCondition`](internal-3.DiscountCondition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `conditionId` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`DiscountCondition`](internal-3.DiscountCondition.md)\> |

#### Returns

`Promise`<[`DiscountCondition`](internal-3.DiscountCondition.md)\>

#### Defined in

packages/medusa/dist/services/discount-condition.d.ts:21

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

### upsertCondition

▸ **upsertCondition**(`data`, `overrideExisting?`): `Promise`<([`DiscountConditionCustomerGroup`](internal-8.internal.DiscountConditionCustomerGroup.md) \| [`DiscountConditionProduct`](internal-8.internal.DiscountConditionProduct.md) \| [`DiscountConditionProductCollection`](internal-8.internal.DiscountConditionProductCollection.md) \| [`DiscountConditionProductTag`](internal-8.internal.DiscountConditionProductTag.md) \| [`DiscountConditionProductType`](internal-8.internal.DiscountConditionProductType.md))[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`DiscountConditionInput`](../modules/internal-8.md#discountconditioninput) |
| `overrideExisting?` | `boolean` |

#### Returns

`Promise`<([`DiscountConditionCustomerGroup`](internal-8.internal.DiscountConditionCustomerGroup.md) \| [`DiscountConditionProduct`](internal-8.internal.DiscountConditionProduct.md) \| [`DiscountConditionProductCollection`](internal-8.internal.DiscountConditionProductCollection.md) \| [`DiscountConditionProductTag`](internal-8.internal.DiscountConditionProductTag.md) \| [`DiscountConditionProductType`](internal-8.internal.DiscountConditionProductType.md))[]\>

#### Defined in

packages/medusa/dist/services/discount-condition.d.ts:28

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`DiscountConditionService`](internal-8.internal.DiscountConditionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`DiscountConditionService`](internal-8.internal.DiscountConditionService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11

___

### resolveConditionType\_

▸ `Static` `Protected` **resolveConditionType_**(`data`): `undefined` \| { `resource_ids`: (`string` \| { `id`: `string`  })[] ; `type`: [`DiscountConditionType`](../enums/internal-3.DiscountConditionType.md)  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`DiscountConditionInput`](../modules/internal-8.md#discountconditioninput) |

#### Returns

`undefined` \| { `resource_ids`: (`string` \| { `id`: `string`  })[] ; `type`: [`DiscountConditionType`](../enums/internal-3.DiscountConditionType.md)  }

#### Defined in

packages/medusa/dist/services/discount-condition.d.ts:22
