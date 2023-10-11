---
displayed_sidebar: jsClientSidebar
---

# Class: ProductCategoryService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ProductCategoryService

Provides layer to manipulate product categories.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ProductCategoryService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/product-category.d.ts:18

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### productCategoryRepo\_

• `Protected` `Readonly` **productCategoryRepo\_**: `TreeRepository`<[`ProductCategory`](internal-3.ProductCategory.md)\> & { `addProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `findOneWithDescendants`: (`query`: `FindOneOptions`<[`ProductCategory`](internal-3.ProductCategory.md)\>, `treeScope?`: [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\>) => `Promise`<``null`` \| [`ProductCategory`](internal-3.ProductCategory.md)\> ; `getFreeTextSearchResultsAndCount`: (`options?`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`ProductCategory`](internal-3.ProductCategory.md)\>, `q?`: `string`, `treeScope?`: [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\>, `includeTree?`: `boolean`) => `Promise`<[[`ProductCategory`](internal-3.ProductCategory.md)[], `number`]\> ; `removeProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

packages/medusa/dist/services/product-category.d.ts:17

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

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

packages/medusa/dist/services/product-category.d.ts:19

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

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

packages/medusa/dist/services/product-category.d.ts:90

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### create

▸ **create**(`productCategoryInput`): `Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

Creates a product category

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryInput` | [`CreateProductCategoryInput`](../modules/internal-8.md#createproductcategoryinput) | parameters to create a product category |

#### Returns

`Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

created product category

#### Defined in

packages/medusa/dist/services/product-category.d.ts:69

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

packages/medusa/dist/services/product-category.d.ts:83

___

### fetchReorderConditions

▸ `Protected` **fetchReorderConditions**(`productCategory`, `input`, `shouldDeleteElement?`): [`ReorderConditions`](../modules/internal-8.md#reorderconditions)

#### Parameters

| Name | Type |
| :------ | :------ |
| `productCategory` | [`ProductCategory`](internal-3.ProductCategory.md) |
| `input` | [`UpdateProductCategoryInput`](../modules/internal-8.md#updateproductcategoryinput) |
| `shouldDeleteElement?` | `boolean` |

#### Returns

[`ReorderConditions`](../modules/internal-8.md#reorderconditions)

#### Defined in

packages/medusa/dist/services/product-category.d.ts:98

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`, `treeSelector?`): `Promise`<[[`ProductCategory`](internal-3.ProductCategory.md)[], `number`]\>

Lists product category based on the provided parameters and includes the count of
product category that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`TreeQuerySelector`](../modules/internal-8.internal.md#treequeryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\> | Filter options for product category. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductCategory`](internal-3.ProductCategory.md)\> | Configuration for query. |
| `treeSelector?` | [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\> | Filter options for product category tree relations |

#### Returns

`Promise`<[[`ProductCategory`](internal-3.ProductCategory.md)[], `number`]\>

an array containing the product category as
  the first element and the total count of product category that matches the query
  as the second element.

#### Defined in

packages/medusa/dist/services/product-category.d.ts:35

___

### performReordering

▸ `Protected` **performReordering**(`repository`, `conditions`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `repository` | `TreeRepository`<[`ProductCategory`](internal-3.ProductCategory.md)\> & { `addProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `findOneWithDescendants`: (`query`: `FindOneOptions`<[`ProductCategory`](internal-3.ProductCategory.md)\>, `treeScope?`: [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\>) => `Promise`<``null`` \| [`ProductCategory`](internal-3.ProductCategory.md)\> ; `getFreeTextSearchResultsAndCount`: (`options?`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`ProductCategory`](internal-3.ProductCategory.md)\>, `q?`: `string`, `treeScope?`: [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\>, `includeTree?`: `boolean`) => `Promise`<[[`ProductCategory`](internal-3.ProductCategory.md)[], `number`]\> ; `removeProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  } |
| `conditions` | [`ReorderConditions`](../modules/internal-8.md#reorderconditions) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/product-category.d.ts:99

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

packages/medusa/dist/services/product-category.d.ts:97

___

### retrieve

▸ **retrieve**(`productCategoryId`, `config?`, `selector?`, `treeSelector?`): `Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

Retrieves a product category by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryId` | `string` | the id of the product category to retrieve. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductCategory`](internal-3.ProductCategory.md)\> | the config of the product category to retrieve. |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ProductCategory`](internal-3.ProductCategory.md)\> |  |
| `treeSelector?` | [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\> |  |

#### Returns

`Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

the product category.

#### Defined in

packages/medusa/dist/services/product-category.d.ts:53

___

### retrieveByHandle

▸ **retrieveByHandle**(`handle`, `config?`, `selector?`, `treeSelector?`): `Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

Retrieves a product category by handle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handle` | `string` | the handle of the category |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductCategory`](internal-3.ProductCategory.md)\> | the config of the product category to retrieve. |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ProductCategory`](internal-3.ProductCategory.md)\> |  |
| `treeSelector?` | [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\> |  |

#### Returns

`Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

the product category.

#### Defined in

packages/medusa/dist/services/product-category.d.ts:63

___

### retrieve\_

▸ `Protected` **retrieve_**(`config?`, `selector?`, `treeSelector?`): `Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

A generic retrieve for fining product categories by different attributes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductCategory`](internal-3.ProductCategory.md)\> | the config of the product category to retrieve. |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`ProductCategory`](internal-3.ProductCategory.md)\> |  |
| `treeSelector?` | [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\> |  |

#### Returns

`Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

the product category.

#### Defined in

packages/medusa/dist/services/product-category.d.ts:44

___

### shiftSiblings

▸ `Protected` **shiftSiblings**(`repository`, `conditions`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `repository` | `TreeRepository`<[`ProductCategory`](internal-3.ProductCategory.md)\> & { `addProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `findOneWithDescendants`: (`query`: `FindOneOptions`<[`ProductCategory`](internal-3.ProductCategory.md)\>, `treeScope?`: [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\>) => `Promise`<``null`` \| [`ProductCategory`](internal-3.ProductCategory.md)\> ; `getFreeTextSearchResultsAndCount`: (`options?`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`ProductCategory`](internal-3.ProductCategory.md)\>, `q?`: `string`, `treeScope?`: [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\>, `includeTree?`: `boolean`) => `Promise`<[[`ProductCategory`](internal-3.ProductCategory.md)[], `number`]\> ; `removeProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  } |
| `conditions` | [`ReorderConditions`](../modules/internal-8.md#reorderconditions) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/product-category.d.ts:100

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### transformParentIdToEntity

▸ `Protected` **transformParentIdToEntity**(`productCategoryInput`): `Promise`<[`CreateProductCategoryInput`](../modules/internal-8.md#createproductcategoryinput) \| [`UpdateProductCategoryInput`](../modules/internal-8.md#updateproductcategoryinput)\>

Accepts an input object and transforms product_category_id
into product_category entity.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryInput` | [`CreateProductCategoryInput`](../modules/internal-8.md#createproductcategoryinput) \| [`UpdateProductCategoryInput`](../modules/internal-8.md#updateproductcategoryinput) | params used to create/update |

#### Returns

`Promise`<[`CreateProductCategoryInput`](../modules/internal-8.md#createproductcategoryinput) \| [`UpdateProductCategoryInput`](../modules/internal-8.md#updateproductcategoryinput)\>

transformed productCategoryInput

#### Defined in

packages/medusa/dist/services/product-category.d.ts:107

___

### update

▸ **update**(`productCategoryId`, `productCategoryInput`): `Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

Updates a product category

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productCategoryId` | `string` | id of product category to update |
| `productCategoryInput` | [`UpdateProductCategoryInput`](../modules/internal-8.md#updateproductcategoryinput) | parameters to update in product category |

#### Returns

`Promise`<[`ProductCategory`](internal-3.ProductCategory.md)\>

updated product category

#### Defined in

packages/medusa/dist/services/product-category.d.ts:76

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductCategoryService`](internal-8.internal.ProductCategoryService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductCategoryService`](internal-8.internal.ProductCategoryService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
