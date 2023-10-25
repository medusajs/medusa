# ProductVariantService

## Hierarchy

- `TransactionBaseService`

  ↳ **`ProductVariantService`**

## Constructors

### constructor

**new ProductVariantService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `Object` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/product-variant.ts:74](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L74)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### cartRepository\_

 `Protected` `Readonly` **cartRepository\_**: `Repository`<`Cart`\> & { `findOneWithRelations`: Method findOneWithRelations ; `findWithRelations`: Method findWithRelations  }

#### Defined in

[medusa/src/services/product-variant.ts:72](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L72)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/product-variant.ts:66](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L66)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### moneyAmountRepository\_

 `Protected` `Readonly` **moneyAmountRepository\_**: `Repository`<`MoneyAmount`\> & { `addPriceListPrices`: Method addPriceListPrices ; `createProductVariantMoneyAmounts`: Method createProductVariantMoneyAmounts ; `deletePriceListPrices`: Method deletePriceListPrices ; `deleteVariantPricesNotIn`: Method deleteVariantPricesNotIn ; `findCurrencyMoneyAmounts`: Method findCurrencyMoneyAmounts ; `findManyForVariantInPriceList`: Method findManyForVariantInPriceList ; `findManyForVariantInRegion`: Method findManyForVariantInRegion ; `findManyForVariantsInRegion`: Method findManyForVariantsInRegion ; `findRegionMoneyAmounts`: Method findRegionMoneyAmounts ; `findVariantPricesNotIn`: Method findVariantPricesNotIn ; `getPricesForVariantInRegion`: Method getPricesForVariantInRegion ; `insertBulk`: Method insertBulk ; `updatePriceListPrices`: Method updatePriceListPrices ; `upsertVariantCurrencyPrice`: Method upsertVariantCurrencyPrice  }

#### Defined in

[medusa/src/services/product-variant.ts:69](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L69)

___

### priceSelectionStrategy\_

 `Protected` `Readonly` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[medusa/src/services/product-variant.ts:68](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L68)

___

### productOptionValueRepository\_

 `Protected` `Readonly` **productOptionValueRepository\_**: `Repository`<`ProductOptionValue`\>

#### Defined in

[medusa/src/services/product-variant.ts:71](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L71)

___

### productRepository\_

 `Protected` `Readonly` **productRepository\_**: `Repository`<`Product`\> & { `_applyCategoriesQuery`: Method \_applyCategoriesQuery ; `_findWithRelations`: Method \_findWithRelations ; `bulkAddToCollection`: Method bulkAddToCollection ; `bulkRemoveFromCollection`: Method bulkRemoveFromCollection ; `findOneWithRelations`: Method findOneWithRelations ; `findWithRelations`: Method findWithRelations ; `findWithRelationsAndCount`: Method findWithRelationsAndCount ; `getCategoryIdsFromInput`: Method getCategoryIdsFromInput ; `getCategoryIdsRecursively`: Method getCategoryIdsRecursively ; `getFreeTextSearchResultsAndCount`: Method getFreeTextSearchResultsAndCount ; `isProductInSalesChannels`: Method isProductInSalesChannels ; `queryProducts`: Method queryProducts ; `queryProductsWithIds`: Method queryProductsWithIds  }

#### Defined in

[medusa/src/services/product-variant.ts:65](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L65)

___

### productVariantRepository\_

 `Protected` `Readonly` **productVariantRepository\_**: `Repository`<`ProductVariant`\>

#### Defined in

[medusa/src/services/product-variant.ts:64](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L64)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/product-variant.ts:67](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L67)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### Events

 `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

[medusa/src/services/product-variant.ts:58](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L58)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addOptionValue

**addOptionValue**(`variantId`, `optionId`, `optionValue`): `Promise`<`ProductOptionValue`\>

Adds option value to a variant.
Fails when product with variant does not exist or
if that product does not have an option with the given
option id. Fails if given variant is not found.
Option value must be of type string or number.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the variant to decorate. |
| `optionId` | `string` | the option from product. |
| `optionValue` | `string` | option value to add. |

#### Returns

`Promise`<`ProductOptionValue`\>

-`Promise`: the result of the update operation.
	-`ProductOptionValue`: 

#### Defined in

[medusa/src/services/product-variant.ts:843](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L843)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

**create**<`TVariants`, `TOutput`\>(`productOrProductId`, `variants`): `Promise`<`TOutput`\>

Creates an unpublished product variant. Will validate against parent product
to ensure that the variant can in fact be created.

| Name | Type |
| :------ | :------ |
| `TVariants` | `CreateProductVariantInput` \| `CreateProductVariantInput`[] |
| `TOutput` | `object` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `productOrProductId` | `string` \| `Product` | the product the variant will be added to |
| `variants` | `CreateProductVariantInput` \| `CreateProductVariantInput`[] |

#### Returns

`Promise`<`TOutput`\>

-`Promise`: resolves to the creation result.

#### Defined in

[medusa/src/services/product-variant.ts:167](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L167)

___

### delete

**delete**(`variantIds`): `Promise`<`void`\>

Deletes variant or variants.
Will never fail due to delete being idempotent.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantIds` | `string` \| `string`[] | the id of the variant to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void`\>

-`Promise`: empty promise

#### Defined in

[medusa/src/services/product-variant.ts:1013](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L1013)

___

### deleteOptionValue

**deleteOptionValue**(`variantId`, `optionId`): `Promise`<`void`\>

Deletes option value from given variant.
Will never fail due to delete being idempotent.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the variant to decorate. |
| `optionId` | `string` | the option from product. |

#### Returns

`Promise`<`void`\>

-`Promise`: empty promise

#### Defined in

[medusa/src/services/product-variant.ts:870](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L870)

___

### getFreeTextQueryBuilder\_

**getFreeTextQueryBuilder_**(`variantRepo`, `query`, `q?`): `SelectQueryBuilder`<`ProductVariant`\>

Lists variants based on the provided parameters and includes the count of
variants that match the query.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantRepo` | `Repository`<`ProductVariant`\> | the variant repository |
| `query` | `FindWithRelationsOptions` | object that defines the scope for what should be returned |
| `q?` | `string` | free text query |

