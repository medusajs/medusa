# Class: UserService

## Hierarchy

- `TransactionBaseService`<[`UserService`](UserService.md)\>

  ↳ **`UserService`**

## Constructors

### constructor

• **new UserService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `UserServiceProps` |

#### Overrides

TransactionBaseService&lt;UserService\&gt;.constructor

#### Defined in

[services/user.ts:40](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L40)

## Properties

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

[services/user.ts:38](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L38)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/user.ts:35](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L35)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/user.ts:36](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L36)

___

### userRepository\_

• `Protected` `Readonly` **userRepository\_**: typeof `UserRepository`

#### Defined in

[services/user.ts:37](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L37)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `PASSWORD_RESET` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/user.ts:28](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L28)

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

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### create

▸ **create**(`user`, `password`): `Promise`<`User`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `user` | `CreateUserInput` |  |
| `password` | `string` |  |

#### Returns

`Promise`<`User`\>

#### Defined in

[services/user.ts:176](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L176)

___

### delete

▸ **delete**(`userId`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/user.ts:256](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L256)

___

### generateResetPasswordToken

▸ **generateResetPasswordToken**(`userId`): `Promise`<`string`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |

#### Returns

`Promise`<`string`\>

#### Defined in

[services/user.ts:312](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L312)

___

### hashPassword\_

▸ **hashPassword_**(`password`): `Promise`<`string`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` |  |

#### Returns

`Promise`<`string`\>

#### Defined in

[services/user.ts:164](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L164)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`User`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableUserProps` |  |
| `config` | `Object` |  |

#### Returns

`Promise`<`User`[]\>

#### Defined in

[services/user.ts:73](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L73)

___

### retrieve

▸ **retrieve**(`userId`, `config?`): `Promise`<`User`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |
| `config` | `FindConfig`<`User`\> |  |

#### Returns

`Promise`<`User`\>

#### Defined in

[services/user.ts:86](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L86)

___

### retrieveByApiToken

▸ **retrieveByApiToken**(`apiToken`, `relations?`): `Promise`<`User`\>

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `apiToken` | `string` | `undefined` |  |
| `relations` | `string`[] | `[]` |  |

#### Returns

`Promise`<`User`\>

#### Defined in

[services/user.ts:110](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L110)

___

### retrieveByEmail

▸ **retrieveByEmail**(`email`, `config?`): `Promise`<`User`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` |  |
| `config` | `FindConfig`<`User`\> |  |

#### Returns

`Promise`<`User`\>

#### Defined in

[services/user.ts:139](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L139)

___

### setPassword\_

▸ **setPassword_**(`userId`, `password`): `Promise`<`User`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |
| `password` | `string` |  |

#### Returns

`Promise`<`User`\>

#### Defined in

[services/user.ts:283](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L283)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`userId`, `update`): `Promise`<`User`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |
| `update` | `UpdateUserInput` |  |

#### Returns

`Promise`<`User`\>

#### Defined in

[services/user.ts:210](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L210)

___

### validateEmail\_

▸ **validateEmail_**(`email`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` |  |

#### Returns

`string`

#### Defined in

[services/user.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/user.ts#L53)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`UserService`](UserService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`UserService`](UserService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
