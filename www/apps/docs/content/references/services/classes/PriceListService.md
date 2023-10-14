# Class: PriceListService

Provides layer to manipulate product tags.

## Hierarchy

- `TransactionBaseService`

  ↳ **`PriceListService`**

## Constructors

### constructor

• **new PriceListService**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `PriceListConstructorProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/price-list.ts:52](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L52)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customerGroupService\_

• `Protected` `Readonly` **customerGroupService\_**: [`CustomerGroupService`](CustomerGroupService.md)

#### Defined in

[medusa/src/services/price-list.ts:43](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L43)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/price-list.ts:50](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L50)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### moneyAmountRepo\_

• `Protected` `Readonly` **moneyAmountRepo\_**: `Repository`<`MoneyAmount`\> & { `addPriceListPrices`: (`priceListId`: `string`, `prices`: `PriceListPriceCreateInput`[], `overrideExisting`: `boolean`) => `Promise`<`MoneyAmount`[]\> ; `createProductVariantMoneyAmounts`: (`toCreate`: { `money_amount_id`: `string` ; `variant_id`: `string`  }[]) => `Promise`<`InsertResult`\> ; `deletePriceListPrices`: (`priceListId`: `string`, `moneyAmountIds`: `string`[]) => `Promise`<`void`\> ; `deleteVariantPricesNotIn`: (`variantIdOrData`: `string` \| { `prices`: `ProductVariantPrice`[] ; `variantId`: `string`  }[], `prices?`: `Price`[]) => `Promise`<`void`\> ; `findCurrencyMoneyAmounts`: (`where`: { `currency_code`: `string` ; `variant_id`: `string`  }[]) => `Promise`<{ `amount`: `number` ; `created_at`: `Date` ; `currency?`: `Currency` ; `currency_code`: `string` ; `deleted_at`: ``null`` \| `Date` ; `id`: `string` ; `max_quantity`: ``null`` \| `number` ; `min_quantity`: ``null`` \| `number` ; `price_list`: ``null`` \| `PriceList` ; `price_list_id`: ``null`` \| `string` ; `region?`: `Region` ; `region_id`: `string` ; `updated_at`: `Date` ; `variant`: `ProductVariant` ; `variant_id`: `any` ; `variants`: `ProductVariant`[]  }[]\> ; `findManyForVariantInPriceList`: (`variant_id`: `string`, `price_list_id`: `string`, `requiresPriceList`: `boolean`) => `Promise`<[`MoneyAmount`[], `number`]\> ; `findManyForVariantInRegion`: (`variant_id`: `string`, `region_id?`: `string`, `currency_code?`: `string`, `customer_id?`: `string`, `include_discount_prices?`: `boolean`, `include_tax_inclusive_pricing`: `boolean`) => `Promise`<[`MoneyAmount`[], `number`]\> ; `findManyForVariantsInRegion`: (`variant_ids`: `string` \| `string`[], `region_id?`: `string`, `currency_code?`: `string`, `customer_id?`: `string`, `include_discount_prices?`: `boolean`, `include_tax_inclusive_pricing`: `boolean`) => `Promise`<[`Record`<`string`, `MoneyAmount`[]\>, `number`]\> ; `findRegionMoneyAmounts`: (`where`: { `region_id`: `string` ; `variant_id`: `string`  }[]) => `Promise`<{ `amount`: `number` ; `created_at`: `Date` ; `currency?`: `Currency` ; `currency_code`: `string` ; `deleted_at`: ``null`` \| `Date` ; `id`: `string` ; `max_quantity`: ``null`` \| `number` ; `min_quantity`: ``null`` \| `number` ; `price_list`: ``null`` \| `PriceList` ; `price_list_id`: ``null`` \| `string` ; `region?`: `Region` ; `region_id`: `string` ; `updated_at`: `Date` ; `variant`: `ProductVariant` ; `variant_id`: `any` ; `variants`: `ProductVariant`[]  }[]\> ; `findVariantPricesNotIn`: (`variantId`: `string`, `prices`: `Price`[]) => `Promise`<`MoneyAmount`[]\> ; `getPricesForVariantInRegion`: (`variantId`: `string`, `regionId`: `undefined` \| `string`) => `Promise`<`MoneyAmount`[]\> ; `insertBulk`: (`data`: `_QueryDeepPartialEntity`<`MoneyAmount`\>[]) => `Promise`<`MoneyAmount`[]\> ; `updatePriceListPrices`: (`priceListId`: `string`, `updates`: `PriceListPriceUpdateInput`[]) => `Promise`<`MoneyAmount`[]\> ; `upsertVariantCurrencyPrice`: (`variantId`: `string`, `price`: `Price`) => `Promise`<`MoneyAmount`\>  }

#### Defined in

[medusa/src/services/price-list.ts:48](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L48)

___

### priceListRepo\_

• `Protected` `Readonly` **priceListRepo\_**: `Repository`<`PriceList`\> & { `listAndCount`: (`query`: `ExtendedFindConfig`<`PriceList`\>, `q?`: `string`) => `Promise`<[`PriceList`[], `number`]\> ; `listPriceListsVariantIdsMap`: (`priceListIds`: `string` \| `string`[]) => `Promise`<{ `[priceListId: string]`: `string`[];  }\>  }

#### Defined in

[medusa/src/services/price-list.ts:47](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L47)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[medusa/src/services/price-list.ts:45](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L45)

___

### productVariantRepo\_

• `Protected` `Readonly` **productVariantRepo\_**: `Repository`<`ProductVariant`\>

#### Defined in

[medusa/src/services/price-list.ts:49](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L49)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/price-list.ts:44](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L44)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### variantService\_

• `Protected` `Readonly` **variantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/price-list.ts:46](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L46)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addCurrencyFromRegion

▸ `Protected` **addCurrencyFromRegion**<`T`\>(`prices`): `Promise`<`T`[]\>

Add `currency_code` to an MA record if `region_id`is passed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `PriceListPriceUpdateInput` \| `PriceListPriceCreateInput` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prices` | `T`[] | a list of PriceListPrice(Create/Update)Input records |

