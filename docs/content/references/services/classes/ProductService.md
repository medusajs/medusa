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

[packages/medusa/src/services/product.ts:73](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L73)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/product.ts:63](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L63)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/product.ts:64](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L64)

___

### imageRepository\_

• `Protected` `Readonly` **imageRepository\_**: typeof `ImageRepository`

#### Defined in

[packages/medusa/src/services/product.ts:60](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L60)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/product.ts:52](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L52)

___

### productOptionRepository\_

• `Protected` `Readonly` **productOptionRepository\_**: typeof `ProductOptionRepository`

#### Defined in

[packages/medusa/src/services/product.ts:55](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L55)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[packages/medusa/src/services/product.ts:56](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L56)

___

### productTagRepository\_

• `Protected` `Readonly` **productTagRepository\_**: typeof `ProductTagRepository`

#### Defined in

[packages/medusa/src/services/product.ts:59](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L59)

___

### productTypeRepository\_

• `Protected` `Readonly` **productTypeRepository\_**: typeof `ProductTypeRepository`

#### Defined in

[packages/medusa/src/services/product.ts:58](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L58)

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: typeof `ProductVariantRepository`

#### Defined in

[packages/medusa/src/services/product.ts:57](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L57)

___

### productVariantService\_

• `Protected` `Readonly` **productVariantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/product.ts:61](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L61)

___

### searchService\_

• `Protected` `Readonly` **searchService\_**: [`SearchService`](SearchService.md)

#### Defined in

[packages/medusa/src/services/product.ts:62](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L62)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/product.ts:53](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L53)

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

[packages/medusa/src/services/product.ts:67](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L67)

___

### IndexName

▪ `Static` `Readonly` **IndexName**: ``"products"``

#### Defined in

[packages/medusa/src/services/product.ts:66](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L66)

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

[packages/medusa/src/services/product.ts:663](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L663)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:48](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L48)

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

[packages/medusa/src/services/product.ts:164](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L164)

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

[packages/medusa/src/services/product.ts:376](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L376)

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

[packages/medusa/src/services/product.ts:629](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L629)

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

[packages/medusa/src/services/product.ts:828](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L828)

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

[packages/medusa/src/services/product.ts:299](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L299)

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

[packages/medusa/src/services/product.ts:354](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L354)

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

[packages/medusa/src/services/product.ts:110](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L110)

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

[packages/medusa/src/services/product.ts:134](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L134)

___

### listTagsByUsage

▸ **listTagsByUsage**(`count?`): `Promise`<`ProductTag`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `count` | `number` | `10` |

#### Returns

`Promise`<`ProductTag`[]\>

#### Defined in

[packages/medusa/src/services/product.ts:339](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L339)

___

### listTypes

▸ **listTypes**(): `Promise`<`ProductType`[]\>

#### Returns

`Promise`<`ProductType`[]\>

#### Defined in

[packages/medusa/src/services/product.ts:330](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L330)

___

### prepareListQuery\_

▸ `Protected` **prepareListQuery_**(`selector`, `config`): `Object`

Creates a query object to be used for list queries.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Product`\> \| `FilterableProductProps` | the selector to create the query from |
| `config` | `FindProductConfig` | the config to use for the query |

#### Returns

`Object`

an object containing the query, relations and free-text
  search param.

| Name | Type |
| :------ | :------ |
| `q` | `string` |
| `query` | `FindWithoutRelationsOptions` |
| `relations` | keyof `Product`[] |

#### Defined in

[packages/medusa/src/services/product.ts:900](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L900)

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

[packages/medusa/src/services/product.ts:706](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L706)

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

[packages/medusa/src/services/product.ts:179](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L179)

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

[packages/medusa/src/services/product.ts:223](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L223)

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

[packages/medusa/src/services/product.ts:202](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L202)

___

### retrieveOptionByTitle

▸ **retrieveOptionByTitle**(`title`, `productId`): `Promise`<`undefined` \| `ProductOption`\>

Retrieve product's option by title.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `title` | `string` | title of the option |
| `productId` | `string` | id of a product |

#### Returns

`Promise`<`undefined` \| `ProductOption`\>

product option

#### Defined in

[packages/medusa/src/services/product.ts:809](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L809)

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

[packages/medusa/src/services/product.ts:281](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L281)

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

[packages/medusa/src/services/product.ts:245](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L245)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:29](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L29)

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

[packages/medusa/src/services/product.ts:471](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L471)

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

[packages/medusa/src/services/product.ts:752](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/services/product.ts#L752)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/d843bc102/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
