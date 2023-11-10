# AuthService

Can authenticate a user based on email password combination

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`AuthService`**

## Constructors

### constructor

**new AuthService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-1.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/auth.ts:22](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/auth.ts#L22)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customerService\_

 `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[packages/medusa/src/services/auth.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/auth.ts#L20)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### userService\_

 `Protected` `Readonly` **userService\_**: [`UserService`](UserService.md)

#### Defined in

[packages/medusa/src/services/auth.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/auth.ts#L19)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### authenticate

**authenticate**(`email`, `password`): `Promise`<[`AuthenticateResult`](../types/AuthenticateResult.md)\>

Authenticates a given user based on an email, password combination. Uses
scrypt to match password with hashed value.

#### Parameters

| Name | Description |
| :------ | :------ |
| `email` | `string` | the email of the user |
| `password` | `string` | the password of the user |

#### Returns

`Promise`<[`AuthenticateResult`](../types/AuthenticateResult.md)\>

-`Promise`: success: whether authentication succeeded
   user: the user document if authentication succeeded
   error: a string with the error message
	-`AuthenticateResult`: 
		-`customer`: (optional) A customer can make purchases in your store and manage their profile.
		-`error`: (optional) 
		-`success`: 
		-`user`: (optional) A User is an administrator who can manage store settings and data.

#### Defined in

[packages/medusa/src/services/auth.ts:81](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/auth.ts#L81)

___

### authenticateAPIToken

**authenticateAPIToken**(`token`): `Promise`<[`AuthenticateResult`](../types/AuthenticateResult.md)\>

Authenticates a given user with an API token

#### Parameters

| Name | Description |
| :------ | :------ |
| `token` | `string` | the api_token of the user to authenticate |

#### Returns

`Promise`<[`AuthenticateResult`](../types/AuthenticateResult.md)\>

-`Promise`: success: whether authentication succeeded
   user: the user document if authentication succeeded
   error: a string with the error message
	-`AuthenticateResult`: 
		-`customer`: (optional) A customer can make purchases in your store and manage their profile.
		-`error`: (optional) 
		-`success`: 
		-`user`: (optional) A User is an administrator who can manage store settings and data.

#### Defined in

[packages/medusa/src/services/auth.ts:52](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/auth.ts#L52)

___

### authenticateCustomer

**authenticateCustomer**(`email`, `password`): `Promise`<[`AuthenticateResult`](../types/AuthenticateResult.md)\>

Authenticates a customer based on an email, password combination. Uses
scrypt to match password with hashed value.

#### Parameters

| Name | Description |
| :------ | :------ |
| `email` | `string` | the email of the user |
| `password` | `string` | the password of the user |

#### Returns

`Promise`<[`AuthenticateResult`](../types/AuthenticateResult.md)\>

-`Promise`: success: whether authentication succeeded
   customer: the customer document if authentication succeded
   error: a string with the error message
	-`AuthenticateResult`: 
		-`customer`: (optional) A customer can make purchases in your store and manage their profile.
		-`error`: (optional) 
		-`success`: 
		-`user`: (optional) A User is an administrator who can manage store settings and data.

#### Defined in

[packages/medusa/src/services/auth.ts:130](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/auth.ts#L130)

___

### comparePassword\_

`Protected` **comparePassword_**(`password`, `hash`): `Promise`<`boolean`\>

Verifies if a password is valid given the provided password hash

#### Parameters

| Name | Description |
| :------ | :------ |
| `password` | `string` | the raw password to check |
| `hash` | `string` | the hash to compare against |

#### Returns

`Promise`<`boolean`\>

-`Promise`: the result of the comparison
	-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/auth.ts:36](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/auth.ts#L36)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`AuthService`](AuthService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`AuthService`](AuthService.md)

-`AuthService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
