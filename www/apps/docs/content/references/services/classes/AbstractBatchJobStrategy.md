# AbstractBatchJobStrategy

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`AbstractBatchJobStrategy`**

## Implements

- [`IBatchJobStrategy`](../interfaces/IBatchJobStrategy.md)

## Constructors

### constructor

`Protected` **new AbstractBatchJobStrategy**(`__container__`, `__configModule__?`, `__moduleDeclaration__?`)

#### Parameters

| Name |
| :------ |
| `__container__` | `any` |
| `__configModule__?` | Record<`string`, `unknown`\> |
| `__moduleDeclaration__?` | Record<`string`, `unknown`\> |

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:12](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L12)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[__configModule__](../interfaces/IBatchJobStrategy.md#__configmodule__)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[__container__](../interfaces/IBatchJobStrategy.md#__container__)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[__moduleDeclaration__](../interfaces/IBatchJobStrategy.md#__moduledeclaration__)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### batchJobService\_

 `Protected` `Abstract` **batchJobService\_**: [`BatchJobService`](BatchJobService.md)

#### Defined in

[packages/medusa/src/interfaces/batch-job-strategy.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/batch-job-strategy.ts#L39)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[manager_](../interfaces/IBatchJobStrategy.md#manager_)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[transactionManager_](../interfaces/IBatchJobStrategy.md#transactionmanager_)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### batchType

 `Static` **batchType**: `string`

#### Defined in

[packages/medusa/src/interfaces/batch-job-strategy.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/batch-job-strategy.ts#L37)

___

### identifier

 `Static` **identifier**: `string`

#### Defined in

[packages/medusa/src/interfaces/batch-job-strategy.ts:36](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/batch-job-strategy.ts#L36)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Implementation of

IBatchJobStrategy.activeManager\_

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

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[atomicPhase_](../interfaces/IBatchJobStrategy.md#atomicphase_)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### buildTemplate

`Abstract` **buildTemplate**(): `Promise`<`string`\>

Builds and returns a template file that can be downloaded and filled in

#### Returns

`Promise`<`string`\>

-`Promise`: 
	-`string`: (optional) 

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[buildTemplate](../interfaces/IBatchJobStrategy.md#buildtemplate)

#### Defined in

[packages/medusa/src/interfaces/batch-job-strategy.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/batch-job-strategy.ts#L56)

___

### handleProcessingError

`Protected` **handleProcessingError**<`T`\>(`batchJobId`, `err`, `result`): `Promise`<`void`\>

| Name |
| :------ |
| `T` | `object` |

#### Parameters

| Name |
| :------ |
| `batchJobId` | `string` |
| `err` | `unknown` |
| `result` | `T` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/interfaces/batch-job-strategy.ts:67](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/batch-job-strategy.ts#L67)

___

### preProcessBatchJob

**preProcessBatchJob**(`batchJobId`): `Promise`<`void`\>

Method for pre-processing a batch job

#### Parameters

| Name |
| :------ |
| `batchJobId` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[preProcessBatchJob](../interfaces/IBatchJobStrategy.md#preprocessbatchjob)

#### Defined in

[packages/medusa/src/interfaces/batch-job-strategy.ts:50](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/batch-job-strategy.ts#L50)

___

### prepareBatchJobForProcessing

**prepareBatchJobForProcessing**(`batchJob`, `req`): `Promise`<[`CreateBatchJobInput`](../index.md#createbatchjobinput)\>

Method for preparing a batch job for processing

#### Parameters

| Name |
| :------ |
| `batchJob` | [`CreateBatchJobInput`](../index.md#createbatchjobinput) |
| `req` | `Request` |

#### Returns

`Promise`<[`CreateBatchJobInput`](../index.md#createbatchjobinput)\>

-`Promise`: 
	-`CreateBatchJobInput`: 
		-`context`: 
		-`dry_run`: 
		-`type`: 

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[prepareBatchJobForProcessing](../interfaces/IBatchJobStrategy.md#preparebatchjobforprocessing)

#### Defined in

[packages/medusa/src/interfaces/batch-job-strategy.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/batch-job-strategy.ts#L41)

___

### processJob

`Abstract` **processJob**(`batchJobId`): `Promise`<`void`\>

Method does the actual processing of the job. Should report back on the progress of the operation.

#### Parameters

| Name |
| :------ |
| `batchJobId` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[processJob](../interfaces/IBatchJobStrategy.md#processjob)

#### Defined in

[packages/medusa/src/interfaces/batch-job-strategy.ts:54](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/batch-job-strategy.ts#L54)

___

### shouldRetryOnProcessingError

`Protected` **shouldRetryOnProcessingError**(`batchJob`, `err`): `Promise`<`boolean`\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `batchJob` | [`BatchJob`](BatchJob.md) | A Batch Job indicates an asynchronus task stored in the Medusa backend. Its status determines whether it has been executed or not. |
| `err` | `unknown` |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/interfaces/batch-job-strategy.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/batch-job-strategy.ts#L58)

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

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[shouldRetryTransaction_](../interfaces/IBatchJobStrategy.md#shouldretrytransaction_)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`AbstractBatchJobStrategy`](AbstractBatchJobStrategy.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`AbstractBatchJobStrategy`](AbstractBatchJobStrategy.md)

-`AbstractBatchJobStrategy`: 

#### Implementation of

[IBatchJobStrategy](../interfaces/IBatchJobStrategy.md).[withTransaction](../interfaces/IBatchJobStrategy.md#withtransaction)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
