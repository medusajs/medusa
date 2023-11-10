# UserService

Provides layer to manipulate users.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`UserService`**

## Constructors

### constructor

**new UserService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`UserServiceProps`](../index.md#userserviceprops) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/user.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L45)

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

### analyticsConfigService\_

 `Protected` `Readonly` **analyticsConfigService\_**: [`AnalyticsConfigService`](AnalyticsConfigService.md)

#### Defined in

[packages/medusa/src/services/user.ts:40](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L40)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/user.ts:42](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L42)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](FlagRouter.md)

#### Defined in

[packages/medusa/src/services/user.ts:43](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L43)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### userRepository\_

 `Protected` `Readonly` **userRepository\_**: [`Repository`](Repository.md)<[`User`](User.md)\>

#### Defined in

[packages/medusa/src/services/user.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L41)

___

### Events

 `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `PASSWORD_RESET` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/user.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L33)

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

**create**(`user`, `password`): `Promise`<[`User`](User.md)\>

Creates a user with username being validated.
Fails if email is not a valid format.

#### Parameters

| Name | Description |
| :------ | :------ |
| `user` | [`CreateUserInput`](../interfaces/CreateUserInput.md) | the user to create |
| `password` | `string` | user's password to hash |

#### Returns

`Promise`<[`User`](User.md)\>

-`Promise`: the result of create
	-`User`: 

#### Defined in

[packages/medusa/src/services/user.ts:171](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L171)

___

### delete

**delete**(`userId`): `Promise`<`void`\>

Deletes a user from a given user id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `userId` | `string` | the id of the user to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void`\>

-`Promise`: the result of the delete operation.

#### Defined in

[packages/medusa/src/services/user.ts:263](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L263)

___

### generateResetPasswordToken

**generateResetPasswordToken**(`userId`): `Promise`<`string`\>

Generate a JSON Web token, that will be sent to a user, that wishes to
reset password.
The token will be signed with the users current password hash as a secret
a long side a payload with userId and the expiry time for the token, which
is always 15 minutes.

#### Parameters

| Name | Description |
| :------ | :------ |
| `userId` | `string` | the id of the user to reset password for |

#### Returns

`Promise`<`string`\>

-`Promise`: the generated JSON web token
	-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/user.ts:327](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L327)

___

### hashPassword\_

**hashPassword_**(`password`): `Promise`<`string`\>

Hashes a password

#### Parameters

| Name | Description |
| :------ | :------ |
| `password` | `string` | the value to hash |

#### Returns

`Promise`<`string`\>

-`Promise`: hashed password
	-`string`: (optional) 

#### Defined in

[packages/medusa/src/services/user.ts:159](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L159)

___

### list

**list**(`selector`, `config?`): `Promise`<[`User`](User.md)[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`FilterableUserProps`](../index.md#filterableuserprops) | the query object for find |
| `config` | `object` | the configuration object for the query |

#### Returns

`Promise`<[`User`](User.md)[]\>

-`Promise`: the result of the find operation
	-`User[]`: 
		-`User`: 

#### Defined in

[packages/medusa/src/services/user.ts:65](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L65)

___

### retrieve

**retrieve**(`userId`, `config?`): `Promise`<[`User`](User.md)\>

Gets a user by id.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `userId` | `string` | the id of the user to get. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`User`](User.md)\> | query configs |

#### Returns

`Promise`<[`User`](User.md)\>

-`Promise`: the user document.
	-`User`: 

#### Defined in

[packages/medusa/src/services/user.ts:77](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L77)

___

### retrieveByApiToken

**retrieveByApiToken**(`apiToken`, `relations?`): `Promise`<[`User`](User.md)\>

Gets a user by api token.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `apiToken` | `string` | the token of the user to get. |
| `relations` | `string`[] | [] | relations to include with the user. |

#### Returns

`Promise`<[`User`](User.md)\>

-`Promise`: the user document.
	-`User`: 

#### Defined in

[packages/medusa/src/services/user.ts:107](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L107)

___

### retrieveByEmail

**retrieveByEmail**(`email`, `config?`): `Promise`<[`User`](User.md)\>

Gets a user by email.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `email` | `string` | the email of the user to get. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`User`](User.md)\> | query config |

#### Returns

`Promise`<[`User`](User.md)\>

-`Promise`: the user document.
	-`User`: 

#### Defined in

[packages/medusa/src/services/user.ts:135](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L135)

___

### setPassword\_

**setPassword_**(`userId`, `password`): `Promise`<[`User`](User.md)\>

Sets a password for a user
Fails if no user exists with userId and if the hashing of the new
password does not work.

#### Parameters

| Name | Description |
| :------ | :------ |
| `userId` | `string` | the userId to set password for |
| `password` | `string` | the old password to set |

#### Returns

`Promise`<[`User`](User.md)\>

-`Promise`: the result of the update operation
	-`User`: 

#### Defined in

[packages/medusa/src/services/user.ts:298](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L298)

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

**update**(`userId`, `update`): `Promise`<[`User`](User.md)\>

Updates a user.

#### Parameters

| Name | Description |
| :------ | :------ |
| `userId` | `string` | id of the user to update |
| `update` | [`UpdateUserInput`](../interfaces/UpdateUserInput.md) | the values to be updated on the user |

#### Returns

`Promise`<[`User`](User.md)\>

-`Promise`: the result of create
	-`User`: 

#### Defined in

[packages/medusa/src/services/user.ts:217](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/user.ts#L217)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`UserService`](UserService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`UserService`](UserService.md)

-`UserService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
