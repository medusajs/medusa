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

[packages/medusa/src/services/product-type.ts:15](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-type.ts#L15)

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

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/product-type.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-type.ts#L10)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/product-type.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-type.ts#L11)

___

### typeRepository\_

• `Protected` `Readonly` **typeRepository\_**: typeof `ProductTypeRepository`

#### Defined in

[packages/medusa/src/services/product-type.ts:13](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-type.ts#L13)

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

[packages/medusa/src/services/product-type.ts:55](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-type.ts#L55)

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

[packages/medusa/src/services/product-type.ts:72](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-type.ts#L72)

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

[packages/medusa/src/services/product-type.ts:30](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-type.ts#L30)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
