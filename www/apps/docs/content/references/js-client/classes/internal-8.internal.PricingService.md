---
displayed_sidebar: jsClientSidebar
---

# Class: PricingService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).PricingService

Allows retrieval of prices.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`PricingService`**

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

### featureFlagRouter

• `Protected` `Readonly` **featureFlagRouter**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/pricing.d.ts:25

___

### getProductPricing\_

• `Private` **getProductPricing\_**: `any`

#### Defined in

packages/medusa/dist/services/pricing.d.ts:69

___

### getProductVariantPricing\_

• `Private` **getProductVariantPricing\_**: `any`

#### Defined in

packages/medusa/dist/services/pricing.d.ts:41

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### priceSelectionStrategy

• `Protected` `Readonly` **priceSelectionStrategy**: [`IPriceSelectionStrategy`](../interfaces/internal-8.internal.IPriceSelectionStrategy.md)

#### Defined in

packages/medusa/dist/services/pricing.d.ts:23

___

### productVariantService

• `Protected` `Readonly` **productVariantService**: [`ProductVariantService`](internal-8.internal.ProductVariantService.md)

#### Defined in

packages/medusa/dist/services/pricing.d.ts:24

___

### regionService

• `Protected` `Readonly` **regionService**: [`RegionService`](internal-8.internal.RegionService.md)

#### Defined in

packages/medusa/dist/services/pricing.d.ts:21

___

### taxProviderService

