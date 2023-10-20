---
displayed_sidebar: jsClientSidebar
---

# Class: AbstractBatchJobStrategy

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AbstractBatchJobStrategy

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`AbstractBatchJobStrategy`**

## Implements

- [`IBatchJobStrategy`](../interfaces/internal-8.internal.IBatchJobStrategy.md)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[__configModule__](../interfaces/internal-8.internal.IBatchJobStrategy.md#__configmodule__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[__container__](../interfaces/internal-8.internal.IBatchJobStrategy.md#__container__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[__moduleDeclaration__](../interfaces/internal-8.internal.IBatchJobStrategy.md#__moduledeclaration__)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### batchJobService\_

• `Protected` `Abstract` **batchJobService\_**: [`BatchJobService`](internal-8.internal.BatchJobService.md)

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:26

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[manager_](../interfaces/internal-8.internal.IBatchJobStrategy.md#manager_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[transactionManager_](../interfaces/internal-8.internal.IBatchJobStrategy.md#transactionmanager_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### batchType

▪ `Static` **batchType**: `string`

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:25

___

### identifier

▪ `Static` **identifier**: `string`

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:24

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Implementation of

IBatchJobStrategy.activeManager\_

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

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[atomicPhase_](../interfaces/internal-8.internal.IBatchJobStrategy.md#atomicphase_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### buildTemplate

▸ `Abstract` **buildTemplate**(): `Promise`<`string`\>

Builds and returns a template file that can be downloaded and filled in

#### Returns

`Promise`<`string`\>

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[buildTemplate](../interfaces/internal-8.internal.IBatchJobStrategy.md#buildtemplate)

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:30

___

### handleProcessingError

▸ `Protected` **handleProcessingError**<`T`\>(`batchJobId`, `err`, `result`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |
| `err` | `unknown` |
| `result` | `T` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:32

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

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[preProcessBatchJob](../interfaces/internal-8.internal.IBatchJobStrategy.md#preprocessbatchjob)

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:28

___

### prepareBatchJobForProcessing

▸ **prepareBatchJobForProcessing**(`batchJob`, `req`): `Promise`<[`CreateBatchJobInput`](../modules/internal-8.internal.md#createbatchjobinput)\>

Method for preparing a batch job for processing

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJob` | [`CreateBatchJobInput`](../modules/internal-8.internal.md#createbatchjobinput) |
| `req` | `Request` |

#### Returns

`Promise`<[`CreateBatchJobInput`](../modules/internal-8.internal.md#createbatchjobinput)\>

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[prepareBatchJobForProcessing](../interfaces/internal-8.internal.IBatchJobStrategy.md#preparebatchjobforprocessing)

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:27

___

### processJob

▸ `Abstract` **processJob**(`batchJobId`): `Promise`<`void`\>

Method does the actual processing of the job. Should report back on the progress of the operation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[processJob](../interfaces/internal-8.internal.IBatchJobStrategy.md#processjob)

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:29

___

### shouldRetryOnProcessingError

▸ `Protected` **shouldRetryOnProcessingError**(`batchJob`, `err`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJob` | [`BatchJob`](internal-2.BatchJob.md) |
| `err` | `unknown` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/interfaces/batch-job-strategy.d.ts:31

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[shouldRetryTransaction_](../interfaces/internal-8.internal.IBatchJobStrategy.md#shouldretrytransaction_)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`AbstractBatchJobStrategy`](internal-8.internal.AbstractBatchJobStrategy.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`AbstractBatchJobStrategy`](internal-8.internal.AbstractBatchJobStrategy.md)

#### Implementation of

[IBatchJobStrategy](../interfaces/internal-8.internal.IBatchJobStrategy.md).[withTransaction](../interfaces/internal-8.internal.IBatchJobStrategy.md#withtransaction)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
