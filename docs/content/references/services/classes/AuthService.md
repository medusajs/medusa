# Class: AuthService

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

[services/auth.ts:25](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/auth.ts#L25)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### customerService\_

• `Protected` `Readonly` **customerService\_**: [`CustomerService`](CustomerService.md)

#### Defined in

[services/auth.ts:23](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/auth.ts#L23)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/auth.ts:20](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/auth.ts#L20)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/auth.ts:21](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/auth.ts#L21)

___

### userService\_

• `Protected` `Readonly` **userService\_**: [`UserService`](UserService.md)

#### Defined in

[services/auth.ts:22](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/auth.ts#L22)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### authenticate

▸ **authenticate**(`email`, `password`): `Promise`<`AuthenticateResult`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` |  |
| `password` | `string` |  |

#### Returns

`Promise`<`AuthenticateResult`\>

#### Defined in

[services/auth.ts:98](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/auth.ts#L98)

___

### authenticateAPIToken

▸ **authenticateAPIToken**(`token`): `Promise`<`AuthenticateResult`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` |  |

#### Returns

`Promise`<`AuthenticateResult`\>

#### Defined in

[services/auth.ts:55](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/auth.ts#L55)

___

### authenticateCustomer

▸ **authenticateCustomer**(`email`, `password`): `Promise`<`AuthenticateResult`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` |  |
| `password` | `string` |  |

#### Returns

`Promise`<`AuthenticateResult`\>

#### Defined in

[services/auth.ts:147](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/auth.ts#L147)

___

### comparePassword\_

▸ `Protected` **comparePassword_**(`password`, `hash`): `Promise`<`boolean`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` |  |
| `hash` | `string` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[services/auth.ts:39](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/auth.ts#L39)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
