# Class: OauthService

## Hierarchy

- `TransactionBaseService`

  ↳ **`OauthService`**

## Constructors

### constructor

• **new OauthService**(`cradle`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cradle` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/oauth.ts:28](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L28)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### container\_

• `Protected` **container\_**: `InjectedDependencies`

#### Defined in

[medusa/src/services/oauth.ts:24](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L24)

___

### eventBus\_

• `Protected` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/oauth.ts:26](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L26)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### oauthRepository\_

• `Protected` **oauthRepository\_**: `Repository`<`Oauth`\>

#### Defined in

[medusa/src/services/oauth.ts:25](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L25)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `TOKEN_GENERATED` | `string` |
| `TOKEN_REFRESHED` | `string` |

#### Defined in

[medusa/src/services/oauth.ts:19](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L19)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`data`): `Promise`<`Oauth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateOauthInput` |

#### Returns

`Promise`<`Oauth`\>

#### Defined in

[medusa/src/services/oauth.ts:87](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L87)

___

### generateToken

▸ **generateToken**(`appName`, `code`, `state`): `Promise`<`Oauth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |
| `code` | `string` |
| `state` | `string` |

#### Returns

`Promise`<`Oauth`\>

#### Defined in

[medusa/src/services/oauth.ts:121](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L121)

___

### list

▸ **list**(`selector`): `Promise`<`Oauth`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `Selector`<`Oauth`\> |

#### Returns

`Promise`<`Oauth`[]\>

#### Defined in

[medusa/src/services/oauth.ts:79](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L79)

___

### refreshToken

▸ **refreshToken**(`appName`): `Promise`<`Oauth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |

#### Returns

`Promise`<`Oauth`\>

#### Defined in

[medusa/src/services/oauth.ts:155](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L155)

___

### registerOauthApp

▸ **registerOauthApp**(`appDetails`): `Promise`<`Oauth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appDetails` | `CreateOauthInput` |

#### Returns

`Promise`<`Oauth`\>

#### Defined in

[medusa/src/services/oauth.ts:111](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L111)

___

### retrieve

▸ **retrieve**(`oauthId`): `Promise`<`Oauth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `oauthId` | `string` |

#### Returns

`Promise`<`Oauth`\>

#### Defined in

[medusa/src/services/oauth.ts:54](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L54)

___

### retrieveByName

▸ **retrieveByName**(`appName`): `Promise`<`Oauth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |

#### Returns

`Promise`<`Oauth`\>

#### Defined in

[medusa/src/services/oauth.ts:36](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L36)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`id`, `update`): `Promise`<`Oauth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `update` | `UpdateOauthInput` |

#### Returns

`Promise`<`Oauth`\>

#### Defined in

[medusa/src/services/oauth.ts:100](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/oauth.ts#L100)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`OauthService`](OauthService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`OauthService`](OauthService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
