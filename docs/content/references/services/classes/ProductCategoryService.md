# Class: ProductCategoryService

Provides layer to manipulate product categories.

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductCategoryService`**

## Constructors

### constructor

• **new ProductCategoryService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/product-category.ts:23](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/product-category.ts#L23)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/product-category.ts:19](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/product-category.ts#L19)

___

### productCategoryRepo\_

• `Protected` `Readonly` **productCategoryRepo\_**: typeof `ProductCategoryRepository`

#### Defined in

[packages/medusa/src/services/product-category.ts:20](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/product-category.ts#L20)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/product-category.ts:21](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/product-category.ts#L21)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:48](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L48)

___

### create

▸ **create**(`productCategory`): `Promise`<`ProductCategory`\>

Creates a product category

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategory` | `CreateProductCategoryInput` | params used to create |

#### Returns

`Promise`<`ProductCategory`\>

created product category

#### Defined in

[packages/medusa/src/services/product-category.ts:108](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/product-category.ts#L108)

___

### delete

▸ **delete**(`productCategoryId`): `Promise`<`void`\>

Deletes a product category

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryId` | `string` | is the id of the product category to delete |

#### Returns

`Promise`<`void`\>

a promise

#### Defined in

[packages/medusa/src/services/product-category.ts:125](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/product-category.ts#L125)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`ProductCategory`[], `number`]\>

Lists product category based on the provided parameters and includes the count of
product category that match the query.

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `QuerySelector`<`ProductCategory`\> |
| `config` | `FindConfig`<`ProductCategory`\> |

#### Returns

`Promise`<[`ProductCategory`[], `number`]\>

an array containing the product category as
  the first element and the total count of product category that matches the query
  as the second element.

#### Defined in

[packages/medusa/src/services/product-category.ts:38](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/product-category.ts#L38)

___

### retrieve

▸ **retrieve**(`productCategoryId`, `config?`): `Promise`<`ProductCategory`\>

Retrieves a product category by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryId` | `string` | the id of the product category to retrieve. |
| `config` | `FindConfig`<`ProductCategory`\> | the config of the product category to retrieve. |

#### Returns

`Promise`<`ProductCategory`\>

the product category.

#### Defined in

[packages/medusa/src/services/product-category.ts:70](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/services/product-category.ts#L70)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:29](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L29)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductCategoryService`](ProductCategoryService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductCategoryService`](ProductCategoryService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/6dafb5154/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
