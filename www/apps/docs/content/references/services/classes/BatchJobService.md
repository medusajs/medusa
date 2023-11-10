# BatchJobService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`BatchJobService`**

## Constructors

### constructor

**new BatchJobService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-2) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/batch-job.ts:91](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L91)

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

### batchJobRepository\_

 `Protected` `Readonly` **batchJobRepository\_**: [`Repository`](Repository.md)<[`BatchJob`](BatchJob.md)\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L39)

___

### batchJobStatusMapToProps

 `Protected` **batchJobStatusMapToProps**: `Map`<[`BatchJobStatus`](../enums/BatchJobStatus.md), { `entityColumnName`: `string` ; `eventType`: `string`  }\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:43](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L43)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/batch-job.ts:40](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L40)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### strategyResolver\_

 `Protected` `Readonly` **strategyResolver\_**: [`StrategyResolverService`](StrategyResolverService.md)

#### Defined in

[packages/medusa/src/services/batch-job.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L41)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

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

[packages/medusa/src/services/batch-job.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L28)

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

### cancel

**cancel**(`batchJobOrId`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:236](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L236)

___

### complete

**complete**(`batchJobOrId`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:218](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L218)

___

### confirm

**confirm**(`batchJobOrId`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:200](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L200)

___

### create

**create**(`data`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `data` | [`BatchJobCreateProps`](../index.md#batchjobcreateprops) |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:144](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L144)

___

### listAndCount

**listAndCount**(`selector?`, `config?`): `Promise`<[[`BatchJob`](BatchJob.md)[], `number`]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`FilterableBatchJobProps`](FilterableBatchJobProps.md) |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`BatchJob`](BatchJob.md)\> |

#### Returns

`Promise`<[[`BatchJob`](BatchJob.md)[], `number`]\>

-`Promise`: 
	-`BatchJob[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/batch-job.ts:132](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L132)

___

### prepareBatchJobForProcessing

**prepareBatchJobForProcessing**(`data`, `req`): `Promise`<[`CreateBatchJobInput`](../index.md#createbatchjobinput)\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateBatchJobInput`](../index.md#createbatchjobinput) |
| `req` | [`Request`](../interfaces/Request.md)<[`ParamsDictionary`](../interfaces/ParamsDictionary.md), `any`, `any`, [`ParsedQs`](../interfaces/ParsedQs.md), Record<`string`, `any`\>\> |

#### Returns

`Promise`<[`CreateBatchJobInput`](../index.md#createbatchjobinput)\>

-`Promise`: 
	-`CreateBatchJobInput`: 
		-`context`: 
		-`dry_run`: 
		-`type`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:333](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L333)

___

### retrieve

**retrieve**(`batchJobId`, `config?`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `batchJobId` | `string` |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`BatchJob`](BatchJob.md)\> |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:104](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L104)

___

### setFailed

**setFailed**(`batchJobOrId`, `error?`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](BatchJob.md) |
| `error?` | `string` \| [`BatchJobResultError`](../index.md#batchjobresulterror) |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:307](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L307)

___

### setPreProcessingDone

**setPreProcessingDone**(`batchJobOrId`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:254](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L254)

___

### setProcessing

**setProcessing**(`batchJobOrId`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](BatchJob.md) |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:287](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L287)

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

### update

**update**(`batchJobOrId`, `data`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](BatchJob.md) |
| `data` | [`Partial`](../index.md#partial)<[`Pick`](../index.md#pick)<[`BatchJob`](BatchJob.md), ``"context"`` \| ``"result"``\>\> |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:161](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L161)

___

### updateStatus

`Protected` **updateStatus**(`batchJobOrId`, `status`): `Promise`<[`BatchJob`](BatchJob.md)\>

#### Parameters

| Name |
| :------ |
| `batchJobOrId` | `string` \| [`BatchJob`](BatchJob.md) |
| `status` | [`BatchJobStatus`](../enums/BatchJobStatus.md) |

#### Returns

`Promise`<[`BatchJob`](BatchJob.md)\>

-`Promise`: 
	-`BatchJob`: 

#### Defined in

[packages/medusa/src/services/batch-job.ts:347](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/batch-job.ts#L347)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`BatchJobService`](BatchJobService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`BatchJobService`](BatchJobService.md)

-`BatchJobService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
