---
displayed_sidebar: jsClientSidebar
---

# Class: OauthService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).OauthService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`OauthService`**

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

### container\_

• `Protected` **container\_**: [`InjectedDependencies`](../modules/internal-8.md#injecteddependencies-17)

#### Defined in

packages/medusa/dist/services/oauth.d.ts:19

___

### eventBus\_

• `Protected` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/oauth.d.ts:21

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### oauthRepository\_

• `Protected` **oauthRepository\_**: `Repository`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Defined in

packages/medusa/dist/services/oauth.d.ts:20

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `TOKEN_GENERATED` | `string` |
| `TOKEN_REFRESHED` | `string` |

#### Defined in

packages/medusa/dist/services/oauth.d.ts:15

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

▸ **create**(`data`): `Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateOauthInput`](../modules/internal-8.md#createoauthinput) |

#### Returns

`Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Defined in

packages/medusa/dist/services/oauth.d.ts:26

___

### generateToken

▸ **generateToken**(`appName`, `code`, `state`): `Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |
| `code` | `string` |
| `state` | `string` |

#### Returns

`Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Defined in

packages/medusa/dist/services/oauth.d.ts:29

___

### list

▸ **list**(`selector`): `Promise`<[`Oauth`](internal-8.internal.Oauth.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Oauth`](internal-8.internal.Oauth.md)\> |

#### Returns

`Promise`<[`Oauth`](internal-8.internal.Oauth.md)[]\>

#### Defined in

packages/medusa/dist/services/oauth.d.ts:25

___

### refreshToken

▸ **refreshToken**(`appName`): `Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |

#### Returns

`Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Defined in

packages/medusa/dist/services/oauth.d.ts:30

___

### registerOauthApp

▸ **registerOauthApp**(`appDetails`): `Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appDetails` | [`CreateOauthInput`](../modules/internal-8.md#createoauthinput) |

#### Returns

`Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Defined in

packages/medusa/dist/services/oauth.d.ts:28

___

### retrieve

▸ **retrieve**(`oauthId`): `Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `oauthId` | `string` |

#### Returns

`Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Defined in

packages/medusa/dist/services/oauth.d.ts:24

___

### retrieveByName

▸ **retrieveByName**(`appName`): `Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |

#### Returns

`Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Defined in

packages/medusa/dist/services/oauth.d.ts:23

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

▸ **update**(`id`, `update`): `Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `update` | [`UpdateOauthInput`](../modules/internal-8.md#updateoauthinput) |

#### Returns

`Promise`<[`Oauth`](internal-8.internal.Oauth.md)\>

#### Defined in

packages/medusa/dist/services/oauth.d.ts:27

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`OauthService`](internal-8.internal.OauthService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`OauthService`](internal-8.internal.OauthService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
