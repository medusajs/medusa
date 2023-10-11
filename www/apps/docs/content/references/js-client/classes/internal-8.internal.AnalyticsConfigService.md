---
displayed_sidebar: jsClientSidebar
---

# Class: AnalyticsConfigService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AnalyticsConfigService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`AnalyticsConfigService`**

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

### analyticsConfigRepository\_

• `Protected` `Readonly` **analyticsConfigRepository\_**: `Repository`<[`AnalyticsConfig`](internal-8.internal.AnalyticsConfig.md)\>

#### Defined in

packages/medusa/dist/services/analytics-config.d.ts:12

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### userService\_

• `Protected` `Readonly` **userService\_**: [`UserService`](internal-8.internal.UserService.md)

#### Defined in

packages/medusa/dist/services/analytics-config.d.ts:13

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

### create

▸ **create**(`userId`, `data`): `Promise`<[`AnalyticsConfig`](internal-8.internal.AnalyticsConfig.md)\>

Creates an analytics config.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `data` | [`CreateAnalyticsConfig`](../modules/internal-8.md#createanalyticsconfig) |

#### Returns

`Promise`<[`AnalyticsConfig`](internal-8.internal.AnalyticsConfig.md)\>

#### Defined in

packages/medusa/dist/services/analytics-config.d.ts:19

___

### delete

▸ **delete**(`userId`): `Promise`<`void`\>

Deletes an analytics config.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/analytics-config.d.ts:27

___

### retrieve

▸ **retrieve**(`userId`): `Promise`<[`AnalyticsConfig`](internal-8.internal.AnalyticsConfig.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`<[`AnalyticsConfig`](internal-8.internal.AnalyticsConfig.md)\>

#### Defined in

packages/medusa/dist/services/analytics-config.d.ts:15

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

▸ **update**(`userId`, `update`): `Promise`<[`AnalyticsConfig`](internal-8.internal.AnalyticsConfig.md)\>

Updates an analytics config. If the config does not exist, it will be created instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `update` | [`UpdateAnalyticsConfig`](../modules/internal-8.md#updateanalyticsconfig) |

#### Returns

`Promise`<[`AnalyticsConfig`](internal-8.internal.AnalyticsConfig.md)\>

#### Defined in

packages/medusa/dist/services/analytics-config.d.ts:23

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`AnalyticsConfigService`](internal-8.internal.AnalyticsConfigService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`AnalyticsConfigService`](internal-8.internal.AnalyticsConfigService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
