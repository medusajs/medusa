# Class: BatchJobService

## Hierarchy

- `TransactionBaseService`

  ↳ **`BatchJobService`**

## Constructors

### constructor

• **new BatchJobService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/batch-job.ts:93](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L93)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### batchJobRepository\_

• `Protected` `Readonly` **batchJobRepository\_**: typeof `BatchJobRepository`

#### Defined in

[packages/medusa/src/services/batch-job.ts:41](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L41)

___

### batchJobStatusMapToProps

• `Protected` **batchJobStatusMapToProps**: `Map`<`BatchJobStatus`, { `entityColumnName`: `string` ; `eventType`: `string`  }\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:45](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L45)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/batch-job.ts:42](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L42)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/batch-job.ts:38](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L38)

___

### strategyResolver\_

• `Protected` `Readonly` **strategyResolver\_**: [`StrategyResolverService`](StrategyResolverService.md)

#### Defined in

[packages/medusa/src/services/batch-job.ts:43](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L43)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/batch-job.ts:39](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L39)

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

[packages/medusa/src/services/batch-job.ts:27](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L27)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### cancel

▸ **cancel**(`batchJobOrId`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| `BatchJob` |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:277](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L277)

___

### complete

▸ **complete**(`batchJobOrId`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| `BatchJob` |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:259](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L259)

___

### confirm

▸ **confirm**(`batchJobOrId`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| `BatchJob` |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:241](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L241)

___

### create

▸ **create**(`data`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `BatchJobCreateProps` |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:146](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L146)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`BatchJob`[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `FilterableBatchJobProps` |
| `config` | `FindConfig`<`BatchJob`\> |

#### Returns

`Promise`<[`BatchJob`[], `number`]\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:135](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L135)

___

### prepareBatchJobForProcessing

▸ **prepareBatchJobForProcessing**(`data`, `req`): `Promise`<`CreateBatchJobInput`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateBatchJobInput` |
| `req` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> |

#### Returns

`Promise`<`CreateBatchJobInput`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:374](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L374)

___

### retrieve

▸ **retrieve**(`batchJobId`, `config?`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobId` | `string` |
| `config` | `FindConfig`<`BatchJob`\> |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:108](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L108)

___

### setFailed

▸ **setFailed**(`batchJobOrId`, `error?`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| `BatchJob` |
| `error?` | `string` \| `BatchJobResultError` |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:348](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L348)

___

### setPreProcessingDone

▸ **setPreProcessingDone**(`batchJobOrId`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| `BatchJob` |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:295](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L295)

___

### setProcessing

▸ **setProcessing**(`batchJobOrId`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| `BatchJob` |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:328](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L328)

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Record`<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### update

▸ **update**(`batchJobOrId`, `data`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| `BatchJob` |
| `data` | `Partial`<`Pick`<`BatchJob`, ``"context"`` \| ``"result"``\>\> |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:165](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L165)

___

### updateStatus

▸ `Protected` **updateStatus**(`batchJobOrId`, `status`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| `BatchJob` |
| `status` | `BatchJobStatus` |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[packages/medusa/src/services/batch-job.ts:206](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/batch-job.ts#L206)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`BatchJobService`](BatchJobService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`BatchJobService`](BatchJobService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
