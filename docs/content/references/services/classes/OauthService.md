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

[packages/medusa/src/services/oauth.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L31)

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

### container\_

• `Protected` **container\_**: `InjectedDependencies`

#### Defined in

[packages/medusa/src/services/oauth.ts:27](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L27)

___

### eventBus\_

• `Protected` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/oauth.ts:29](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L29)

___

### manager

• `Protected` **manager**: `EntityManager`

#### Defined in

[packages/medusa/src/services/oauth.ts:26](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L26)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/oauth.ts:19](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L19)

___

### oauthRepository\_

• `Protected` **oauthRepository\_**: typeof `OauthRepository`

#### Defined in

[packages/medusa/src/services/oauth.ts:28](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L28)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/oauth.ts:20](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L20)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `TOKEN_GENERATED` | `string` |
| `TOKEN_REFRESHED` | `string` |

#### Defined in

[packages/medusa/src/services/oauth.ts:21](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L21)

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

### create

▸ **create**(`data`): `Promise`<`Oauth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `CreateOauthInput` |

#### Returns

`Promise`<`Oauth`\>

#### Defined in

[packages/medusa/src/services/oauth.ts:88](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L88)

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

[packages/medusa/src/services/oauth.ts:122](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L122)

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

[packages/medusa/src/services/oauth.ts:80](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L80)

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

[packages/medusa/src/services/oauth.ts:156](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L156)

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

[packages/medusa/src/services/oauth.ts:112](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L112)

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

[packages/medusa/src/services/oauth.ts:57](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L57)

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

[packages/medusa/src/services/oauth.ts:41](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L41)

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

▸ **update**(`id`, `update`): `Promise`<`Oauth`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `update` | `UpdateOauthInput` |

#### Returns

`Promise`<`Oauth`\>

#### Defined in

[packages/medusa/src/services/oauth.ts:101](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/oauth.ts#L101)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
