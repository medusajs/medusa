# Class: AuthService

Can authenticate a user based on email password combination

## Hierarchy

- `TransactionBaseService`

  ↳ **`AuthService`**

## Constructors

### constructor

• **new AuthService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/auth.ts:24](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/auth.ts#L24)

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

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/auth.ts:22](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/auth.ts#L22)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/auth.ts:19](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/auth.ts#L19)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/auth.ts:20](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/auth.ts#L20)

___

### userService\_

• `Protected` `Readonly` **userService\_**: [`UserService`](UserService.md)

#### Defined in

[packages/medusa/src/services/auth.ts:21](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/auth.ts#L21)

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

[packages/medusa/src/services/auth.ts:97](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/auth.ts#L97)

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

[packages/medusa/src/services/auth.ts:54](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/auth.ts#L54)

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

[packages/medusa/src/services/auth.ts:146](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/auth.ts#L146)

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

[packages/medusa/src/services/auth.ts:38](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/auth.ts#L38)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
