# ProductService

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`ProductService`**

## Constructors

### constructor

**new ProductService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../index.md#injecteddependencies-26) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/product.ts:82](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L82)

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

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/product.ts:72](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L72)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](FlagRouter.md)

#### Defined in

[packages/medusa/src/services/product.ts:73](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L73)

___

### imageRepository\_

 `Protected` `Readonly` **imageRepository\_**: [`Repository`](Repository.md)<[`Image`](Image.md)\> & { `insertBulk`: Method insertBulk ; `upsertImages`: Method upsertImages  }

#### Defined in

[packages/medusa/src/services/product.ts:67](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L67)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productCategoryRepository\_

 `Protected` `Readonly` **productCategoryRepository\_**: [`TreeRepository`](TreeRepository.md)<[`ProductCategory`](ProductCategory.md)\> & { `addProducts`: Method addProducts ; `findOneWithDescendants`: Method findOneWithDescendants ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `removeProducts`: Method removeProducts  }

#### Defined in

[packages/medusa/src/services/product.ts:69](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L69)

___

### productOptionRepository\_

 `Protected` `Readonly` **productOptionRepository\_**: [`Repository`](Repository.md)<[`ProductOption`](ProductOption.md)\>

#### Defined in

[packages/medusa/src/services/product.ts:62](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L62)

___

### productRepository\_

 `Protected` `Readonly` **productRepository\_**: [`Repository`](Repository.md)<[`Product`](Product.md)\> & { `_applyCategoriesQuery`: Method \_applyCategoriesQuery ; `_findWithRelations`: Method \_findWithRelations ; `bulkAddToCollection`: Method bulkAddToCollection ; `bulkRemoveFromCollection`: Method bulkRemoveFromCollection ; `findOneWithRelations`: Method findOneWithRelations ; `findWithRelations`: Method findWithRelations ; `findWithRelationsAndCount`: Method findWithRelationsAndCount ; `getCategoryIdsFromInput`: Method getCategoryIdsFromInput ; `getCategoryIdsRecursively`: Method getCategoryIdsRecursively ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `isProductInSalesChannels`: Method isProductInSalesChannels ; `queryProducts`: Method queryProducts ; `queryProductsWithIds`: Method queryProductsWithIds  }

#### Defined in

[packages/medusa/src/services/product.ts:63](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L63)

___

### productTagRepository\_

 `Protected` `Readonly` **productTagRepository\_**: [`Repository`](Repository.md)<[`ProductTag`](ProductTag.md)\> & { `findAndCountByDiscountConditionId`: Method findAndCountByDiscountConditionId ; `insertBulk`: Method insertBulk ; `listTagsByUsage`: Method listTagsByUsage ; `upsertTags`: Method upsertTags  }

#### Defined in

[packages/medusa/src/services/product.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L66)

___

### productTypeRepository\_

 `Protected` `Readonly` **productTypeRepository\_**: [`Repository`](Repository.md)<[`ProductType`](ProductType.md)\> & { `findAndCountByDiscountConditionId`: Method findAndCountByDiscountConditionId ; `upsertType`: Method upsertType  }

#### Defined in

[packages/medusa/src/services/product.ts:65](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L65)

___

### productVariantRepository\_

 `Protected` `Readonly` **productVariantRepository\_**: [`Repository`](Repository.md)<[`ProductVariant`](ProductVariant.md)\>

#### Defined in

[packages/medusa/src/services/product.ts:64](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L64)

___

### productVariantService\_

 `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/product.ts:70](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L70)

___

### searchService\_

 `Protected` `Readonly` **searchService\_**: [`SearchService`](SearchService.md)

#### Defined in

[packages/medusa/src/services/product.ts:71](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L71)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` `Readonly` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[packages/medusa/src/services/product.ts:76](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L76)

___

### IndexName

 `Static` `Readonly` **IndexName**: ``"products"``

#### Defined in

[packages/medusa/src/services/product.ts:75](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L75)

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

### addOption

**addOption**(`productId`, `optionTitle`): `Promise`<[`Product`](Product.md)\>

Adds an option to a product. Options can, for example, be "Size", "Color",
etc. Will update all the products variants with a dummy value for the newly
created option. The same option cannot be added more than once.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the product to apply the new option to |
| `optionTitle` | `string` | the display title of the option, e.g. "Size" |

#### Returns

`Promise`<[`Product`](Product.md)\>

-`Promise`: the result of the model update operation
	-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:723](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L723)

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

### count

**count**(`selector?`): `Promise`<`number`\>

Return the total number of documents in database

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Product`](Product.md)\> | the selector to choose products by |

#### Returns

`Promise`<`number`\>

-`Promise`: the result of the count operation
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/product.ts:188](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L188)

___

### create

**create**(`productObject`): `Promise`<[`Product`](Product.md)\>

Creates a product.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productObject` | [`CreateProductInput`](../index.md#createproductinput) | the product to create |

#### Returns

`Promise`<[`Product`](Product.md)\>

-`Promise`: resolves to the creation result.
	-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:421](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L421)

