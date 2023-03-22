# Class: AnalyticsConfigService

## Hierarchy

- `TransactionBaseService`

  ↳ **`AnalyticsConfigService`**

## Constructors

### constructor

• **new AnalyticsConfigService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/analytics-config.ts:24](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/analytics-config.ts#L24)

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

### analyticsConfigRepository\_

• `Protected` `Readonly` **analyticsConfigRepository\_**: typeof `AnalyticsConfigRepository`

#### Defined in

[packages/medusa/src/services/analytics-config.ts:21](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/analytics-config.ts#L21)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/analytics-config.ts:18](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/analytics-config.ts#L18)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/analytics-config.ts:19](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/analytics-config.ts#L19)

___

### userService\_

• `Protected` `Readonly` **userService\_**: [`UserService`](UserService.md)

#### Defined in

[packages/medusa/src/services/analytics-config.ts:22](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/analytics-config.ts#L22)

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

### create

▸ **create**(`userId`, `data`): `Promise`<`AnalyticsConfig`\>

Creates an analytics config.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `data` | `CreateAnalyticsConfig` |

#### Returns

`Promise`<`AnalyticsConfig`\>

#### Defined in

[packages/medusa/src/services/analytics-config.ts:56](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/analytics-config.ts#L56)

___

### delete

▸ **delete**(`userId`): `Promise`<`void`\>

Deletes an analytics config.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/analytics-config.ts:103](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/analytics-config.ts#L103)

___

### retrieve

▸ **retrieve**(`userId`): `Promise`<`AnalyticsConfig`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`<`AnalyticsConfig`\>

#### Defined in

[packages/medusa/src/services/analytics-config.ts:32](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/analytics-config.ts#L32)

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

### update

▸ **update**(`userId`, `update`): `Promise`<`AnalyticsConfig`\>

Updates an analytics config. If the config does not exist, it will be created instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `update` | `UpdateAnalyticsConfig` |

#### Returns

`Promise`<`AnalyticsConfig`\>

#### Defined in

[packages/medusa/src/services/analytics-config.ts:72](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/analytics-config.ts#L72)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`AnalyticsConfigService`](AnalyticsConfigService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`AnalyticsConfigService`](AnalyticsConfigService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
