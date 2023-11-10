# AnalyticsConfigService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`AnalyticsConfigService`**

## Constructors

### constructor

**new AnalyticsConfigService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/analytics-config.ts:21](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/analytics-config.ts#L21)

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

### analyticsConfigRepository\_

 `Protected` `Readonly` **analyticsConfigRepository\_**: [`Repository`](Repository.md)<[`AnalyticsConfig`](AnalyticsConfig.md)\>

#### Defined in

[packages/medusa/src/services/analytics-config.ts:18](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/analytics-config.ts#L18)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### userService\_

 `Protected` `Readonly` **userService\_**: [`UserService`](UserService.md)

#### Defined in

[packages/medusa/src/services/analytics-config.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/analytics-config.ts#L19)

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

### create

**create**(`userId`, `data`): `Promise`<[`AnalyticsConfig`](AnalyticsConfig.md)\>

Creates an analytics config.

#### Parameters

| Name |
| :------ |
| `userId` | `string` |
| `data` | [`CreateAnalyticsConfig`](../index.md#createanalyticsconfig) |

#### Returns

`Promise`<[`AnalyticsConfig`](AnalyticsConfig.md)\>

-`Promise`: 
	-`AnalyticsConfig`: 

#### Defined in

[packages/medusa/src/services/analytics-config.ts:50](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/analytics-config.ts#L50)

___

### delete

**delete**(`userId`): `Promise`<`void`\>

Deletes an analytics config.

#### Parameters

| Name |
| :------ |
| `userId` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/analytics-config.ts:94](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/analytics-config.ts#L94)

___

### retrieve

**retrieve**(`userId`): `Promise`<[`AnalyticsConfig`](AnalyticsConfig.md)\>

#### Parameters

| Name |
| :------ |
| `userId` | `string` |

#### Returns

`Promise`<[`AnalyticsConfig`](AnalyticsConfig.md)\>

-`Promise`: 
	-`AnalyticsConfig`: 

#### Defined in

[packages/medusa/src/services/analytics-config.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/analytics-config.ts#L28)

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

**update**(`userId`, `update`): `Promise`<[`AnalyticsConfig`](AnalyticsConfig.md)\>

Updates an analytics config. If the config does not exist, it will be created instead.

#### Parameters

| Name |
| :------ |
| `userId` | `string` |
| `update` | [`UpdateAnalyticsConfig`](../index.md#updateanalyticsconfig) |

#### Returns

`Promise`<[`AnalyticsConfig`](AnalyticsConfig.md)\>

-`Promise`: 
	-`AnalyticsConfig`: 

#### Defined in

[packages/medusa/src/services/analytics-config.ts:65](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/analytics-config.ts#L65)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`AnalyticsConfigService`](AnalyticsConfigService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`AnalyticsConfigService`](AnalyticsConfigService.md)

-`AnalyticsConfigService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
