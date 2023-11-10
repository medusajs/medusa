# ReturnReasonService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`ReturnReasonService`**

## Constructors

### constructor

**new ReturnReasonService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-32.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/return-reason.ts:18](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/return-reason.ts#L18)

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

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### retReasonRepo\_

 `Protected` `Readonly` **retReasonRepo\_**: [`Repository`](Repository.md)<[`ReturnReason`](ReturnReason.md)\>

#### Defined in

[packages/medusa/src/services/return-reason.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/return-reason.ts#L16)

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

**create**(`data`): `Promise`<[`ReturnReason`](ReturnReason.md)\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateReturnReason`](../types/CreateReturnReason.md) |

#### Returns

`Promise`<[`ReturnReason`](ReturnReason.md)\>

-`Promise`: 
	-`ReturnReason`: 

#### Defined in

[packages/medusa/src/services/return-reason.ts:25](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/return-reason.ts#L25)

___

### delete

**delete**(`returnReasonId`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `returnReasonId` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/return-reason.ts:113](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/return-reason.ts#L113)

___

### list

**list**(`selector`, `config?`): `Promise`<[`ReturnReason`](ReturnReason.md)[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../types/Selector.md)<[`ReturnReason`](ReturnReason.md)\> | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ReturnReason`](ReturnReason.md)\> | config object |

#### Returns

`Promise`<[`ReturnReason`](ReturnReason.md)[]\>

-`Promise`: the result of the find operation
	-`ReturnReason[]`: 
		-`ReturnReason`: 

#### Defined in

[packages/medusa/src/services/return-reason.ts:68](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/return-reason.ts#L68)

___

### retrieve

**retrieve**(`returnReasonId`, `config?`): `Promise`<[`ReturnReason`](ReturnReason.md)\>

Gets an order by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `returnReasonId` | `string` | id of order to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ReturnReason`](ReturnReason.md)\> | config object |

#### Returns

`Promise`<[`ReturnReason`](ReturnReason.md)\>

-`Promise`: the order document
	-`ReturnReason`: 

#### Defined in

[packages/medusa/src/services/return-reason.ts:87](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/return-reason.ts#L87)

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

**update**(`id`, `data`): `Promise`<[`ReturnReason`](ReturnReason.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `data` | [`UpdateReturnReason`](../types/UpdateReturnReason.md) |

#### Returns

`Promise`<[`ReturnReason`](ReturnReason.md)\>

-`Promise`: 
	-`ReturnReason`: 

#### Defined in

[packages/medusa/src/services/return-reason.ts:46](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/return-reason.ts#L46)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ReturnReasonService`](ReturnReasonService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`ReturnReasonService`](ReturnReasonService.md)

-`ReturnReasonService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