#### Returns

`Promise`<`T`[]\>

updated `prices` list

#### Defined in

[medusa/src/services/price-list.ts:524](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L524)

___

### addPrices

▸ **addPrices**(`id`, `prices`, `replace?`): `Promise`<`PriceList`\>

Adds prices to a price list in bulk, optionally replacing all existing prices

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `id` | `string` | `undefined` | id of the price list |
| `prices` | `PriceListPriceCreateInput`[] | `undefined` | prices to add |
| `replace` | `boolean` | `false` | whether to replace existing prices |

#### Returns

`Promise`<`PriceList`\>

updated Price List

#### Defined in

[medusa/src/services/price-list.ts:242](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L242)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/price-list.ts:282](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L282)

___

### create

▸ **create**(`priceListObject`): `Promise`<`PriceList`\>

Creates a Price List

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `priceListObject` | `CreatePriceListInput` | the Price List to create |

#### Returns

`Promise`<`PriceList`\>

created Price List

#### Defined in

[medusa/src/services/price-list.ts:143](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L143)

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

[medusa/src/services/price-list.ts:296](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L296)

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

[medusa/src/services/price-list.ts:267](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L267)

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

[medusa/src/services/price-list.ts:451](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L451)

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

[medusa/src/services/price-list.ts:488](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L488)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`PriceList`[]\>

Lists Price Lists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterablePriceListProps` | the query object for find |
| `config` | `FindConfig`<`PriceList`\> | the config to be used for find |

#### Returns

`Promise`<`PriceList`[]\>

the result of the find operation

#### Defined in

[medusa/src/services/price-list.ts:316](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L316)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`PriceList`[], `number`]\>

Lists Price Lists and adds count

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterablePriceListProps` | the query object for find |
| `config` | `FindConfig`<`PriceList`\> | the config to be used for find |

#### Returns

`Promise`<[`PriceList`[], `number`]\>

the result of the find operation

#### Defined in

[medusa/src/services/price-list.ts:330](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L330)

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

[medusa/src/services/price-list.ts:109](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L109)

___

### listProducts

▸ **listProducts**(`priceListId`, `selector?`, `config?`, `requiresPriceList?`): `Promise`<[`Product`[], `number`]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `priceListId` | `string` | `undefined` |
| `selector` | `FilterableProductProps` \| `Selector`<`Product`\> | `{}` |
| `config` | `FindConfig`<`Product`\> | `undefined` |
| `requiresPriceList` | `boolean` | `false` |

#### Returns

`Promise`<[`Product`[], `number`]\>

#### Defined in

[medusa/src/services/price-list.ts:367](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L367)

___

### listVariants

▸ **listVariants**(`priceListId`, `selector?`, `config?`, `requiresPriceList?`): `Promise`<[`ProductVariant`[], `number`]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `priceListId` | `string` | `undefined` |
| `selector` | `FilterableProductVariantProps` | `{}` |
| `config` | `FindConfig`<`ProductVariant`\> | `undefined` |
| `requiresPriceList` | `boolean` | `false` |

#### Returns

`Promise`<[`ProductVariant`[], `number`]\>

#### Defined in

[medusa/src/services/price-list.ts:417](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L417)

___

### retrieve

▸ **retrieve**(`priceListId`, `config?`): `Promise`<`PriceList`\>

Retrieves a product tag by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `priceListId` | `string` | the id of the product tag to retrieve |
| `config` | `FindConfig`<`PriceList`\> | the config to retrieve the tag by |

#### Returns

`Promise`<`PriceList`\>

the collection.

#### Defined in

[medusa/src/services/price-list.ts:81](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L81)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`id`, `update`): `Promise`<`PriceList`\>

Updates a Price List

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the Product List to update |
| `update` | `UpdatePriceListInput` | the update to apply |

#### Returns

`Promise`<`PriceList`\>

updated Price List

#### Defined in

[medusa/src/services/price-list.ts:191](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L191)

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

[medusa/src/services/price-list.ts:346](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/services/price-list.ts#L346)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PriceListService`](PriceListService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PriceListService`](PriceListService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
