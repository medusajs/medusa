# PricingService

Allows retrieval of prices.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`PricingService`**

## Constructors

### constructor

**new PricingService**(`«destructured»`)

#### Parameters

| Name |
| :------ |
| `«destructured»` | [`InjectedDependencies`](../types/InjectedDependencies-25.md) |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/pricing.ts:66](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L66)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### featureFlagRouter

 `Protected` `Readonly` **featureFlagRouter**: [`FlagRouter`](FlagRouter.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:57](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L57)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### priceSelectionStrategy

 `Protected` `Readonly` **priceSelectionStrategy**: [`IPriceSelectionStrategy`](../interfaces/IPriceSelectionStrategy.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:55](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L55)

___

### productVariantService

 `Protected` `Readonly` **productVariantService**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L56)

___

### regionService

 `Protected` `Readonly` **regionService**: [`RegionService`](RegionService.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:53](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L53)

___

### taxProviderService

 `Protected` `Readonly` **taxProviderService**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[packages/medusa/src/services/pricing.ts:54](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L54)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

___

### pricingModuleService

`Protected` `get` **pricingModuleService**(): [`IPricingModuleService`](../interfaces/IPricingModuleService.md)

#### Returns

[`IPricingModuleService`](../interfaces/IPricingModuleService.md)

-`addPrices`: 
-`addRules`: 
-`calculatePrices`: 
-`create`: 
-`createCurrencies`: 
-`createMoneyAmounts`: 
-`createPriceRules`: 
-`createPriceSetMoneyAmountRules`: 
-`createRuleTypes`: 
-`delete`: 
-`deleteCurrencies`: 
-`deleteMoneyAmounts`: 
-`deletePriceRules`: 
-`deletePriceSetMoneyAmountRules`: 
-`deleteRuleTypes`: 
-`list`: 
-`listAndCount`: 
-`listAndCountCurrencies`: 
-`listAndCountMoneyAmounts`: 
-`listAndCountPriceRules`: 
-`listAndCountPriceSetMoneyAmountRules`: 
-`listAndCountPriceSetMoneyAmounts`: 
-`listAndCountRuleTypes`: 
-`listCurrencies`: 
-`listMoneyAmounts`: 
-`listPriceRules`: 
-`listPriceSetMoneyAmountRules`: 
-`listPriceSetMoneyAmounts`: 
-`listRuleTypes`: 
-`removeRules`: 
-`retrieve`: 
-`retrieveCurrency`: 
-`retrieveMoneyAmount`: 
-`retrievePriceRule`: 
-`retrievePriceSetMoneyAmountRules`: 
-`retrieveRuleType`: 
-`updateCurrencies`: 
-`updateMoneyAmounts`: 
-`updatePriceRules`: 
-`updatePriceSetMoneyAmountRules`: 
-`updateRuleTypes`: 

#### Defined in

[packages/medusa/src/services/pricing.ts:59](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L59)

___

### remoteQuery

`Protected` `get` **remoteQuery**(): [`RemoteQueryFunction`](../types/RemoteQueryFunction.md)

#### Returns

[`RemoteQueryFunction`](../types/RemoteQueryFunction.md)

-`RemoteQueryFunction`: 
	-`__type`: 

#### Defined in

[packages/medusa/src/services/pricing.ts:62](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L62)

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
| `work` | (`transactionManager`: [`EntityManager`](EntityManager.md)) => `Promise`<`TResult`\> | the transactional work to be done |
| `isolationOrErrorHandler?` | [`IsolationLevel`](../types/IsolationLevel.md) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### calculateTaxes

**calculateTaxes**(`variantPricing`, `productRates`): [`TaxedPricing`](../types/TaxedPricing.md)

