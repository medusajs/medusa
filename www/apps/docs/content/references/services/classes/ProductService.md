# Class: ProductService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductService`**

## Constructors

### constructor

• **new ProductService**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/product.ts:78](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L78)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/product.ts:68](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L68)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/product.ts:69](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L69)

___

### imageRepository\_

• `Protected` `Readonly` **imageRepository\_**: `Repository`<`Image`\> & { `insertBulk`: (`data`: `_QueryDeepPartialEntity`<`Image`\>[]) => `Promise`<`Image`[]\> ; `upsertImages`: (`imageUrls`: `string`[]) => `Promise`<`Image`[]\>  }

#### Defined in

[medusa/src/services/product.ts:63](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L63)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productCategoryRepository\_

• `Protected` `Readonly` **productCategoryRepository\_**: `TreeRepository`<`ProductCategory`\> & { `addProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `findOneWithDescendants`: (`query`: `FindOneOptions`<`ProductCategory`\>, `treeScope`: `QuerySelector`<`ProductCategory`\>) => `Promise`<``null`` \| `ProductCategory`\> ; `getFreeTextSearchResultsAndCount`: (`options`: `ExtendedFindConfig`<`ProductCategory`\>, `q?`: `string`, `treeScope`: `QuerySelector`<`ProductCategory`\>, `includeTree`: `boolean`) => `Promise`<[`ProductCategory`[], `number`]\> ; `removeProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

[medusa/src/services/product.ts:65](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L65)

___

### productOptionRepository\_

• `Protected` `Readonly` **productOptionRepository\_**: `Repository`<`ProductOption`\>

#### Defined in

[medusa/src/services/product.ts:58](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L58)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: `Repository`<`Product`\> & { `_applyCategoriesQuery`: (`qb`: `SelectQueryBuilder`<`Product`\>, `__namedParameters`: `Object`) => `SelectQueryBuilder`<`Product`\> ; `_findWithRelations`: (`__namedParameters`: { `idsOrOptionsWithoutRelations`: `string`[] \| `FindWithoutRelationsOptions` ; `relations`: `string`[] ; `shouldCount`: `boolean` ; `withDeleted`: `boolean`  }) => `Promise`<[`Product`[], `number`]\> ; `bulkAddToCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<`Product`[]\> ; `bulkRemoveFromCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<`Product`[]\> ; `findOneWithRelations`: (`relations`: `string`[], `optionsWithoutRelations`: `FindWithoutRelationsOptions`) => `Promise`<`Product`\> ; `findWithRelations`: (`relations`: `string`[], `idsOrOptionsWithoutRelations`: `string`[] \| `FindWithoutRelationsOptions`, `withDeleted`: `boolean`) => `Promise`<`Product`[]\> ; `findWithRelationsAndCount`: (`relations`: `string`[], `idsOrOptionsWithoutRelations`: `FindWithoutRelationsOptions`) => `Promise`<[`Product`[], `number`]\> ; `getCategoryIdsFromInput`: (`categoryId?`: `CategoryQueryParams`, `includeCategoryChildren`: `boolean`) => `Promise`<`string`[]\> ; `getCategoryIdsRecursively`: (`productCategory`: `ProductCategory`) => `string`[] ; `getFreeTextSearchResultsAndCount`: (`q`: `string`, `options`: `FindWithoutRelationsOptions`, `relations`: `string`[]) => `Promise`<[`Product`[], `number`]\> ; `isProductInSalesChannels`: (`id`: `string`, `salesChannelIds`: `string`[]) => `Promise`<`boolean`\> ; `queryProducts`: (`optionsWithoutRelations`: `FindWithoutRelationsOptions`, `shouldCount`: `boolean`) => `Promise`<[`Product`[], `number`]\> ; `queryProductsWithIds`: (`__namedParameters`: { `entityIds`: `string`[] ; `groupedRelations`: { `[toplevel: string]`: `string`[];  } ; `order?`: { `[column: string]`: ``"ASC"`` \| ``"DESC"``;  } ; `select?`: keyof `Product`[] ; `where?`: `FindOptionsWhere`<`Product`\> ; `withDeleted?`: `boolean`  }) => `Promise`<`Product`[]\>  }

#### Defined in

[medusa/src/services/product.ts:59](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L59)

___

### productTagRepository\_

• `Protected` `Readonly` **productTagRepository\_**: `Repository`<`ProductTag`\> & { `findAndCountByDiscountConditionId`: (`conditionId`: `string`, `query`: `ExtendedFindConfig`<`ProductTag`\>) => `Promise`<[`ProductTag`[], `number`]\> ; `insertBulk`: (`data`: `_QueryDeepPartialEntity`<`ProductTag`\>[]) => `Promise`<`ProductTag`[]\> ; `listTagsByUsage`: (`take`: `number`) => `Promise`<`ProductTag`[]\> ; `upsertTags`: (`tags`: `UpsertTagsInput`) => `Promise`<`ProductTag`[]\>  }

#### Defined in

[medusa/src/services/product.ts:62](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L62)

___

### productTypeRepository\_

• `Protected` `Readonly` **productTypeRepository\_**: `Repository`<`ProductType`\> & { `findAndCountByDiscountConditionId`: (`conditionId`: `string`, `query`: `ExtendedFindConfig`<`ProductType`\>) => `Promise`<[`ProductType`[], `number`]\> ; `upsertType`: (`type?`: `UpsertTypeInput`) => `Promise`<``null`` \| `ProductType`\>  }

#### Defined in

[medusa/src/services/product.ts:61](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L61)

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: `Repository`<`ProductVariant`\>

#### Defined in

[medusa/src/services/product.ts:60](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L60)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/product.ts:66](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L66)

