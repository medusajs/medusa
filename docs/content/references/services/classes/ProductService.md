# Class: ProductService

Provides layer to manipulate products.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ProductService`**

## Constructors

### constructor

• **new ProductService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/product.js:19](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L19)

## Properties

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[services/product.js:13](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L13)

___

### IndexName

▪ `Static` **IndexName**: `string`

#### Defined in

[services/product.js:12](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L12)

## Methods

### addOption

▸ **addOption**(`productId`, `optionTitle`): `Promise`<`any`\>

Adds an option to a product. Options can, for example, be "Size", "Color",
etc. Will update all the products variants with a dummy value for the newly
created option. The same option cannot be added more than once.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product to apply the new option to |
| `optionTitle` | `string` | the display title of the option, e.g. "Size" |

#### Returns

`Promise`<`any`\>

the result of the model update operation

#### Defined in

[services/product.js:707](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L707)

___

### count

▸ **count**(`selector?`): `Promise`<`any`\>

Return the total number of documents in database

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the selector to choose products by |

#### Returns

`Promise`<`any`\>

the result of the count operation

#### Defined in

[services/product.js:223](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L223)

___

### create

▸ **create**(`productObject`): `Promise`<`any`\>

Creates a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productObject` | `any` | the product to create |

#### Returns

`Promise`<`any`\>

resolves to the creation result.

#### Defined in

[services/product.js:483](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L483)

___

### decorate

▸ **decorate**(`productId`, `fields?`, `expandFields?`, `config?`): `Product`

Decorates a product with product variants.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `productId` | `string` | `undefined` | the productId to decorate. |
| `fields` | `string`[] | `[]` | the fields to include. |
| `expandFields` | `string`[] | `[]` | fields to expand. |
| `config` | `any` | `{}` | retrieve config for price calculation. |

#### Returns

`Product`

return the decorated product.

#### Defined in

[services/product.js:945](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L945)

___

### delete

▸ **delete**(`productId`): `Promise`<`any`\>

Deletes a product from a given product id. The product's associated
variants will also be deleted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`any`\>

empty promise

#### Defined in

[services/product.js:673](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L673)

___

### deleteOption

▸ **deleteOption**(`productId`, `optionId`): `Promise`<`any`\>

Delete an option from a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product to delete an option from |
| `optionId` | `string` | the option to delete |

#### Returns

`Promise`<`any`\>

the updated product

#### Defined in

[services/product.js:881](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L881)

___

### getFreeTextQueryBuilder\_

▸ **getFreeTextQueryBuilder_**(`productRepo`, `query`, `q`): `QueryBuilder`<`Product`\>

Creates a QueryBuilder that can fetch products based on free text.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productRepo` | `ProductRepository` | an instance of a ProductRepositry |
| `query` | `FindOptions`<`Product`\> | the query to get products by |
| `q` | `string` | the text to perform free text search from |

#### Returns

`QueryBuilder`<`Product`\>

a query builder that can fetch products

#### Defined in

[services/product.js:1014](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L1014)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Product`[]\>

Lists products based on the provided parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | an object that defines rules to filter products   by |
| `config` | `any` | object that defines the scope for what should be   returned |

#### Returns

`Promise`<`Product`[]\>

the result of the find operation

#### Defined in

[services/product.js:109](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L109)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`Product`[], `number`]\>

Lists products based on the provided parameters and includes the count of
products that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | an object that defines rules to filter products   by |
| `config` | `any` | object that defines the scope for what should be   returned |

#### Returns

`Promise`<[`Product`[], `number`]\>

an array containing the products as
  the first element and the total count of products that matches the query
  as the second element.

#### Defined in

[services/product.js:164](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L164)

___

### listTagsByUsage

