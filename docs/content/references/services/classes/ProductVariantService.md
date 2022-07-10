# Class: ProductVariantService

Provides layer to manipulate product variants.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`ProductVariantService`**

## Constructors

### constructor

• **new ProductVariantService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/product-variant.ts:52](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L52)

## Properties

### cartRepository\_

• `Private` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[services/product-variant.ts:50](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L50)

___

### eventBus\_

• `Private` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/product-variant.ts:45](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L45)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/product-variant.ts:42](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L42)

___

### moneyAmountRepository\_

• `Private` **moneyAmountRepository\_**: typeof `MoneyAmountRepository`

#### Defined in

[services/product-variant.ts:48](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L48)

___

### priceSelectionStrategy\_

• `Private` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[services/product-variant.ts:47](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L47)

___

### productOptionValueRepository\_

• `Private` **productOptionValueRepository\_**: typeof `ProductOptionValueRepository`

#### Defined in

[services/product-variant.ts:49](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L49)

___

### productRepository\_

• `Private` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[services/product-variant.ts:44](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L44)

___

### productVariantRepository\_

• `Private` **productVariantRepository\_**: typeof `ProductVariantRepository`

#### Defined in

[services/product-variant.ts:43](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L43)

___

### regionService\_

• `Private` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[services/product-variant.ts:46](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L46)

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

[services/product-variant.ts:36](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L36)

## Methods

### addOptionValue

▸ **addOptionValue**(`variantId`, `optionId`, `optionValue`): `Promise`<`ProductOptionValue`\>

Adds option value to a varaint.
Fails when product with variant does not exists or
if that product does not have an option with the given
option id. Fails if given variant is not found.
Option value must be of type string or number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the variant to decorate. |
| `optionId` | `string` | the option from product. |
| `optionValue` | `string` | option value to add. |

#### Returns

`Promise`<`ProductOptionValue`\>

the result of the update operation.

#### Defined in

[services/product-variant.ts:529](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L529)

___

### create

▸ **create**(`productOrProductId`, `variant`): `Promise`<`ProductVariant`\>

Creates an unpublished product variant. Will validate against parent product
to ensure that the variant can in fact be created.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productOrProductId` | `string` \| `Product` | the product the variant will be added to |
| `variant` | `CreateProductVariantInput` | the variant to create |

#### Returns

`Promise`<`ProductVariant`\>

resolves to the creation result.

#### Defined in

[services/product-variant.ts:183](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L183)

___

### delete

▸ **delete**(`variantId`): `Promise`<`void`\>

Deletes variant.
Will never fail due to delete being idempotent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

[services/product-variant.ts:682](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L682)

___

### deleteOptionValue

▸ **deleteOptionValue**(`variantId`, `optionId`): `Promise`<`void`\>

Deletes option value from given variant.
Will never fail due to delete being idempotent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the variant to decorate. |
| `optionId` | `string` | the option from product. |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

[services/product-variant.ts:556](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L556)

___

### getFreeTextQueryBuilder\_

▸ **getFreeTextQueryBuilder_**(`variantRepo`, `query`, `q?`): `SelectQueryBuilder`<`ProductVariant`\>

Lists variants based on the provided parameters and includes the count of
variants that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantRepo` | `ProductVariantRepository` | the variant repository |
| `query` | `FindWithRelationsOptions` | object that defines the scope for what should be returned |
| `q?` | `string` | free text query |

#### Returns

`SelectQueryBuilder`<`ProductVariant`\>

an array containing the products as the first element and the total
  count of products that matches the query as the second element.

#### Defined in

[services/product-variant.ts:788](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L788)

___

### getRegionPrice

▸ **getRegionPrice**(`variantId`, `context`): `Promise`<`number`\>

Gets the price specific to a region. If no region specific money amount
exists the function will try to use a currency price. If no default
currency price exists the function will throw an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to get price from |
| `context` | `GetRegionPriceContext` | context for getting region price |

#### Returns

`Promise`<`number`\>

the price specific to the region

#### Defined in

[services/product-variant.ts:404](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L404)

___

### list

▸ **list**(`selector`, `config?`): `Promise`<`ProductVariant`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductVariantProps` | the query object for find |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` | query config object for variant retrieval |

#### Returns

`Promise`<`ProductVariant`[]\>

