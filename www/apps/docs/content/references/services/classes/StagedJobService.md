# StagedJobService

Provides layer to manipulate users.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`StagedJobService`**

## Constructors

### constructor

**new StagedJobService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`StagedJobServiceProps`](../types/StagedJobServiceProps.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/staged-job.ts:22](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/staged-job.ts#L22)

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

### stagedJobRepository\_

 `Protected` **stagedJobRepository\_**: [`Repository`](Repository.md)<[`StagedJob`](StagedJob.md)\> & { `insertBulk`: Method insertBulk  }

#### Defined in

[packages/medusa/src/services/staged-job.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/staged-job.ts#L20)

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

**create**(`data`): `Promise`<[`StagedJob`](StagedJob.md)[]\>

#### Parameters

| Name |
| :------ |
| `data` | [`EmitData`](../types/EmitData.md)<`unknown`\> \| [`EmitData`](../types/EmitData.md)<`unknown`\>[] |

#### Returns

`Promise`<[`StagedJob`](StagedJob.md)[]\>

-`Promise`: 
	-`StagedJob[]`: 
		-`StagedJob`: 

#### Defined in

[packages/medusa/src/services/staged-job.ts:45](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/staged-job.ts#L45)

___

### delete

**delete**(`stagedJobIds`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `stagedJobIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/staged-job.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/staged-job.ts#L37)

___

### list

**list**(`config`): `Promise`<[`StagedJob`](StagedJob.md)[]\>

#### Parameters

| Name |
| :------ |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`StagedJob`](StagedJob.md)\> |

#### Returns

`Promise`<[`StagedJob`](StagedJob.md)[]\>

-`Promise`: 
	-`StagedJob[]`: 
		-`StagedJob`: 

#### Defined in

[packages/medusa/src/services/staged-job.ts:29](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/staged-job.ts#L29)

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

### withTransaction

**withTransaction**(`transactionManager?`): [`StagedJobService`](StagedJobService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`StagedJobService`](StagedJobService.md)

-`StagedJobService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
