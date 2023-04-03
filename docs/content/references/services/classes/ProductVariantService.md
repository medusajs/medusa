# Class: ProductVariantService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductVariantService`**

## Constructors

### constructor

• **new ProductVariantService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/product-variant.ts:72](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L72)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:70](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L70)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/product-variant.ts:64](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L64)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/product-variant.ts:59](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L59)

___

### moneyAmountRepository\_

• `Protected` `Readonly` **moneyAmountRepository\_**: typeof `MoneyAmountRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:67](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L67)

___

### priceSelectionStrategy\_

• `Protected` `Readonly` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[packages/medusa/src/services/product-variant.ts:66](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L66)

___

### productOptionValueRepository\_

• `Protected` `Readonly` **productOptionValueRepository\_**: typeof `ProductOptionValueRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:69](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L69)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:63](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L63)

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: typeof `ProductVariantRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:62](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L62)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/product-variant.ts:65](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L65)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/product-variant.ts:60](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L60)

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

[packages/medusa/src/services/product-variant.ts:53](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L53)

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

[packages/medusa/src/services/product-variant.ts:823](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L823)

___

### addOrUpdateCurrencyPrices

▸ **addOrUpdateCurrencyPrices**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | { `price`: `WithRequiredProperty`<`ProductVariantPrice`, ``"currency_code"``\> ; `variantId`: `string`  }[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/product-variant.ts:613](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L613)

___

### addOrUpdateRegionPrices

▸ **addOrUpdateRegionPrices**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `UpdateVariantRegionPriceData`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/product-variant.ts:542](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L542)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/product-variant.ts:167](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L167)

___

### delete

▸ **delete**(`variantIds`): `Promise`<`void`\>

Deletes variant or variants.
Will never fail due to delete being idempotent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantIds` | `string` \| `string`[] | the id of the variant to delete. Must be   castable as an ObjectId |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

[packages/medusa/src/services/product-variant.ts:976](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L976)

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

[packages/medusa/src/services/product-variant.ts:850](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L850)

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

[packages/medusa/src/services/product-variant.ts:1078](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L1078)

___

### getRegionPrice

▸ **getRegionPrice**(`variantId`, `context`): `Promise`<``null`` \| `number`\>

Gets the price specific to a region. If no region specific money amount
exists the function will try to use a currency price. If no default
currency price exists the function will throw an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to get price from |
| `context` | `GetRegionPriceContext` | context for getting region price |

#### Returns

`Promise`<``null`` \| `number`\>

the price specific to the region

#### Defined in

[packages/medusa/src/services/product-variant.ts:697](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L697)

___

### isVariantInSalesChannels

▸ **isVariantInSalesChannels**(`id`, `salesChannelIds`): `Promise`<`boolean`\>

Check if the variant is assigned to at least one of the provided sales channels.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | product variant id |
| `salesChannelIds` | `string`[] | an array of sales channel ids |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/medusa/src/services/product-variant.ts:1016](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L1016)

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

[packages/medusa/src/services/product-variant.ts:918](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L918)

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

[packages/medusa/src/services/product-variant.ts:877](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L877)

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

[packages/medusa/src/services/product-variant.ts:1039](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L1039)

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

[packages/medusa/src/services/product-variant.ts:103](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L103)

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

[packages/medusa/src/services/product-variant.ts:131](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L131)

___

### setCurrencyPrice

▸ **setCurrencyPrice**(`variantId`, `price`): `Promise`<`MoneyAmount`\>

**`Deprecated`**

use addOrUpdateCurrencyPrices instead
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

[packages/medusa/src/services/product-variant.ts:764](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L764)

___

### setRegionPrice

▸ **setRegionPrice**(`variantId`, `price`): `Promise`<`MoneyAmount`\>

**`Deprecated`**

use addOrUpdateRegionPrices instead
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

[packages/medusa/src/services/product-variant.ts:727](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L727)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### update

▸ **update**(`variantData`): `Promise`<`ProductVariant`[]\>

Updates a collection of variant.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantData` | { `updateData`: `UpdateProductVariantInput` ; `variant`: `ProductVariant`  }[] | a collection of variant and the data to update. |

#### Returns

`Promise`<`ProductVariant`[]\>

resolves to the update result.

#### Defined in

[packages/medusa/src/services/product-variant.ts:264](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L264)

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

[packages/medusa/src/services/product-variant.ts:279](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L279)

▸ **update**(`variantOrVariantId`, `update`): `Promise`<`ProductVariant`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantOrVariantId` | `string` \| `Partial`<`ProductVariant`\> |
| `update` | `UpdateProductVariantInput` |

#### Returns

`Promise`<`ProductVariant`\>

#### Defined in

[packages/medusa/src/services/product-variant.ts:284](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L284)

___

### updateBatch

▸ `Protected` **updateBatch**(`variantData`): `Promise`<`ProductVariant`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantData` | `UpdateProductVariantData`[] |

#### Returns

`Promise`<`ProductVariant`[]\>

#### Defined in

[packages/medusa/src/services/product-variant.ts:340](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L340)

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

[packages/medusa/src/services/product-variant.ts:785](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L785)

___

### updateVariantPrices

▸ **updateVariantPrices**(`data`): `Promise`<`void`\>

Updates variant/prices collection.
Deletes any prices that are not in the update object, and is not associated with a price list.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `UpdateVariantPricesData`[] |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

[packages/medusa/src/services/product-variant.ts:440](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L440)

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

[packages/medusa/src/services/product-variant.ts:449](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L449)

___

### updateVariantPricesBatch

▸ `Protected` **updateVariantPricesBatch**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `UpdateVariantPricesData`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/product-variant.ts:469](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/product-variant.ts#L469)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductVariantService`](ProductVariantService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductVariantService`](ProductVariantService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
