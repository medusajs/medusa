# Class: AuthService

Can authenticate a user based on email password combination

## Hierarchy

- `TransactionBaseService`<[`AuthService`](AuthService.md)\>

  ↳ **`AuthService`**

## Constructors

### constructor

• **new AuthService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;AuthService\&gt;.constructor

#### Defined in

[packages/medusa/src/services/auth.ts:25](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/auth.ts#L25)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:12](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L12)

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/auth.ts:23](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/auth.ts#L23)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/auth.ts:20](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/auth.ts#L20)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/auth.ts:21](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/auth.ts#L21)

___

### userService\_

• `Protected` `Readonly` **userService\_**: [`UserService`](UserService.md)

#### Defined in

[packages/medusa/src/services/auth.ts:22](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/auth.ts#L22)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

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

[packages/medusa/src/services/auth.ts:98](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/auth.ts#L98)

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

[packages/medusa/src/services/auth.ts:55](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/auth.ts#L55)

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

[packages/medusa/src/services/auth.ts:147](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/auth.ts#L147)

___

### comparePassword\_

▸ `Protected` **comparePassword_**(`password`, `hash`): `Promise`<`boolean`\>

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

[packages/medusa/src/services/auth.ts:39](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/services/auth.ts#L39)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`AuthService`](AuthService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`AuthService`](AuthService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/f406c8d4/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
