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

[medusa/src/services/batch-job.ts:91](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L91)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### batchJobRepository\_

• `Protected` `Readonly` **batchJobRepository\_**: `Repository`<`BatchJob`\>

#### Defined in

[medusa/src/services/batch-job.ts:39](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L39)

___

### batchJobStatusMapToProps

• `Protected` **batchJobStatusMapToProps**: `Map`<`BatchJobStatus`, { `entityColumnName`: `string` ; `eventType`: `string`  }\>

#### Defined in

[medusa/src/services/batch-job.ts:43](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L43)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/batch-job.ts:40](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L40)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### strategyResolver\_

• `Protected` `Readonly` **strategyResolver\_**: [`StrategyResolverService`](StrategyResolverService.md)

#### Defined in

[medusa/src/services/batch-job.ts:41](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L41)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/batch-job.ts:28](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L28)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/batch-job.ts:270](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L270)

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

[medusa/src/services/batch-job.ts:252](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L252)

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

[medusa/src/services/batch-job.ts:234](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L234)

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

[medusa/src/services/batch-job.ts:144](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L144)

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

[medusa/src/services/batch-job.ts:132](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L132)

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

[medusa/src/services/batch-job.ts:367](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L367)

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

[medusa/src/services/batch-job.ts:104](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L104)

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

[medusa/src/services/batch-job.ts:341](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L341)

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

[medusa/src/services/batch-job.ts:288](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L288)

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

[medusa/src/services/batch-job.ts:321](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L321)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/batch-job.ts:161](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L161)

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

[medusa/src/services/batch-job.ts:200](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/services/batch-job.ts#L200)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/d61d0d4cb/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
