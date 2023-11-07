# ProductService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductService`**

## Constructors

### constructor

**new ProductService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/product.ts:81](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L81)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/product.ts:71](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L71)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/product.ts:72](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L72)

___

### imageRepository\_

 `Protected` `Readonly` **imageRepository\_**: `Repository`<`Image`\> & { `insertBulk`: Method insertBulk ; `upsertImages`: Method upsertImages  }

#### Defined in

[medusa/src/services/product.ts:66](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L66)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productCategoryRepository\_

 `Protected` `Readonly` **productCategoryRepository\_**: `TreeRepository`<`ProductCategory`\> & { `addProducts`: Method addProducts ; `findOneWithDescendants`: Method findOneWithDescendants ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `removeProducts`: Method removeProducts  }

#### Defined in

[medusa/src/services/product.ts:68](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L68)

___

### productOptionRepository\_

 `Protected` `Readonly` **productOptionRepository\_**: `Repository`<`ProductOption`\>

#### Defined in

[medusa/src/services/product.ts:61](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L61)

___

### productRepository\_

 `Protected` `Readonly` **productRepository\_**: `Repository`<`Product`\> & { `_applyCategoriesQuery`: Method \_applyCategoriesQuery ; `_findWithRelations`: Method \_findWithRelations ; `bulkAddToCollection`: Method bulkAddToCollection ; `bulkRemoveFromCollection`: Method bulkRemoveFromCollection ; `findOneWithRelations`: Method findOneWithRelations ; `findWithRelations`: Method findWithRelations ; `findWithRelationsAndCount`: Method findWithRelationsAndCount ; `getCategoryIdsFromInput`: Method getCategoryIdsFromInput ; `getCategoryIdsRecursively`: Method getCategoryIdsRecursively ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `isProductInSalesChannels`: Method isProductInSalesChannels ; `queryProducts`: Method queryProducts ; `queryProductsWithIds`: Method queryProductsWithIds  }

#### Defined in

[medusa/src/services/product.ts:62](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L62)

___

### productTagRepository\_

 `Protected` `Readonly` **productTagRepository\_**: `Repository`<`ProductTag`\> & { `findAndCountByDiscountConditionId`: Method findAndCountByDiscountConditionId ; `insertBulk`: Method insertBulk ; `listTagsByUsage`: Method listTagsByUsage ; `upsertTags`: Method upsertTags  }

#### Defined in

[medusa/src/services/product.ts:65](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L65)

___

### productTypeRepository\_

 `Protected` `Readonly` **productTypeRepository\_**: `Repository`<`ProductType`\> & { `findAndCountByDiscountConditionId`: Method findAndCountByDiscountConditionId ; `upsertType`: Method upsertType  }

#### Defined in

[medusa/src/services/product.ts:64](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L64)

___

### productVariantRepository\_

 `Protected` `Readonly` **productVariantRepository\_**: `Repository`<`ProductVariant`\>

#### Defined in

[medusa/src/services/product.ts:63](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L63)

___

### productVariantService\_

 `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/product.ts:69](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L69)

___

### searchService\_

 `Protected` `Readonly` **searchService\_**: [`SearchService`](SearchService.md)

#### Defined in

[medusa/src/services/product.ts:70](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L70)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/product.ts:75](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L75)

___

### IndexName

 `Static` `Readonly` **IndexName**: ``"products"``

#### Defined in

[medusa/src/services/product.ts:74](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L74)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addOption

**addOption**(`productId`, `optionTitle`): `Promise`<`Product`\>

Adds an option to a product. Options can, for example, be "Size", "Color",
etc. Will update all the products variants with a dummy value for the newly
created option. The same option cannot be added more than once.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the product to apply the new option to |
| `optionTitle` | `string` | the display title of the option, e.g. "Size" |

#### Returns

`Promise`<`Product`\>

-`Promise`: the result of the model update operation
	-`Product`: 

#### Defined in

[medusa/src/services/product.ts:722](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L722)

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
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### count

**count**(`selector?`): `Promise`<`number`\>

Return the total number of documents in database

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `Selector`<`Product`\> | the selector to choose products by |

#### Returns

`Promise`<`number`\>

-`Promise`: the result of the count operation
	-`number`: (optional) 

#### Defined in

[medusa/src/services/product.ts:187](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L187)

___

### create

**create**(`productObject`): `Promise`<`Product`\>

Creates a product.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productObject` | `CreateProductInput` | the product to create |

