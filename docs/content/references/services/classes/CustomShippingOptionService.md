# Class: CustomShippingOptionService

## Hierarchy

- `TransactionBaseService`

  ↳ **`CustomShippingOptionService`**

## Constructors

### constructor

• **new CustomShippingOptionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/custom-shipping-option.ts:20](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/custom-shipping-option.ts#L20)

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

### customShippingOptionRepository\_

• `Protected` **customShippingOptionRepository\_**: typeof `CustomShippingOptionRepository`

#### Defined in

[packages/medusa/src/services/custom-shipping-option.ts:18](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/custom-shipping-option.ts#L18)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/custom-shipping-option.ts:15](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/custom-shipping-option.ts#L15)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/custom-shipping-option.ts:16](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/custom-shipping-option.ts#L16)

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

[packages/medusa/src/services/custom-shipping-option.ts:89](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/custom-shipping-option.ts#L89)

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

[packages/medusa/src/services/custom-shipping-option.ts:65](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/custom-shipping-option.ts#L65)

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

[packages/medusa/src/services/custom-shipping-option.ts:37](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/custom-shipping-option.ts#L37)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
