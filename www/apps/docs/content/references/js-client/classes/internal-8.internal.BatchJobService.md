---
displayed_sidebar: jsClientSidebar
---

# Class: BatchJobService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).BatchJobService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`BatchJobService`**

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

### batchJobRepository\_

• `Protected` `Readonly` **batchJobRepository\_**: `Repository`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:27

___

### batchJobStatusMapToProps

• `Protected` **batchJobStatusMapToProps**: `Map`<[`BatchJobStatus`](../enums/internal-2.BatchJobStatus.md), { `entityColumnName`: `string` ; `eventType`: `string`  }\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:30

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:28

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### strategyResolver\_

• `Protected` `Readonly` **strategyResolver\_**: [`StrategyResolverService`](internal-8.internal.StrategyResolverService.md)

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:29

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CANCELED` | `string` |
| `COMPLETED` | `string` |
| `CONFIRMED` | `string` |
| `CREATED` | `string` |
| `FAILED` | `string` |
| `PRE_PROCESSED` | `string` |
| `PROCESSING` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:17

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

### cancel

▸ **cancel**(`batchJobOrId`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](internal-2.BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:42

___

### complete

▸ **complete**(`batchJobOrId`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](internal-2.BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:41

___

### confirm

▸ **confirm**(`batchJobOrId`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](internal-2.BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:40

___

### create

▸ **create**(`data`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`BatchJobCreateProps`](../modules/internal-8.internal.md#batchjobcreateprops) |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:37

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[[`BatchJob`](internal-2.BatchJob.md)[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector?` | [`FilterableBatchJobProps`](internal-8.internal.FilterableBatchJobProps.md) |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`BatchJob`](internal-2.BatchJob.md)\> |

#### Returns

`Promise`<[[`BatchJob`](internal-2.BatchJob.md)[], `number`]\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:36

___

### prepareBatchJobForProcessing

▸ **prepareBatchJobForProcessing**(`data`, `req`): `Promise`<[`CreateBatchJobInput`](../modules/internal-8.internal.md#createbatchjobinput)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateBatchJobInput`](../modules/internal-8.internal.md#createbatchjobinput) |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, [`Record`](../modules/internal.md#record)<`string`, `any`\>\> |

#### Returns

`Promise`<[`CreateBatchJobInput`](../modules/internal-8.internal.md#createbatchjobinput)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:46

___

### retrieve

▸ **retrieve**(`batchJobId`, `config?`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`BatchJob`](internal-2.BatchJob.md)\> |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:35

___

### setFailed

▸ **setFailed**(`batchJobOrId`, `error?`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](internal-2.BatchJob.md) |
| `error?` | `string` \| [`BatchJobResultError`](../modules/internal-2.md#batchjobresulterror) |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:45

___

### setPreProcessingDone

▸ **setPreProcessingDone**(`batchJobOrId`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](internal-2.BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:43

___

### setProcessing

▸ **setProcessing**(`batchJobOrId`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](internal-2.BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:44

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

▸ **update**(`batchJobOrId`, `data`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](internal-2.BatchJob.md) |
| `data` | [`Partial`](../modules/internal-8.md#partial)<[`Pick`](../modules/internal-1.md#pick)<[`BatchJob`](internal-2.BatchJob.md), ``"context"`` \| ``"result"``\>\> |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:38

___

### updateStatus

▸ `Protected` **updateStatus**(`batchJobOrId`, `status`): `Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](internal-2.BatchJob.md) |
| `status` | [`BatchJobStatus`](../enums/internal-2.BatchJobStatus.md) |

#### Returns

`Promise`<[`BatchJob`](internal-2.BatchJob.md)\>

#### Defined in

packages/medusa/dist/services/batch-job.d.ts:39

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`BatchJobService`](internal-8.internal.BatchJobService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`BatchJobService`](internal-8.internal.BatchJobService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
