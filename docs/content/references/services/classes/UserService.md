# Class: UserService

Provides layer to manipulate users.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`UserService`**

## Constructors

### constructor

• **new UserService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `UserServiceProps` |

#### Overrides

BaseService.constructor

#### Defined in

[services/user.ts:36](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L36)

## Properties

### eventBus\_

• `Private` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/user.ts:32](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L32)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/user.ts:33](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L33)

___

### transactionManager\_

• `Private` **transactionManager\_**: `EntityManager`

#### Defined in

[services/user.ts:34](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L34)

___

### userRepository\_

• `Private` **userRepository\_**: typeof `UserRepository`

#### Defined in

[services/user.ts:31](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L31)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `PASSWORD_RESET` | `string` |

#### Defined in

[services/user.ts:27](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L27)

## Methods

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

[services/user.ts:188](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L188)

___

### delete

▸ **delete**(`userId`): `Promise`<``null``\>

Deletes a user from a given user id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | `string` | the id of the user to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<``null``\>

the result of the delete operation.

#### Defined in

[services/user.ts:257](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L257)

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

[services/user.ts:311](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L311)

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

[services/user.ts:176](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L176)

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

[services/user.ts:88](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L88)

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

[services/user.ts:100](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L100)

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

[services/user.ts:124](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L124)

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

[services/user.ts:152](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L152)

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

[services/user.ts:282](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L282)

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

[services/user.ts:216](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L216)

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

[services/user.ts:70](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L70)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`UserService`](UserService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`UserService`](UserService.md)

#### Defined in

[services/user.ts:49](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/user.ts#L49)
