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

[packages/medusa/src/services/product-category.ts:35](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L35)

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

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/product-category.ts:25](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L25)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/product-category.ts:27](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L27)

___

### productCategoryRepo\_

• `Protected` `Readonly` **productCategoryRepo\_**: typeof `ProductCategoryRepository`

#### Defined in

[packages/medusa/src/services/product-category.ts:24](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L24)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/product-category.ts:26](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L26)

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/product-category.ts:29](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L29)

## Methods

### addProducts

▸ **addProducts**(`productCategoryId`, `productIds`): `Promise`<`void`\>

Add a batch of product to a product category

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryId` | `string` | The id of the product category on which to add the products |
| `productIds` | `string`[] | The products ids to attach to the product category |

#### Returns

`Promise`<`void`\>

the product category on which the products have been added

#### Defined in

[packages/medusa/src/services/product-category.ts:227](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L227)

___

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

▸ **create**(`productCategoryInput`): `Promise`<`ProductCategory`\>

Creates a product category

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategoryInput` | `CreateProductCategoryInput` |

#### Returns

`Promise`<`ProductCategory`\>

created product category

#### Defined in

[packages/medusa/src/services/product-category.ts:132](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L132)

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

[packages/medusa/src/services/product-category.ts:191](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L191)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`, `treeSelector?`): `Promise`<[`ProductCategory`[], `number`]\>

Lists product category based on the provided parameters and includes the count of
product category that match the query.

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `QuerySelector`<`ProductCategory`\> |
| `config` | `FindConfig`<`ProductCategory`\> |
| `treeSelector` | `QuerySelector`<`ProductCategory`\> |

#### Returns

`Promise`<[`ProductCategory`[], `number`]\>

an array containing the product category as
  the first element and the total count of product category that matches the query
  as the second element.

#### Defined in

[packages/medusa/src/services/product-category.ts:55](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L55)

___

### removeProducts

▸ **removeProducts**(`productCategoryId`, `productIds`): `Promise`<`void`\>

Remove a batch of product from a product category

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryId` | `string` | The id of the product category on which to remove the products |
| `productIds` | `string`[] | The products ids to remove from the product category |

#### Returns

`Promise`<`void`\>

the product category on which the products have been removed

#### Defined in

[packages/medusa/src/services/product-category.ts:245](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L245)

___

### retrieve

▸ **retrieve**(`productCategoryId`, `config?`, `selector?`): `Promise`<`ProductCategory`\>

Retrieves a product category by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryId` | `string` | the id of the product category to retrieve. |
| `config` | `FindConfig`<`ProductCategory`\> | the config of the product category to retrieve. |
| `selector` | `Selector`<`ProductCategory`\> | - |

#### Returns

`Promise`<`ProductCategory`\>

the product category.

#### Defined in

[packages/medusa/src/services/product-category.ts:92](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L92)

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

▸ **update**(`productCategoryId`, `productCategoryInput`): `Promise`<`ProductCategory`\>

Updates a product category

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryId` | `string` | id of product category to update |
| `productCategoryInput` | `UpdateProductCategoryInput` | parameters to update in product category |

#### Returns

`Promise`<`ProductCategory`\>

updated product category

#### Defined in

[packages/medusa/src/services/product-category.ts:156](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-category.ts#L156)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