___

### delete

**delete**(`productId`): `Promise`<`void`\>

Deletes a product from a given product id. The product's associated
variants will also be deleted.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the id of the product to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void`\>

-`Promise`: empty promise

#### Defined in

[packages/medusa/src/services/product.ts:684](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L684)

___

### deleteOption

**deleteOption**(`productId`, `optionId`): `Promise`<`void` \| [`Product`](Product.md)\>

Delete an option from a product.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the product to delete an option from |
| `optionId` | `string` | the option to delete |

#### Returns

`Promise`<`void` \| [`Product`](Product.md)\>

-`Promise`: the updated product
	-`void \| Product`: (optional) 

#### Defined in

[packages/medusa/src/services/product.ts:888](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L888)

___

### filterProductsBySalesChannel

**filterProductsBySalesChannel**(`productIds`, `salesChannelId`, `config?`): `Promise`<[`Product`](Product.md)[]\>

#### Parameters

| Name |
| :------ |
| `productIds` | `string`[] |
| `salesChannelId` | `string` |
| `config` | [`FindProductConfig`](../index.md#findproductconfig) |

#### Returns

`Promise`<[`Product`](Product.md)[]\>

-`Promise`: 
	-`Product[]`: 
		-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:346](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L346)

___

### isProductInSalesChannels

**isProductInSalesChannels**(`id`, `salesChannelIds`): `Promise`<`boolean`\>

Check if the product is assigned to at least one of the provided sales channels.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | product id |
| `salesChannelIds` | `string`[] | an array of sales channel ids |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[packages/medusa/src/services/product.ts:399](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L399)

___

### list

**list**(`selector`, `config?`): `Promise`<[`Product`](Product.md)[]\>

Lists products based on the provided parameters.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`ProductSelector`](../index.md#productselector) | an object that defines rules to filter products by |
| `config` | [`FindProductConfig`](../index.md#findproductconfig) | object that defines the scope for what should be returned |

#### Returns

`Promise`<[`Product`](Product.md)[]\>

-`Promise`: the result of the find operation
	-`Product[]`: 
		-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:119](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L119)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[[`Product`](Product.md)[], `number`]\>

Lists products based on the provided parameters and includes the count of
products that match the query.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`ProductSelector`](../index.md#productselector) | an object that defines rules to filter products by |
| `config` | [`FindProductConfig`](../index.md#findproductconfig) | object that defines the scope for what should be returned |

#### Returns

`Promise`<[[`Product`](Product.md)[], `number`]\>

-`Promise`: an array containing the products as
  the first element and the total count of products that matches the query
  as the second element.
	-`Product[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/product.ts:143](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L143)

___

### listTagsByUsage

**listTagsByUsage**(`take?`): `Promise`<[`ProductTag`](ProductTag.md)[]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `take` | `number` | 10 |

#### Returns

`Promise`<[`ProductTag`](ProductTag.md)[]\>

-`Promise`: 
	-`ProductTag[]`: 
		-`ProductTag`: 

#### Defined in

[packages/medusa/src/services/product.ts:385](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L385)

___

### listTypes

**listTypes**(): `Promise`<[`ProductType`](ProductType.md)[]\>

#### Returns

`Promise`<[`ProductType`](ProductType.md)[]\>

-`Promise`: 
	-`ProductType[]`: 
		-`ProductType`: 

#### Defined in

[packages/medusa/src/services/product.ts:377](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L377)

___

### prepareListQuery\_