the result of the find operation

#### Defined in

[services/product-variant.ts:624](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L624)

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[`ProductVariant`[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductVariantProps` | the query object for find |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` | query config object for variant retrieval |

#### Returns

`Promise`<[`ProductVariant`[], `number`]\>

the result of the find operation

#### Defined in

[services/product-variant.ts:583](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L583)

___

### prepareListQuery\_

▸ **prepareListQuery_**(`selector`, `config`): `Object`

Creates a query object to be used for list queries.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterableProductVariantProps` | the selector to create the query from |
| `config` | `FindConfig`<`ProductVariant`\> | the config to use for the query |

#### Returns

`Object`

an object containing the query, relations and free-text
  search param.

| Name | Type |
| :------ | :------ |
| `q?` | `string` |
| `query` | `FindWithRelationsOptions` |
| `relations` | `string`[] |

#### Defined in

[services/product-variant.ts:749](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L749)

___

### retrieve

▸ **retrieve**(`variantId`, `config?`): `Promise`<`ProductVariant`\>

Gets a product variant by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the product to get. |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` | query config object for variant retrieval. |

#### Returns

`Promise`<`ProductVariant`\>

the product document.

#### Defined in

[services/product-variant.ts:117](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L117)

___

### retrieveBySKU

▸ **retrieveBySKU**(`sku`, `config?`): `Promise`<`ProductVariant`\>

Gets a product variant by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sku` | `string` | The unique stock keeping unit used to identify the product variant. |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` | query config object for variant retrieval. |

#### Returns

`Promise`<`ProductVariant`\>

the product document.

#### Defined in

[services/product-variant.ts:147](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L147)

___

### setCurrencyPrice

▸ **setCurrencyPrice**(`variantId`, `price`): `Promise`<`MoneyAmount`\>

Sets the default price for the given currency.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to set prices for |
| `price` | `ProductVariantPrice` | the price for the variant |

#### Returns

`Promise`<`MoneyAmount`\>

the result of the update operation

#### Defined in

[services/product-variant.ts:470](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L470)

___

### setMetadata\_

▸ **setMetadata_**(`variant`, `metadata`): `Record`<`string`, `unknown`\>

Dedicated method to set metadata for a variant.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variant` | `ProductVariant` | the variant to set metadata for. |
| `metadata` | `object` | the metadata to set |

#### Returns

`Record`<`string`, `unknown`\>

updated metadata object

#### Defined in

[services/product-variant.ts:717](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L717)

___

### setRegionPrice

▸ **setRegionPrice**(`variantId`, `price`): `Promise`<`MoneyAmount`\>

Sets the default price of a specific region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to update |
| `price` | `ProductVariantPrice` | the price for the variant. |

#### Returns

`Promise`<`MoneyAmount`\>

the result of the update operation

#### Defined in

[services/product-variant.ts:433](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L433)

___

### update

▸ **update**(`variantOrVariantId`, `update`): `Promise`<`ProductVariant`\>

Updates a variant.
Price updates should use dedicated methods.
The function will throw, if price updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantOrVariantId` | `string` \| `Partial`<`ProductVariant`\> | variant or id of a variant. |
| `update` | `UpdateProductVariantInput` | an object with the update values. |

#### Returns

`Promise`<`ProductVariant`\>

resolves to the update result.

#### Defined in

[services/product-variant.ts:288](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L288)

___

### updateOptionValue

▸ **updateOptionValue**(`variantId`, `optionId`, `optionValue`): `Promise`<`ProductOptionValue`\>

Updates variant's option value.
Option value must be of type string or number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the variant to decorate. |
| `optionId` | `string` | the option from product. |
| `optionValue` | `string` | option value to add. |

#### Returns

`Promise`<`ProductOptionValue`\>

the result of the update operation.

#### Defined in

[services/product-variant.ts:491](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L491)

___

### updateVariantPrices

▸ **updateVariantPrices**(`variantId`, `prices`): `Promise`<`void`\>

Updates a variant's prices.
Deletes any prices that are not in the update object, and is not associated with a price list.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of variant variant |
| `prices` | `ProductVariantPrice`[] | the update prices |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

[services/product-variant.ts:366](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L366)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`ProductVariantService`](ProductVariantService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/product-variant.ts:89](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/product-variant.ts#L89)
