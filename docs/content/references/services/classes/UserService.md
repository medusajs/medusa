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

[services/user.ts:37](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L37)

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

[services/user.ts:35](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L35)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/user.ts:32](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L32)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/user.ts:33](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L33)

___

### userRepository\_

• `Protected` `Readonly` **userRepository\_**: typeof `UserRepository`

#### Defined in

[services/user.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L34)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `PASSWORD_RESET` | `string` |

#### Defined in

[services/user.ts:28](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L28)

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

[services/user.ts:183](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L183)

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

[services/user.ts:251](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L251)

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

[services/user.ts:305](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L305)

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

[services/user.ts:171](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L171)

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

[services/user.ts:68](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L68)

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

[services/user.ts:84](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L84)

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

[services/user.ts:111](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L111)

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

[services/user.ts:143](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L143)

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

[services/user.ts:276](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L276)

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

▸ **update**(`userId`, `update`): `Promise`<`User`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` |  |
| `update` | `UpdateUserInput` |  |

#### Returns

`Promise`<`User`\>

#### Defined in

[services/user.ts:211](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L211)

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

[services/user.ts:50](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/user.ts#L50)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
