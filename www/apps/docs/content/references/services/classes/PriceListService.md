# PriceListService

Provides layer to manipulate product tags.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`PriceListService`**

## Constructors

### constructor

**new PriceListService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`PriceListConstructorProps`](../index.md#pricelistconstructorprops) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/price-list.ts:52](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L52)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customerGroupService\_

 `Protected` `Readonly` **customerGroupService\_**: [`CustomerGroupService`](CustomerGroupService.md)

#### Defined in

[packages/medusa/src/services/price-list.ts:43](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L43)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: [`FlagRouter`](FlagRouter.md)

#### Defined in

[packages/medusa/src/services/price-list.ts:50](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L50)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### moneyAmountRepo\_

 `Protected` `Readonly` **moneyAmountRepo\_**: [`Repository`](Repository.md)<[`MoneyAmount`](MoneyAmount.md)\> & { `addPriceListPrices`: Method addPriceListPrices ; `createProductVariantMoneyAmounts`: Method createProductVariantMoneyAmounts ; `deletePriceListPrices`: Method deletePriceListPrices ; `deleteVariantPricesNotIn`: Method deleteVariantPricesNotIn ; `findCurrencyMoneyAmounts`: Method findCurrencyMoneyAmounts ; `findManyForVariantInPriceList`: Method findManyForVariantInPriceList ; `findManyForVariantInRegion`: Method findManyForVariantInRegion ; `findManyForVariantsInRegion`: Method findManyForVariantsInRegion ; `findRegionMoneyAmounts`: Method findRegionMoneyAmounts ; `findVariantPricesNotIn`: Method findVariantPricesNotIn ; `getPricesForVariantInRegion`: Method getPricesForVariantInRegion ; `insertBulk`: Method insertBulk ; `updatePriceListPrices`: Method updatePriceListPrices ; `upsertVariantCurrencyPrice`: Method upsertVariantCurrencyPrice  }

#### Defined in

[packages/medusa/src/services/price-list.ts:48](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L48)

___

### priceListRepo\_

 `Protected` `Readonly` **priceListRepo\_**: [`Repository`](Repository.md)<[`PriceList`](PriceList.md)\> & { `listAndCount`: Method listAndCount ; `listPriceListsVariantIdsMap`: Method listPriceListsVariantIdsMap  }

#### Defined in

[packages/medusa/src/services/price-list.ts:47](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L47)

___

### productService\_

 `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/price-list.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L45)

___

### productVariantRepo\_

 `Protected` `Readonly` **productVariantRepo\_**: [`Repository`](Repository.md)<[`ProductVariant`](ProductVariant.md)\>

#### Defined in

[packages/medusa/src/services/price-list.ts:49](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L49)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/price-list.ts:44](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L44)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### variantService\_

 `Protected` `Readonly` **variantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/price-list.ts:46](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L46)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addCurrencyFromRegion

`Protected` **addCurrencyFromRegion**<`T`\>(`prices`): `Promise`<`T`[]\>

Add `currency_code` to an MA record if `region_id`is passed.

| Name | Type |
| :------ | :------ |
| `T` | [`PriceListPriceUpdateInput`](../index.md#pricelistpriceupdateinput) \| [`PriceListPriceCreateInput`](../index.md#pricelistpricecreateinput) |

#### Parameters

| Name | Description |
| :------ | :------ |
| `prices` | `T`[] | a list of PriceListPrice(Create/Update)Input records |

#### Returns

`Promise`<`T`[]\>

-`Promise`: updated `prices` list
	-`T[]`: 

#### Defined in

[packages/medusa/src/services/price-list.ts:524](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L524)

___

### addPrices

**addPrices**(`id`, `prices`, `replace?`): `Promise`<[`PriceList`](PriceList.md)\>

Adds prices to a price list in bulk, optionally replacing all existing prices

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the price list |
| `prices` | [`PriceListPriceCreateInput`](../index.md#pricelistpricecreateinput)[] | prices to add |
| `replace` | `boolean` | false | whether to replace existing prices |

#### Returns

`Promise`<[`PriceList`](PriceList.md)\>

-`Promise`: updated Price List
	-`PriceList`: 

#### Defined in

[packages/medusa/src/services/price-list.ts:242](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L242)

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
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### clearPrices

**clearPrices**(`id`): `Promise`<`void`\>

Removes all prices from a price list and deletes the removed prices in bulk

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | id of the price list |

#### Returns

`Promise`<`void`\>

-`Promise`: updated Price List

#### Defined in

[packages/medusa/src/services/price-list.ts:282](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L282)

___

### create

**create**(`priceListObject`): `Promise`<[`PriceList`](PriceList.md)\>

Creates a Price List

#### Parameters

| Name | Description |
| :------ | :------ |
| `priceListObject` | [`CreatePriceListInput`](../index.md#createpricelistinput) | the Price List to create |

#### Returns

`Promise`<[`PriceList`](PriceList.md)\>

-`Promise`: created Price List
	-`PriceList`: 

#### Defined in

[packages/medusa/src/services/price-list.ts:143](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L143)

___

### delete

**delete**(`id`): `Promise`<`void`\>

Deletes a Price List
Will never fail due to delete being idempotent.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | id of the price list |

#### Returns

`Promise`<`void`\>

-`Promise`: empty promise

#### Defined in

[packages/medusa/src/services/price-list.ts:296](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L296)

___

### deletePrices

**deletePrices**(`id`, `priceIds`): `Promise`<`void`\>

Removes prices from a price list and deletes the removed prices in bulk

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | id of the price list |
| `priceIds` | `string`[] | ids of the prices to delete |

#### Returns

`Promise`<`void`\>

-`Promise`: updated Price List

#### Defined in

[packages/medusa/src/services/price-list.ts:267](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L267)

___

### deleteProductPrices

**deleteProductPrices**(`priceListId`, `productIds`): `Promise`<[`string`[], `number`]\>

#### Parameters

| Name |
| :------ |
| `priceListId` | `string` |
| `productIds` | `string`[] |

#### Returns

`Promise`<[`string`[], `number`]\>

-`Promise`: 
	-`string[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/price-list.ts:451](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L451)

___

### deleteVariantPrices

**deleteVariantPrices**(`priceListId`, `variantIds`): `Promise`<[`string`[], `number`]\>

#### Parameters

| Name |
| :------ |
| `priceListId` | `string` |
| `variantIds` | `string`[] |

#### Returns

`Promise`<[`string`[], `number`]\>

-`Promise`: 
	-`string[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/price-list.ts:488](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L488)

___

### list

**list**(`selector?`, `config?`): `Promise`<[`PriceList`](PriceList.md)[]\>

Lists Price Lists

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`FilterablePriceListProps`](FilterablePriceListProps.md) | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`PriceList`](PriceList.md)\> | the config to be used for find |

#### Returns

`Promise`<[`PriceList`](PriceList.md)[]\>

-`Promise`: the result of the find operation
	-`PriceList[]`: 
		-`PriceList`: 

#### Defined in

[packages/medusa/src/services/price-list.ts:316](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L316)

___

### listAndCount

**listAndCount**(`selector?`, `config?`): `Promise`<[[`PriceList`](PriceList.md)[], `number`]\>

Lists Price Lists and adds count

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | [`FilterablePriceListProps`](FilterablePriceListProps.md) | the query object for find |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`PriceList`](PriceList.md)\> | the config to be used for find |

#### Returns

`Promise`<[[`PriceList`](PriceList.md)[], `number`]\>

-`Promise`: the result of the find operation
	-`PriceList[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/price-list.ts:330](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L330)

___

### listPriceListsVariantIdsMap

**listPriceListsVariantIdsMap**(`priceListIds`): `Promise`<{ `[priceListId: string]`: `string`[];  }\>

#### Parameters

| Name |
| :------ |
| `priceListIds` | `string` \| `string`[] |

#### Returns

`Promise`<{ `[priceListId: string]`: `string`[];  }\>

-`Promise`: 
	-``object``: (optional) 

#### Defined in

[packages/medusa/src/services/price-list.ts:109](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L109)

___

### listProducts

**listProducts**(`priceListId`, `selector?`, `config?`, `requiresPriceList?`): `Promise`<[[`Product`](Product.md)[], `number`]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `priceListId` | `string` |
| `selector` | [`FilterableProductProps`](FilterableProductProps.md) \| [`Selector`](../index.md#selector)<[`Product`](Product.md)\> |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`Product`](Product.md)\> |
| `requiresPriceList` | `boolean` | false |

#### Returns

`Promise`<[[`Product`](Product.md)[], `number`]\>

-`Promise`: 
	-`Product[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/price-list.ts:367](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L367)

___

### listVariants

**listVariants**(`priceListId`, `selector?`, `config?`, `requiresPriceList?`): `Promise`<[[`ProductVariant`](ProductVariant.md)[], `number`]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `priceListId` | `string` |
| `selector` | [`FilterableProductVariantProps`](FilterableProductVariantProps.md) |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`ProductVariant`](ProductVariant.md)\> |
| `requiresPriceList` | `boolean` | false |

#### Returns

`Promise`<[[`ProductVariant`](ProductVariant.md)[], `number`]\>

-`Promise`: 
	-`ProductVariant[]`: 
	-`number`: (optional) 

#### Defined in

[packages/medusa/src/services/price-list.ts:417](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L417)

___

### retrieve

**retrieve**(`priceListId`, `config?`): `Promise`<[`PriceList`](PriceList.md)\>

Retrieves a product tag by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `priceListId` | `string` | the id of the product tag to retrieve |
| `config` | [`FindConfig`](../interfaces/FindConfig.md)<[`PriceList`](PriceList.md)\> | the config to retrieve the tag by |

#### Returns

`Promise`<[`PriceList`](PriceList.md)\>

-`Promise`: the collection.
	-`PriceList`: 

#### Defined in

[packages/medusa/src/services/price-list.ts:81](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L81)

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

[TransactionBaseService](TransactionBaseService.md).[shouldRetryTransaction_](TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`id`, `update`): `Promise`<[`PriceList`](PriceList.md)\>

Updates a Price List

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the Product List to update |
| `update` | [`UpdatePriceListInput`](../index.md#updatepricelistinput) | the update to apply |

#### Returns

`Promise`<[`PriceList`](PriceList.md)\>

-`Promise`: updated Price List
	-`PriceList`: 

#### Defined in

[packages/medusa/src/services/price-list.ts:191](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L191)

___

### upsertCustomerGroups\_

`Protected` **upsertCustomerGroups_**(`priceListId`, `customerGroups`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `priceListId` | `string` |
| `customerGroups` | { `id`: `string`  }[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/price-list.ts:346](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/price-list.ts#L346)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`PriceListService`](PriceListService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`PriceListService`](PriceListService.md)

-`PriceListService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
