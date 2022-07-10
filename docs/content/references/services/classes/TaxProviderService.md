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

[services/tax-provider.ts:49](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L49)

## Properties

### container\_

• `Private` **container\_**: `AwilixContainer`<`any`\>

#### Defined in

[services/tax-provider.ts:40](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L40)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/tax-provider.ts:41](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L41)

___

### redis\_

• `Private` **redis\_**: `Redis`

#### Defined in

[services/tax-provider.ts:47](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L47)

___

### smTaxLineRepo\_

• `Private` **smTaxLineRepo\_**: typeof `ShippingMethodTaxLineRepository`

#### Defined in

[services/tax-provider.ts:45](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L45)

___

### taxLineRepo\_

• `Private` **taxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[services/tax-provider.ts:44](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L44)

___

### taxProviderRepo\_

• `Private` **taxProviderRepo\_**: typeof `TaxProviderRepository`

#### Defined in

[services/tax-provider.ts:46](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L46)

___

### taxRateService\_

• `Private` **taxRateService\_**: [`TaxRateService`](TaxRateService.md)

#### Defined in

[services/tax-provider.ts:43](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L43)

___

### transactionManager\_

• `Private` **transactionManager\_**: `EntityManager`

#### Defined in

[services/tax-provider.ts:42](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L42)

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

[services/tax-provider.ts:103](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L103)

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

[services/tax-provider.ts:171](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L171)

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

[services/tax-provider.ts:121](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L121)

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

[services/tax-provider.ts:454](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L454)

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

[services/tax-provider.ts:423](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L423)

___

### getRegionRatesForProduct

▸ **getRegionRatesForProduct**(`productId`, `region`): `Promise`<`TaxServiceRate`[]\>

Gets the tax rates configured for a product. The rates are cached between
calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product id to get rates for |
| `region` | `RegionDetails` | the region to get configured rates for. |

#### Returns

`Promise`<`TaxServiceRate`[]\>

the tax rates configured for the shipping option.

#### Defined in

[services/tax-provider.ts:378](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L378)

___

### getRegionRatesForShipping

▸ **getRegionRatesForShipping**(`optionId`, `regionDetails`): `Promise`<`TaxServiceRate`[]\>

Gets the tax rates configured for a shipping option. The rates are cached
between calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the option id of the shipping method. |
| `regionDetails` | `RegionDetails` | the region to get configured rates for. |

#### Returns

`Promise`<`TaxServiceRate`[]\>

the tax rates configured for the shipping option.

#### Defined in

[services/tax-provider.ts:332](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L332)

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

[services/tax-provider.ts:190](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L190)

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

[services/tax-provider.ts:242](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L242)

___

### list

▸ **list**(): `Promise`<`TaxProvider`[]\>

#### Returns

`Promise`<`TaxProvider`[]\>

#### Defined in

[services/tax-provider.ts:75](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L75)

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

[services/tax-provider.ts:475](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L475)

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

[services/tax-provider.ts:85](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L85)

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

[services/tax-provider.ts:434](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L434)

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

[services/tax-provider.ts:62](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/tax-provider.ts#L62)
