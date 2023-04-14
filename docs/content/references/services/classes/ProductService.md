# Class: ProductService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductService`**

## Constructors

### constructor

• **new ProductService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/product.ts:71](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L71)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/product.ts:61](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L61)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/product.ts:62](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L62)

___

### imageRepository\_

• `Protected` `Readonly` **imageRepository\_**: `Repository`<`Image`\> & { `insertBulk`: (`data`: `_QueryDeepPartialEntity`<`Image`\>[]) => `Promise`<`Image`[]\> ; `upsertImages`: (`imageUrls`: `string`[]) => `Promise`<`Image`[]\>  }

#### Defined in

[medusa/src/services/product.ts:56](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L56)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### productCategoryRepository\_

• `Protected` `Readonly` **productCategoryRepository\_**: `TreeRepository`<`ProductCategory`\> & { `addProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`void`\> ; `findOneWithDescendants`: (`query`: `FindOneOptions`<`ProductCategory`\>, `treeScope`: `QuerySelector`<`ProductCategory`\>) => `Promise`<``null`` \| `ProductCategory`\> ; `getFreeTextSearchResultsAndCount`: (`options`: `ExtendedFindConfig`<`ProductCategory`\>, `q?`: `string`, `treeScope`: `QuerySelector`<`ProductCategory`\>, `includeTree`: `boolean`) => `Promise`<[`ProductCategory`[], `number`]\> ; `removeProducts`: (`productCategoryId`: `string`, `productIds`: `string`[]) => `Promise`<`DeleteResult`\>  }

#### Defined in

[medusa/src/services/product.ts:58](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L58)

___

### productOptionRepository\_

• `Protected` `Readonly` **productOptionRepository\_**: `Repository`<`ProductOption`\>

#### Defined in

[medusa/src/services/product.ts:51](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L51)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: `Repository`<`Product`\> & { `bulkAddToCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<`Product`[]\> ; `bulkRemoveFromCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<`Product`[]\> ; `findAndCount`: (`options`: `ExtendedFindConfig`<`Product` & `ProductFilterOptions`\>, `q?`: `string`) => `Promise`<[`Product`[], `number`]\> ; `findOne`: (`options`: `ExtendedFindConfig`<`Product` & `ProductFilterOptions`\>) => `Promise`<``null`` \| `Product`\> ; `isProductInSalesChannels`: (`id`: `string`, `salesChannelIds`: `string`[]) => `Promise`<`boolean`\> ; `prepareQueryBuilder_`: (`options`: `ExtendedFindConfig`<`Product` & `ProductFilterOptions`\>, `q?`: `string`) => `Promise`<`SelectQueryBuilder`<`Product`\>\> ; `upsertShippingProfile`: (`productIds`: `string`[], `shippingProfileId`: `string`) => `Promise`<`Product`[]\>  }

#### Defined in

[medusa/src/services/product.ts:52](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L52)

___

### productTagRepository\_

• `Protected` `Readonly` **productTagRepository\_**: `Repository`<`ProductTag`\> & { `findAndCountByDiscountConditionId`: (`conditionId`: `string`, `query`: `ExtendedFindConfig`<`ProductTag`\>) => `Promise`<[`ProductTag`[], `number`]\> ; `insertBulk`: (`data`: `_QueryDeepPartialEntity`<`ProductTag`\>[]) => `Promise`<`ProductTag`[]\> ; `listTagsByUsage`: (`take`: `number`) => `Promise`<`ProductTag`[]\> ; `upsertTags`: (`tags`: `UpsertTagsInput`) => `Promise`<`ProductTag`[]\>  }

#### Defined in

[medusa/src/services/product.ts:55](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L55)

___

### productTypeRepository\_

• `Protected` `Readonly` **productTypeRepository\_**: `Repository`<`ProductType`\> & { `findAndCountByDiscountConditionId`: (`conditionId`: `string`, `query`: `ExtendedFindConfig`<`ProductType`\>) => `Promise`<[`ProductType`[], `number`]\> ; `upsertType`: (`type?`: `UpsertTypeInput`) => `Promise`<``null`` \| `ProductType`\>  }

#### Defined in

[medusa/src/services/product.ts:54](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L54)

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: `Repository`<`ProductVariant`\>

#### Defined in

[medusa/src/services/product.ts:53](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L53)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/product.ts:59](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L59)

___

### searchService\_

• `Protected` `Readonly` **searchService\_**: [`SearchService`](SearchService.md)

#### Defined in

[medusa/src/services/product.ts:60](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L60)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/product.ts:65](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L65)

___

### IndexName

▪ `Static` `Readonly` **IndexName**: ``"products"``

#### Defined in

[medusa/src/services/product.ts:64](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L64)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/services/product.ts:637](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L637)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/product.ts:158](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L158)

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

[medusa/src/services/product.ts:365](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L365)

___

### delete

▸ **delete**(`productId`): `Promise`<`void`\>

Deletes a product from a given product id. The product's associated
variants will also be deleted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

[medusa/src/services/product.ts:598](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L598)

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

[medusa/src/services/product.ts:802](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L802)

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

[medusa/src/services/product.ts:290](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L290)

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

[medusa/src/services/product.ts:343](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L343)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`Product`[]\>

Lists products based on the provided parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `ProductSelector` | an object that defines rules to filter products   by |
| `config` | `FindProductConfig` | object that defines the scope for what should be   returned |

#### Returns

`Promise`<`Product`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/product.ts:108](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L108)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`Product`[], `number`]\>

Lists products based on the provided parameters and includes the count of
products that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `ProductSelector` | an object that defines rules to filter products   by |
| `config` | `FindProductConfig` | object that defines the scope for what should be   returned |

#### Returns

`Promise`<[`Product`[], `number`]\>

an array containing the products as
  the first element and the total count of products that matches the query
  as the second element.

#### Defined in

[medusa/src/services/product.ts:132](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L132)

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

[medusa/src/services/product.ts:329](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L329)

___

### listTypes

▸ **listTypes**(): `Promise`<`ProductType`[]\>

#### Returns

`Promise`<`ProductType`[]\>

#### Defined in

[medusa/src/services/product.ts:321](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L321)

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

[medusa/src/services/product.ts:680](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L680)

___

### retrieve

▸ **retrieve**(`productId`, `config?`): `Promise`<`Product`\>

Gets a product by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | id of the product to get. |
| `config` | `FindProductConfig` | object that defines what should be included in the   query response |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[medusa/src/services/product.ts:174](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L174)

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

[medusa/src/services/product.ts:218](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L218)

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

[medusa/src/services/product.ts:197](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L197)

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

[medusa/src/services/product.ts:783](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L783)

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

[medusa/src/services/product.ts:272](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L272)

___

### retrieve\_

▸ **retrieve_**(`selector`, `config?`): `Promise`<`Product`\>

Gets a product by selector.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> | selector object |
| `config` | `FindProductConfig` | object that defines what should be included in the   query response |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[medusa/src/services/product.ts:240](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L240)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`productId`, `update`): `Promise`<`Product`\>

Updates a product. Product variant updates should use dedicated methods,
e.g. `addVariant`, etc. The function will throw errors if metadata or
product variant updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product. Must be a string that   can be casted to an ObjectId |
| `update` | `UpdateProductInput` | an object with the update values. |

#### Returns

`Promise`<`Product`\>

resolves to the update result.

#### Defined in

[medusa/src/services/product.ts:470](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L470)

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

[medusa/src/services/product.ts:726](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L726)

___

### updateShippingProfile

▸ **updateShippingProfile**(`productIds`, `profileId`): `Promise`<`Product`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productIds` | `string` \| `string`[] | ID or IDs of the products to update |
| `profileId` | `string` | Shipping profile ID to update the shipping options with |

#### Returns

`Promise`<`Product`[]\>

updated shipping options

#### Defined in

[medusa/src/services/product.ts:873](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/services/product.ts#L873)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0f51e3a40/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
