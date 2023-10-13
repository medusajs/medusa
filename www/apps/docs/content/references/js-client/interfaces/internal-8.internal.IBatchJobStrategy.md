---
displayed_sidebar: jsClientSidebar
---

# Interface: IBatchJobStrategy

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).IBatchJobStrategy

## Hierarchy

- [`TransactionBaseService`](../classes/internal-8.internal.TransactionBaseService.md)

  ↳ **`IBatchJobStrategy`**

## Implemented by

- [`AbstractBatchJobStrategy`](../classes/internal-8.internal.AbstractBatchJobStrategy.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__configModule__](../classes/internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__container__](../classes/internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](../classes/internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[manager_](../classes/internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[transactionManager_](../classes/internal-8.internal.TransactionBaseService.md#transactionmanager_)

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

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[atomicPhase_](../classes/internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### buildTemplate

▸ **buildTemplate**(): `Promise`<`string`\>

Builds and returns a template file that can be downloaded and filled in

#### Returns

`Promise`<`string`\>

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:21

___

### preProcessBatchJob

▸ **preProcessBatchJob**(`batchJobId`): `Promise`<`void`\>

Method for pre-processing a batch job

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:13

___

### prepareBatchJobForProcessing

▸ **prepareBatchJobForProcessing**(`batchJobEntity`, `req`): `Promise`<[`CreateBatchJobInput`](../modules/internal-8.internal.md#createbatchjobinput)\>

Method for preparing a batch job for processing

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobEntity` | [`CreateBatchJobInput`](../modules/internal-8.internal.md#createbatchjobinput) |
| `req` | `Request` |

#### Returns

`Promise`<[`CreateBatchJobInput`](../modules/internal-8.internal.md#createbatchjobinput)\>

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:9

___

### processJob

▸ **processJob**(`batchJobId`): `Promise`<`void`\>

Method does the actual processing of the job. Should report back on the progress of the operation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:17

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

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](../classes/internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`IBatchJobStrategy`](internal-8.internal.IBatchJobStrategy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`IBatchJobStrategy`](internal-8.internal.IBatchJobStrategy.md)

#### Inherited from

[TransactionBaseService](../classes/internal-8.internal.TransactionBaseService.md).[withTransaction](../classes/internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