`Protected` **prepareListQuery_**(`selector`, `config`): { `q`: `string` ; `query`: [`FindWithoutRelationsOptions`](../index.md#findwithoutrelationsoptions-1) ; `relations`: keyof [`Product`](Product.md)[]  }

Temporary method to be used in place we need custom query strategy to prevent typeorm bug

#### Parameters

| Name |
| :------ |
| `selector` | [`FilterableProductProps`](FilterableProductProps.md) \| [`Selector`](../index.md#selector)<[`Product`](Product.md)\> |
| `config` | [`FindProductConfig`](../index.md#findproductconfig) |

#### Returns

`object`

-``object``: (optional) 

| Name | Type |
| :------ | :------ |
| `q` | `string` |
| `query` | [`FindWithoutRelationsOptions`](../index.md#findwithoutrelationsoptions-1) |
| `relations` | keyof [`Product`](Product.md)[] |

#### Defined in

[packages/medusa/src/services/product.ts:996](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L996)

___

### reorderVariants

**reorderVariants**(`productId`, `variantOrder`): `Promise`<[`Product`](Product.md)\>

#### Parameters

| Name |
| :------ |
| `productId` | `string` |
| `variantOrder` | `string`[] |

#### Returns

`Promise`<[`Product`](Product.md)\>

-`Promise`: 
	-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:766](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L766)

___

### retrieve

**retrieve**(`productId`, `config?`): `Promise`<[`Product`](Product.md)\>

Gets a product by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | id of the product to get. |
| `config` | [`FindProductConfig`](../index.md#findproductconfig) | object that defines what should be included in the query response |

#### Returns

`Promise`<[`Product`](Product.md)\>

-`Promise`: the result of the find one operation.
	-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:204](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L204)

___

### retrieveByExternalId

**retrieveByExternalId**(`externalId`, `config?`): `Promise`<[`Product`](Product.md)\>

Gets a product by external id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `externalId` | `string` | handle of the product to get. |
| `config` | [`FindProductConfig`](../index.md#findproductconfig) | details about what to get from the product |

#### Returns

`Promise`<[`Product`](Product.md)\>

-`Promise`: the result of the find one operation.
	-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:248](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L248)

___

### retrieveByHandle

**retrieveByHandle**(`productHandle`, `config?`): `Promise`<[`Product`](Product.md)\>

Gets a product by handle.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productHandle` | `string` | handle of the product to get. |
| `config` | [`FindProductConfig`](../index.md#findproductconfig) | details about what to get from the product |

#### Returns

`Promise`<[`Product`](Product.md)\>

-`Promise`: the result of the find one operation.
	-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:227](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L227)

___

### retrieveOptionByTitle

**retrieveOptionByTitle**(`title`, `productId`): `Promise`<``null`` \| [`ProductOption`](ProductOption.md)\>

Retrieve product's option by title.

#### Parameters

| Name | Description |
| :------ | :------ |
| `title` | `string` | title of the option |
| `productId` | `string` | id of a product |

#### Returns

`Promise`<``null`` \| [`ProductOption`](ProductOption.md)\>

-`Promise`: product option
	-```null`` \| ProductOption`: (optional) 

#### Defined in

[packages/medusa/src/services/product.ts:869](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L869)

___

### retrieveVariants

**retrieveVariants**(`productId`, `config?`): `Promise`<[`ProductVariant`](ProductVariant.md)[]\>

Gets all variants belonging to a product.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the id of the product to get variants from. |
| `config` | [`FindProductConfig`](../index.md#findproductconfig) | The config to select and configure relations etc... |

#### Returns

`Promise`<[`ProductVariant`](ProductVariant.md)[]\>

-`Promise`: an array of variants
	-`ProductVariant[]`: 
		-`ProductVariant`: 

#### Defined in

[packages/medusa/src/services/product.ts:328](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L328)

___

### retrieve\_

**retrieve_**(`selector`, `config?`): `Promise`<[`Product`](Product.md)\>

Gets a product by selector.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`Selector`](../index.md#selector)<[`Product`](Product.md)\> | selector object |
| `config` | [`FindProductConfig`](../index.md#findproductconfig) | object that defines what should be included in the query response |

#### Returns

`Promise`<[`Product`](Product.md)\>

-`Promise`: the result of the find one operation.
	-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:270](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L270)

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

### update

**update**(`productId`, `update`): `Promise`<[`Product`](Product.md)\>

Updates a product. Product variant updates should use dedicated methods,
e.g. `addVariant`, etc. The function will throw errors if metadata or
product variant updates are attempted.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the id of the product. Must be a string that can be casted to an ObjectId |
| `update` | [`UpdateProductInput`](../index.md#updateproductinput) | an object with the update values. |

#### Returns

`Promise`<[`Product`](Product.md)\>

-`Promise`: resolves to the update result.
	-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:552](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L552)

___

### updateOption

**updateOption**(`productId`, `optionId`, `data`): `Promise`<[`Product`](Product.md)\>

Updates a product's option. Throws if the call tries to update an option
not associated with the product. Throws if the updated title already exists.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the product whose option we are updating |
| `optionId` | `string` | the id of the option we are updating |
| `data` | [`ProductOptionInput`](../index.md#productoptioninput) | the data to update the option with |

#### Returns

`Promise`<[`Product`](Product.md)\>

-`Promise`: the updated product
	-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:812](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L812)

___

### updateShippingProfile

**updateShippingProfile**(`productIds`, `profileId`): `Promise`<[`Product`](Product.md)[]\>

Assign a product to a profile, if a profile id null is provided then detach the product from the profile

#### Parameters

| Name | Description |
| :------ | :------ |
| `productIds` | `string` \| `string`[] | ID or IDs of the products to update |
| `profileId` | ``null`` \| `string` | Shipping profile ID to update the shipping options with |

#### Returns

`Promise`<[`Product`](Product.md)[]\>

-`Promise`: updated products
	-`Product[]`: 
		-`Product`: 

#### Defined in

[packages/medusa/src/services/product.ts:959](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/product.ts#L959)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ProductService`](ProductService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`ProductService`](ProductService.md)

-`ProductService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
