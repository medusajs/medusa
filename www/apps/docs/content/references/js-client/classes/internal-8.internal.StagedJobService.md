---
displayed_sidebar: jsClientSidebar
---

# Class: StagedJobService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).StagedJobService

Provides layer to manipulate users.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`StagedJobService`**

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

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### stagedJobRepository\_

• `Protected` **stagedJobRepository\_**: `Repository`<[`StagedJob`](internal-8.internal.StagedJob.md)\> & { `insertBulk`: (`jobToCreates`: `_QueryDeepPartialEntity`<[`StagedJob`](internal-8.internal.StagedJob.md)\>[]) => `Promise`<[`StagedJob`](internal-8.internal.StagedJob.md)[]\>  }

#### Defined in

packages/medusa/dist/services/staged-job.d.ts:15

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

▸ **create**(`data`): `Promise`<[`StagedJob`](internal-8.internal.StagedJob.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`EmitData`](../modules/internal-8.md#emitdata)<`unknown`\> \| [`EmitData`](../modules/internal-8.md#emitdata)<`unknown`\>[] |

#### Returns

`Promise`<[`StagedJob`](internal-8.internal.StagedJob.md)[]\>

#### Defined in

packages/medusa/dist/services/staged-job.d.ts:19

___

### delete

▸ **delete**(`stagedJobIds`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stagedJobIds` | `string` \| `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/staged-job.d.ts:18

___

### list

▸ **list**(`config`): `Promise`<[`StagedJob`](internal-8.internal.StagedJob.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`StagedJob`](internal-8.internal.StagedJob.md)\> |

#### Returns

`Promise`<[`StagedJob`](internal-8.internal.StagedJob.md)[]\>

#### Defined in

packages/medusa/dist/services/staged-job.d.ts:17

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

▸ **withTransaction**(`transactionManager?`): [`StagedJobService`](internal-8.internal.StagedJobService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`StagedJobService`](internal-8.internal.StagedJobService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