Gets the prices for a product variant

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantPricing` | [`ProductVariantPricing`](../types/ProductVariantPricing.md) | the prices retrieved from a variant |
| `productRates` | [`TaxServiceRate`](../types/TaxServiceRate.md)[] | the tax rates that the product has applied |

#### Returns

[`TaxedPricing`](../types/TaxedPricing.md)

-`TaxedPricing`: Pricing fields related to taxes.
	-`calculated_price_incl_tax`: The price after applying the tax amount on the calculated price.
	-`calculated_tax`: The tax amount applied to the calculated price.
	-`original_price_incl_tax`: The price after applying the tax amount on the original price.
	-`original_tax`: The tax amount applied to the original price.
	-`tax_rates`: The list of tax rates.

#### Defined in

[packages/medusa/src/services/pricing.ts:125](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L125)

___

### collectPricingContext

**collectPricingContext**(`context`): `Promise`<[`PricingContext`](../types/PricingContext-1.md)\>

Collects additional information necessary for completing the price
selection.

#### Parameters

| Name | Description |
| :------ | :------ |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) | the price selection context to use |

#### Returns

`Promise`<[`PricingContext`](../types/PricingContext-1.md)\>

-`Promise`: The pricing context
	-`PricingContext`: 
		-`automatic_taxes`: 
		-`price_selection`: 
		-`tax_rate`: 

#### Defined in

[packages/medusa/src/services/pricing.ts:89](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L89)

___

### getPricingModuleVariantMoneyAmounts

`Private` **getPricingModuleVariantMoneyAmounts**(`variantIds`): `Promise`<`Map`<`string`, [`MoneyAmount`](MoneyAmount.md)[]\>\>

#### Parameters

| Name |
| :------ |
| `variantIds` | `string`[] |

#### Returns

`Promise`<`Map`<`string`, [`MoneyAmount`](MoneyAmount.md)[]\>\>

-`Promise`: 
	-`Map`: 
		-`string`: (optional) 
		-`MoneyAmount[]`: 

#### Defined in

[packages/medusa/src/services/pricing.ts:640](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L640)

___

### getProductPricing

**getProductPricing**(`product`, `context`): `Promise`<Record<`string`, [`ProductVariantPricing`](../types/ProductVariantPricing.md)\>\>

Gets all the variant prices for a product. All the product's variants will
be fetched.

#### Parameters

| Name | Description |
| :------ | :------ |
| `product` | [`Pick`](../types/Pick.md)<[`Product`](Product.md), ``"id"`` \| ``"variants"``\> | the product to get pricing for. |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) | the price selection context to use |

#### Returns

`Promise`<Record<`string`, [`ProductVariantPricing`](../types/ProductVariantPricing.md)\>\>

-`Promise`: A map of variant ids to their corresponding prices
	-`Record`: 
		-`string`: (optional) 
		-`ProductVariantPricing`: Pricing fields for product variants.

#### Defined in

[packages/medusa/src/services/pricing.ts:538](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L538)

___

### getProductPricingById

**getProductPricingById**(`productId`, `context`): `Promise`<Record<`string`, [`ProductVariantPricing`](../types/ProductVariantPricing.md)\>\>

Gets all the variant prices for a product by the product id

#### Parameters

| Name | Description |
| :------ | :------ |
| `productId` | `string` | the id of the product to get prices for |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) | the price selection context to use |

#### Returns

`Promise`<Record<`string`, [`ProductVariantPricing`](../types/ProductVariantPricing.md)\>\>

-`Promise`: A map of variant ids to their corresponding prices
	-`Record`: 
		-`string`: (optional) 
		-`ProductVariantPricing`: Pricing fields for product variants.

#### Defined in

[packages/medusa/src/services/pricing.ts:556](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L556)

___

### getProductPricing\_

`Private` **getProductPricing_**(`data`, `context`): `Promise`<`Map`<`string`, Record<`string`, [`ProductVariantPricing`](../types/ProductVariantPricing.md)\>\>\>

#### Parameters

| Name |
| :------ |
| `data` | { `productId`: `string` ; `variants`: [`ProductVariant`](ProductVariant.md)[]  }[] |
| `context` | [`PricingContext`](../types/PricingContext-1.md) |

#### Returns

`Promise`<`Map`<`string`, Record<`string`, [`ProductVariantPricing`](../types/ProductVariantPricing.md)\>\>\>

-`Promise`: 
	-`Map`: 
		-`string`: (optional) 
		-`Record`: 

#### Defined in

[packages/medusa/src/services/pricing.ts:481](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L481)

___

### getProductVariantPricing

**getProductVariantPricing**(`variant`, `context`): `Promise`<[`ProductVariantPricing`](../types/ProductVariantPricing.md)\>

Gets the prices for a product variant.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variant` | [`Pick`](../types/Pick.md)<[`ProductVariant`](ProductVariant.md), ``"id"`` \| ``"product_id"``\> |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) \| [`PricingContext`](../types/PricingContext-1.md) | the price selection context to use |

