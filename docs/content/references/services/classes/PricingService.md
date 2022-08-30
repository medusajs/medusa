# Class: PricingService

Allows retrieval of prices.

## Hierarchy

- `TransactionBaseService`

  ↳ **`PricingService`**

## Constructors

### constructor

• **new PricingService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/pricing.ts:40](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L40)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/pricing.ts:33](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L33)

___

### priceSelectionStrategy

• `Protected` `Readonly` **priceSelectionStrategy**: `IPriceSelectionStrategy`

#### Defined in

[packages/medusa/src/services/pricing.ts:37](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L37)

___

### productVariantService

• `Protected` `Readonly` **productVariantService**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:38](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L38)

___

### regionService

• `Protected` `Readonly` **regionService**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:35](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L35)

___

### taxProviderService

• `Protected` `Readonly` **taxProviderService**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:36](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L36)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/pricing.ts:34](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L34)

## Methods

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### calculateTaxes

▸ **calculateTaxes**(`variantPricing`, `productRates`): `Promise`<`TaxedPricing`\>

Gets the prices for a product variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantPricing` | `ProductVariantPricing` | the prices retrieved from a variant |
| `productRates` | `TaxServiceRate`[] | the tax rates that the product has applied |

#### Returns

`Promise`<`TaxedPricing`\>

The tax related variant prices.

#### Defined in

[packages/medusa/src/services/pricing.ts:98](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L98)

___

### collectPricingContext

▸ **collectPricingContext**(`context`): `Promise`<`PricingContext`\>

Collects additional information neccessary for completing the price
selection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`PricingContext`\>

The pricing context

#### Defined in

[packages/medusa/src/services/pricing.ts:63](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L63)

___

### getProductPricing

▸ **getProductPricing**(`product`, `context`): `Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

Gets all the variant prices for a product. All the product's variants will
be fetched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `product` | `Pick`<`Product`, ``"id"`` \| ``"variants"``\> | the product to get pricing for. |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

A map of variant ids to their corresponding prices

#### Defined in

[packages/medusa/src/services/pricing.ts:286](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L286)

___

### getProductPricingById

▸ **getProductPricingById**(`productId`, `context`): `Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

Gets all the variant prices for a product by the product id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to get prices for |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

A map of variant ids to their corresponding prices

#### Defined in

[packages/medusa/src/services/pricing.ts:304](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L304)

___

### getProductPricing\_

▸ `Private` **getProductPricing_**(`productId`, `variants`, `context`): `Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `productId` | `string` |
| `variants` | `ProductVariant`[] |
| `context` | `PricingContext` |

#### Returns

`Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

#### Defined in

[packages/medusa/src/services/pricing.ts:248](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L248)

___

### getProductVariantPricing

▸ **getProductVariantPricing**(`variant`, `context`): `Promise`<`ProductVariantPricing`\>

Gets the prices for a product variant.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variant` | `Pick`<`ProductVariant`, ``"id"`` \| ``"product_id"``\> | the id of the variant to get prices for |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<`ProductVariantPricing`\>

The product variant prices

#### Defined in

[packages/medusa/src/services/pricing.ts:176](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L176)

___

### getProductVariantPricingById

▸ **getProductVariantPricingById**(`variantId`, `context`): `Promise`<`ProductVariantPricing`\>

Gets the prices for a product variant by a variant id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to get prices for |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<`ProductVariantPricing`\>

The product variant prices

#### Defined in

[packages/medusa/src/services/pricing.ts:214](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L214)

___

### getProductVariantPricing\_

▸ `Private` **getProductVariantPricing_**(`variantId`, `taxRates`, `context`): `Promise`<`ProductVariantPricing`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `variantId` | `string` |
| `taxRates` | `TaxServiceRate`[] |
| `context` | `PricingContext` |

#### Returns

`Promise`<`ProductVariantPricing`\>

#### Defined in

[packages/medusa/src/services/pricing.ts:134](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L134)

___

### getShippingOptionPricing

▸ **getShippingOptionPricing**(`shippingOption`, `context`): `Promise`<`PricedShippingOption`\>

Gets the prices for a shipping option.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingOption` | `ShippingOption` | the shipping option to get prices for |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<`PricedShippingOption`\>

The shipping option prices

#### Defined in

[packages/medusa/src/services/pricing.ts:390](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L390)

___

### setProductPrices

▸ **setProductPrices**(`products`, `context?`): `Promise`<(`Product` \| `PricedProduct`)[]\>

Set additional prices on a list of products.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `products` | `Product`[] | list of products on which to set additional prices |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<(`Product` \| `PricedProduct`)[]\>

A list of products with variants decorated with prices

#### Defined in

[packages/medusa/src/services/pricing.ts:347](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L347)

___

### setShippingOptionPrices

▸ **setShippingOptionPrices**(`shippingOptions`, `context?`): `Promise`<`PricedShippingOption`[]\>

Set additional prices on a list of shipping options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingOptions` | `ShippingOption`[] | list of shipping options on which to set additional prices |
| `context` | `Omit`<`PriceSelectionContext`, ``"region_id"``\> | the price selection context to use |

#### Returns

`Promise`<`PricedShippingOption`[]\>

A list of shipping options with prices

#### Defined in

[packages/medusa/src/services/pricing.ts:437](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L437)

___

### setVariantPrices

▸ **setVariantPrices**(`variants`, `context`): `Promise`<`PricedVariant`[]\>

Set additional prices on a list of product variants.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variants` | `ProductVariant`[] | list of variants on which to set additional prices |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`PricedVariant`[]\>

A list of products with variants decorated with prices

#### Defined in

[packages/medusa/src/services/pricing.ts:322](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/services/pricing.ts#L322)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PricingService`](PricingService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PricingService`](PricingService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
