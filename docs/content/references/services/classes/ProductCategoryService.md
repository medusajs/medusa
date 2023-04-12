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

[medusa/src/services/product-category.ts:40](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L40)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/product-category.ts:32](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L32)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productCategoryRepo\_

• `Protected` `Readonly` **productCategoryRepo\_**: `TreeRepository`<`ProductCategory`\> & { `addProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `findOneWithDescendants`: (`query`: `FindOneOptions`<`ProductCategory`\>, `treeScope`: `QuerySelector`<`ProductCategory`\>) => `Promise`<``null`` \| `ProductCategory`\> ; `getFreeTextSearchResultsAndCount`: (`options`: `ExtendedFindConfig`<`ProductCategory`\>, `q?`: `string`, `treeScope`: `QuerySelector`<`ProductCategory`\>, `includeTree`: `boolean`) => `Promise`<[`ProductCategory`[], `number`]\> ; `removeProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

[medusa/src/services/product-category.ts:31](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L31)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/product-category.ts:34](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L34)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/services/product-category.ts:266](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L266)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`productCategoryInput`): `Promise`<`ProductCategory`\>

Creates a product category

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryInput` | `CreateProductCategoryInput` | parameters to create a product category |

#### Returns

`Promise`<`ProductCategory`\>

created product category

#### Defined in

[medusa/src/services/product-category.ts:139](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L139)

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

[medusa/src/services/product-category.ts:220](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L220)

___

### fetchReorderConditions

▸ `Protected` **fetchReorderConditions**(`productCategory`, `input`, `shouldDeleteElement?`): `ReorderConditions`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `productCategory` | `ProductCategory` | `undefined` |
| `input` | `UpdateProductCategoryInput` | `undefined` |
| `shouldDeleteElement` | `boolean` | `false` |

#### Returns

`ReorderConditions`

#### Defined in

[medusa/src/services/product-category.ts:301](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L301)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`, `treeSelector?`): `Promise`<[`ProductCategory`[], `number`]\>

Lists product category based on the provided parameters and includes the count of
product category that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `TreeQuerySelector`<`ProductCategory`\> | Filter options for product category. |
| `config` | `FindConfig`<`ProductCategory`\> | Configuration for query. |
| `treeSelector` | `QuerySelector`<`ProductCategory`\> | Filter options for product category tree relations |

#### Returns

`Promise`<[`ProductCategory`[], `number`]\>

an array containing the product category as
  the first element and the total count of product category that matches the query
  as the second element.

#### Defined in

[medusa/src/services/product-category.ts:61](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L61)

___

### performReordering

▸ `Protected` **performReordering**(`repository`, `conditions`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `repository` | `TreeRepository`<`ProductCategory`\> & { `addProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `findOneWithDescendants`: (`query`: `FindOneOptions`<`ProductCategory`\>, `treeScope`: `QuerySelector`<`ProductCategory`\>) => `Promise`<``null`` \| `ProductCategory`\> ; `getFreeTextSearchResultsAndCount`: (`options`: `ExtendedFindConfig`<`ProductCategory`\>, `q?`: `string`, `treeScope`: `QuerySelector`<`ProductCategory`\>, `includeTree`: `boolean`) => `Promise`<[`ProductCategory`[], `number`]\> ; `removeProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  } |
| `conditions` | `ReorderConditions` |

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/product-category.ts:329](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L329)

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

[medusa/src/services/product-category.ts:285](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L285)

___

### retrieve

▸ **retrieve**(`productCategoryId`, `config?`, `selector?`, `treeSelector?`): `Promise`<`ProductCategory`\>

Retrieves a product category by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryId` | `string` | the id of the product category to retrieve. |
| `config` | `FindConfig`<`ProductCategory`\> | the config of the product category to retrieve. |
| `selector` | `Selector`<`ProductCategory`\> | - |
| `treeSelector` | `QuerySelector`<`ProductCategory`\> | - |

#### Returns

`Promise`<`ProductCategory`\>

the product category.

#### Defined in

[medusa/src/services/product-category.ts:100](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L100)

___

### shiftSiblings

▸ `Protected` **shiftSiblings**(`repository`, `conditions`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `repository` | `TreeRepository`<`ProductCategory`\> & { `addProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `findOneWithDescendants`: (`query`: `FindOneOptions`<`ProductCategory`\>, `treeScope`: `QuerySelector`<`ProductCategory`\>) => `Promise`<``null`` \| `ProductCategory`\> ; `getFreeTextSearchResultsAndCount`: (`options`: `ExtendedFindConfig`<`ProductCategory`\>, `q?`: `string`, `treeScope`: `QuerySelector`<`ProductCategory`\>, `includeTree`: `boolean`) => `Promise`<[`ProductCategory`[], `number`]\> ; `removeProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  } |
| `conditions` | `ReorderConditions` |

#### Returns

`Promise`<`void`\>

#### Defined in

[medusa/src/services/product-category.ts:367](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L367)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### transformParentIdToEntity

▸ `Protected` **transformParentIdToEntity**(`productCategoryInput`): `Promise`<`CreateProductCategoryInput` \| `UpdateProductCategoryInput`\>

Accepts an input object and transforms product_category_id
into product_category entity.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryInput` | `CreateProductCategoryInput` \| `UpdateProductCategoryInput` | params used to create/update |

#### Returns

`Promise`<`CreateProductCategoryInput` \| `UpdateProductCategoryInput`\>

transformed productCategoryInput

#### Defined in

[medusa/src/services/product-category.ts:465](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L465)

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

[medusa/src/services/product-category.ts:173](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/product-category.ts#L173)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
