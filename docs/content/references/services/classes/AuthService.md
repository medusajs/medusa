# Class: AuthService

Can authenticate a user based on email password combination

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`AuthService`**

## Constructors

### constructor

• **new AuthService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/auth.ts:12](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/auth.ts#L12)

## Methods

### authenticate

▸ **authenticate**(`email`, `password`): `Promise`<`AuthenticateResult`\>

Authenticates a given user based on an email, password combination. Uses
scrypt to match password with hashed value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the user |
| `password` | `string` | the password of the user |

#### Returns

`Promise`<`AuthenticateResult`\>

   success: whether authentication succeeded
   user: the user document if authentication succeded
   error: a string with the error message

#### Defined in

[services/auth.ts:78](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/auth.ts#L78)

___

### authenticateAPIToken

▸ **authenticateAPIToken**(`token`): `Promise`<`AuthenticateResult`\>

Authenticates a given user with an API token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` | the api_token of the user to authenticate |

#### Returns

`Promise`<`AuthenticateResult`\>

   success: whether authentication succeeded
   user: the user document if authentication succeded
   error: a string with the error message

#### Defined in

[services/auth.ts:41](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/auth.ts#L41)

___

### authenticateCustomer

▸ **authenticateCustomer**(`email`, `password`): `Promise`<`AuthenticateResult`\>

Authenticates a customer based on an email, password combination. Uses
scrypt to match password with hashed value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the user |
| `password` | `string` | the password of the user |

#### Returns

`Promise`<`AuthenticateResult`\>

   success: whether authentication succeeded
   user: the user document if authentication succeded
   error: a string with the error message

#### Defined in

[services/auth.ts:123](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/auth.ts#L123)

___

### comparePassword\_

▸ **comparePassword_**(`password`, `hash`): `Promise`<`boolean`\>

Verifies if a password is valid given the provided password hash

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` | the raw password to check |
| `hash` | `string` | the hash to compare against |

#### Returns

`Promise`<`boolean`\>

the result of the comparison

#### Defined in

[services/auth.ts:28](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/auth.ts#L28)