#### Returns

`SelectQueryBuilder`<`ProductVariant`\>

-`SelectQueryBuilder`: an array containing the products as the first element and the total
  count of products that matches the query as the second element.
	-`ProductVariant`: 

#### Defined in

[medusa/src/services/product-variant.ts:1076](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L1076)

___

### getRegionPrice

**getRegionPrice**(`variantId`, `context`): `Promise`<``null`` \| `number`\>

Gets the price specific to a region. If no region specific money amount
exists the function will try to use a currency price. If no default
currency price exists the function will throw an error.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the id of the variant to get price from |
| `context` | `GetRegionPriceContext` | context for getting region price |

#### Returns

`Promise`<``null`` \| `number`\>

-`Promise`: the price specific to the region
	-```null`` \| number`: (optional) 

#### Defined in

[medusa/src/services/product-variant.ts:708](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L708)

___

### isVariantInSalesChannels

**isVariantInSalesChannels**(`id`, `salesChannelIds`): `Promise`<`boolean`\>

Check if the variant is assigned to at least one of the provided sales channels.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | product variant id |
| `salesChannelIds` | `string`[] | an array of sales channel ids |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

[medusa/src/services/product-variant.ts:1051](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L1051)

___

### list

**list**(`selector`, `config?`): `Promise`<`ProductVariant`[]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `FilterableProductVariantProps` | the query object for find |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` | query config object for variant retrieval |

#### Returns

`Promise`<`ProductVariant`[]\>

-`Promise`: the result of the find operation
	-`ProductVariant[]`: 
		-`ProductVariant`: 

#### Defined in

[medusa/src/services/product-variant.ts:959](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L959)

___

### listAndCount

**listAndCount**(`selector`, `config?`): `Promise`<[`ProductVariant`[], `number`]\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `FilterableProductVariantProps` | the query object for find |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` | query config object for variant retrieval |

#### Returns

`Promise`<[`ProductVariant`[], `number`]\>

-`Promise`: the result of the find operation
	-`ProductVariant[]`: 
	-`number`: (optional) 

#### Defined in

[medusa/src/services/product-variant.ts:898](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L898)

___

### retrieve

**retrieve**(`variantId`, `config?`): `Promise`<`ProductVariant`\>

Gets a product variant by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the id of the product to get. |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` | query config object for variant retrieval. |

#### Returns

`Promise`<`ProductVariant`\>

-`Promise`: the product document.
	-`ProductVariant`: 

#### Defined in

[medusa/src/services/product-variant.ts:103](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L103)

___

### retrieveBySKU

**retrieveBySKU**(`sku`, `config?`): `Promise`<`ProductVariant`\>

Gets a product variant by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `sku` | `string` | The unique stock keeping unit used to identify the product variant. |
| `config` | `FindConfig`<`ProductVariant`\> & `PriceSelectionContext` | query config object for variant retrieval. |

#### Returns

`Promise`<`ProductVariant`\>

-`Promise`: the product document.
	-`ProductVariant`: 

#### Defined in

[medusa/src/services/product-variant.ts:131](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L131)

___

### setCurrencyPrice

**setCurrencyPrice**(`variantId`, `price`): `Promise`<`MoneyAmount`\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the id of the variant to set prices for |
| `price` | `ProductVariantPrice` | the price for the variant |

#### Returns

`Promise`<`MoneyAmount`\>

-`Promise`: the result of the update operation
	-`MoneyAmount`: 

**Deprecated**

use addOrUpdateCurrencyPrices instead
Sets the default price for the given currency.

#### Defined in

[medusa/src/services/product-variant.ts:784](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L784)

___

### setRegionPrice

**setRegionPrice**(`variantId`, `price`): `Promise`<`MoneyAmount`\>

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the id of the variant to update |
| `price` | `ProductVariantPrice` | the price for the variant. |

#### Returns

`Promise`<`MoneyAmount`\>

-`Promise`: the result of the update operation
	-`MoneyAmount`: 

**Deprecated**

use addOrUpdateRegionPrices instead
Sets the default price of a specific region

#### Defined in

[medusa/src/services/product-variant.ts:737](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L737)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`variantData`): `Promise`<`ProductVariant`[]\>

Updates a collection of variant.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantData` | { `updateData`: `UpdateProductVariantInput` ; `variant`: `ProductVariant`  }[] | a collection of variant and the data to update. |

