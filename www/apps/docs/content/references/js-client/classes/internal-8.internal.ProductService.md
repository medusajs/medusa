---
displayed_sidebar: jsClientSidebar
---

# Class: ProductService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ProductService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ProductService`**

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

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/product.d.ts:40

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/product.d.ts:41

___

### imageRepository\_

• `Protected` `Readonly` **imageRepository\_**: `Repository`<[`Image`](internal-3.Image.md)\> & { `insertBulk`: (`data`: `_QueryDeepPartialEntity`<[`Image`](internal-3.Image.md)\>[]) => `Promise`<[`Image`](internal-3.Image.md)[]\> ; `upsertImages`: (`imageUrls`: `string`[]) => `Promise`<[`Image`](internal-3.Image.md)[]\>  }

#### Defined in

packages/medusa/dist/services/product.d.ts:36

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### productCategoryRepository\_

• `Protected` `Readonly` **productCategoryRepository\_**: `TreeRepository`<[`ProductCategory`](internal-3.ProductCategory.md)\> & { `addProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `findOneWithDescendants`: (`query`: `FindOneOptions`<[`ProductCategory`](internal-3.ProductCategory.md)\>, `treeScope?`: [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\>) => `Promise`<``null`` \| [`ProductCategory`](internal-3.ProductCategory.md)\> ; `getFreeTextSearchResultsAndCount`: (`options?`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`ProductCategory`](internal-3.ProductCategory.md)\>, `q?`: `string`, `treeScope?`: [`QuerySelector`](../modules/internal-8.internal.md#queryselector)<[`ProductCategory`](internal-3.ProductCategory.md)\>, `includeTree?`: `boolean`) => `Promise`<[[`ProductCategory`](internal-3.ProductCategory.md)[], `number`]\> ; `removeProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

packages/medusa/dist/services/product.d.ts:37

___

### productOptionRepository\_

• `Protected` `Readonly` **productOptionRepository\_**: `Repository`<[`ProductOption`](internal-3.ProductOption.md)\>

#### Defined in

packages/medusa/dist/services/product.d.ts:31

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: `Repository`<[`Product`](internal-3.Product.md)\> & { `_applyCategoriesQuery`: (`qb`: `SelectQueryBuilder`<[`Product`](internal-3.Product.md)\>, `__namedParameters`: { `alias`: `any` ; `categoryAlias`: `any` ; `joinName`: `any` ; `where`: `any`  }) => `SelectQueryBuilder`<[`Product`](internal-3.Product.md)\> ; `_findWithRelations`: (`__namedParameters`: { `idsOrOptionsWithoutRelations`: `string`[] \| [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1) ; `relations`: `string`[] ; `shouldCount`: `boolean` ; `withDeleted`: `boolean`  }) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `bulkAddToCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `bulkRemoveFromCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `findOneWithRelations`: (`relations?`: `string`[], `optionsWithoutRelations?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1)) => `Promise`<[`Product`](internal-3.Product.md)\> ; `findWithRelations`: (`relations?`: `string`[], `idsOrOptionsWithoutRelations?`: `string`[] \| [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `withDeleted?`: `boolean`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `findWithRelationsAndCount`: (`relations?`: `string`[], `idsOrOptionsWithoutRelations?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1)) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `getCategoryIdsFromInput`: (`categoryId?`: [`CategoryQueryParams`](../modules/internal-8.md#categoryqueryparams), `includeCategoryChildren?`: `boolean`) => `Promise`<`string`[]\> ; `getCategoryIdsRecursively`: (`productCategory`: [`ProductCategory`](internal-3.ProductCategory.md)) => `string`[] ; `getFreeTextSearchResultsAndCount`: (`q`: `string`, `options?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `relations?`: `string`[]) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `isProductInSalesChannels`: (`id`: `string`, `salesChannelIds`: `string`[]) => `Promise`<`boolean`\> ; `queryProducts`: (`optionsWithoutRelations`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `shouldCount?`: `boolean`) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `queryProductsWithIds`: (`__namedParameters`: { `entityIds`: `string`[] ; `groupedRelations`: { `[toplevel: string]`: `string`[];  } ; `order?`: { `[column: string]`: ``"ASC"`` \| ``"DESC"``;  } ; `select?`: keyof [`Product`](internal-3.Product.md)[] ; `where?`: `FindOptionsWhere`<[`Product`](internal-3.Product.md)\> ; `withDeleted?`: `boolean`  }) => `Promise`<[`Product`](internal-3.Product.md)[]\>  }

#### Defined in

packages/medusa/dist/services/product.d.ts:32

___

### productTagRepository\_

• `Protected` `Readonly` **productTagRepository\_**: `Repository`<[`ProductTag`](internal-3.ProductTag.md)\> & { `findAndCountByDiscountConditionId`: (`conditionId`: `string`, `query`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`ProductTag`](internal-3.ProductTag.md)\>) => `Promise`<[[`ProductTag`](internal-3.ProductTag.md)[], `number`]\> ; `insertBulk`: (`data`: `_QueryDeepPartialEntity`<[`ProductTag`](internal-3.ProductTag.md)\>[]) => `Promise`<[`ProductTag`](internal-3.ProductTag.md)[]\> ; `listTagsByUsage`: (`take?`: `number`) => `Promise`<[`ProductTag`](internal-3.ProductTag.md)[]\> ; `upsertTags`: (`tags`: [`UpsertTagsInput`](../modules/internal-8.md#upserttagsinput)) => `Promise`<[`ProductTag`](internal-3.ProductTag.md)[]\>  }

#### Defined in

packages/medusa/dist/services/product.d.ts:35

___

### productTypeRepository\_

• `Protected` `Readonly` **productTypeRepository\_**: `Repository`<[`ProductType`](internal-3.ProductType.md)\> & { `findAndCountByDiscountConditionId`: (`conditionId`: `string`, `query`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`ProductType`](internal-3.ProductType.md)\>) => `Promise`<[[`ProductType`](internal-3.ProductType.md)[], `number`]\> ; `upsertType`: (`type?`: [`UpsertTypeInput`](../modules/internal-8.md#upserttypeinput)) => `Promise`<``null`` \| [`ProductType`](internal-3.ProductType.md)\>  }

#### Defined in

packages/medusa/dist/services/product.d.ts:34

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: `Repository`<[`ProductVariant`](internal-3.ProductVariant.md)\>

#### Defined in

packages/medusa/dist/services/product.d.ts:33

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](internal-8.internal.ProductVariantService.md)

#### Defined in

packages/medusa/dist/services/product.d.ts:38

___

### searchService\_

• `Protected` `Readonly` **searchService\_**: [`SearchService`](internal-8.internal.SearchService.md)

#### Defined in

packages/medusa/dist/services/product.d.ts:39

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/product.d.ts:43

___

### IndexName

▪ `Static` `Readonly` **IndexName**: ``"products"``

#### Defined in

packages/medusa/dist/services/product.d.ts:42

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

### addOption

▸ **addOption**(`productId`, `optionTitle`): `Promise`<[`Product`](internal-3.Product.md)\>

Adds an option to a product. Options can, for example, be "Size", "Color",
etc. Will update all the products variants with a dummy value for the newly
created option. The same option cannot be added more than once.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product to apply the new option to |
| `optionTitle` | `string` | the display title of the option, e.g. "Size" |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)\>

the result of the model update operation

#### Defined in

packages/medusa/dist/services/product.d.ts:159

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

### count

▸ **count**(`selector?`): `Promise`<`number`\>

Return the total number of documents in database

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Product`](internal-3.Product.md)\> | the selector to choose products by |

#### Returns

`Promise`<`number`\>

the result of the count operation

#### Defined in

packages/medusa/dist/services/product.d.ts:75

___

### create

▸ **create**(`productObject`): `Promise`<[`Product`](internal-3.Product.md)\>

Creates a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productObject` | [`CreateProductInput`](../modules/internal-8.md#createproductinput) | the product to create |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)\>

resolves to the creation result.

#### Defined in

packages/medusa/dist/services/product.d.ts:132

___

### delete

▸ **delete**(`productId`): `Promise`<`void`\>

Deletes a product from a given product id. The product's associated
variants will also be deleted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

packages/medusa/dist/services/product.d.ts:150

___

### deleteOption

▸ **deleteOption**(`productId`, `optionId`): `Promise`<`void` \| [`Product`](internal-3.Product.md)\>

Delete an option from a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product to delete an option from |
| `optionId` | `string` | the option to delete |

#### Returns

`Promise`<`void` \| [`Product`](internal-3.Product.md)\>

the updated product

#### Defined in

packages/medusa/dist/services/product.d.ts:184

___

### filterProductsBySalesChannel

▸ **filterProductsBySalesChannel**(`productIds`, `salesChannelId`, `config?`): `Promise`<[`Product`](internal-3.Product.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productIds` | `string`[] |
| `salesChannelId` | `string` |
| `config?` | [`FindProductConfig`](../modules/internal-8.md#findproductconfig) |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)[]\>

#### Defined in

packages/medusa/dist/services/product.d.ts:117

___

### isProductInSalesChannels

▸ **isProductInSalesChannels**(`id`, `salesChannelIds`): `Promise`<`boolean`\>

Check if the product is assigned to at least one of the provided sales channels.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | product id |
| `salesChannelIds` | `string`[] | an array of sales channel ids |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/medusa/dist/services/product.d.ts:126

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`Product`](internal-3.Product.md)[]\>

Lists products based on the provided parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`ProductSelector`](../modules/internal-8.md#productselector) | an object that defines rules to filter products by |
| `config?` | [`FindProductConfig`](../modules/internal-8.md#findproductconfig) | object that defines the scope for what should be returned |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/product.d.ts:57

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\>

Lists products based on the provided parameters and includes the count of
products that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`ProductSelector`](../modules/internal-8.md#productselector) | an object that defines rules to filter products by |
| `config?` | [`FindProductConfig`](../modules/internal-8.md#findproductconfig) | object that defines the scope for what should be returned |

#### Returns

`Promise`<[[`Product`](internal-3.Product.md)[], `number`]\>

an array containing the products as
  the first element and the total count of products that matches the query
  as the second element.

#### Defined in

packages/medusa/dist/services/product.d.ts:69

___

### listTagsByUsage

▸ **listTagsByUsage**(`take?`): `Promise`<[`ProductTag`](internal-3.ProductTag.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `take?` | `number` |

#### Returns

`Promise`<[`ProductTag`](internal-3.ProductTag.md)[]\>

#### Defined in

packages/medusa/dist/services/product.d.ts:119

___

### listTypes

▸ **listTypes**(): `Promise`<[`ProductType`](internal-3.ProductType.md)[]\>

#### Returns

`Promise`<[`ProductType`](internal-3.ProductType.md)[]\>

#### Defined in

packages/medusa/dist/services/product.d.ts:118

___

### prepareListQuery\_

▸ `Protected` **prepareListQuery_**(`selector`, `config`): `Object`

Temporary method to be used in place we need custom query strategy to prevent typeorm bug

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`FilterableProductProps`](internal-8.FilterableProductProps.md) \| [`Selector`](../modules/internal-8.internal.md#selector)<[`Product`](internal-3.Product.md)\> |
| `config` | [`FindProductConfig`](../modules/internal-8.md#findproductconfig) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `q` | `string` |
| `query` | [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1) |
| `relations` | keyof [`Product`](internal-3.Product.md)[] |

#### Defined in

packages/medusa/dist/services/product.d.ts:198

___

### reorderVariants

▸ **reorderVariants**(`productId`, `variantOrder`): `Promise`<[`Product`](internal-3.Product.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `variantOrder` | `string`[] |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)\>

#### Defined in

packages/medusa/dist/services/product.d.ts:160

___

### retrieve

▸ **retrieve**(`productId`, `config?`): `Promise`<[`Product`](internal-3.Product.md)\>

Gets a product by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | id of the product to get. |
| `config?` | [`FindProductConfig`](../modules/internal-8.md#findproductconfig) | object that defines what should be included in the query response |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)\>

the result of the find one operation.

#### Defined in

packages/medusa/dist/services/product.d.ts:84

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<[`Product`](internal-3.Product.md)\>

Gets a product by external id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` | handle of the product to get. |
| `config?` | [`FindProductConfig`](../modules/internal-8.md#findproductconfig) | details about what to get from the product |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)\>

the result of the find one operation.

#### Defined in

packages/medusa/dist/services/product.d.ts:100

___

### retrieveByHandle

▸ **retrieveByHandle**(`productHandle`, `config?`): `Promise`<[`Product`](internal-3.Product.md)\>

Gets a product by handle.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productHandle` | `string` | handle of the product to get. |
| `config?` | [`FindProductConfig`](../modules/internal-8.md#findproductconfig) | details about what to get from the product |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)\>

the result of the find one operation.

#### Defined in

packages/medusa/dist/services/product.d.ts:92

___

### retrieveOptionByTitle

▸ **retrieveOptionByTitle**(`title`, `productId`): `Promise`<``null`` \| [`ProductOption`](internal-3.ProductOption.md)\>

Retrieve product's option by title.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `title` | `string` | title of the option |
| `productId` | `string` | id of a product |

#### Returns

`Promise`<``null`` \| [`ProductOption`](internal-3.ProductOption.md)\>

product option

#### Defined in

packages/medusa/dist/services/product.d.ts:177

___

### retrieveVariants

▸ **retrieveVariants**(`productId`, `config?`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

Gets all variants belonging to a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to get variants from. |
| `config?` | [`FindProductConfig`](../modules/internal-8.md#findproductconfig) | The config to select and configure relations etc... |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

an array of variants

#### Defined in

packages/medusa/dist/services/product.d.ts:116

___

### retrieve\_

▸ **retrieve_**(`selector`, `config?`): `Promise`<[`Product`](internal-3.Product.md)\>

Gets a product by selector.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Product`](internal-3.Product.md)\> | selector object |
| `config?` | [`FindProductConfig`](../modules/internal-8.md#findproductconfig) | object that defines what should be included in the query response |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)\>

the result of the find one operation.

#### Defined in

packages/medusa/dist/services/product.d.ts:109

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

### update

▸ **update**(`productId`, `update`): `Promise`<[`Product`](internal-3.Product.md)\>

Updates a product. Product variant updates should use dedicated methods,
e.g. `addVariant`, etc. The function will throw errors if metadata or
product variant updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product. Must be a string that can be casted to an ObjectId |
| `update` | [`UpdateProductInput`](../modules/internal-8.md#updateproductinput) | an object with the update values. |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)\>

resolves to the update result.

#### Defined in

packages/medusa/dist/services/product.d.ts:142

___

### updateOption

▸ **updateOption**(`productId`, `optionId`, `data`): `Promise`<[`Product`](internal-3.Product.md)\>

Updates a product's option. Throws if the call tries to update an option
not associated with the product. Throws if the updated title already exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product whose option we are updating |
| `optionId` | `string` | the id of the option we are updating |
| `data` | [`ProductOptionInput`](../modules/internal-8.md#productoptioninput) | the data to update the option with |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)\>

the updated product

#### Defined in

packages/medusa/dist/services/product.d.ts:169

___

### updateShippingProfile

▸ **updateShippingProfile**(`productIds`, `profileId`): `Promise`<[`Product`](internal-3.Product.md)[]\>

Assign a product to a profile, if a profile id null is provided then detach the product from the profile

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productIds` | `string` \| `string`[] | ID or IDs of the products to update |
| `profileId` | ``null`` \| `string` | Shipping profile ID to update the shipping options with |

#### Returns

`Promise`<[`Product`](internal-3.Product.md)[]\>

updated products

#### Defined in

packages/medusa/dist/services/product.d.ts:191

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductService`](internal-8.internal.ProductService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductService`](internal-8.internal.ProductService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