___

### searchService\_

• `Protected` `Readonly` **searchService\_**: [`SearchService`](SearchService.md)

#### Defined in

[medusa/src/services/product.ts:67](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L67)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/product.ts:72](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L72)

___

### IndexName

▪ `Static` `Readonly` **IndexName**: ``"products"``

#### Defined in

[medusa/src/services/product.ts:71](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L71)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addOption

▸ **addOption**(`productId`, `optionTitle`): `Promise`<`Product`\>

Adds an option to a product. Options can, for example, be "Size", "Color",
etc. Will update all the products variants with a dummy value for the newly
created option. The same option cannot be added more than once.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product to apply the new option to |
| `optionTitle` | `string` | the display title of the option, e.g. "Size" |

#### Returns

`Promise`<`Product`\>

the result of the model update operation

#### Defined in

[medusa/src/services/product.ts:697](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L697)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### count

▸ **count**(`selector?`): `Promise`<`number`\>

Return the total number of documents in database

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> | the selector to choose products by |

#### Returns

`Promise`<`number`\>

the result of the count operation

#### Defined in

[medusa/src/services/product.ts:184](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L184)

___

### create

▸ **create**(`productObject`): `Promise`<`Product`\>

Creates a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productObject` | `CreateProductInput` | the product to create |

#### Returns

`Promise`<`Product`\>

resolves to the creation result.

#### Defined in

[medusa/src/services/product.ts:417](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L417)

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

[medusa/src/services/product.ts:658](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L658)

___

### deleteOption

▸ **deleteOption**(`productId`, `optionId`): `Promise`<`void` \| `Product`\>

Delete an option from a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product to delete an option from |
| `optionId` | `string` | the option to delete |

#### Returns

`Promise`<`void` \| `Product`\>

the updated product

#### Defined in

[medusa/src/services/product.ts:862](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L862)

___

### filterProductsBySalesChannel

▸ **filterProductsBySalesChannel**(`productIds`, `salesChannelId`, `config?`): `Promise`<`Product`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productIds` | `string`[] |
| `salesChannelId` | `string` |
| `config` | `FindProductConfig` |

#### Returns

`Promise`<`Product`[]\>

#### Defined in

[medusa/src/services/product.ts:342](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L342)

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

[medusa/src/services/product.ts:395](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L395)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Product`[]\>

Lists products based on the provided parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `ProductSelector` | an object that defines rules to filter products by |
| `config` | `FindProductConfig` | object that defines the scope for what should be returned |

#### Returns

`Promise`<`Product`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/product.ts:115](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L115)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Product`[], `number`]\>

Lists products based on the provided parameters and includes the count of
products that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `ProductSelector` | an object that defines rules to filter products by |
| `config` | `FindProductConfig` | object that defines the scope for what should be returned |

#### Returns

`Promise`<[`Product`[], `number`]\>

an array containing the products as
  the first element and the total count of products that matches the query
  as the second element.

#### Defined in

[medusa/src/services/product.ts:139](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L139)

___

### listTagsByUsage

▸ **listTagsByUsage**(`take?`): `Promise`<`ProductTag`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `take` | `number` | `10` |

#### Returns

`Promise`<`ProductTag`[]\>

