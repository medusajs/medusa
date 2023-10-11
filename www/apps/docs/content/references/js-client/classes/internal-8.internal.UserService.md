---
displayed_sidebar: jsClientSidebar
---

# Class: UserService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).UserService

Provides layer to manipulate users.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`UserService`**

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

### analyticsConfigService\_

• `Protected` `Readonly` **analyticsConfigService\_**: [`AnalyticsConfigService`](internal-8.internal.AnalyticsConfigService.md)

#### Defined in

packages/medusa/dist/services/user.d.ts:27

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/user.d.ts:29

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/user.d.ts:30

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### userRepository\_

• `Protected` `Readonly` **userRepository\_**: `Repository`<[`User`](internal-1.User.md)\>

#### Defined in

packages/medusa/dist/services/user.d.ts:28

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

packages/medusa/dist/services/user.d.ts:21

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

▸ **create**(`user`, `password`): `Promise`<[`User`](internal-1.User.md)\>

Creates a user with username being validated.
Fails if email is not a valid format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `user` | [`CreateUserInput`](../interfaces/internal-8.CreateUserInput.md) | the user to create |
| `password` | `string` | user's password to hash |

#### Returns

`Promise`<[`User`](internal-1.User.md)\>

the result of create

#### Defined in

packages/medusa/dist/services/user.d.ts:75

___

### delete

▸ **delete**(`userId`): `Promise`<`void`\>

Deletes a user from a given user id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | the id of the user to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void`\>

the result of the delete operation.

#### Defined in

packages/medusa/dist/services/user.d.ts:89

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

packages/medusa/dist/services/user.d.ts:108

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

packages/medusa/dist/services/user.d.ts:67

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`User`](internal-1.User.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`FilterableUserProps`](../modules/internal-8.md#filterableuserprops) | the query object for find |
| `config?` | `Object` | the configuration object for the query |

#### Returns

`Promise`<[`User`](internal-1.User.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/user.d.ts:37

___

### retrieve

▸ **retrieve**(`userId`, `config?`): `Promise`<[`User`](internal-1.User.md)\>

Gets a user by id.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | the id of the user to get. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`User`](internal-1.User.md)\> | query configs |

#### Returns

`Promise`<[`User`](internal-1.User.md)\>

the user document.

#### Defined in

packages/medusa/dist/services/user.d.ts:45

___

### retrieveByApiToken

▸ **retrieveByApiToken**(`apiToken`, `relations?`): `Promise`<[`User`](internal-1.User.md)\>

Gets a user by api token.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `apiToken` | `string` | the token of the user to get. |
| `relations?` | `string`[] | relations to include with the user. |

#### Returns

`Promise`<[`User`](internal-1.User.md)\>

the user document.

#### Defined in

packages/medusa/dist/services/user.d.ts:53

___

### retrieveByEmail

▸ **retrieveByEmail**(`email`, `config?`): `Promise`<[`User`](internal-1.User.md)\>

Gets a user by email.
Throws in case of DB Error and if user was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the user to get. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`User`](internal-1.User.md)\> | query config |

#### Returns

`Promise`<[`User`](internal-1.User.md)\>

the user document.

#### Defined in

packages/medusa/dist/services/user.d.ts:61

___

### setPassword\_

▸ **setPassword_**(`userId`, `password`): `Promise`<[`User`](internal-1.User.md)\>

Sets a password for a user
Fails if no user exists with userId and if the hashing of the new
password does not work.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | the userId to set password for |
| `password` | `string` | the old password to set |

#### Returns

`Promise`<[`User`](internal-1.User.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/user.d.ts:98

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

▸ **update**(`userId`, `update`): `Promise`<[`User`](internal-1.User.md)\>

Updates a user.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | id of the user to update |
| `update` | [`UpdateUserInput`](../interfaces/internal-8.UpdateUserInput.md) | the values to be updated on the user |

#### Returns

`Promise`<[`User`](internal-1.User.md)\>

the result of create

#### Defined in

packages/medusa/dist/services/user.d.ts:82

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`UserService`](internal-8.internal.UserService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`UserService`](internal-8.internal.UserService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
