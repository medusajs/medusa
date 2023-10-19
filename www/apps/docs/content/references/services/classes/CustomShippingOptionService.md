# Class: CustomShippingOptionService

## Hierarchy

- `TransactionBaseService`

  ↳ **`CustomShippingOptionService`**

## Constructors

### constructor

• **new CustomShippingOptionService**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/custom-shipping-option.ts:18](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/custom-shipping-option.ts#L18)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customShippingOptionRepository\_

• `Protected` **customShippingOptionRepository\_**: `Repository`<`CustomShippingOption`\>

#### Defined in

[medusa/src/services/custom-shipping-option.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/custom-shipping-option.ts#L16)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**<`T`, `TResult`\>(`data`): `Promise`<`TResult`\>

Creates a custom shipping option

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `CreateCustomShippingOptionInput` \| `CreateCustomShippingOptionInput`[] |
| `TResult` | `T` extends `CreateCustomShippingOptionInput`[] ? `CustomShippingOption`[] : `CustomShippingOption` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `T` | the custom shipping option to create |

#### Returns

`Promise`<`TResult`\>

resolves to the creation result

#### Defined in

[medusa/src/services/custom-shipping-option.ts:80](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/custom-shipping-option.ts#L80)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`CustomShippingOption`[]\>

Fetches all custom shipping options based on the given selector

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`CustomShippingOption`\> | the query object for find |
| `config` | `FindConfig`<`CustomShippingOption`\> | the configuration used to find the objects. contains relations, skip, and take. |

#### Returns

`Promise`<`CustomShippingOption`[]\>

custom shipping options matching the query

#### Defined in

[medusa/src/services/custom-shipping-option.ts:58](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/custom-shipping-option.ts#L58)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`CustomShippingOption`\>

Retrieves a specific shipping option.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the custom shipping option to retrieve. |
| `config` | `FindConfig`<`CustomShippingOption`\> | any options needed to query for the result. |

#### Returns

`Promise`<`CustomShippingOption`\>

the requested custom shipping option.

#### Defined in

[medusa/src/services/custom-shipping-option.ts:31](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/custom-shipping-option.ts#L31)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`CustomShippingOptionService`](CustomShippingOptionService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