▸ **listTagsByUsage**(`count?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `count` | `number` | `10` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/product.js:412](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L412)

___

### listTypes

▸ **listTypes**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[services/product.js:404](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L404)

___

### prepareListQuery\_

▸ **prepareListQuery_**(`selector`, `config`): `any`

Creates a query object to be used for list queries.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `any` | the selector to create the query from |
| `config` | `any` | the config to use for the query |

#### Returns

`any`

an object containing the query, relations and free-text
  search param.

#### Defined in

[services/product.js:980](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L980)

___

### reorderOptions

▸ **reorderOptions**(`productId`, `optionOrder`): `Promise`<`any`\>

Changes the order of a product's options. Will throw if the length of
optionOrder and the length of the product's options are different. Will
throw optionOrder contains an id not associated with the product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product whose options we are reordering |
| `optionOrder` | `string`[] | the ids of the product's options in the    new order |

#### Returns

`Promise`<`any`\>

the result of the update operation

#### Defined in

[services/product.js:790](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L790)

___

### reorderVariants

▸ **reorderVariants**(`productId`, `variantOrder`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `any` |
| `variantOrder` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/product.js:746](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L746)

___

### retrieve

▸ **retrieve**(`productId`, `config?`): `Promise`<`Product`\>

Gets a product by id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | id of the product to get. |
| `config` | `any` | object that defines what should be included in the   query response |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[services/product.js:239](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L239)

___

### retrieveByExternalId

▸ **retrieveByExternalId**(`externalId`, `config?`): `Promise`<`Product`\>

Gets a product by external id.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalId` | `string` | handle of the product to get. |
| `config` | `any` | details about what to get from the product |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[services/product.js:342](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L342)

___

### retrieveByHandle

▸ **retrieveByHandle**(`productHandle`, `config?`): `Promise`<`Product`\>

Gets a product by handle.
Throws in case of DB Error and if product was not found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productHandle` | `string` | handle of the product to get. |
| `config` | `any` | details about what to get from the product |

#### Returns

`Promise`<`Product`\>

the result of the find one operation.

#### Defined in

[services/product.js:291](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L291)

___

### retrieveVariants

▸ **retrieveVariants**(`productId`, `config?`): `Promise`<`any`\>

Gets all variants belonging to a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to get variants from. |
| `config` | `FindConfig`<`Product`\> | The config to select and configure relations etc... |

#### Returns

`Promise`<`any`\>

an array of variants

#### Defined in

[services/product.js:392](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L392)

___

### setAdditionalPrices

▸ **setAdditionalPrices**(`products`, `currency_code`, `region_id`, `cart_id`, `customer_id`, `include_discount_prices?`): `Promise`<`Product`[]\>

Set additional prices on a list of products.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `products` | `any` | `undefined` | list of products on which to set additional prices |
| `currency_code` | `string` | `undefined` | currency code to fetch prices for |
| `region_id` | `string` | `undefined` | region to fetch prices for |
| `cart_id` | `string` | `undefined` | string of cart to use as a basis for getting currency and region |
| `customer_id` | `string` | `undefined` | id of potentially logged in customer, used to get prices valid for their customer groups |
| `include_discount_prices` | `boolean` | `false` | indication wether or not to include sales prices in result |

#### Returns

`Promise`<`Product`[]\>

A list of products with variants decorated with "additional_prices"

#### Defined in

[services/product.js:1055](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L1055)

___

### update

▸ **update**(`productId`, `update`): `Promise`<`any`\>

Updates a product. Product variant updates should use dedicated methods,
e.g. `addVariant`, etc. The function will throw errors if metadata or
product variant updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product. Must be a string that   can be casted to an ObjectId |
| `update` | `any` | an object with the update values. |

#### Returns

`Promise`<`any`\>

resolves to the update result.

#### Defined in

[services/product.js:573](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L573)

___

### updateOption

▸ **updateOption**(`productId`, `optionId`, `data`): `Promise`<`any`\>

Updates a product's option. Throws if the call tries to update an option
not associated with the product. Throws if the updated title already exists.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product whose option we are updating |
| `optionId` | `string` | the id of the option we are updating |
| `data` | `any` | the data to update the option with |

#### Returns

`Promise`<`any`\>

the updated product

#### Defined in

[services/product.js:831](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L831)

___

### upsertImages\_

▸ **upsertImages_**(`images`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `images` | `any` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[services/product.js:542](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L542)

___

### upsertProductTags\_

▸ **upsertProductTags_**(`tags`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tags` | `any` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

[services/product.js:455](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L455)

___

### upsertProductType\_

▸ **upsertProductType_**(`type`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/product.js:430](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L430)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`ProductService`](ProductService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`ProductService`](ProductService.md)

#### Defined in

[services/product.js:76](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/product.js#L76)
