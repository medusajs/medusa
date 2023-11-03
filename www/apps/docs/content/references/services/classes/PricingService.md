# PricingService

Allows retrieval of prices.

## Hierarchy

- `TransactionBaseService`

  ↳ **`PricingService`**

## Constructors

### constructor

**new PricingService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/pricing.ts:62](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L62)

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

### featureFlagRouter

 `Protected` `Readonly` **featureFlagRouter**: `FlagRouter`

#### Defined in

[medusa/src/services/pricing.ts:58](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L58)

___

### manager\_

 `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### priceSelectionStrategy

 `Protected` `Readonly` **priceSelectionStrategy**: `IPriceSelectionStrategy`

#### Defined in

[medusa/src/services/pricing.ts:56](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L56)

___

### pricingModuleService

 `Protected` `Readonly` **pricingModuleService**: `IPricingModuleService`

#### Defined in

[medusa/src/services/pricing.ts:59](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L59)

___

### productVariantService

 `Protected` `Readonly` **productVariantService**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[medusa/src/services/pricing.ts:57](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L57)

___

### regionService

 `Protected` `Readonly` **regionService**: [`RegionService`](RegionService.md)

#### Defined in

[medusa/src/services/pricing.ts:54](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L54)

___

### remoteQuery

 `Protected` `Readonly` **remoteQuery**: `RemoteQueryFunction`

#### Defined in

[medusa/src/services/pricing.ts:60](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L60)

___

### taxProviderService

 `Protected` `Readonly` **taxProviderService**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[medusa/src/services/pricing.ts:55](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L55)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

### calculateTaxes

**calculateTaxes**(`variantPricing`, `productRates`): `TaxedPricing`

Gets the prices for a product variant

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantPricing` | `ProductVariantPricing` | the prices retrieved from a variant |
| `productRates` | `TaxServiceRate`[] | the tax rates that the product has applied |

#### Returns

`TaxedPricing`

#### Defined in

[medusa/src/services/pricing.ts:125](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L125)

___

### collectPricingContext

**collectPricingContext**(`context`): `Promise`<`PricingContext`\>

Collects additional information necessary for completing the price
selection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`PricingContext`\>

-`Promise`: The pricing context

#### Defined in

[medusa/src/services/pricing.ts:89](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L89)

___

### getPricingModuleVariantMoneyAmounts

`Private` **getPricingModuleVariantMoneyAmounts**(`variantIds`): `Promise`<`Map`<`string`, `MoneyAmount`[]\>\>

#### Parameters

| Name |
| :------ |
| `variantIds` | `string`[] |

#### Returns

`Promise`<`Map`<`string`, `MoneyAmount`[]\>\>

-`Promise`: 
	-`Map`: 
		-`string`: (optional) 
		-`MoneyAmount[]`: 

#### Defined in

[medusa/src/services/pricing.ts:640](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L640)

___

### getProductPricing

**getProductPricing**(`product`, `context`): `Promise`<Record<`string`, `ProductVariantPricing`\>\>

Gets all the variant prices for a product. All the product's variants will
be fetched.

#### Parameters

| Name | Description |
| :------ | :------ |
| `product` | `Pick`<`Product`, ``"id"`` \| ``"variants"``\> | the product to get pricing for. |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<Record<`string`, `ProductVariantPricing`\>\>

-`Promise`: A map of variant ids to their corresponding prices
	-`Record`: 
		-`string`: (optional) 

#### Defined in

[medusa/src/services/pricing.ts:538](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L538)

___

### getProductPricingById

**getProductPricingById**(`productId`, `context`): `Promise`<Record<`string`, `ProductVariantPricing`\>\>

Gets all the variant prices for a product by the product id

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the id of the product to get prices for |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<Record<`string`, `ProductVariantPricing`\>\>

-`Promise`: A map of variant ids to their corresponding prices
	-`Record`: 
		-`string`: (optional) 

#### Defined in

[medusa/src/services/pricing.ts:556](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L556)

___

### getProductPricing\_

`Private` **getProductPricing_**(`data`, `context`): `Promise`<`Map`<`string`, Record<`string`, `ProductVariantPricing`\>\>\>

#### Parameters

| Name |
| :------ |
| `data` | { `productId`: `string` ; `variants`: `ProductVariant`[]  }[] |
| `context` | `PricingContext` |

#### Returns

`Promise`<`Map`<`string`, Record<`string`, `ProductVariantPricing`\>\>\>

-`Promise`: 
	-`Map`: 
		-`string`: (optional) 
		-`Record`: 

#### Defined in

[medusa/src/services/pricing.ts:481](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L481)

___

### getProductVariantPricing

**getProductVariantPricing**(`variant`, `context`): `Promise`<`ProductVariantPricing`\>

