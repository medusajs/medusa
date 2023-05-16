# Class: ProductTypeService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductTypeService`**

## Constructors

### constructor

• **new ProductTypeService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/product-type.ts:12](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-type.ts#L12)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### typeRepository\_

• `Protected` `Readonly` **typeRepository\_**: `Repository`<`ProductType`\> & { `findAndCountByDiscountConditionId`: (`conditionId`: `string`, `query`: `ExtendedFindConfig`<`ProductType`\>) => `Promise`<[`ProductType`[], `number`]\> ; `upsertType`: (`type?`: `UpsertTypeInput`) => `Promise`<``null`` \| `ProductType`\>  }

#### Defined in

[medusa/src/services/product-type.ts:10](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-type.ts#L10)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`ProductType`[]\>

Lists product types

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ProductType`\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | `FindConfig`<`ProductType`\> | the config to be used for find |

#### Returns

`Promise`<`ProductType`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/product-type.ts:52](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-type.ts#L52)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`ProductType`[], `number`]\>

Lists product types and adds count.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`ProductType`\> & { `discount_condition_id?`: `string` ; `q?`: `string`  } | the query object for find |
| `config` | `FindConfig`<`ProductType`\> | the config to be used for find |

#### Returns

`Promise`<[`ProductType`[], `number`]\>

the result of the find operation

#### Defined in

[medusa/src/services/product-type.ts:69](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-type.ts#L69)

___

### retrieve

▸ **retrieve**(`id`, `config?`): `Promise`<`ProductType`\>

Gets a product type by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the product to get. |
| `config` | `FindConfig`<`ProductType`\> | object that defines what should be included in the   query response |

#### Returns

`Promise`<`ProductType`\>

the result of the find one operation.

#### Defined in

[medusa/src/services/product-type.ts:27](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/services/product-type.ts#L27)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductTypeService`](ProductTypeService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductTypeService`](ProductTypeService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/27ff5a7f5/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