#### Returns

`Promise`<`Product`\>

-`Promise`: resolves to the creation result.
	-`Product`: 

#### Defined in

[medusa/src/services/product.ts:420](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L420)

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

[medusa/src/services/product.ts:683](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L683)

___

### deleteOption

**deleteOption**(`productId`, `optionId`): `Promise`<`void` \| `Product`\>

Delete an option from a product.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the product to delete an option from |
| `optionId` | `string` | the option to delete |

#### Returns

`Promise`<`void` \| `Product`\>

-`Promise`: the updated product
	-`void \| Product`: (optional) 

#### Defined in

[medusa/src/services/product.ts:887](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L887)

___

### filterProductsBySalesChannel

**filterProductsBySalesChannel**(`productIds`, `salesChannelId`, `config?`): `Promise`<`Product`[]\>

#### Parameters

| Name |
| :------ |
| `productIds` | `string`[] |
| `salesChannelId` | `string` |
| `config` | `FindProductConfig` |

#### Returns

`Promise`<`Product`[]\>

-`Promise`: 
	-`Product[]`: 
		-`Product`: 

#### Defined in

[medusa/src/services/product.ts:345](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L345)

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

[medusa/src/services/product.ts:398](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L398)

___

### list

**list**(`selector`, `config?`): `Promise`<`Product`[]\>

Lists products based on the provided parameters.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `ProductSelector` | an object that defines rules to filter products by |
| `config` | `FindProductConfig` | object that defines the scope for what should be returned |

#### Returns

`Promise`<`Product`[]\>

-`Promise`: the result of the find operation
	-`Product[]`: 
		-`Product`: 

#### Defined in

[medusa/src/services/product.ts:118](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L118)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[`Product`[], `number`]\>

Lists products based on the provided parameters and includes the count of
products that match the query.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `ProductSelector` | an object that defines rules to filter products by |
| `config` | `FindProductConfig` | object that defines the scope for what should be returned |

#### Returns

`Promise`<[`Product`[], `number`]\>

-`Promise`: an array containing the products as
  the first element and the total count of products that matches the query
  as the second element.
	-`Product[]`: 
	-`number`: (optional) 

#### Defined in

[medusa/src/services/product.ts:142](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L142)

___

### listTagsByUsage

**listTagsByUsage**(`take?`): `Promise`<`ProductTag`[]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `take` | `number` | `10` |

#### Returns

`Promise`<`ProductTag`[]\>

-`Promise`: 
	-`ProductTag[]`: 
		-`ProductTag`: 

#### Defined in

[medusa/src/services/product.ts:384](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L384)

___

### listTypes

**listTypes**(): `Promise`<`ProductType`[]\>

#### Returns

`Promise`<`ProductType`[]\>

-`Promise`: 
	-`ProductType[]`: 
		-`ProductType`: 

#### Defined in

[medusa/src/services/product.ts:376](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L376)

___

### prepareListQuery\_

`Protected` **prepareListQuery_**(`selector`, `config`): { `q`: `string` ; `query`: `FindWithoutRelationsOptions` ; `relations`: keyof `Product`[]  }

Temporary method to be used in place we need custom query strategy to prevent typeorm bug

#### Parameters

| Name |
| :------ |
| `selector` | `FilterableProductProps` \| `Selector`<`Product`\> |
| `config` | `FindProductConfig` |

#### Returns

`object`

-``object``: (optional) 

| Name | Type |
| :------ | :------ |
| `q` | `string` |
| `query` | `FindWithoutRelationsOptions` |
| `relations` | keyof `Product`[] |

#### Defined in

[medusa/src/services/product.ts:995](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L995)

___

### reorderVariants

**reorderVariants**(`productId`, `variantOrder`): `Promise`<`Product`\>

#### Parameters

| Name |
| :------ |
| `productId` | `string` |
| `variantOrder` | `string`[] |

#### Returns

`Promise`<`Product`\>

-`Promise`: 
	-`Product`: 

#### Defined in

[medusa/src/services/product.ts:765](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L765)

___

### retrieve

**retrieve**(`productId`, `config?`): `Promise`<`Product`\>

Gets a product by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | id of the product to get. |
| `config` | `FindProductConfig` | object that defines what should be included in the query response |

