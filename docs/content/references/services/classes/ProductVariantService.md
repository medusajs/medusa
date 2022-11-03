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

[packages/medusa/src/services/product-variant.ts:53](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L53)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### cartRepository\_

• `Protected` `Readonly` **cartRepository\_**: typeof `CartRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:51](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L51)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/product-variant.ts:46](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L46)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/product-variant.ts:41](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L41)

___

### moneyAmountRepository\_

• `Protected` `Readonly` **moneyAmountRepository\_**: typeof `MoneyAmountRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:49](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L49)

___

### priceSelectionStrategy\_

• `Protected` `Readonly` **priceSelectionStrategy\_**: `IPriceSelectionStrategy`

#### Defined in

[packages/medusa/src/services/product-variant.ts:48](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L48)

___

### productOptionValueRepository\_

• `Protected` `Readonly` **productOptionValueRepository\_**: typeof `ProductOptionValueRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:50](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L50)

___

### productRepository\_

• `Protected` `Readonly` **productRepository\_**: typeof `ProductRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:45](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L45)

___

### productVariantRepository\_

• `Protected` `Readonly` **productVariantRepository\_**: typeof `ProductVariantRepository`

#### Defined in

[packages/medusa/src/services/product-variant.ts:44](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L44)

___

### regionService\_

• `Protected` `Readonly` **regionService\_**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/product-variant.ts:47](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L47)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/product-variant.ts:42](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L42)

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

[packages/medusa/src/services/product-variant.ts:35](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L35)

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

[packages/medusa/src/services/product-variant.ts:498](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L498)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/product-variant.ts:147](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L147)

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

[packages/medusa/src/services/product-variant.ts:651](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L651)

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

[packages/medusa/src/services/product-variant.ts:525](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L525)

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

[packages/medusa/src/services/product-variant.ts:724](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L724)

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

[packages/medusa/src/services/product-variant.ts:374](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L374)

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

[packages/medusa/src/services/product-variant.ts:593](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L593)

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

[packages/medusa/src/services/product-variant.ts:552](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L552)

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

[packages/medusa/src/services/product-variant.ts:685](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L685)

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

[packages/medusa/src/services/product-variant.ts:83](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L83)

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

[packages/medusa/src/services/product-variant.ts:111](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L111)

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

[packages/medusa/src/services/product-variant.ts:439](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L439)

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

[packages/medusa/src/services/product-variant.ts:403](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L403)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/services/product-variant.ts:255](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L255)

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

[packages/medusa/src/services/product-variant.ts:460](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L460)

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

[packages/medusa/src/services/product-variant.ts:333](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/services/product-variant.ts#L333)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/0b0d50b47/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