• `Protected` `Readonly` **taxProviderService**: [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Defined in

packages/medusa/dist/services/pricing.d.ts:22

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

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

### calculateTaxes

▸ **calculateTaxes**(`variantPricing`, `productRates`): [`TaxedPricing`](../modules/internal-8.md#taxedpricing)

Gets the prices for a product variant

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantPricing` | [`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing) | the prices retrieved from a variant |
| `productRates` | [`TaxServiceRate`](../modules/internal-8.md#taxservicerate)[] | the tax rates that the product has applied |

#### Returns

[`TaxedPricing`](../modules/internal-8.md#taxedpricing)

The tax related variant prices.

#### Defined in

packages/medusa/dist/services/pricing.d.ts:40

___

### collectPricingContext

▸ **collectPricingContext**(`context`): `Promise`<[`PricingContext`](../modules/internal-8.md#pricingcontext)\>

Collects additional information necessary for completing the price
selection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | the price selection context to use |

#### Returns

`Promise`<[`PricingContext`](../modules/internal-8.md#pricingcontext)\>

The pricing context

#### Defined in

packages/medusa/dist/services/pricing.d.ts:33

___

### getProductPricing

▸ **getProductPricing**(`product`, `context`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, [`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing)\>\>

Gets all the variant prices for a product. All the product's variants will
be fetched.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `product` | [`Pick`](../modules/internal-1.md#pick)<[`Product`](internal-3.Product.md), ``"id"`` \| ``"variants"``\> | the product to get pricing for. |
| `context` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | the price selection context to use |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, [`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing)\>\>

A map of variant ids to their corresponding prices

#### Defined in

packages/medusa/dist/services/pricing.d.ts:77

___

### getProductPricingById

▸ **getProductPricingById**(`productId`, `context`): `Promise`<[`Record`](../modules/internal.md#record)<`string`, [`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing)\>\>

Gets all the variant prices for a product by the product id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the id of the product to get prices for |
| `context` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | the price selection context to use |

#### Returns

`Promise`<[`Record`](../modules/internal.md#record)<`string`, [`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing)\>\>

A map of variant ids to their corresponding prices

#### Defined in

packages/medusa/dist/services/pricing.d.ts:84

___

### getProductVariantPricing

▸ **getProductVariantPricing**(`variant`, `context`): `Promise`<[`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing)\>

Gets the prices for a product variant.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variant` | [`Pick`](../modules/internal-1.md#pick)<[`ProductVariant`](internal-3.ProductVariant.md), ``"id"`` \| ``"product_id"``\> |  |
| `context` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) \| [`PricingContext`](../modules/internal-8.md#pricingcontext) | the price selection context to use |

#### Returns

`Promise`<[`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing)\>

The product variant prices

#### Defined in

packages/medusa/dist/services/pricing.d.ts:48

___

### getProductVariantPricingById

▸ **getProductVariantPricingById**(`variantId`, `context`): `Promise`<[`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing)\>

Gets the prices for a product variant by a variant id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to get prices for |
| `context` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) \| [`PricingContext`](../modules/internal-8.md#pricingcontext) | the price selection context to use |

#### Returns

`Promise`<[`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing)\>

The product variant prices

**`Deprecated`**

Use [getProductVariantsPricing](internal-8.internal.PricingService.md#getproductvariantspricing) instead.

#### Defined in

packages/medusa/dist/services/pricing.d.ts:56

___

### getProductVariantsPricing

▸ **getProductVariantsPricing**(`data`, `context`): `Promise`<{ `[variant_id: string]`: [`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing);  }\>

Gets the prices for a collection of variants.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | { `quantity?`: `number` ; `variantId`: `string`  }[] |  |
| `context` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) \| [`PricingContext`](../modules/internal-8.md#pricingcontext) | the price selection context to use |

#### Returns

`Promise`<{ `[variant_id: string]`: [`ProductVariantPricing`](../modules/internal-8.md#productvariantpricing);  }\>

The product variant prices

#### Defined in

packages/medusa/dist/services/pricing.d.ts:63

___

### getShippingOptionPricing

▸ **getShippingOptionPricing**(`shippingOption`, `context`): `Promise`<[`PricedShippingOption`](../modules/internal-8.md#pricedshippingoption)\>

Gets the prices for a shipping option.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingOption` | [`ShippingOption`](internal-3.ShippingOption.md) | the shipping option to get prices for |
| `context` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) \| [`PricingContext`](../modules/internal-8.md#pricingcontext) | the price selection context to use |

#### Returns

`Promise`<[`PricedShippingOption`](../modules/internal-8.md#pricedshippingoption)\>

The shipping option prices

#### Defined in

packages/medusa/dist/services/pricing.d.ts:105

___

### setProductPrices

▸ **setProductPrices**(`products`, `context?`): `Promise`<([`Product`](internal-3.Product.md) \| [`PricedProduct`](../modules/internal-8.md#pricedproduct))[]\>

Set additional prices on a list of products.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `products` | [`Product`](internal-3.Product.md)[] | list of products on which to set additional prices |
| `context?` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | the price selection context to use |

#### Returns

`Promise`<([`Product`](internal-3.Product.md) \| [`PricedProduct`](../modules/internal-8.md#pricedproduct))[]\>

A list of products with variants decorated with prices

#### Defined in

packages/medusa/dist/services/pricing.d.ts:98

___

### setShippingOptionPrices

▸ **setShippingOptionPrices**(`shippingOptions`, `context?`): `Promise`<[`PricedShippingOption`](../modules/internal-8.md#pricedshippingoption)[]\>

Set additional prices on a list of shipping options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingOptions` | [`ShippingOption`](internal-3.ShippingOption.md)[] | list of shipping options on which to set additional prices |
| `context?` | [`Omit`](../modules/internal-1.md#omit)<[`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext), ``"region_id"``\> | the price selection context to use |

#### Returns

`Promise`<[`PricedShippingOption`](../modules/internal-8.md#pricedshippingoption)[]\>

A list of shipping options with prices

#### Defined in

packages/medusa/dist/services/pricing.d.ts:112

___

### setVariantPrices

▸ **setVariantPrices**(`variants`, `context?`): `Promise`<[`PricedVariant`](../modules/internal-8.md#pricedvariant)[]\>

Set additional prices on a list of product variants.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variants` | [`ProductVariant`](internal-3.ProductVariant.md)[] |  |
| `context?` | [`PriceSelectionContext`](../modules/internal-8.internal.md#priceselectioncontext) | the price selection context to use |

#### Returns

`Promise`<[`PricedVariant`](../modules/internal-8.md#pricedvariant)[]\>

A list of products with variants decorated with prices

#### Defined in

packages/medusa/dist/services/pricing.d.ts:91

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

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`PricingService`](internal-8.internal.PricingService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`PricingService`](internal-8.internal.PricingService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
