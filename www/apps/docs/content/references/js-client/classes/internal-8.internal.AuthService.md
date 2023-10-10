---
displayed_sidebar: jsClientSidebar
---

# Class: AuthService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AuthService

Can authenticate a user based on email password combination

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`AuthService`**

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

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](internal-8.internal.CustomerService.md)

#### Defined in

packages/medusa/dist/services/auth.d.ts:16

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

### userService\_

• `Protected` `Readonly` **userService\_**: [`UserService`](internal-8.internal.UserService.md)

#### Defined in

packages/medusa/dist/services/auth.d.ts:15

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

### authenticate

▸ **authenticate**(`email`, `password`): `Promise`<[`AuthenticateResult`](../modules/internal-8.md#authenticateresult)\>

Authenticates a given user based on an email, password combination. Uses
scrypt to match password with hashed value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the user |
| `password` | `string` | the password of the user |

#### Returns

`Promise`<[`AuthenticateResult`](../modules/internal-8.md#authenticateresult)\>

success: whether authentication succeeded
   user: the user document if authentication succeeded
   error: a string with the error message

#### Defined in

packages/medusa/dist/services/auth.d.ts:44

___

### authenticateAPIToken

▸ **authenticateAPIToken**(`token`): `Promise`<[`AuthenticateResult`](../modules/internal-8.md#authenticateresult)\>

Authenticates a given user with an API token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` | the api_token of the user to authenticate |

#### Returns

`Promise`<[`AuthenticateResult`](../modules/internal-8.md#authenticateresult)\>

success: whether authentication succeeded
   user: the user document if authentication succeeded
   error: a string with the error message

#### Defined in

packages/medusa/dist/services/auth.d.ts:33

___

### authenticateCustomer

▸ **authenticateCustomer**(`email`, `password`): `Promise`<[`AuthenticateResult`](../modules/internal-8.md#authenticateresult)\>

Authenticates a customer based on an email, password combination. Uses
scrypt to match password with hashed value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email of the user |
| `password` | `string` | the password of the user |

#### Returns

`Promise`<[`AuthenticateResult`](../modules/internal-8.md#authenticateresult)\>

success: whether authentication succeeded
   customer: the customer document if authentication succeded
   error: a string with the error message

#### Defined in

packages/medusa/dist/services/auth.d.ts:55

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

packages/medusa/dist/services/auth.d.ts:24

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

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`AuthService`](internal-8.internal.AuthService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`AuthService`](internal-8.internal.AuthService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
