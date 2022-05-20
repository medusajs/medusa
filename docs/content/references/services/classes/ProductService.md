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

[product.js:18](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L18)

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

[product.js:12](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L12)

___

### IndexName

▪ `Static` **IndexName**: `string`

#### Defined in

[product.js:11](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L11)

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

[product.js:698](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L698)

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

[product.js:222](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L222)

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

[product.js:474](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L474)

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

[product.js:936](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L936)

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

[product.js:664](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L664)

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

[product.js:872](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L872)

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

[product.js:1005](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L1005)

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

[product.js:108](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L108)

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

[product.js:163](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L163)

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

[product.js:403](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L403)

___

### listTypes

▸ **listTypes**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[product.js:395](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L395)

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

[product.js:971](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L971)

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

[product.js:781](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L781)

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

[product.js:737](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L737)

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

[product.js:238](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L238)

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

[product.js:341](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L341)

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

[product.js:290](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L290)

___

### retrieveVariants

▸ **retrieveVariants**(`productId`): `Promise`<`any`\>

Gets all variants belonging to a product.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to get variants from. |

#### Returns

`Promise`<`any`\>

an array of variants

#### Defined in

[product.js:390](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L390)

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

[product.js:1046](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L1046)

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

[product.js:564](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L564)

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

[product.js:822](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L822)

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

[product.js:533](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L533)

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

[product.js:446](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L446)

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

[product.js:421](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L421)

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

[product.js:75](https://github.com/medusajs/medusa/blob/636edb65/packages/medusa/src/services/product.js#L75)