#### Returns

`Promise`<[`ProductVariantPricing`](../types/ProductVariantPricing.md)\>

-`Promise`: The product variant prices
	-`ProductVariantPricing`: Pricing fields for product variants.
		-`calculated_price`: The lowest price among the retrieved prices.
		-`calculated_price_includes_tax`: (optional) Whether the `calculated_price` field includes taxes.
		-`calculated_price_type`: (optional) Either `default` if the `calculated_price` is the original price, or the type of the price list applied, if any.
		-`original_price`: The original price of the variant.
		-`original_price_includes_tax`: (optional) Whether the `original_price` field includes taxes.
		-`prices`: The list of prices.
		-`calculated_price_incl_tax`: The price after applying the tax amount on the calculated price.
		-`calculated_tax`: The tax amount applied to the calculated price.
		-`original_price_incl_tax`: The price after applying the tax amount on the original price.
		-`original_tax`: The tax amount applied to the original price.
		-`tax_rates`: The list of tax rates.

#### Defined in

[packages/medusa/src/services/pricing.ts:335](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L335)

___

### getProductVariantPricingById

**getProductVariantPricingById**(`variantId`, `context`): `Promise`<[`ProductVariantPricing`](../types/ProductVariantPricing.md)\>

Gets the prices for a product variant by a variant id.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variantId` | `string` | the id of the variant to get prices for |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) \| [`PricingContext`](../types/PricingContext-1.md) | the price selection context to use |

#### Returns

`Promise`<[`ProductVariantPricing`](../types/ProductVariantPricing.md)\>

-`Promise`: The product variant prices
	-`ProductVariantPricing`: Pricing fields for product variants.
		-`calculated_price`: The lowest price among the retrieved prices.
		-`calculated_price_includes_tax`: (optional) Whether the `calculated_price` field includes taxes.
		-`calculated_price_type`: (optional) Either `default` if the `calculated_price` is the original price, or the type of the price list applied, if any.
		-`original_price`: The original price of the variant.
		-`original_price_includes_tax`: (optional) Whether the `original_price` field includes taxes.
		-`prices`: The list of prices.
		-`calculated_price_incl_tax`: The price after applying the tax amount on the calculated price.
		-`calculated_tax`: The tax amount applied to the calculated price.
		-`original_price_incl_tax`: The price after applying the tax amount on the original price.
		-`original_tax`: The tax amount applied to the original price.
		-`tax_rates`: The list of tax rates.

**Deprecated**

Use [getProductVariantsPricing](PricingService.md#getproductvariantspricing) instead.

#### Defined in

[packages/medusa/src/services/pricing.ts:384](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L384)

___

### getProductVariantPricingModulePricing\_

`Private` **getProductVariantPricingModulePricing_**(`variantPriceData`, `context`): `Promise`<`Map`<`any`, `any`\>\>

#### Parameters

| Name |
| :------ |
| `variantPriceData` | { `quantity?`: `number` ; `variantId`: `string`  }[] |
| `context` | [`PricingContext`](../types/PricingContext-1.md) |

#### Returns

`Promise`<`Map`<`any`, `any`\>\>

-`Promise`: 
	-`Map`: 
		-`any`: (optional) 
		-`any`: (optional) 

#### Defined in

[packages/medusa/src/services/pricing.ts:187](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L187)

___

### getProductVariantPricing\_

`Private` **getProductVariantPricing_**(`data`, `context`): `Promise`<`Map`<`string`, [`ProductVariantPricing`](../types/ProductVariantPricing.md)\>\>

#### Parameters

| Name |
| :------ |
| `data` | { `quantity?`: `number` ; `variantId`: `string`  }[] |
| `context` | [`PricingContext`](../types/PricingContext-1.md) |

#### Returns

`Promise`<`Map`<`string`, [`ProductVariantPricing`](../types/ProductVariantPricing.md)\>\>

-`Promise`: 
	-`Map`: 
		-`string`: (optional) 
		-`ProductVariantPricing`: Pricing fields for product variants.

#### Defined in

[packages/medusa/src/services/pricing.ts:271](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L271)

___

### getProductVariantsPricing

**getProductVariantsPricing**(`data`, `context`): `Promise`<{ `[variant_id: string]`: [`ProductVariantPricing`](../types/ProductVariantPricing.md);  }\>

Gets the prices for a collection of variants.

#### Parameters

| Name | Description |
| :------ | :------ |
| `data` | { `quantity?`: `number` ; `variantId`: `string`  }[] |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) \| [`PricingContext`](../types/PricingContext-1.md) | the price selection context to use |

#### Returns

`Promise`<{ `[variant_id: string]`: [`ProductVariantPricing`](../types/ProductVariantPricing.md);  }\>

-`Promise`: The product variant prices
	-``object``: (optional) 

#### Defined in

[packages/medusa/src/services/pricing.ts:429](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L429)

___

### getShippingOptionPricing

**getShippingOptionPricing**(`shippingOption`, `context`): `Promise`<[`PricedShippingOption`](../types/PricedShippingOption.md)\>

Gets the prices for a shipping option.

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingOption` | [`ShippingOption`](ShippingOption.md) | the shipping option to get prices for |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) \| [`PricingContext`](../types/PricingContext-1.md) | the price selection context to use |

