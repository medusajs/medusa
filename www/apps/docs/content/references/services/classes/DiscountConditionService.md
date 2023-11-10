# DiscountConditionService

Provides layer to manipulate discount conditions.

**Implements**

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`DiscountConditionService`**

## Constructors

### constructor

**new DiscountConditionService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-8) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/discount-condition.ts:34](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/discount-condition.ts#L34)

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

### discountConditionRepository\_

 `Protected` `Readonly` **discountConditionRepository\_**: [`Repository`](Repository.md)<[`DiscountCondition`](DiscountCondition.md)\> & { `addConditionResources`: Method addConditionResources ; `canApplyForCustomer`: Method canApplyForCustomer ; `findOneWithDiscount`: Method findOneWithDiscount ; `getJoinTableResourceIdentifiers`: Method getJoinTableResourceIdentifiers ; `isValidForProduct`: Method isValidForProduct ; `queryConditionTable`: Method queryConditionTable ; `removeConditionResources`: Method removeConditionResources  }

#### Defined in

[packages/medusa/src/services/discount-condition.ts:31](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/discount-condition.ts#L31)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/discount-condition.ts:32](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/discount-condition.ts#L32)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

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

### delete

**delete**(`discountConditionId`): `Promise`<`void` \| [`DiscountCondition`](DiscountCondition.md)\>

#### Parameters

| Name |
| :------ |
| `discountConditionId` | `string` |

#### Returns

`Promise`<`void` \| [`DiscountCondition`](DiscountCondition.md)\>

-`Promise`: 
	-`void \| DiscountCondition`: (optional) 

#### Defined in

[packages/medusa/src/services/discount-condition.ts:217](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/discount-condition.ts#L217)

___

### removeResources

**removeResources**(`data`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `data` | [`Omit`](../index.md#omit)<[`DiscountConditionInput`](../index.md#discountconditioninput), ``"id"``\> & { `id`: `string`  } |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/discount-condition.ts:184](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/discount-condition.ts#L184)

___

### retrieve

**retrieve**(`conditionId`, `config?`): `Promise`<[`DiscountCondition`](DiscountCondition.md)\>

#### Parameters

| Name |
| :------ |
| `conditionId` | `string` |
| `config?` | [`FindConfig`](../interfaces/FindConfig.md)<[`DiscountCondition`](DiscountCondition.md)\> |

#### Returns

`Promise`<[`DiscountCondition`](DiscountCondition.md)\>

-`Promise`: 
	-`DiscountCondition`: 

#### Defined in

[packages/medusa/src/services/discount-condition.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/discount-condition.ts#L45)

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

### upsertCondition

**upsertCondition**(`data`, `overrideExisting?`): `Promise`<([`DiscountConditionProduct`](DiscountConditionProduct.md) \| [`DiscountConditionProductType`](DiscountConditionProductType.md) \| [`DiscountConditionProductCollection`](DiscountConditionProductCollection.md) \| [`DiscountConditionProductTag`](DiscountConditionProductTag.md) \| [`DiscountConditionCustomerGroup`](DiscountConditionCustomerGroup.md))[]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `data` | [`DiscountConditionInput`](../index.md#discountconditioninput) |
| `overrideExisting` | `boolean` | true |

#### Returns

`Promise`<([`DiscountConditionProduct`](DiscountConditionProduct.md) \| [`DiscountConditionProductType`](DiscountConditionProductType.md) \| [`DiscountConditionProductCollection`](DiscountConditionProductCollection.md) \| [`DiscountConditionProductTag`](DiscountConditionProductTag.md) \| [`DiscountConditionCustomerGroup`](DiscountConditionCustomerGroup.md))[]\>

-`Promise`: 
	-`(DiscountConditionProduct \| DiscountConditionProductType \| DiscountConditionProductCollection \| DiscountConditionProductTag \| DiscountConditionCustomerGroup)[]`: 
		-`DiscountConditionProduct \| DiscountConditionProductType \| DiscountConditionProductCollection \| DiscountConditionProductTag \| DiscountConditionCustomerGroup`: (optional) 

#### Defined in

[packages/medusa/src/services/discount-condition.ts:111](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/discount-condition.ts#L111)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`DiscountConditionService`](DiscountConditionService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`DiscountConditionService`](DiscountConditionService.md)

-`DiscountConditionService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)

___

### resolveConditionType\_

`Static` `Protected` **resolveConditionType_**(`data`): `undefined` \| { `resource_ids`: (`string` \| { `id`: `string`  })[] ; `type`: [`DiscountConditionType`](../enums/DiscountConditionType.md)  }

#### Parameters

| Name |
| :------ |
| `data` | [`DiscountConditionInput`](../index.md#discountconditioninput) |

#### Returns

`undefined` \| { `resource_ids`: (`string` \| { `id`: `string`  })[] ; `type`: [`DiscountConditionType`](../enums/DiscountConditionType.md)  }

-`undefined \| { `resource_ids`: (`string` \| { `id`: `string`  })[] ; `type`: [`DiscountConditionType`](../enums/DiscountConditionType.md)  }`: (optional) 

#### Defined in

[packages/medusa/src/services/discount-condition.ts:74](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/discount-condition.ts#L74)
