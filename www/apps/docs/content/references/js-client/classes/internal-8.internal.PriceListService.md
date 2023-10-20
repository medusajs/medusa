---
displayed_sidebar: jsClientSidebar
---

# Class: PriceListService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).PriceListService

Provides layer to manipulate product tags.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`PriceListService`**

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

### customerGroupService\_

• `Protected` `Readonly` **customerGroupService\_**: [`CustomerGroupService`](internal-8.internal.CustomerGroupService.md)

#### Defined in

packages/medusa/dist/services/price-list.d.ts:31

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/price-list.d.ts:38

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### moneyAmountRepo\_

• `Protected` `Readonly` **moneyAmountRepo\_**: `Repository`<[`MoneyAmount`](internal-3.MoneyAmount.md)\> & { `addPriceListPrices`: (`priceListId`: `string`, `prices`: [`PriceListPriceCreateInput`](../modules/internal-8.internal.md#pricelistpricecreateinput)[], `overrideExisting?`: `boolean`) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `createProductVariantMoneyAmounts`: (`toCreate`: { `money_amount_id`: `string` ; `variant_id`: `string`  }[]) => `Promise`<`InsertResult`\> ; `deletePriceListPrices`: (`priceListId`: `string`, `moneyAmountIds`: `string`[]) => `Promise`<`void`\> ; `deleteVariantPricesNotIn`: (`variantIdOrData`: `string` \| { `prices`: [`ProductVariantPrice`](../modules/internal-8.md#productvariantprice)[] ; `variantId`: `string`  }[], `prices?`: [`Price`](../modules/internal-8.md#price)[]) => `Promise`<`void`\> ; `findCurrencyMoneyAmounts`: (`where`: { `currency_code`: `string` ; `variant_id`: `string`  }[]) => `Promise`<{ `amount`: `number` ; `created_at`: `Date` ; `currency?`: [`Currency`](internal-3.Currency.md) ; `currency_code`: `string` ; `deleted_at`: ``null`` \| `Date` ; `id`: `string` ; `max_quantity`: ``null`` \| `number` ; `min_quantity`: ``null`` \| `number` ; `price_list`: ``null`` \| [`PriceList`](internal-3.PriceList.md) ; `price_list_id`: ``null`` \| `string` ; `region?`: [`Region`](internal-3.Region.md) ; `region_id`: `string` ; `updated_at`: `Date` ; `variant`: [`ProductVariant`](internal-3.ProductVariant.md) ; `variant_id`: `any` ; `variants`: [`ProductVariant`](internal-3.ProductVariant.md)[]  }[]\> ; `findManyForVariantInPriceList`: (`variant_id`: `string`, `price_list_id`: `string`, `requiresPriceList?`: `boolean`) => `Promise`<[[`MoneyAmount`](internal-3.MoneyAmount.md)[], `number`]\> ; `findManyForVariantInRegion`: (`variant_id`: `string`, `region_id?`: `string`, `currency_code?`: `string`, `customer_id?`: `string`, `include_discount_prices?`: `boolean`, `include_tax_inclusive_pricing?`: `boolean`) => `Promise`<[[`MoneyAmount`](internal-3.MoneyAmount.md)[], `number`]\> ; `findManyForVariantsInRegion`: (`variant_ids`: `string` \| `string`[], `region_id?`: `string`, `currency_code?`: `string`, `customer_id?`: `string`, `include_discount_prices?`: `boolean`, `include_tax_inclusive_pricing?`: `boolean`) => `Promise`<[[`Record`](../modules/internal.md#record)<`string`, [`MoneyAmount`](internal-3.MoneyAmount.md)[]\>, `number`]\> ; `findRegionMoneyAmounts`: (`where`: { `region_id`: `string` ; `variant_id`: `string`  }[]) => `Promise`<{ `amount`: `number` ; `created_at`: `Date` ; `currency?`: [`Currency`](internal-3.Currency.md) ; `currency_code`: `string` ; `deleted_at`: ``null`` \| `Date` ; `id`: `string` ; `max_quantity`: ``null`` \| `number` ; `min_quantity`: ``null`` \| `number` ; `price_list`: ``null`` \| [`PriceList`](internal-3.PriceList.md) ; `price_list_id`: ``null`` \| `string` ; `region?`: [`Region`](internal-3.Region.md) ; `region_id`: `string` ; `updated_at`: `Date` ; `variant`: [`ProductVariant`](internal-3.ProductVariant.md) ; `variant_id`: `any` ; `variants`: [`ProductVariant`](internal-3.ProductVariant.md)[]  }[]\> ; `findVariantPricesNotIn`: (`variantId`: `string`, `prices`: [`Price`](../modules/internal-8.md#price)[]) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `getPricesForVariantInRegion`: (`variantId`: `string`, `regionId`: `undefined` \| `string`) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `insertBulk`: (`data`: `_QueryDeepPartialEntity`<[`MoneyAmount`](internal-3.MoneyAmount.md)\>[]) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `updatePriceListPrices`: (`priceListId`: `string`, `updates`: [`PriceListPriceUpdateInput`](../modules/internal-8.internal.md#pricelistpriceupdateinput)[]) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)[]\> ; `upsertVariantCurrencyPrice`: (`variantId`: `string`, `price`: [`Price`](../modules/internal-8.md#price)) => `Promise`<[`MoneyAmount`](internal-3.MoneyAmount.md)\>  }

#### Defined in

packages/medusa/dist/services/price-list.d.ts:36

___

### priceListRepo\_

• `Protected` `Readonly` **priceListRepo\_**: `Repository`<[`PriceList`](internal-3.PriceList.md)\> & { `listAndCount`: (`query`: [`ExtendedFindConfig`](../modules/internal-8.internal.md#extendedfindconfig)<[`PriceList`](internal-3.PriceList.md)\>, `q?`: `string`) => `Promise`<[[`PriceList`](internal-3.PriceList.md)[], `number`]\> ; `listPriceListsVariantIdsMap`: (`priceListIds`: `string` \| `string`[]) => `Promise`<{ `[priceListId: string]`: `string`[];  }\>  }

#### Defined in

packages/medusa/dist/services/price-list.d.ts:35

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](internal-8.internal.ProductService.md)

#### Defined in

packages/medusa/dist/services/price-list.d.ts:33

___

### productVariantRepo\_

• `Protected` `Readonly` **productVariantRepo\_**: `Repository`<[`ProductVariant`](internal-3.ProductVariant.md)\>

#### Defined in

packages/medusa/dist/services/price-list.d.ts:37

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/price-list.d.ts:32

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### variantService\_

• `Protected` `Readonly` **variantService\_**: [`ProductVariantService`](internal-8.internal.ProductVariantService.md)

#### Defined in

packages/medusa/dist/services/price-list.d.ts:34

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

### addCurrencyFromRegion

▸ `Protected` **addCurrencyFromRegion**<`T`\>(`prices`): `Promise`<`T`[]\>

Add `currency_code` to an MA record if `region_id`is passed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PriceListPriceCreateInput`](../modules/internal-8.internal.md#pricelistpricecreateinput) \| [`PriceListPriceUpdateInput`](../modules/internal-8.internal.md#pricelistpriceupdateinput) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prices` | `T`[] | a list of PriceListPrice(Create/Update)Input records |

#### Returns

`Promise`<`T`[]\>

updated `prices` list

#### Defined in

packages/medusa/dist/services/price-list.d.ts:117

___

### addPrices

▸ **addPrices**(`id`, `prices`, `replace?`): `Promise`<[`PriceList`](internal-3.PriceList.md)\>

Adds prices to a price list in bulk, optionally replacing all existing prices

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the price list |
| `prices` | [`PriceListPriceCreateInput`](../modules/internal-8.internal.md#pricelistpricecreateinput)[] | prices to add |
| `replace?` | `boolean` | whether to replace existing prices |

#### Returns

`Promise`<[`PriceList`](internal-3.PriceList.md)\>

updated Price List

#### Defined in

packages/medusa/dist/services/price-list.d.ts:70

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

### clearPrices

▸ **clearPrices**(`id`): `Promise`<`void`\>

Removes all prices from a price list and deletes the removed prices in bulk

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the price list |

#### Returns

`Promise`<`void`\>

updated Price List

#### Defined in

packages/medusa/dist/services/price-list.d.ts:83

___

### create

▸ **create**(`priceListObject`): `Promise`<[`PriceList`](internal-3.PriceList.md)\>

Creates a Price List

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `priceListObject` | [`CreatePriceListInput`](../modules/internal-8.internal.md#createpricelistinput) | the Price List to create |

#### Returns

`Promise`<[`PriceList`](internal-3.PriceList.md)\>

created Price List

#### Defined in

packages/medusa/dist/services/price-list.d.ts:55

___

### delete

▸ **delete**(`id`): `Promise`<`void`\>

Deletes a Price List
Will never fail due to delete being idempotent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the price list |

#### Returns

`Promise`<`void`\>

empty promise

#### Defined in

packages/medusa/dist/services/price-list.d.ts:90

___

### deletePrices

▸ **deletePrices**(`id`, `priceIds`): `Promise`<`void`\>

Removes prices from a price list and deletes the removed prices in bulk

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the price list |
| `priceIds` | `string`[] | ids of the prices to delete |

#### Returns

`Promise`<`void`\>

updated Price List

#### Defined in

packages/medusa/dist/services/price-list.d.ts:77

___

### deleteProductPrices

▸ **deleteProductPrices**(`priceListId`, `productIds`): `Promise`<[`string`[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `productIds` | `string`[] |

#### Returns

`Promise`<[`string`[], `number`]\>

#### Defined in

packages/medusa/dist/services/price-list.d.ts:110

___

### deleteVariantPrices

▸ **deleteVariantPrices**(`priceListId`, `variantIds`): `Promise`<[`string`[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `variantIds` | `string`[] |

#### Returns

`Promise`<[`string`[], `number`]\>

#### Defined in

packages/medusa/dist/services/price-list.d.ts:111

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<[`PriceList`](internal-3.PriceList.md)[]\>

Lists Price Lists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`FilterablePriceListProps`](internal-8.internal.FilterablePriceListProps.md) | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`PriceList`](internal-3.PriceList.md)\> | the config to be used for find |

#### Returns

`Promise`<[`PriceList`](internal-3.PriceList.md)[]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/price-list.d.ts:97

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[[`PriceList`](internal-3.PriceList.md)[], `number`]\>

Lists Price Lists and adds count

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`FilterablePriceListProps`](internal-8.internal.FilterablePriceListProps.md) | the query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`PriceList`](internal-3.PriceList.md)\> | the config to be used for find |

#### Returns

`Promise`<[[`PriceList`](internal-3.PriceList.md)[], `number`]\>

the result of the find operation

#### Defined in

packages/medusa/dist/services/price-list.d.ts:104

___

### listPriceListsVariantIdsMap

▸ **listPriceListsVariantIdsMap**(`priceListIds`): `Promise`<{ `[priceListId: string]`: `string`[];  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListIds` | `string` \| `string`[] |

#### Returns

`Promise`<{ `[priceListId: string]`: `string`[];  }\>

#### Defined in

packages/medusa/dist/services/price-list.d.ts:47

___

### listProducts

▸ **listProducts**(`priceListId`, `selector?`, `config?`, `requiresPriceList?`): `Promise`<[[`Product`](internal-3.Product.md)[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `selector?` | [`FilterableProductProps`](internal-8.FilterableProductProps.md) \| [`Selector`](../modules/internal-8.internal.md#selector)<[`Product`](internal-3.Product.md)\> |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Product`](internal-3.Product.md)\> |
| `requiresPriceList?` | `boolean` |

#### Returns

`Promise`<[[`Product`](internal-3.Product.md)[], `number`]\>

#### Defined in

packages/medusa/dist/services/price-list.d.ts:108

___

### listVariants

▸ **listVariants**(`priceListId`, `selector?`, `config?`, `requiresPriceList?`): `Promise`<[[`ProductVariant`](internal-3.ProductVariant.md)[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `selector?` | [`FilterableProductVariantProps`](internal-8.FilterableProductVariantProps.md) |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`ProductVariant`](internal-3.ProductVariant.md)\> |
| `requiresPriceList?` | `boolean` |

#### Returns

`Promise`<[[`ProductVariant`](internal-3.ProductVariant.md)[], `number`]\>

#### Defined in

packages/medusa/dist/services/price-list.d.ts:109

___

### retrieve

▸ **retrieve**(`priceListId`, `config?`): `Promise`<[`PriceList`](internal-3.PriceList.md)\>

Retrieves a product tag by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `priceListId` | `string` | the id of the product tag to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`PriceList`](internal-3.PriceList.md)\> | the config to retrieve the tag by |

#### Returns

`Promise`<[`PriceList`](internal-3.PriceList.md)\>

the collection.

#### Defined in

packages/medusa/dist/services/price-list.d.ts:46

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

▸ **update**(`id`, `update`): `Promise`<[`PriceList`](internal-3.PriceList.md)\>

Updates a Price List

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the Product List to update |
| `update` | [`UpdatePriceListInput`](../modules/internal-8.internal.md#updatepricelistinput) | the update to apply |

#### Returns

`Promise`<[`PriceList`](internal-3.PriceList.md)\>

updated Price List

#### Defined in

packages/medusa/dist/services/price-list.d.ts:62

___

### upsertCustomerGroups\_

▸ `Protected` **upsertCustomerGroups_**(`priceListId`, `customerGroups`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `priceListId` | `string` |
| `customerGroups` | { `id`: `string`  }[] |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/medusa/dist/services/price-list.d.ts:105

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PriceListService`](internal-8.internal.PriceListService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PriceListService`](internal-8.internal.PriceListService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
