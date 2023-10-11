---
displayed_sidebar: jsClientSidebar
---

# Class: ProductVariantService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).ProductVariantService

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`ProductVariantService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: `Repository`<[`Cart`](internal-3.Cart.md)\> & { `findOneWithRelations`: (`relations?`: `FindOptionsRelations`<[`Cart`](internal-3.Cart.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Cart`](internal-3.Cart.md)\>, ``"relations"``\>) => `Promise`<[`Cart`](internal-3.Cart.md)\> ; `findWithRelations`: (`relations?`: `FindOptionsRelations`<[`Cart`](internal-3.Cart.md)\>, `optionsWithoutRelations?`: [`Omit`](../modules/internal-1.md#omit)<`FindManyOptions`<[`Cart`](internal-3.Cart.md)\>, ``"relations"``\>) => `Promise`<[`Cart`](internal-3.Cart.md)[]\>  }

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:26

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:21

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### moneyAmountRepository\_

• `Protected` `Readonly` **moneyAmountRepository\_**: `Repository`<[`MoneyAmount`](internal-3.MoneyAmount.md)\> & { `addPriceListPrices`: (`priceListId`: `string`, `prices`: [`PriceListPriceCreateInput`](../modules/internal-8.internal.md#pricelistpricecreateinput)[], `overrideExisting?`: `boolean`) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `createProductVariantMoneyAmounts`: (`toCreate`: { `money_amount_id`: `string` ; `variant_id`: `string`  }[]) => `Promise`<`InsertResult`\> ; `deletePriceListPrices`: (`priceListId`: `string`, `moneyAmountIds`: `string`[]) => `Promise`<`void`\> ; `deleteVariantPricesNotIn`: (`variantIdOrData`: `string` \| { `prices`: [`ProductVariantPrice`](../modules/internal-8.md#productvariantprice)[] ; `variantId`: `string`  }[], `prices?`: [`Price`](../modules/internal-8.md#price)[]) => `Promise`<`void`\> ; `findCurrencyMoneyAmounts`: (`where`: { `currency_code`: `string` ; `variant_id`: `string`  }[]) => `Promise`<{ `amount`: `number` ; `created_at`: `Date` ; `currency?`: [`Currency`](internal-3.Currency.md) ; `currency_code`: `string` ; `deleted_at`: ``null`` \| `Date` ; `id`: `string` ; `max_quantity`: ``null`` \| `number` ; `min_quantity`: ``null`` \| `number` ; `price_list`: ``null`` \| [`PriceList`](internal-3.PriceList.md) ; `price_list_id`: ``null`` \| `string` ; `region?`: [`Region`](internal-3.Region.md) ; `region_id`: `string` ; `updated_at`: `Date` ; `variant`: [`ProductVariant`](internal-3.ProductVariant.md) ; `variant_id`: `any` ; `variants`: [`ProductVariant`](internal-3.ProductVariant.md)[]  }[]\> ; `findManyForVariantInPriceList`: (`variant_id`: `string`, `price_list_id`: `string`, `requiresPriceList?`: `boolean`) => `Promise`<[[`MoneyAmount`](internal-3.MoneyAmount.md)[], `number`]\> ; `findManyForVariantInRegion`: (`variant_id`: `string`, `region_id?`: `string`, `currency_code?`: `string`, `customer_id?`: `string`, `include_discount_prices?`: `boolean`, `include_tax_inclusive_pricing?`: `boolean`) => `Promise`<[[`MoneyAmount`](internal-3.MoneyAmount.md)[], `number`]\> ; `findManyForVariantsInRegion`: (`variant_ids`: `string` \| `string`[], `region_id?`: `string`, `currency_code?`: `string`, `customer_id?`: `string`, `include_discount_prices?`: `boolean`, `include_tax_inclusive_pricing?`: `boolean`) => `Promise`<[[`Record`](../modules/internal.md#record)<`string`, [`MoneyAmount`](internal-3.MoneyAmount.md)[]\>, `number`]\> ; `findRegionMoneyAmounts`: (`where`: { `region_id`: `string` ; `variant_id`: `string`  }[]) => `Promise`<{ `amount`: `number` ; `created_at`: `Date` ; `currency?`: [`Currency`](internal-3.Currency.md) ; `currency_code`: `string` ; `deleted_at`: ``null`` \| `Date` ; `id`: `string` ; `max_quantity`: ``null`` \| `number` ; `min_quantity`: ``null`` \| `number` ; `price_list`: ``null`` \| [`PriceList`](internal-3.PriceList.md) ; `price_list_id`: ``null`` \| `string` ; `region?`: [`Region`](internal-3.Region.md) ; `region_id`: `string` ; `updated_at`: `Date` ; `variant`: [`ProductVariant`](internal-3.ProductVariant.md) ; `variant_id`: `any` ; `variants`: [`ProductVariant`](internal-3.ProductVariant.md)[]  }[]\> ; `findVariantPricesNotIn`: (`variantId`: `string`, `prices`: [`Price`](../modules/internal-8.md#price)[]) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `getPricesForVariantInRegion`: (`variantId`: `string`, `regionId`: `undefined` \| `string`) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `insertBulk`: (`data`: `_QueryDeepPartialEntity`<[`MoneyAmount`](internal-3.MoneyAmount.md)\>[]) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `updatePriceListPrices`: (`priceListId`: `string`, `updates`: [`PriceListPriceUpdateInput`](../modules/internal-8.internal.md#pricelistpriceupdateinput)[]) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `upsertVariantCurrencyPrice`: (`variantId`: `string`, `price`: [`Price`](../modules/internal-8.md#price)) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)\>  }

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:24

___

### priceSelectionStrategy\_

• `Protected` `Readonly` **priceSelectionStrategy\_**: [`IPriceSelectionStrategy`](../interfaces/internal-8.internal.IPriceSelectionStrategy.md)

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:23

___

### productOptionValueRepository\_

• `Protected` `Readonly` **productOptionValueRepository\_**: `Repository`<[`ProductOptionValue`](internal-3.ProductOptionValue.md)\>

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:25

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: `Repository`<[`Product`](internal-3.Product.md)\> & { `_applyCategoriesQuery`: (`qb`: `SelectQueryBuilder`<[`Product`](internal-3.Product.md)\>, `__namedParameters`: { `alias`: `any` ; `categoryAlias`: `any` ; `joinName`: `any` ; `where`: `any`  }) => `SelectQueryBuilder`<[`Product`](internal-3.Product.md)\> ; `_findWithRelations`: (`__namedParameters`: { `idsOrOptionsWithoutRelations`: `string`[] \| [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1) ; `relations`: `string`[] ; `shouldCount`: `boolean` ; `withDeleted`: `boolean`  }) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `bulkAddToCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `bulkRemoveFromCollection`: (`productIds`: `string`[], `collectionId`: `string`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `findOneWithRelations`: (`relations?`: `string`[], `optionsWithoutRelations?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1)) => `Promise`<[`Product`](internal-3.Product.md)\> ; `findWithRelations`: (`relations?`: `string`[], `idsOrOptionsWithoutRelations?`: `string`[] \| [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `withDeleted?`: `boolean`) => `Promise`<[`Product`](internal-3.Product.md)[]\> ; `findWithRelationsAndCount`: (`relations?`: `string`[], `idsOrOptionsWithoutRelations?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1)) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `getCategoryIdsFromInput`: (`categoryId?`: [`CategoryQueryParams`](../modules/internal-8.md#categoryqueryparams), `includeCategoryChildren?`: `boolean`) => `Promise`<`string`[]\> ; `getCategoryIdsRecursively`: (`productCategory`: [`ProductCategory`](internal-3.ProductCategory.md)) => `string`[] ; `getFreeTextSearchResultsAndCount`: (`q`: `string`, `options?`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `relations?`: `string`[]) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `isProductInSalesChannels`: (`id`: `string`, `salesChannelIds`: `string`[]) => `Promise`<`boolean`\> ; `queryProducts`: (`optionsWithoutRelations`: [`FindWithoutRelationsOptions`](../modules/internal-8.md#findwithoutrelationsoptions-1), `shouldCount?`: `boolean`) => `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\> ; `queryProductsWithIds`: (`__namedParameters`: { `entityIds`: `string`[] ; `groupedRelations`: { `[toplevel: string]`: `string`[];  } ; `order?`: { `[column: string]`: ``"ASC"`` \| ``"DESC"``;  } ; `select?`: keyof [`Product`](internal-3.Product.md)[] ; `where?`: `FindOptionsWhere`<[`Product`](internal-3.Product.md)\> ; `withDeleted?`: `boolean`  }) => `Promise`<[`Product`](internal-3.Product.md)[]\>  }

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:20

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: `Repository`<[`ProductVariant`](internal-3.ProductVariant.md)\>

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:19

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:22

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

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

packages/medusa/dist/services/product-variant.d.ts:14

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

## Methods

### addOptionValue

▸ **addOptionValue**(`variantId`, `optionId`, `optionValue`): `Promise`<[`ProductOptionValue`](internal-3.ProductOptionValue.md)\>

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

`Promise`<[`ProductOptionValue`](internal-3.ProductOptionValue.md)\>

the result of the update operation.

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:145

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

___

### create

▸ **create**<`TVariants`, `TOutput`\>(`productOrProductId`, `variants`): `Promise`<`TOutput`\>

Creates an unpublished product variant. Will validate against parent product
to ensure that the variant can in fact be created.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TVariants` | extends [`CreateProductVariantInput`](../modules/internal-8.md#createproductvariantinput) \| [`CreateProductVariantInput`](../modules/internal-8.md#createproductvariantinput)[] |
| `TOutput` | `TVariants` extends [`CreateProductVariantInput`](../modules/internal-8.md#createproductvariantinput)[] ? [`CreateProductVariantInput`](../modules/internal-8.md#createproductvariantinput)[] : [`CreateProductVariantInput`](../modules/internal-8.md#createproductvariantinput) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productOrProductId` | `string` \| [`Product`](internal-3.Product.md) | the product the variant will be added to |
| `variants` | [`CreateProductVariantInput`](../modules/internal-8.md#createproductvariantinput) \| [`CreateProductVariantInput`](../modules/internal-8.md#createproductvariantinput)[] |  |

#### Returns

`Promise`<`TOutput`\>

resolves to the creation result.

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:58

___

### delete

▸ **delete**(`variantIds`): `Promise`<`void`\>

Deletes variant or variants.
Will never fail due to delete being idempotent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantIds` | `string` \| `string`[] | the id of the variant to delete. Must be castable as an ObjectId |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:173

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

packages/medusa/dist/services/product-variant.d.ts:153

___

### getFreeTextQueryBuilder\_

▸ **getFreeTextQueryBuilder_**(`variantRepo`, `query`, `q?`): `SelectQueryBuilder`<[`ProductVariant`](internal-3.ProductVariant.md)\>

Lists variants based on the provided parameters and includes the count of
variants that match the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantRepo` | `Repository`<[`ProductVariant`](internal-3.ProductVariant.md)\> | the variant repository |
| `query` | [`FindWithRelationsOptions`](../modules/internal-8.md#findwithrelationsoptions) | object that defines the scope for what should be returned |
| `q?` | `string` | free text query |

#### Returns

`SelectQueryBuilder`<[`ProductVariant`](internal-3.ProductVariant.md)\>

an array containing the products as the first element and the total
  count of products that matches the query as the second element.

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:190

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
| `context` | [`GetRegionPriceContext`](../modules/internal-8.md#getregionpricecontext) | context for getting region price |

#### Returns

`Promise`<``null`` \| `number`\>

the price specific to the region

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:108

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

packages/medusa/dist/services/product-variant.d.ts:180

___

### list

▸ **list**(`selector`, `config?`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`FilterableProductVariantProps`](internal-8.FilterableProductVariantProps.md) | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductVariant`](internal-3.ProductVariant.md)\> & [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | query config object for variant retrieval |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:165

___

### listAndCount

▸ **listAndCount**(`selector`, `config?`): `Promise`<[[`ProductVariant`](internal-3.ProductVariant.md)[], `number`]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | [`FilterableProductVariantProps`](internal-8.FilterableProductVariantProps.md) | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductVariant`](internal-3.ProductVariant.md)\> & [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | query config object for variant retrieval |

#### Returns

`Promise`<[[`ProductVariant`](internal-3.ProductVariant.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:159

___

### retrieve

▸ **retrieve**(`variantId`, `config?`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)\>

Gets a product variant by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the product to get. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductVariant`](internal-3.ProductVariant.md)\> & [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | query config object for variant retrieval. |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)\>

the product document.

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:43

___

### retrieveBySKU

▸ **retrieveBySKU**(`sku`, `config?`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)\>

Gets a product variant by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sku` | `string` | The unique stock keeping unit used to identify the product variant. |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductVariant`](internal-3.ProductVariant.md)\> & [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | query config object for variant retrieval. |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)\>

the product document.

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:50

___

### setCurrencyPrice

▸ **setCurrencyPrice**(`variantId`, `price`): `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to set prices for |
| `price` | [`ProductVariantPrice`](../modules/internal-8.md#productvariantprice) | the price for the variant |

#### Returns

`Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)\>

the result of the update operation

**`Deprecated`**

use addOrUpdateCurrencyPrices instead
Sets the default price for the given currency.

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:124

___

### setRegionPrice

▸ **setRegionPrice**(`variantId`, `price`): `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to update |
| `price` | [`ProductVariantPrice`](../modules/internal-8.md#productvariantprice) | the price for the variant. |

#### Returns

`Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)\>

the result of the update operation

**`Deprecated`**

use addOrUpdateRegionPrices instead
Sets the default price of a specific region

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:116

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### update

▸ **update**(`variantData`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

Updates a collection of variant.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantData` | { `updateData`: [`UpdateProductVariantInput`](../modules/internal-8.md#updateproductvariantinput) ; `variant`: [`ProductVariant`](internal-3.ProductVariant.md)  }[] | a collection of variant and the data to update. |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

resolves to the update result.

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:64

▸ **update**(`variantOrVariantId`, `update`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)\>

Updates a variant.
Price updates should use dedicated methods.
The function will throw, if price updates are attempted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantOrVariantId` | `string` \| [`Partial`](../modules/internal-8.md#partial)<[`ProductVariant`](internal-3.ProductVariant.md)\> | variant or id of a variant. |
| `update` | [`UpdateProductVariantInput`](../modules/internal-8.md#updateproductvariantinput) | an object with the update values. |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)\>

resolves to the update result.

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:76

▸ **update**(`variantOrVariantId`, `update`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantOrVariantId` | `string` \| [`Partial`](../modules/internal-8.md#partial)<[`ProductVariant`](internal-3.ProductVariant.md)\> |
| `update` | [`UpdateProductVariantInput`](../modules/internal-8.md#updateproductvariantinput) |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)\>

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:77

___

### updateBatch

▸ `Protected` **updateBatch**(`variantData`): `Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantData` | [`UpdateProductVariantData`](../modules/internal-8.md#updateproductvariantdata)[] |

#### Returns

`Promise`<[`ProductVariant`](internal-3.ProductVariant.md)[]\>

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:78

___

### updateOptionValue

▸ **updateOptionValue**(`variantId`, `optionId`, `optionValue`): `Promise`<[`ProductOptionValue`](internal-3.ProductOptionValue.md)\>

Updates variant's option value.
Option value must be of type string or number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the variant to decorate. |
| `optionId` | `string` | the option from product. |
| `optionValue` | `string` | option value to add. |

#### Returns

`Promise`<[`ProductOptionValue`](internal-3.ProductOptionValue.md)\>

the result of the update operation.

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:133

___

### updateVariantPrices

▸ **updateVariantPrices**(`data`): `Promise`<`void`\>

Updates variant/prices collection.
Deletes any prices that are not in the update object, and is not associated with a price list.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`UpdateVariantPricesData`](../modules/internal-8.md#updatevariantpricesdata)[] |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:85

▸ **updateVariantPrices**(`variantId`, `prices`): `Promise`<`void`\>

Updates a variant's prices.
Deletes any prices that are not in the update object, and is not associated with a price list.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of variant |
| `prices` | [`ProductVariantPrice`](../modules/internal-8.md#productvariantprice)[] | the update prices |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:93

___

### updateVariantPricesBatch

▸ `Protected` **updateVariantPricesBatch**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`UpdateVariantPricesData`](../modules/internal-8.md#updatevariantpricesdata)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:94

___

### upsertCurrencyPrices

▸ **upsertCurrencyPrices**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | { `price`: [`WithRequiredProperty`](../modules/internal-8.internal.md#withrequiredproperty)<[`ProductVariantPrice`](../modules/internal-8.md#productvariantprice), ``"currency_code"``\> ; `variantId`: `string`  }[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:96

___

### upsertRegionPrices

▸ **upsertRegionPrices**(`data`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`UpdateVariantRegionPriceData`](../modules/internal-8.md#updatevariantregionpricedata)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:95

___

### validateVariantsToCreate\_

▸ `Protected` **validateVariantsToCreate_**(`product`, `variants`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `product` | [`Product`](internal-3.Product.md) |
| `variants` | [`CreateProductVariantInput`](../modules/internal-8.md#createproductvariantinput)[] |

#### Returns

`void`

#### Defined in

packages/medusa/dist/services/product-variant.d.ts:191

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`ProductVariantService`](internal-8.internal.ProductVariantService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`ProductVariantService`](internal-8.internal.ProductVariantService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