Gets the prices for a product variant.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variant` | `Pick`<`ProductVariant`, ``"id"`` \| ``"product_id"``\> |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<`ProductVariantPricing`\>

-`Promise`: The product variant prices

#### Defined in

[medusa/src/services/pricing.ts:335](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L335)

___

### getProductVariantPricingById

**getProductVariantPricingById**(`variantId`, `context`): `Promise`<`ProductVariantPricing`\>

Gets the prices for a product variant by a variant id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the id of the variant to get prices for |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<`ProductVariantPricing`\>

-`Promise`: The product variant prices

**Deprecated**

Use [getProductVariantsPricing](PricingService.md#getproductvariantspricing) instead.

#### Defined in

[medusa/src/services/pricing.ts:384](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L384)

___

### getProductVariantPricingModulePricing\_

`Private` **getProductVariantPricingModulePricing_**(`variantPriceData`, `context`): `Promise`<`Map`<`any`, `any`\>\>

#### Parameters

| Name |
| :------ |
| `variantPriceData` | { `quantity?`: `number` ; `variantId`: `string`  }[] |
| `context` | `PricingContext` |

#### Returns

`Promise`<`Map`<`any`, `any`\>\>

-`Promise`: 
	-`Map`: 
		-`any`: (optional) 
		-`any`: (optional) 

#### Defined in

[medusa/src/services/pricing.ts:187](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L187)

___

### getProductVariantPricing\_

`Private` **getProductVariantPricing_**(`data`, `context`): `Promise`<`Map`<`string`, `ProductVariantPricing`\>\>

#### Parameters

| Name |
| :------ |
| `data` | { `quantity?`: `number` ; `variantId`: `string`  }[] |
| `context` | `PricingContext` |

#### Returns

`Promise`<`Map`<`string`, `ProductVariantPricing`\>\>

-`Promise`: 
	-`Map`: 
		-`string`: (optional) 

#### Defined in

[medusa/src/services/pricing.ts:271](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L271)

___

### getProductVariantsPricing

**getProductVariantsPricing**(`data`, `context`): `Promise`<{ `[variant_id: string]`: `ProductVariantPricing`;  }\>

Gets the prices for a collection of variants.

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | { `quantity?`: `number` ; `variantId`: `string`  }[] |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<{ `[variant_id: string]`: `ProductVariantPricing`;  }\>

-`Promise`: The product variant prices
	-``object``: (optional) 

#### Defined in

[medusa/src/services/pricing.ts:429](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L429)

___

### getShippingOptionPricing

**getShippingOptionPricing**(`shippingOption`, `context`): `Promise`<`PricedShippingOption`\>

Gets the prices for a shipping option.

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingOption` | `ShippingOption` | the shipping option to get prices for |
| `context` | `PriceSelectionContext` \| `PricingContext` | the price selection context to use |

#### Returns

`Promise`<`PricedShippingOption`\>

-`Promise`: The shipping option prices

#### Defined in

[medusa/src/services/pricing.ts:807](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L807)

___

### setAdminProductPricing

**setAdminProductPricing**(`products`): `Promise`<(`Product` \| `PricedProduct`)[]\>

#### Parameters

| Name |
| :------ |
| `products` | `Product`[] |

#### Returns

`Promise`<(`Product` \| `PricedProduct`)[]\>

-`Promise`: 
	-`(Product \| PricedProduct)[]`: 
		-`Product \| PricedProduct`: (optional) 

#### Defined in

[medusa/src/services/pricing.ts:754](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L754)

___

### setAdminVariantPricing

**setAdminVariantPricing**(`variants`, `context?`): `Promise`<`PricedVariant`[]\>

#### Parameters

| Name |
| :------ |
| `variants` | `ProductVariant`[] |
| `context` | `PriceSelectionContext` |

#### Returns

`Promise`<`PricedVariant`[]\>

-`Promise`: 
	-`PricedVariant[]`: 

#### Defined in

[medusa/src/services/pricing.ts:717](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L717)

___

### setProductPrices

**setProductPrices**(`products`, `context?`): `Promise`<(`Product` \| `PricedProduct`)[]\>

Set additional prices on a list of products.

#### Parameters

| Name | Description |
| :------ | :------ |
| `products` | `Product`[] | list of products on which to set additional prices |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<(`Product` \| `PricedProduct`)[]\>

-`Promise`: A list of products with variants decorated with prices
	-`(Product \| PricedProduct)[]`: 
		-`Product \| PricedProduct`: (optional) 

#### Defined in

[medusa/src/services/pricing.ts:605](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L605)

___

### setShippingOptionPrices

**setShippingOptionPrices**(`shippingOptions`, `context?`): `Promise`<`PricedShippingOption`[]\>

Set additional prices on a list of shipping options.

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingOptions` | `ShippingOption`[] | list of shipping options on which to set additional prices |
| `context` | `Omit`<`PriceSelectionContext`, ``"region_id"``\> | the price selection context to use |

#### Returns

`Promise`<`PricedShippingOption`[]\>

-`Promise`: A list of shipping options with prices
	-`PricedShippingOption[]`: 

#### Defined in

[medusa/src/services/pricing.ts:869](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L869)

___

### setVariantPrices

**setVariantPrices**(`variants`, `context?`): `Promise`<`PricedVariant`[]\>

Set additional prices on a list of product variants.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variants` | `ProductVariant`[] |
| `context` | `PriceSelectionContext` | the price selection context to use |

#### Returns

`Promise`<`PricedVariant`[]\>

-`Promise`: A list of products with variants decorated with prices
	-`PricedVariant[]`: 

#### Defined in

[medusa/src/services/pricing.ts:578](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/services/pricing.ts#L578)

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

### withTransaction

**withTransaction**(`transactionManager?`): [`PricingService`](PricingService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PricingService`](PricingService.md)

-`PricingService`: 

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/0af6e5534/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