#### Returns

`Promise`<`ProductVariant`[]\>

-`Promise`: resolves to the update result.
	-`ProductVariant[]`: 
		-`ProductVariant`: 

#### Defined in

[medusa/src/services/product-variant.ts:265](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L265)

**update**(`variantOrVariantId`, `update`): `Promise`<`ProductVariant`\>

Updates a variant.
Price updates should use dedicated methods.
The function will throw, if price updates are attempted.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantOrVariantId` | `string` \| `Partial`<`ProductVariant`\> | variant or id of a variant. |
| `update` | `UpdateProductVariantInput` | an object with the update values. |

#### Returns

`Promise`<`ProductVariant`\>

-`Promise`: resolves to the update result.
	-`ProductVariant`: 

#### Defined in

[medusa/src/services/product-variant.ts:280](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L280)

**update**(`variantOrVariantId`, `update`): `Promise`<`ProductVariant`\>

#### Parameters

| Name |
| :------ |
| `variantOrVariantId` | `string` \| `Partial`<`ProductVariant`\> |
| `update` | `UpdateProductVariantInput` |

#### Returns

`Promise`<`ProductVariant`\>

-`Promise`: 
	-`ProductVariant`: 

#### Defined in

[medusa/src/services/product-variant.ts:285](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L285)

___

### updateBatch

`Protected` **updateBatch**(`variantData`): `Promise`<`ProductVariant`[]\>

#### Parameters

| Name |
| :------ |
| `variantData` | `UpdateProductVariantData`[] |

#### Returns

`Promise`<`ProductVariant`[]\>

-`Promise`: 
	-`ProductVariant[]`: 
		-`ProductVariant`: 

#### Defined in

[medusa/src/services/product-variant.ts:339](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L339)

___

### updateOptionValue

**updateOptionValue**(`variantId`, `optionId`, `optionValue`): `Promise`<`ProductOptionValue`\>

Updates variant's option value.
Option value must be of type string or number.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the variant to decorate. |
| `optionId` | `string` | the option from product. |
| `optionValue` | `string` | option value to add. |

#### Returns

`Promise`<`ProductOptionValue`\>

-`Promise`: the result of the update operation.
	-`ProductOptionValue`: 

#### Defined in

[medusa/src/services/product-variant.ts:805](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L805)

___

### updateVariantPrices

**updateVariantPrices**(`data`): `Promise`<`void`\>

Updates variant/prices collection.
Deletes any prices that are not in the update object, and is not associated with a price list.

#### Parameters

| Name |
| :------ |
| `data` | `UpdateVariantPricesData`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: empty promise

#### Defined in

[medusa/src/services/product-variant.ts:438](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L438)

**updateVariantPrices**(`variantId`, `prices`): `Promise`<`void`\>

Updates a variant's prices.
Deletes any prices that are not in the update object, and is not associated with a price list.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the id of variant |
| `prices` | `ProductVariantPrice`[] | the update prices |

#### Returns

`Promise`<`void`\>

-`Promise`: empty promise

#### Defined in

[medusa/src/services/product-variant.ts:447](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L447)

___

### updateVariantPricesBatch

`Protected` **updateVariantPricesBatch**(`data`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `data` | `UpdateVariantPricesData`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/product-variant.ts:467](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L467)

___

### upsertCurrencyPrices

**upsertCurrencyPrices**(`data`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `data` | { `price`: `WithRequiredProperty`<`ProductVariantPrice`, ``"currency_code"``\> ; `variantId`: `string`  }[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/product-variant.ts:618](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L618)

___

### upsertRegionPrices

**upsertRegionPrices**(`data`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `data` | `UpdateVariantRegionPriceData`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[medusa/src/services/product-variant.ts:540](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L540)

___

### validateVariantsToCreate\_

`Protected` **validateVariantsToCreate_**(`product`, `variants`): `void`

#### Parameters

| Name |
| :------ |
| `product` | `Product` |
| `variants` | `CreateProductVariantInput`[] |

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[medusa/src/services/product-variant.ts:1111](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/services/product-variant.ts#L1111)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`ProductVariantService`](ProductVariantService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductVariantService`](ProductVariantService.md)

-`ProductVariantService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/39f807849/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
