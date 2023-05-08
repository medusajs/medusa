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

[medusa/src/services/user.ts:45](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L45)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### analyticsConfigService\_

• `Protected` `Readonly` **analyticsConfigService\_**: [`AnalyticsConfigService`](AnalyticsConfigService.md)

#### Defined in

[medusa/src/services/user.ts:40](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L40)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/user.ts:42](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L42)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/user.ts:43](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L43)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### userRepository\_

• `Protected` `Readonly` **userRepository\_**: `Repository`<`User`\>

#### Defined in

[medusa/src/services/user.ts:41](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L41)

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

[medusa/src/services/user.ts:33](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L33)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/user.ts:171](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L171)

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

[medusa/src/services/user.ts:251](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L251)

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

[medusa/src/services/user.ts:315](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L315)

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

[medusa/src/services/user.ts:159](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L159)

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

[medusa/src/services/user.ts:65](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L65)

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

[medusa/src/services/user.ts:77](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L77)

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

[medusa/src/services/user.ts:107](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L107)

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

[medusa/src/services/user.ts:135](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L135)

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

[medusa/src/services/user.ts:286](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L286)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/user.ts:205](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/services/user.ts#L205)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/731f05d3e/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
