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

[packages/medusa/src/services/product-variant.ts:53](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L53)

## Properties

### cartRepository\_

• `Private` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:51](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L51)

___

### eventBus\_

• `Private` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/product-variant.ts:46](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L46)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/product-variant.ts:43](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L43)

___

### moneyAmountRepository\_

• `Private` **moneyAmountRepository\_**: typeof `MoneyAmountRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:49](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L49)

___

### priceSelectionStrategy\_

• `Private` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[packages/medusa/src/services/product-variant.ts:48](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L48)

___

### productOptionValueRepository\_

• `Private` **productOptionValueRepository\_**: typeof `ProductOptionValueRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:50](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L50)

___

### productRepository\_

• `Private` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:45](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L45)

___

### productVariantRepository\_

• `Private` **productVariantRepository\_**: typeof `ProductVariantRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:44](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L44)

___

### regionService\_

• `Private` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/product-variant.ts:47](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L47)

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

[packages/medusa/src/services/product-variant.ts:37](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L37)

## Methods

### addOptionValue

▸ **addOptionValue**(`variantId`, `optionId`, `optionValue`): `Promise`<`ProductOptionValue`\>

Adds option value to a variant.
Fails when product with variant does not exist or
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

[packages/medusa/src/services/product-variant.ts:536](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L536)

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

[packages/medusa/src/services/product-variant.ts:184](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L184)

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

[packages/medusa/src/services/product-variant.ts:689](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L689)

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

[packages/medusa/src/services/product-variant.ts:563](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L563)

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

[packages/medusa/src/services/product-variant.ts:795](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L795)

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

[packages/medusa/src/services/product-variant.ts:411](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L411)

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

[packages/medusa/src/services/product-variant.ts:631](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L631)

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

[packages/medusa/src/services/product-variant.ts:590](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L590)

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

[packages/medusa/src/services/product-variant.ts:756](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L756)

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

[packages/medusa/src/services/product-variant.ts:118](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L118)

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

[packages/medusa/src/services/product-variant.ts:148](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L148)

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

[packages/medusa/src/services/product-variant.ts:477](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L477)

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

[packages/medusa/src/services/product-variant.ts:724](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L724)

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

[packages/medusa/src/services/product-variant.ts:440](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L440)

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

[packages/medusa/src/services/product-variant.ts:292](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L292)

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

[packages/medusa/src/services/product-variant.ts:498](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L498)

___

### updateVariantPrices

▸ **updateVariantPrices**(`variantId`, `prices`): `Promise`<`void`\>

Updates a variant's prices.
Deletes any prices that are not in the update object, and is not associated with a price list.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of variant |
| `prices` | `ProductVariantPrice`[] | the update prices |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

[packages/medusa/src/services/product-variant.ts:370](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L370)

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

[packages/medusa/src/services/product-variant.ts:90](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/product-variant.ts#L90)
