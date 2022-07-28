# Class: PricingService

## Hierarchy

- `TransactionBaseService`<[`PricingService`](PricingService.md)\>

  ↳ **`PricingService`**

## Constructors

### constructor

• **new PricingService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService&lt;PricingService\&gt;.constructor

#### Defined in

[services/pricing.ts:40](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L40)

## Properties

### configModule

• `Protected` `Optional` `Readonly` **configModule**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.configModule

___

### container

• `Protected` `Readonly` **container**: `unknown`

#### Inherited from

TransactionBaseService.container

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/pricing.ts:33](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L33)

___

### priceSelectionStrategy

• `Protected` `Readonly` **priceSelectionStrategy**: `IPriceSelectionStrategy`

#### Defined in

[services/pricing.ts:37](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L37)

___

### productVariantService

• `Protected` `Readonly` **productVariantService**: [`ProductVariantService`](ProductVariantService.md)

#### Defined in

[services/pricing.ts:38](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L38)

___

### regionService

• `Protected` `Readonly` **regionService**: [`RegionService`](RegionService.md)

#### Defined in

[services/pricing.ts:35](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L35)

___

### taxProviderService

• `Protected` `Readonly` **taxProviderService**: [`TaxProviderService`](TaxProviderService.md)

#### Defined in

[services/pricing.ts:36](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L36)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/pricing.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L34)

## Methods

### atomicPhase\_

▸ `Protected` **atomicPhase_**<`TResult`, `TError`\>(`work`, `isolationOrErrorHandler?`, `maybeErrorHandlerOrDontFail?`): `Promise`<`TResult`\>

#### Type parameters

| Name |
| :------ |
| `TResult` |
| `TError` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `work` | (`transactionManager`: `EntityManager`) => `Promise`<`TResult`\> |  |
| `isolationOrErrorHandler?` | `IsolationLevel` \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> |  |

#### Returns

`Promise`<`TResult`\>

#### Inherited from

TransactionBaseService.atomicPhase\_

#### Defined in

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### calculateTaxes

▸ **calculateTaxes**(`variantPricing`, `productRates`): `Promise`<`TaxedPricing`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantPricing` | `ProductVariantPricing` |  |
| `productRates` | `TaxServiceRate`[] |  |

#### Returns

`Promise`<`TaxedPricing`\>

#### Defined in

[services/pricing.ts:102](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L102)

___

### collectPricingContext

▸ **collectPricingContext**(`context`): `Promise`<`PricingContext`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `PriceSelectionContext` |  |

#### Returns

`Promise`<`PricingContext`\>

#### Defined in

[services/pricing.ts:63](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L63)

___

### getProductPricing

▸ **getProductPricing**(`product`, `context`): `Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `product` | `Pick`<`Product`, ``"id"`` \| ``"variants"``\> |  |
| `context` | `PriceSelectionContext` |  |

#### Returns

`Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

#### Defined in

[services/pricing.ts:292](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L292)

___

### getProductPricingById

▸ **getProductPricingById**(`productId`, `context`): `Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `context` | `PriceSelectionContext` |  |

#### Returns

`Promise`<`Record`<`string`, `ProductVariantPricing`\>\>

#### Defined in

[services/pricing.ts:310](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L310)

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

[services/pricing.ts:254](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L254)

___

### getProductVariantPricing

▸ **getProductVariantPricing**(`variant`, `context`): `Promise`<`ProductVariantPricing`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variant` | `Pick`<`ProductVariant`, ``"id"`` \| ``"product_id"``\> |  |
| `context` | `PriceSelectionContext` \| `PricingContext` |  |

#### Returns

`Promise`<`ProductVariantPricing`\>

#### Defined in

[services/pricing.ts:180](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L180)

___

### getProductVariantPricingById

▸ **getProductVariantPricingById**(`variantId`, `context`): `Promise`<`ProductVariantPricing`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `context` | `PriceSelectionContext` \| `PricingContext` |  |

#### Returns

`Promise`<`ProductVariantPricing`\>

#### Defined in

[services/pricing.ts:218](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L218)

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

[services/pricing.ts:138](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L138)

___

### getShippingOptionPricing

▸ **getShippingOptionPricing**(`shippingOption`, `context`): `Promise`<`PricedShippingOption`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingOption` | `ShippingOption` |  |
| `context` | `PriceSelectionContext` \| `PricingContext` |  |

#### Returns

`Promise`<`PricedShippingOption`\>

#### Defined in

[services/pricing.ts:396](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L396)

___

### setProductPrices

▸ **setProductPrices**(`products`, `context?`): `Promise`<(`Product` \| `PricedProduct`)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `products` | `Product`[] |  |
| `context` | `PriceSelectionContext` |  |

#### Returns

`Promise`<(`Product` \| `PricedProduct`)[]\>

#### Defined in

[services/pricing.ts:353](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L353)

___

### setShippingOptionPrices

▸ **setShippingOptionPrices**(`shippingOptions`, `context?`): `Promise`<`PricedShippingOption`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingOptions` | `ShippingOption`[] |  |
| `context` | `Omit`<`PriceSelectionContext`, ``"region_id"``\> |  |

#### Returns

`Promise`<`PricedShippingOption`[]\>

#### Defined in

[services/pricing.ts:445](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L445)

___

### setVariantPrices

▸ **setVariantPrices**(`variants`, `context`): `Promise`<`PricedVariant`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variants` | `ProductVariant`[] |  |
| `context` | `PriceSelectionContext` |  |

#### Returns

`Promise`<`PricedVariant`[]\>

#### Defined in

[services/pricing.ts:328](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/pricing.ts#L328)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

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

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
