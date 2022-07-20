# Class: BatchJobService

## Hierarchy

- `TransactionBaseService`<[`BatchJobService`](BatchJobService.md)\>

  ↳ **`BatchJobService`**

## Constructors

### constructor

• **new BatchJobService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;BatchJobService\&gt;.constructor

#### Defined in

[services/batch-job.ts:93](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L93)

## Properties

### batchJobRepository\_

• `Protected` `Readonly` **batchJobRepository\_**: typeof `BatchJobRepository`

#### Defined in

[services/batch-job.ts:41](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L41)

___

### batchJobStatusMapToProps

• `Protected` **batchJobStatusMapToProps**: `Map`<`BatchJobStatus`, { `entityColumnName`: `string` ; `eventType`: `string`  }\>

#### Defined in

[services/batch-job.ts:45](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L45)

___

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/batch-job.ts:42](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L42)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/batch-job.ts:38](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L38)

___

### strategyResolver\_

• `Protected` `Readonly` **strategyResolver\_**: [`StrategyResolverService`](StrategyResolverService.md)

#### Defined in

[services/batch-job.ts:43](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L43)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/batch-job.ts:39](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L39)

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

[services/batch-job.ts:27](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L27)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

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

[services/batch-job.ts:284](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L284)

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

[services/batch-job.ts:266](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L266)

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

[services/batch-job.ts:248](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L248)

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

[services/batch-job.ts:153](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L153)

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

[services/batch-job.ts:137](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L137)

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

[services/batch-job.ts:380](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L380)

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

[services/batch-job.ts:112](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L112)

___

### setFailed

▸ **setFailed**(`batchJobOrId`, `error?`): `Promise`<`BatchJob`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `batchJobOrId` | `string` \| `BatchJob` |
| `error?` | `BatchJobResultError` |

#### Returns

`Promise`<`BatchJob`\>

#### Defined in

[services/batch-job.ts:354](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L354)

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

[services/batch-job.ts:302](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L302)

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

[services/batch-job.ts:334](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L334)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[services/batch-job.ts:172](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L172)

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

[services/batch-job.ts:213](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/batch-job.ts#L213)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
