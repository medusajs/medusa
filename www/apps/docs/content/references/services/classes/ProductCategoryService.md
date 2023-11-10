# ProductCategoryService

Provides layer to manipulate product categories.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`ProductCategoryService`**

## Constructors

### constructor

**new ProductCategoryService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-27) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/product-category.ts:40](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L40)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBusService\_

 `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/product-category.ts:32](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L32)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productCategoryRepo\_

 `Protected` `Readonly` **productCategoryRepo\_**: [`TreeRepository`](TreeRepository.md)<[`ProductCategory`](ProductCategory.md)\> & { `addProducts`: Method addProducts ; `findOneWithDescendants`: Method findOneWithDescendants ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `removeProducts`: Method removeProducts  }

#### Defined in

[packages/medusa/src/services/product-category.ts:31](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L31)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/product-category.ts:34](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L34)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addProducts

**addProducts**(`productCategoryId`, `productIds`): `Promise`<`void`\>

Add a batch of product to a product category

#### Parameters

| Name | Description |
| :------ | :------ |
| `productCategoryId` | `string` | The id of the product category on which to add the products |
| `productIds` | `string`[] | The products ids to attach to the product category |

#### Returns

`Promise`<`void`\>

-`Promise`: the product category on which the products have been added

#### Defined in

[packages/medusa/src/services/product-category.ts:314](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L314)

___

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**(`productCategoryInput`): `Promise`<[`ProductCategory`](ProductCategory.md)\>

Creates a product category

#### Parameters

| Name | Description |
| :------ | :------ |
| `productCategoryInput` | [`CreateProductCategoryInput`](../index.md#createproductcategoryinput) | parameters to create a product category |

#### Returns

`Promise`<[`ProductCategory`](ProductCategory.md)\>

-`Promise`: created product category
	-`ProductCategory`: 

#### Defined in

[packages/medusa/src/services/product-category.ts:187](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L187)

___

### delete

**delete**(`productCategoryId`): `Promise`<`void`\>

Deletes a product category

#### Parameters

| Name | Description |
| :------ | :------ |
| `productCategoryId` | `string` | is the id of the product category to delete |

#### Returns

`Promise`<`void`\>

-`Promise`: a promise

#### Defined in

[packages/medusa/src/services/product-category.ts:268](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L268)

___

### fetchReorderConditions

`Protected` **fetchReorderConditions**(`productCategory`, `input`, `shouldDeleteElement?`): [`ReorderConditions`](../index.md#reorderconditions)

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `productCategory` | [`ProductCategory`](ProductCategory.md) | A product category can be used to categorize products into a hierarchy of categories. |
| `input` | [`UpdateProductCategoryInput`](../index.md#updateproductcategoryinput) |
| `shouldDeleteElement` | `boolean` | false |

#### Returns

[`ReorderConditions`](../index.md#reorderconditions)

-`ReorderConditions`: 
	-`originalParentId`: 
	-`originalRank`: 
	-`shouldChangeParent`: 
	-`shouldChangeRank`: 
	-`shouldDeleteElement`: 
	-`shouldIncrementRank`: 
	-`targetCategoryId`: 
	-`targetParentId`: 
	-`targetRank`: 

#### Defined in

[packages/medusa/src/services/product-category.ts:349](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L349)

___

### listAndCount

**listAndCount**(`selector`, `config?`, `treeSelector?`): `Promise`<[[`ProductCategory`](ProductCategory.md)[], `number`]\>

Lists product category based on the provided parameters and includes the count of
product category that match the query.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`TreeQuerySelector`](../index.md#treequeryselector)<[`ProductCategory`](ProductCategory.md)\> | Filter options for product category. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ProductCategory`](ProductCategory.md)\> | Configuration for query. |
| `treeSelector` | [`QuerySelector`](../index.md#queryselector)<[`ProductCategory`](ProductCategory.md)\> | Filter options for product category tree relations |

#### Returns

`Promise`<[[`ProductCategory`](ProductCategory.md)[], `number`]\>

-`Promise`: an array containing the product category as
  the first element and the total count of product category that matches the query
  as the second element.
	-`ProductCategory[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/product-category.ts:61](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L61)

___

### performReordering

`Protected` **performReordering**(`repository`, `conditions`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `repository` | [`TreeRepository`](TreeRepository.md)<[`ProductCategory`](ProductCategory.md)\> & { `addProducts`: Method addProducts ; `findOneWithDescendants`: Method findOneWithDescendants ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `removeProducts`: Method removeProducts  } |
| `conditions` | [`ReorderConditions`](../index.md#reorderconditions) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/product-category.ts:377](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L377)

___

### removeProducts

**removeProducts**(`productCategoryId`, `productIds`): `Promise`<`void`\>

Remove a batch of product from a product category

#### Parameters

| Name | Description |
| :------ | :------ |
| `productCategoryId` | `string` | The id of the product category on which to remove the products |
| `productIds` | `string`[] | The products ids to remove from the product category |

#### Returns

`Promise`<`void`\>

-`Promise`: the product category on which the products have been removed

#### Defined in

[packages/medusa/src/services/product-category.ts:333](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L333)

___

### retrieve

**retrieve**(`productCategoryId`, `config?`, `selector?`, `treeSelector?`): `Promise`<[`ProductCategory`](ProductCategory.md)\>

Retrieves a product category by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productCategoryId` | `string` | the id of the product category to retrieve. |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ProductCategory`](ProductCategory.md)\> | the config of the product category to retrieve. |
| `selector` | [`Selector`](../index.md#selector)<[`ProductCategory`](ProductCategory.md)\> |
| `treeSelector` | [`QuerySelector`](../index.md#queryselector)<[`ProductCategory`](ProductCategory.md)\> |

#### Returns

`Promise`<[`ProductCategory`](ProductCategory.md)\>

-`Promise`: the product category.
	-`ProductCategory`: 

#### Defined in

[packages/medusa/src/services/product-category.ts:139](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L139)

___

### retrieveByHandle

**retrieveByHandle**(`handle`, `config?`, `selector?`, `treeSelector?`): `Promise`<[`ProductCategory`](ProductCategory.md)\>

Retrieves a product category by handle.

#### Parameters

| Name | Description |
| :------ | :------ |
| `handle` | `string` | the handle of the category |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ProductCategory`](ProductCategory.md)\> | the config of the product category to retrieve. |
| `selector` | [`Selector`](../index.md#selector)<[`ProductCategory`](ProductCategory.md)\> |
| `treeSelector` | [`QuerySelector`](../index.md#queryselector)<[`ProductCategory`](ProductCategory.md)\> |

#### Returns

`Promise`<[`ProductCategory`](ProductCategory.md)\>

-`Promise`: the product category.
	-`ProductCategory`: 

#### Defined in

[packages/medusa/src/services/product-category.ts:165](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L165)

___

### retrieve\_

`Protected` **retrieve_**(`config?`, `selector?`, `treeSelector?`): `Promise`<[`ProductCategory`](ProductCategory.md)\>

A generic retrieve for fining product categories by different attributes.

#### Parameters

| Name | Description |
| :------ | :------ |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ProductCategory`](ProductCategory.md)\> | the config of the product category to retrieve. |
| `selector` | [`Selector`](../index.md#selector)<[`ProductCategory`](ProductCategory.md)\> |
| `treeSelector` | [`QuerySelector`](../index.md#queryselector)<[`ProductCategory`](ProductCategory.md)\> |

#### Returns

`Promise`<[`ProductCategory`](ProductCategory.md)\>

-`Promise`: the product category.
	-`ProductCategory`: 

#### Defined in

[packages/medusa/src/services/product-category.ts:102](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L102)

___

### shiftSiblings

`Protected` **shiftSiblings**(`repository`, `conditions`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `repository` | [`TreeRepository`](TreeRepository.md)<[`ProductCategory`](ProductCategory.md)\> & { `addProducts`: Method addProducts ; `findOneWithDescendants`: Method findOneWithDescendants ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `removeProducts`: Method removeProducts  } |
| `conditions` | [`ReorderConditions`](../index.md#reorderconditions) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/product-category.ts:415](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L415)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### transformParentIdToEntity

`Protected` **transformParentIdToEntity**(`productCategoryInput`): `Promise`<[`CreateProductCategoryInput`](../index.md#createproductcategoryinput) \| [`UpdateProductCategoryInput`](../index.md#updateproductcategoryinput)\>

Accepts an input object and transforms product_category_id
into product_category entity.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productCategoryInput` | [`CreateProductCategoryInput`](../index.md#createproductcategoryinput) \| [`UpdateProductCategoryInput`](../index.md#updateproductcategoryinput) | params used to create/update |

#### Returns

`Promise`<[`CreateProductCategoryInput`](../index.md#createproductcategoryinput) \| [`UpdateProductCategoryInput`](../index.md#updateproductcategoryinput)\>

-`Promise`: transformed productCategoryInput
	-`CreateProductCategoryInput \| UpdateProductCategoryInput`: (optional) 

#### Defined in

[packages/medusa/src/services/product-category.ts:513](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L513)

___

### update

**update**(`productCategoryId`, `productCategoryInput`): `Promise`<[`ProductCategory`](ProductCategory.md)\>

Updates a product category

#### Parameters

| Name | Description |
| :------ | :------ |
| `productCategoryId` | `string` | id of product category to update |
| `productCategoryInput` | [`UpdateProductCategoryInput`](../index.md#updateproductcategoryinput) | parameters to update in product category |

#### Returns

`Promise`<[`ProductCategory`](ProductCategory.md)\>

-`Promise`: updated product category
	-`ProductCategory`: 

#### Defined in

[packages/medusa/src/services/product-category.ts:221](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product-category.ts#L221)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ProductCategoryService`](ProductCategoryService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`ProductCategoryService`](ProductCategoryService.md)

-`ProductCategoryService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
