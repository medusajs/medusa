# OauthService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`OauthService`**

## Constructors

### constructor

**new OauthService**(`cradle`)

#### Parameters

| Name |
| :------ |
| `cradle` | [`InjectedDependencies`](../index.md#injecteddependencies-18) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/oauth.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L28)

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

### container\_

 `Protected` **container\_**: [`InjectedDependencies`](../index.md#injecteddependencies-18)

#### Defined in

[packages/medusa/src/services/oauth.ts:24](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L24)

___

### eventBus\_

 `Protected` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/oauth.ts:26](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L26)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### oauthRepository\_

 `Protected` **oauthRepository\_**: [`Repository`](Repository.md)<[`Oauth`](Oauth.md)\>

#### Defined in

[packages/medusa/src/services/oauth.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L25)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `TOKEN_GENERATED` | `string` |
| `TOKEN_REFRESHED` | `string` |

#### Defined in

[packages/medusa/src/services/oauth.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L19)

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

**create**(`data`): `Promise`<[`Oauth`](Oauth.md)\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateOauthInput`](../index.md#createoauthinput) |

#### Returns

`Promise`<[`Oauth`](Oauth.md)\>

-`Promise`: 
	-`Oauth`: 

#### Defined in

[packages/medusa/src/services/oauth.ts:87](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L87)

___

### generateToken

**generateToken**(`appName`, `code`, `state`): `Promise`<[`Oauth`](Oauth.md)\>

#### Parameters

| Name |
| :------ |
| `appName` | `string` |
| `code` | `string` |
| `state` | `string` |

#### Returns

`Promise`<[`Oauth`](Oauth.md)\>

-`Promise`: 
	-`Oauth`: 

#### Defined in

[packages/medusa/src/services/oauth.ts:121](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L121)

___

### list

**list**(`selector`): `Promise`<[`Oauth`](Oauth.md)[]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Oauth`](Oauth.md)\> |

#### Returns

`Promise`<[`Oauth`](Oauth.md)[]\>

-`Promise`: 
	-`Oauth[]`: 
		-`Oauth`: 

#### Defined in

[packages/medusa/src/services/oauth.ts:79](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L79)

___

### refreshToken

**refreshToken**(`appName`): `Promise`<[`Oauth`](Oauth.md)\>

#### Parameters

| Name |
| :------ |
| `appName` | `string` |

#### Returns

`Promise`<[`Oauth`](Oauth.md)\>

-`Promise`: 
	-`Oauth`: 

#### Defined in

[packages/medusa/src/services/oauth.ts:155](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L155)

___

### registerOauthApp

**registerOauthApp**(`appDetails`): `Promise`<[`Oauth`](Oauth.md)\>

#### Parameters

| Name |
| :------ |
| `appDetails` | [`CreateOauthInput`](../index.md#createoauthinput) |

#### Returns

`Promise`<[`Oauth`](Oauth.md)\>

-`Promise`: 
	-`Oauth`: 

#### Defined in

[packages/medusa/src/services/oauth.ts:111](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L111)

___

### retrieve

**retrieve**(`oauthId`): `Promise`<[`Oauth`](Oauth.md)\>

#### Parameters

| Name |
| :------ |
| `oauthId` | `string` |

#### Returns

`Promise`<[`Oauth`](Oauth.md)\>

-`Promise`: 
	-`Oauth`: 

#### Defined in

[packages/medusa/src/services/oauth.ts:54](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L54)

___

### retrieveByName

**retrieveByName**(`appName`): `Promise`<[`Oauth`](Oauth.md)\>

#### Parameters

| Name |
| :------ |
| `appName` | `string` |

#### Returns

`Promise`<[`Oauth`](Oauth.md)\>

-`Promise`: 
	-`Oauth`: 

#### Defined in

[packages/medusa/src/services/oauth.ts:36](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L36)

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

**update**(`id`, `update`): `Promise`<[`Oauth`](Oauth.md)\>

#### Parameters

| Name |
| :------ |
| `id` | `string` |
| `update` | [`UpdateOauthInput`](../index.md#updateoauthinput) |

#### Returns

`Promise`<[`Oauth`](Oauth.md)\>

-`Promise`: 
	-`Oauth`: 

#### Defined in

[packages/medusa/src/services/oauth.ts:100](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/oauth.ts#L100)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`OauthService`](OauthService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`OauthService`](OauthService.md)

-`Oauth`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
