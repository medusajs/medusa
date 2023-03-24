# Class: UserService

Provides layer to manipulate users.

## Hierarchy

- `TransactionBaseService`

  ↳ **`UserService`**

## Constructors

### constructor

• **new UserService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `UserServiceProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/user.ts:47](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L47)

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

### analyticsConfigService\_

• `Protected` `Readonly` **analyticsConfigService\_**: [`AnalyticsConfigService`](AnalyticsConfigService.md)

#### Defined in

[packages/medusa/src/services/user.ts:42](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L42)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/user.ts:44](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L44)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/user.ts:45](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L45)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/user.ts:40](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L40)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/user.ts:41](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L41)

___

### userRepository\_

• `Protected` `Readonly` **userRepository\_**: typeof `UserRepository`

#### Defined in

[packages/medusa/src/services/user.ts:43](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L43)

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

[packages/medusa/src/services/user.ts:33](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L33)

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

[packages/medusa/src/services/user.ts:179](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L179)

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

[packages/medusa/src/services/user.ts:259](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L259)

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

[packages/medusa/src/services/user.ts:323](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L323)

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

[packages/medusa/src/services/user.ts:167](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L167)

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

[packages/medusa/src/services/user.ts:69](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L69)

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

[packages/medusa/src/services/user.ts:82](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L82)

___

### retrieveByApiToken

▸ **retrieveByApiToken**(`apiToken`, `relations?`): `Promise`<`User`\>

Gets a user by api token.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `apiToken` | `string` | `undefined` | the token of the user to get. |
| `relations` | `string`[] | `[]` | relations to include with the user. |

#### Returns

`Promise`<`User`\>

the user document.

#### Defined in

[packages/medusa/src/services/user.ts:113](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L113)

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

[packages/medusa/src/services/user.ts:142](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L142)

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

[packages/medusa/src/services/user.ts:294](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L294)

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

[packages/medusa/src/services/user.ts:213](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/user.ts#L213)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