#### Returns

`Promise`<[`PricedShippingOption`](../types/PricedShippingOption.md)\>

-`Promise`: The shipping option prices
	-`PricedShippingOption`: 
		-`admin_only`: (default: false) Flag to indicate if the Shipping Option usage is restricted to admin users.
		-`amount`: The amount to charge for shipping when the Shipping Option price type is `flat_rate`.
		-`created_at`: The date with timezone at which the resource was created.
		-`data`: The data needed for the Fulfillment Provider to identify the Shipping Option.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`id`: The shipping option's ID
		-`includes_tax`: (default: false) Whether the shipping option price include tax
		-`is_return`: (default: false) Flag to indicate if the Shipping Option can be used for Return shipments.
		-`metadata`: An optional key-value map with additional details
		-`name`: The name given to the Shipping Option - this may be displayed to the Customer.
		-`price_type`: The type of pricing calculation that is used when creatin Shipping Methods from the Shipping Option. Can be `flat_rate` for fixed prices or `calculated` if the Fulfillment Provider can provide price calulations.
		-`profile`: The details of the shipping profile that the shipping option belongs to.
		-`profile_id`: The ID of the Shipping Profile that the shipping option belongs to.
		-`provider`: The details of the fulfillment provider that will be used to later to process the shipping method created from this shipping option and its fulfillments.
		-`provider_id`: The ID of the fulfillment provider that will be used to later to process the shipping method created from this shipping option and its fulfillments.
		-`region`: The details of the region this shipping option can be used in.
		-`region_id`: The ID of the region this shipping option can be used in.
		-`requirements`: The details of the requirements that must be satisfied for the Shipping Option to be available for usage in a Cart.
		-`updated_at`: The date with timezone at which the resource was updated.
		-`price_incl_tax`: Price including taxes
		-`tax_amount`: The taxes applied.
		-`tax_rates`: An array of applied tax rates

