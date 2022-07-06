# Class: UserService

Provides layer to manipulate users.

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

[services/user.ts:37](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L37)

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

[services/user.ts:35](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L35)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/user.ts:32](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L32)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/user.ts:33](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L33)

___

### userRepository\_

• `Protected` `Readonly` **userRepository\_**: typeof `UserRepository`

#### Defined in

[services/user.ts:34](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L34)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `PASSWORD_RESET` | `string` |

#### Defined in

[services/user.ts:28](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L28)

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

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### create

▸ **create**(`user`, `password`): `Promise`<`User`\>

Creates a user with username being validated.
Fails if email is not a valid format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `user` | `CreateUserInput` | the user to create |
| `password` | `string` | user's password to hash |

#### Returns

`Promise`<`User`\>

the result of create

#### Defined in

[services/user.ts:183](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L183)

___

### delete

▸ **delete**(`userId`): `Promise`<`void`\>

Deletes a user from a given user id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | the id of the user to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`void`\>

the result of the delete operation.

#### Defined in

[services/user.ts:251](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L251)

___

### generateResetPasswordToken

▸ **generateResetPasswordToken**(`userId`): `Promise`<`string`\>

Generate a JSON Web token, that will be sent to a user, that wishes to
reset password.
The token will be signed with the users current password hash as a secret
a long side a payload with userId and the expiry time for the token, which
is always 15 minutes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | the id of the user to reset password for |

#### Returns

`Promise`<`string`\>

the generated JSON web token

#### Defined in

[services/user.ts:305](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L305)

___

### hashPassword\_

▸ **hashPassword_**(`password`): `Promise`<`string`\>

Hashes a password

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` | the value to hash |

#### Returns

`Promise`<`string`\>

hashed password

#### Defined in

[services/user.ts:171](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L171)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`User`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableUserProps` | the query object for find |
| `config` | `Object` | the configuration object for the query |

#### Returns

`Promise`<`User`[]\>

the result of the find operation

#### Defined in

[services/user.ts:68](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L68)

___

### retrieve

▸ **retrieve**(`userId`, `config?`): `Promise`<`User`\>

Gets a user by id.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | the id of the user to get. |
| `config` | `FindConfig`<`User`\> | query configs |

#### Returns

`Promise`<`User`\>

the user document.

#### Defined in

[services/user.ts:84](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L84)

___

### retrieveByApiToken

▸ **retrieveByApiToken**(`apiToken`, `relations?`): `Promise`<`User`\>

Gets a user by api token.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `apiToken` | `string` | `undefined` | the token of the user to get. |
| `relations` | `string`[] | `[]` | relations to include with the user |

#### Returns

`Promise`<`User`\>

the user document.

#### Defined in

[services/user.ts:111](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L111)

___

### retrieveByEmail

▸ **retrieveByEmail**(`email`, `config?`): `Promise`<`User`\>

Gets a user by email.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the user to get. |
| `config` | `FindConfig`<`User`\> | query config |

#### Returns

`Promise`<`User`\>

the user document.

#### Defined in

[services/user.ts:143](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L143)

___

### setPassword\_

▸ **setPassword_**(`userId`, `password`): `Promise`<`User`\>

Sets a password for a user
Fails if no user exists with userId and if the hashing of the new
password does not work.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | the userId to set password for |
| `password` | `string` | the old password to set |

#### Returns

`Promise`<`User`\>

the result of the update operation

#### Defined in

[services/user.ts:276](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L276)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### update

▸ **update**(`userId`, `update`): `Promise`<`User`\>

Updates a user.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | id of the user to update |
| `update` | `UpdateUserInput` | the values to be updated on the user |

#### Returns

`Promise`<`User`\>

the result of create

#### Defined in

[services/user.ts:211](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L211)

___

### validateEmail\_

▸ **validateEmail_**(`email`): `string`

Used to validate user email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | email to validate |

#### Returns

`string`

the validated email

#### Defined in

[services/user.ts:50](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/user.ts#L50)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
