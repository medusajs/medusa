# PriceListService

Provides layer to manipulate product tags.

## Hierarchy

- `TransactionBaseService`

  ↳ **`PriceListService`**

## Constructors

### constructor

**new PriceListService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `PriceListConstructorProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/price-list.ts:52](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L52)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### customerGroupService\_

 `Protected` `Readonly` **customerGroupService\_**: [`CustomerGroupService`](CustomerGroupService.md)

#### Defined in

[medusa/src/services/price-list.ts:43](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L43)

___

### featureFlagRouter\_

 `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/price-list.ts:50](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L50)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### moneyAmountRepo\_

 `Protected` `Readonly` **moneyAmountRepo\_**: `Repository`<`MoneyAmount`\> & { `addPriceListPrices`: Method addPriceListPrices ; `createProductVariantMoneyAmounts`: Method createProductVariantMoneyAmounts ; `deletePriceListPrices`: Method deletePriceListPrices ; `deleteVariantPricesNotIn`: Method deleteVariantPricesNotIn ; `findCurrencyMoneyAmounts`: Method findCurrencyMoneyAmounts ; `findManyForVariantInPriceList`: Method findManyForVariantInPriceList ; `findManyForVariantInRegion`: Method findManyForVariantInRegion ; `findManyForVariantsInRegion`: Method findManyForVariantsInRegion ; `findRegionMoneyAmounts`: Method findRegionMoneyAmounts ; `findVariantPricesNotIn`: Method findVariantPricesNotIn ; `getPricesForVariantInRegion`: Method getPricesForVariantInRegion ; `insertBulk`: Method insertBulk ; `updatePriceListPrices`: Method updatePriceListPrices ; `upsertVariantCurrencyPrice`: Method upsertVariantCurrencyPrice  }

#### Defined in

[medusa/src/services/price-list.ts:48](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L48)

___

### priceListRepo\_

 `Protected` `Readonly` **priceListRepo\_**: `Repository`<`PriceList`\> & { `listAndCount`: Method listAndCount ; `listPriceListsVariantIdsMap`: Method listPriceListsVariantIdsMap  }

#### Defined in

[medusa/src/services/price-list.ts:47](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L47)

___

### productService\_

 `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[medusa/src/services/price-list.ts:45](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L45)

___

### productVariantRepo\_

 `Protected` `Readonly` **productVariantRepo\_**: `Repository`<`ProductVariant`\>

#### Defined in

[medusa/src/services/price-list.ts:49](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L49)

___

### regionService\_

 `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/price-list.ts:44](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L44)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

___

### variantService\_

 `Protected` `Readonly` **variantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/price-list.ts:46](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L46)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addCurrencyFromRegion

`Protected` **addCurrencyFromRegion**<`T`\>(`prices`): `Promise`<`T`[]\>

Add `currency_code` to an MA record if `region_id`is passed.

| Name | Type |
| :------ | :------ |
| `T` | `PriceListPriceUpdateInput` \| `PriceListPriceCreateInput` |

#### Parameters

| Name | Description |
| :------ | :------ |
| `prices` | `T`[] | a list of PriceListPrice(Create/Update)Input records |

#### Returns

`Promise`<`T`[]\>

-`Promise`: updated `prices` list
	-`T[]`: 

#### Defined in

[medusa/src/services/price-list.ts:524](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L524)

___

### addPrices

**addPrices**(`id`, `prices`, `replace?`): `Promise`<`PriceList`\>

Adds prices to a price list in bulk, optionally replacing all existing prices

#### Parameters

| Name | Default value | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the price list |
| `prices` | `PriceListPriceCreateInput`[] | prices to add |
| `replace` | `boolean` | `false` | whether to replace existing prices |

#### Returns

`Promise`<`PriceList`\>

-`Promise`: updated Price List
	-`PriceList`: 

#### Defined in

[medusa/src/services/price-list.ts:242](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L242)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/price-list.ts:282](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L282)

___

### create

**create**(`priceListObject`): `Promise`<`PriceList`\>

Creates a Price List

