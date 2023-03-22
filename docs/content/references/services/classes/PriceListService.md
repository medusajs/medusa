# Class: PriceListService

Provides layer to manipulate product tags.

## Hierarchy

- `TransactionBaseService`

  ↳ **`PriceListService`**

## Constructors

### constructor

• **new PriceListService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `PriceListConstructorProps` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/price-list.ts:57](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L57)

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

### customerGroupService\_

• `Protected` `Readonly` **customerGroupService\_**: [`CustomerGroupService`](CustomerGroupService.md)

#### Defined in

[packages/medusa/src/services/price-list.ts:48](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L48)

___

### featureFlagRouter\_

• `Protected` `Readonly` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/price-list.ts:55](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L55)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/price-list.ts:45](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L45)

___

### moneyAmountRepo\_

• `Protected` `Readonly` **moneyAmountRepo\_**: typeof `MoneyAmountRepository`

#### Defined in

[packages/medusa/src/services/price-list.ts:53](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L53)

___

### priceListRepo\_

• `Protected` `Readonly` **priceListRepo\_**: typeof `PriceListRepository`

#### Defined in

[packages/medusa/src/services/price-list.ts:52](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L52)

___

### productService\_

• `Protected` `Readonly` **productService\_**: [`ProductService`](ProductService.md)

#### Defined in

[packages/medusa/src/services/price-list.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L50)

___

### productVariantRepo\_

• `Protected` `Readonly` **productVariantRepo\_**: typeof `ProductVariantRepository`

#### Defined in

[packages/medusa/src/services/price-list.ts:54](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L54)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/price-list.ts:49](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L49)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/price-list.ts:46](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L46)

___

### variantService\_

• `Protected` `Readonly` **variantService\_**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/price-list.ts:51](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L51)

## Methods

### addCurrencyFromRegion

▸ `Protected` **addCurrencyFromRegion**<`T`\>(`prices`): `Promise`<`T`[]\>

Add `currency_code` to an MA record if `region_id`is passed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `PriceListPriceCreateInput` \| `PriceListPriceUpdateInput` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prices` | `T`[] | a list of PriceListPrice(Create/Update)Input records |

#### Returns

`Promise`<`T`[]\>

updated `prices` list

#### Defined in

[packages/medusa/src/services/price-list.ts:519](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L519)

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

[packages/medusa/src/services/price-list.ts:218](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L218)

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

[packages/medusa/src/services/price-list.ts:258](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L258)

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

[packages/medusa/src/services/price-list.ts:119](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L119)

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

[packages/medusa/src/services/price-list.ts:272](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L272)

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

[packages/medusa/src/services/price-list.ts:243](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L243)

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

[packages/medusa/src/services/price-list.ts:446](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L446)

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

[packages/medusa/src/services/price-list.ts:483](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L483)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`PriceList`[]\>

Lists Price Lists

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterablePriceListProps` | the query object for find |
| `config` | `FindConfig`<`FilterablePriceListProps`\> | the config to be used for find |

#### Returns

`Promise`<`PriceList`[]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/price-list.ts:292](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L292)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`PriceList`[], `number`]\>

Lists Price Lists and adds count

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `FilterablePriceListProps` | the query object for find |
| `config` | `FindConfig`<`FilterablePriceListProps`\> | the config to be used for find |

#### Returns

`Promise`<[`PriceList`[], `number`]\>

the result of the find operation

#### Defined in

[packages/medusa/src/services/price-list.ts:316](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L316)

___

### listProducts

▸ **listProducts**(`priceListId`, `selector?`, `config?`, `requiresPriceList?`): `Promise`<[`Product`[], `number`]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `priceListId` | `string` | `undefined` |
| `selector` | `Selector`<`Product`\> \| `FilterableProductProps` | `{}` |
| `config` | `FindConfig`<`Product`\> | `undefined` |
| `requiresPriceList` | `boolean` | `false` |

#### Returns

`Promise`<[`Product`[], `number`]\>

#### Defined in

[packages/medusa/src/services/price-list.ts:364](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L364)

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

[packages/medusa/src/services/price-list.ts:412](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L412)

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

[packages/medusa/src/services/price-list.ts:88](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L88)

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

[packages/medusa/src/services/price-list.ts:167](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L167)

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

[packages/medusa/src/services/price-list.ts:345](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/price-list.ts#L345)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