#### Defined in

[medusa/src/services/product.ts:381](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L381)

___

### listTypes

▸ **listTypes**(): `Promise`<`ProductType`[]\>

#### Returns

`Promise`<`ProductType`[]\>

#### Defined in

[medusa/src/services/product.ts:373](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L373)

___

### prepareListQuery\_

▸ `Protected` **prepareListQuery_**(`selector`, `config`): `Object`

Temporary method to be used in place we need custom query strategy to prevent typeorm bug

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | `FilterableProductProps` \| `Selector`<`Product`\> |
| `config` | `FindProductConfig` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `q` | `string` |
| `query` | `FindWithoutRelationsOptions` |
| `relations` | keyof `Product`[] |

#### Defined in

[medusa/src/services/product.ts:970](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L970)

___

### reorderVariants

▸ **reorderVariants**(`productId`, `variantOrder`): `Promise`<`Product`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `variantOrder` | `string`[] |

#### Returns

`Promise`<`Product`\>

#### Defined in

[medusa/src/services/product.ts:740](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L740)

___

### retrieve

▸ **retrieve**(`productId`, `config?`): `Promise`<`Product`\>

Gets a product by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | id of the product to get. |
| `config` | `FindProductConfig` | object that defines what should be included in the query response |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[medusa/src/services/product.ts:200](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L200)

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Product`\>

Gets a product by external id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` | handle of the product to get. |
| `config` | `FindProductConfig` | details about what to get from the product |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[medusa/src/services/product.ts:244](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L244)

___

### retrieveByHandle

▸ **retrieveByHandle**(`productHandle`, `config?`): `Promise`<`Product`\>

Gets a product by handle.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productHandle` | `string` | handle of the product to get. |
| `config` | `FindProductConfig` | details about what to get from the product |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[medusa/src/services/product.ts:223](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L223)

___

### retrieveOptionByTitle

▸ **retrieveOptionByTitle**(`title`, `productId`): `Promise`<``null`` \| `ProductOption`\>

Retrieve product's option by title.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `title` | `string` | title of the option |
| `productId` | `string` | id of a product |

#### Returns

`Promise`<``null`` \| `ProductOption`\>

product option

#### Defined in

[medusa/src/services/product.ts:843](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L843)

___

### retrieveVariants

▸ **retrieveVariants**(`productId`, `config?`): `Promise`<`ProductVariant`[]\>

Gets all variants belonging to a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to get variants from. |
| `config` | `FindProductConfig` | The config to select and configure relations etc... |

#### Returns

`Promise`<`ProductVariant`[]\>

an array of variants

#### Defined in

[medusa/src/services/product.ts:324](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L324)

___

### retrieve\_

▸ **retrieve_**(`selector`, `config?`): `Promise`<`Product`\>

Gets a product by selector.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> | selector object |
| `config` | `FindProductConfig` | object that defines what should be included in the query response |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[medusa/src/services/product.ts:266](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L266)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`productId`, `update`): `Promise`<`Product`\>

Updates a product. Product variant updates should use dedicated methods,
e.g. `addVariant`, etc. The function will throw errors if metadata or
product variant updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product. Must be a string that can be casted to an ObjectId |
| `update` | `UpdateProductInput` | an object with the update values. |

#### Returns

`Promise`<`Product`\>

resolves to the update result.

#### Defined in

[medusa/src/services/product.ts:526](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L526)

___

### updateOption

▸ **updateOption**(`productId`, `optionId`, `data`): `Promise`<`Product`\>

Updates a product's option. Throws if the call tries to update an option
not associated with the product. Throws if the updated title already exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product whose option we are updating |
| `optionId` | `string` | the id of the option we are updating |
| `data` | `ProductOptionInput` | the data to update the option with |

#### Returns

`Promise`<`Product`\>

the updated product

#### Defined in

[medusa/src/services/product.ts:786](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L786)

___

### updateShippingProfile

▸ **updateShippingProfile**(`productIds`, `profileId`): `Promise`<`Product`[]\>

Assign a product to a profile, if a profile id null is provided then detach the product from the profile

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productIds` | `string` \| `string`[] | ID or IDs of the products to update |
| `profileId` | ``null`` \| `string` | Shipping profile ID to update the shipping options with |

#### Returns

`Promise`<`Product`[]\>

updated products

#### Defined in

[medusa/src/services/product.ts:933](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/product.ts#L933)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductService`](ProductService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductService`](ProductService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
