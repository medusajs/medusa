# Class: TaxProviderService

Finds tax providers and assists in tax related operations.

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`TaxProviderService`**

## Constructors

### constructor

• **new TaxProviderService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `AwilixContainer`<`any`\> |

#### Overrides

BaseService.constructor

#### Defined in

[services/tax-provider.ts:44](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L44)

## Properties

### container\_

• `Private` **container\_**: `AwilixContainer`<`any`\>

#### Defined in

[services/tax-provider.ts:35](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L35)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/tax-provider.ts:36](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L36)

___

### redis\_

• `Private` **redis\_**: `Redis`

#### Defined in

[services/tax-provider.ts:42](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L42)

___

### smTaxLineRepo\_

• `Private` **smTaxLineRepo\_**: typeof `ShippingMethodTaxLineRepository`

#### Defined in

[services/tax-provider.ts:40](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L40)

___

### taxLineRepo\_

• `Private` **taxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[services/tax-provider.ts:39](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L39)

___

### taxProviderRepo\_

• `Private` **taxProviderRepo\_**: typeof `TaxProviderRepository`

#### Defined in

[services/tax-provider.ts:41](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L41)

___

### taxRateService\_

• `Private` **taxRateService\_**: [`TaxRateService`](TaxRateService.md)

#### Defined in

[services/tax-provider.ts:38](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L38)

___

### transactionManager\_

• `Private` **transactionManager\_**: `EntityManager`

#### Defined in

[services/tax-provider.ts:37](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L37)

## Methods

### clearTaxLines

▸ **clearTaxLines**(`cartId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/tax-provider.ts:98](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L98)

___

### createShippingTaxLines

▸ **createShippingTaxLines**(`shippingMethod`, `calculationContext`): `Promise`<(`ShippingMethodTaxLine` \| `LineItemTaxLine`)[]\>

Persists the tax lines relevant for a shipping method to the database. Used
for return shipping methods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethod` | `ShippingMethod` | the shipping method to create tax lines for |
| `calculationContext` | `TaxCalculationContext` | the calculation context to get tax lines by |

#### Returns

`Promise`<(`ShippingMethodTaxLine` \| `LineItemTaxLine`)[]\>

the newly created tax lines

#### Defined in

[services/tax-provider.ts:166](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L166)

___

### createTaxLines

▸ **createTaxLines**(`cartOrLineItems`, `calculationContext`): `Promise`<(`ShippingMethodTaxLine` \| `LineItemTaxLine`)[]\>

Persists the tax lines relevant for an order to the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrLineItems` | `Cart` \| `LineItem`[] | the cart or line items to create tax lines for |
| `calculationContext` | `TaxCalculationContext` | the calculation context to get tax lines by |

#### Returns

`Promise`<(`ShippingMethodTaxLine` \| `LineItemTaxLine`)[]\>

the newly created tax lines

#### Defined in

[services/tax-provider.ts:116](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L116)

___

### getCacheEntry

▸ `Private` **getCacheEntry**(`productId`, `regionId`): `Promise`<``null`` \| `TaxServiceRate`[]\>

Gets the cache results for a set of ids

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product id to cache |
| `regionId` | `string` | the region id to cache |

#### Returns

`Promise`<``null`` \| `TaxServiceRate`[]\>

the cached result or null

#### Defined in

[services/tax-provider.ts:450](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L450)

___

### getCacheKey

▸ `Private` **getCacheKey**(`productId`, `regionId`): `string`

The cache key to get cache hits by.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product id to cache |
| `regionId` | `string` | the region id to cache |

#### Returns

`string`

the cache key to use for the id set

#### Defined in

[services/tax-provider.ts:419](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L419)

___

### getRegionRatesForProduct

▸ **getRegionRatesForProduct**(`productId`, `region`): `Promise`<`TaxServiceRate`[]\>

Gets the tax rates configured for a product. The rates are cached between
calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product id to get rates for |
| `region` | `Region` | the region to get configured rates for. |

#### Returns

`Promise`<`TaxServiceRate`[]\>

the tax rates configured for the shipping option.

#### Defined in

[services/tax-provider.ts:374](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L374)

___

### getRegionRatesForShipping

▸ **getRegionRatesForShipping**(`optionId`, `region`): `Promise`<`TaxServiceRate`[]\>

Gets the tax rates configured for a shipping option. The rates are cached
between calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the option id of the shipping method. |
| `region` | `Region` | the region to get configured rates for. |

#### Returns

`Promise`<`TaxServiceRate`[]\>

the tax rates configured for the shipping option.

#### Defined in

[services/tax-provider.ts:327](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L327)

___

### getShippingTaxLines

▸ **getShippingTaxLines**(`shippingMethod`, `calculationContext`): `Promise`<`ShippingMethodTaxLine`[]\>

Gets the relevant tax lines for a shipping method. Note: this method
doesn't persist the tax lines. Use createShippingTaxLines if you wish to
persist the tax lines to the DB layer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethod` | `ShippingMethod` | the shipping method to get tax lines for |
| `calculationContext` | `TaxCalculationContext` | the calculation context to get tax lines by |

#### Returns

`Promise`<`ShippingMethodTaxLine`[]\>

the computed tax lines

#### Defined in

[services/tax-provider.ts:185](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L185)

___

### getTaxLines

▸ **getTaxLines**(`lineItems`, `calculationContext`): `Promise`<(`ShippingMethodTaxLine` \| `LineItemTaxLine`)[]\>

Gets the relevant tax lines for an order or cart. If an order is provided
the order's tax lines will be returned. If a cart is provided the tax lines
will be computed from the tax rules and potentially a 3rd party tax plugin.
Note: this method doesn't persist the tax lines. Use createTaxLines if you
wish to persist the tax lines to the DB layer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItems` | `LineItem`[] | the cart or order to get tax lines for |
| `calculationContext` | `TaxCalculationContext` | the calculation context to get tax lines by |

#### Returns

`Promise`<(`ShippingMethodTaxLine` \| `LineItemTaxLine`)[]\>

the computed tax lines

#### Defined in

[services/tax-provider.ts:237](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L237)

___

### list

▸ **list**(): `Promise`<`TaxProvider`[]\>

#### Returns

`Promise`<`TaxProvider`[]\>

#### Defined in

[services/tax-provider.ts:70](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L70)

___

### registerInstalledProviders

▸ **registerInstalledProviders**(`providers`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `providers` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/tax-provider.ts:471](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L471)

___

### retrieveProvider

▸ **retrieveProvider**(`region`): `ITaxService`

Retrieves the relevant tax provider for the given region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `region` | `Region` | the region to get tax provider for. |

#### Returns

`ITaxService`

the region specific tax provider

#### Defined in

[services/tax-provider.ts:80](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L80)

___

### setCache

▸ `Private` **setCache**(`productId`, `regionId`, `value`): `Promise`<`void`\>

Sets the cache results for a set of ids

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product id to cache |
| `regionId` | `string` | the region id to cache |
| `value` | `TaxServiceRate`[] | tax rates to cache |

#### Returns

`Promise`<`void`\>

promise that resolves after the cache has been set

#### Defined in

[services/tax-provider.ts:430](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L430)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`TaxProviderService`](TaxProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `EntityManager` |

#### Returns

[`TaxProviderService`](TaxProviderService.md)

#### Defined in

[services/tax-provider.ts:57](https://github.com/medusajs/medusa/blob/2d3e404f/packages/medusa/src/services/tax-provider.ts#L57)