#### Parameters

| Name | Description |
| :------ | :------ |
| `priceListObject` | `CreatePriceListInput` | the Price List to create |

#### Returns

`Promise`<`PriceList`\>

-`Promise`: created Price List
	-`PriceList`: 

#### Defined in

[medusa/src/services/price-list.ts:143](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L143)

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

[medusa/src/services/price-list.ts:296](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L296)

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

[medusa/src/services/price-list.ts:267](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L267)

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

[medusa/src/services/price-list.ts:451](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L451)

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

[medusa/src/services/price-list.ts:488](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L488)

___

### list

**list**(`selector?`, `config?`): `Promise`<`PriceList`[]\>

Lists Price Lists

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `FilterablePriceListProps` | the query object for find |
| `config` | `FindConfig`<`PriceList`\> | the config to be used for find |

#### Returns

`Promise`<`PriceList`[]\>

-`Promise`: the result of the find operation
	-`PriceList[]`: 
		-`PriceList`: 

#### Defined in

[medusa/src/services/price-list.ts:316](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L316)

___

### listAndCount

**listAndCount**(`selector?`, `config?`): `Promise`<[`PriceList`[], `number`]\>

Lists Price Lists and adds count

#### Parameters

| Name | Description |
| :------ | :------ |
| `selector` | `FilterablePriceListProps` | the query object for find |
| `config` | `FindConfig`<`PriceList`\> | the config to be used for find |

#### Returns

`Promise`<[`PriceList`[], `number`]\>

-`Promise`: the result of the find operation
	-`PriceList[]`: 
	-`number`: (optional) 

#### Defined in

[medusa/src/services/price-list.ts:330](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L330)

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

[medusa/src/services/price-list.ts:109](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L109)

___

### listProducts

**listProducts**(`priceListId`, `selector?`, `config?`, `requiresPriceList?`): `Promise`<[`Product`[], `number`]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `priceListId` | `string` |
| `selector` | `FilterableProductProps` \| `Selector`<`Product`\> |
| `config` | `FindConfig`<`Product`\> |
| `requiresPriceList` | `boolean` | `false` |

#### Returns

`Promise`<[`Product`[], `number`]\>

-`Promise`: 
	-`Product[]`: 
	-`number`: (optional) 

#### Defined in

[medusa/src/services/price-list.ts:367](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L367)

___

### listVariants

**listVariants**(`priceListId`, `selector?`, `config?`, `requiresPriceList?`): `Promise`<[`ProductVariant`[], `number`]\>

#### Parameters

| Name | Default value |
| :------ | :------ |
| `priceListId` | `string` |
| `selector` | `FilterableProductVariantProps` |
| `config` | `FindConfig`<`ProductVariant`\> |
| `requiresPriceList` | `boolean` | `false` |

#### Returns

`Promise`<[`ProductVariant`[], `number`]\>

-`Promise`: 
	-`ProductVariant[]`: 
	-`number`: (optional) 

#### Defined in

[medusa/src/services/price-list.ts:417](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L417)

___

### retrieve

**retrieve**(`priceListId`, `config?`): `Promise`<`PriceList`\>

Retrieves a product tag by id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `priceListId` | `string` | the id of the product tag to retrieve |
| `config` | `FindConfig`<`PriceList`\> | the config to retrieve the tag by |

#### Returns

`Promise`<`PriceList`\>

-`Promise`: the collection.
	-`PriceList`: 

#### Defined in

[medusa/src/services/price-list.ts:81](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L81)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

**update**(`id`, `update`): `Promise`<`PriceList`\>

Updates a Price List

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the id of the Product List to update |
| `update` | `UpdatePriceListInput` | the update to apply |

#### Returns

`Promise`<`PriceList`\>

-`Promise`: updated Price List
	-`PriceList`: 

#### Defined in

[medusa/src/services/price-list.ts:191](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L191)

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

[medusa/src/services/price-list.ts:346](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/price-list.ts#L346)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`PriceListService`](PriceListService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PriceListService`](PriceListService.md)

-`PriceListService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