#### Defined in

[packages/medusa/src/services/pricing.ts:807](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L807)

___

### setAdminProductPricing

**setAdminProductPricing**(`products`): `Promise`<([`Product`](Product.md) \| [`PricedProduct`](../types/PricedProduct.md))[]\>

#### Parameters

| Name |
| :------ |
| `products` | [`Product`](Product.md)[] |

#### Returns

`Promise`<([`Product`](Product.md) \| [`PricedProduct`](../types/PricedProduct.md))[]\>

-`Promise`: 
	-`(Product \| PricedProduct)[]`: 
		-`Product \| PricedProduct`: (optional) 

#### Defined in

[packages/medusa/src/services/pricing.ts:754](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L754)

___

### setAdminVariantPricing

**setAdminVariantPricing**(`variants`, `context?`): `Promise`<[`PricedVariant`](../types/PricedVariant.md)[]\>

#### Parameters

| Name |
| :------ |
| `variants` | [`ProductVariant`](ProductVariant.md)[] |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) |

#### Returns

`Promise`<[`PricedVariant`](../types/PricedVariant.md)[]\>

-`Promise`: 
	-`PricedVariant[]`: 
		-`PricedVariant`: 

#### Defined in

[packages/medusa/src/services/pricing.ts:717](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L717)

___

### setProductPrices

**setProductPrices**(`products`, `context?`): `Promise`<([`Product`](Product.md) \| [`PricedProduct`](../types/PricedProduct.md))[]\>

Set additional prices on a list of products.

#### Parameters

| Name | Description |
| :------ | :------ |
| `products` | [`Product`](Product.md)[] | list of products on which to set additional prices |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) | the price selection context to use |

#### Returns

`Promise`<([`Product`](Product.md) \| [`PricedProduct`](../types/PricedProduct.md))[]\>

-`Promise`: A list of products with variants decorated with prices
	-`(Product \| PricedProduct)[]`: 
		-`Product \| PricedProduct`: (optional) 

#### Defined in

[packages/medusa/src/services/pricing.ts:605](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L605)

___

### setShippingOptionPrices

**setShippingOptionPrices**(`shippingOptions`, `context?`): `Promise`<[`PricedShippingOption`](../types/PricedShippingOption.md)[]\>

Set additional prices on a list of shipping options.

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingOptions` | [`ShippingOption`](ShippingOption.md)[] | list of shipping options on which to set additional prices |
| `context` | [`Omit`](../types/Omit.md)<[`PriceSelectionContext`](../types/PriceSelectionContext.md), ``"region_id"``\> | the price selection context to use |

#### Returns

`Promise`<[`PricedShippingOption`](../types/PricedShippingOption.md)[]\>

-`Promise`: A list of shipping options with prices
	-`PricedShippingOption[]`: 
		-`PricedShippingOption`: 

#### Defined in

[packages/medusa/src/services/pricing.ts:869](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L869)

___

### setVariantPrices

**setVariantPrices**(`variants`, `context?`): `Promise`<[`PricedVariant`](../types/PricedVariant.md)[]\>

Set additional prices on a list of product variants.

#### Parameters

| Name | Description |
| :------ | :------ |
| `variants` | [`ProductVariant`](ProductVariant.md)[] |
| `context` | [`PriceSelectionContext`](../types/PriceSelectionContext.md) | the price selection context to use |

#### Returns

`Promise`<[`PricedVariant`](../types/PricedVariant.md)[]\>

-`Promise`: A list of products with variants decorated with prices
	-`PricedVariant[]`: 
		-`PricedVariant`: 

#### Defined in

[packages/medusa/src/services/pricing.ts:578](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/services/pricing.ts#L578)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`PricingService`](PricingService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`PricingService`](PricingService.md)

-`PricingService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