#### Returns

`Promise`<`Product`\>

-`Promise`: the result of the find one operation.
	-`Product`: 

#### Defined in

[medusa/src/services/product.ts:203](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L203)

___

### retrieveByExternalId

**retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Product`\>

Gets a product by external id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `externalId` | `string` | handle of the product to get. |
| `config` | `FindProductConfig` | details about what to get from the product |

#### Returns

`Promise`<`Product`\>

-`Promise`: the result of the find one operation.
	-`Product`: 

#### Defined in

[medusa/src/services/product.ts:247](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L247)

___

### retrieveByHandle

**retrieveByHandle**(`productHandle`, `config?`): `Promise`<`Product`\>

Gets a product by handle.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productHandle` | `string` | handle of the product to get. |
| `config` | `FindProductConfig` | details about what to get from the product |

#### Returns

`Promise`<`Product`\>

-`Promise`: the result of the find one operation.
	-`Product`: 

#### Defined in

[medusa/src/services/product.ts:226](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L226)

___

### retrieveOptionByTitle

**retrieveOptionByTitle**(`title`, `productId`): `Promise`<``null`` \| `ProductOption`\>

Retrieve product's option by title.

#### Parameters

| Name | Description |
| :------ | :------ |
| `title` | `string` | title of the option |
| `productId` | `string` | id of a product |

#### Returns

`Promise`<``null`` \| `ProductOption`\>

-`Promise`: product option
	-```null`` \| ProductOption`: (optional) 

#### Defined in

[medusa/src/services/product.ts:868](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L868)

___

### retrieveVariants

**retrieveVariants**(`productId`, `config?`): `Promise`<`ProductVariant`[]\>

Gets all variants belonging to a product.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the id of the product to get variants from. |
| `config` | `FindProductConfig` | The config to select and configure relations etc... |

#### Returns

`Promise`<`ProductVariant`[]\>

-`Promise`: an array of variants
	-`ProductVariant[]`: 
		-`ProductVariant`: 

#### Defined in

[medusa/src/services/product.ts:327](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L327)

___

### retrieve\_

**retrieve_**(`selector`, `config?`): `Promise`<`Product`\>

Gets a product by selector.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `Selector`<`Product`\> | selector object |
| `config` | `FindProductConfig` | object that defines what should be included in the query response |

#### Returns

`Promise`<`Product`\>

-`Promise`: the result of the find one operation.
	-`Product`: 

#### Defined in

[medusa/src/services/product.ts:269](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L269)

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

TransactionBaseService.shouldRetryTransaction\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`productId`, `update`): `Promise`<`Product`\>

Updates a product. Product variant updates should use dedicated methods,
e.g. `addVariant`, etc. The function will throw errors if metadata or
product variant updates are attempted.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the id of the product. Must be a string that can be casted to an ObjectId |
| `update` | `UpdateProductInput` | an object with the update values. |

#### Returns

`Promise`<`Product`\>

-`Promise`: resolves to the update result.
	-`Product`: 

#### Defined in

[medusa/src/services/product.ts:551](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L551)

___

### updateOption

**updateOption**(`productId`, `optionId`, `data`): `Promise`<`Product`\>

Updates a product's option. Throws if the call tries to update an option
not associated with the product. Throws if the updated title already exists.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the product whose option we are updating |
| `optionId` | `string` | the id of the option we are updating |
| `data` | `ProductOptionInput` | the data to update the option with |

#### Returns

`Promise`<`Product`\>

-`Promise`: the updated product
	-`Product`: 

#### Defined in

[medusa/src/services/product.ts:811](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L811)

___

### updateShippingProfile

**updateShippingProfile**(`productIds`, `profileId`): `Promise`<`Product`[]\>

Assign a product to a profile, if a profile id null is provided then detach the product from the profile

#### Parameters

| Name | Description |
| :------ | :------ |
| `productIds` | `string` \| `string`[] | ID or IDs of the products to update |
| `profileId` | ``null`` \| `string` | Shipping profile ID to update the shipping options with |

#### Returns

`Promise`<`Product`[]\>

-`Promise`: updated products
	-`Product[]`: 
		-`Product`: 

#### Defined in

[medusa/src/services/product.ts:958](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/product.ts#L958)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ProductService`](ProductService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductService`](ProductService.md)

-`ProductService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
