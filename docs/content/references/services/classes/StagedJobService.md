# Class: StagedJobService

Provides layer to manipulate users.

## Hierarchy

- `TransactionBaseService`

  ↳ **`StagedJobService`**

## Constructors

### constructor

• **new StagedJobService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `StagedJobServiceProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/staged-job.ts:22](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/staged-job.ts#L22)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### stagedJobRepository\_

• `Protected` **stagedJobRepository\_**: `Repository`<`StagedJob`\> & { `insertBulk`: (`jobToCreates`: `_QueryDeepPartialEntity`<`StagedJob`\>[]) => `Promise`<`StagedJob`[]\>  }

#### Defined in

[medusa/src/services/staged-job.ts:20](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/staged-job.ts#L20)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`data`): `Promise`<`StagedJob`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `EmitData`<`unknown`\> \| `EmitData`<`unknown`\>[] |

#### Returns

`Promise`<`StagedJob`[]\>

#### Defined in

[medusa/src/services/staged-job.ts:45](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/staged-job.ts#L45)

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

[medusa/src/services/staged-job.ts:37](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/staged-job.ts#L37)

___

### list

▸ **list**(`config`): `Promise`<`StagedJob`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `FindConfig`<`StagedJob`\> |

#### Returns

`Promise`<`StagedJob`[]\>

#### Defined in

[medusa/src/services/staged-job.ts:29](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/staged-job.ts#L29)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`StagedJobService`](StagedJobService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`StagedJobService`](StagedJobService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
