# Class: TaxProviderService

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

[services/tax-provider.ts:49](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L49)

## Properties

### container\_

• `Private` **container\_**: `AwilixContainer`<`any`\>

#### Defined in

[services/tax-provider.ts:40](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L40)

___

### manager\_

• `Private` **manager\_**: `EntityManager`

#### Defined in

[services/tax-provider.ts:41](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L41)

___

### redis\_

• `Private` **redis\_**: `Redis`

#### Defined in

[services/tax-provider.ts:47](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L47)

___

### smTaxLineRepo\_

• `Private` **smTaxLineRepo\_**: typeof `ShippingMethodTaxLineRepository`

#### Defined in

[services/tax-provider.ts:45](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L45)

___

### taxLineRepo\_

• `Private` **taxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[services/tax-provider.ts:44](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L44)

___

### taxProviderRepo\_

• `Private` **taxProviderRepo\_**: typeof `TaxProviderRepository`

#### Defined in

[services/tax-provider.ts:46](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L46)

___

### taxRateService\_

• `Private` **taxRateService\_**: [`TaxRateService`](TaxRateService.md)

#### Defined in

[services/tax-provider.ts:43](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L43)

___

### transactionManager\_

• `Private` **transactionManager\_**: `EntityManager`

#### Defined in

[services/tax-provider.ts:42](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L42)

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

[services/tax-provider.ts:103](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L103)

___

### createShippingTaxLines

▸ **createShippingTaxLines**(`shippingMethod`, `calculationContext`): `Promise`<(`LineItemTaxLine` \| `ShippingMethodTaxLine`)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethod` | `ShippingMethod` |  |
| `calculationContext` | `TaxCalculationContext` |  |

#### Returns

`Promise`<(`LineItemTaxLine` \| `ShippingMethodTaxLine`)[]\>

#### Defined in

[services/tax-provider.ts:171](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L171)

___

### createTaxLines

▸ **createTaxLines**(`cartOrLineItems`, `calculationContext`): `Promise`<(`LineItemTaxLine` \| `ShippingMethodTaxLine`)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrLineItems` | `Cart` \| `LineItem`[] |  |
| `calculationContext` | `TaxCalculationContext` |  |

#### Returns

`Promise`<(`LineItemTaxLine` \| `ShippingMethodTaxLine`)[]\>

#### Defined in

[services/tax-provider.ts:121](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L121)

___

### getCacheEntry

▸ `Private` **getCacheEntry**(`productId`, `regionId`): `Promise`<``null`` \| `TaxServiceRate`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `regionId` | `string` |  |

#### Returns

`Promise`<``null`` \| `TaxServiceRate`[]\>

#### Defined in

[services/tax-provider.ts:454](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L454)

___

### getCacheKey

▸ `Private` **getCacheKey**(`productId`, `regionId`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `regionId` | `string` |  |

#### Returns

`string`

#### Defined in

[services/tax-provider.ts:423](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L423)

___

### getRegionRatesForProduct

▸ **getRegionRatesForProduct**(`productId`, `region`): `Promise`<`TaxServiceRate`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `region` | `RegionDetails` |  |

#### Returns

`Promise`<`TaxServiceRate`[]\>

#### Defined in

[services/tax-provider.ts:378](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L378)

___

### getRegionRatesForShipping

▸ **getRegionRatesForShipping**(`optionId`, `regionDetails`): `Promise`<`TaxServiceRate`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` |  |
| `regionDetails` | `RegionDetails` |  |

#### Returns

`Promise`<`TaxServiceRate`[]\>

#### Defined in

[services/tax-provider.ts:332](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L332)

___

### getShippingTaxLines

▸ **getShippingTaxLines**(`shippingMethod`, `calculationContext`): `Promise`<`ShippingMethodTaxLine`[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethod` | `ShippingMethod` |  |
| `calculationContext` | `TaxCalculationContext` |  |

#### Returns

`Promise`<`ShippingMethodTaxLine`[]\>

#### Defined in

[services/tax-provider.ts:190](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L190)

___

### getTaxLines

▸ **getTaxLines**(`lineItems`, `calculationContext`): `Promise`<(`LineItemTaxLine` \| `ShippingMethodTaxLine`)[]\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItems` | `LineItem`[] |  |
| `calculationContext` | `TaxCalculationContext` |  |

#### Returns

`Promise`<(`LineItemTaxLine` \| `ShippingMethodTaxLine`)[]\>

#### Defined in

[services/tax-provider.ts:242](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L242)

___

### list

▸ **list**(): `Promise`<`TaxProvider`[]\>

#### Returns

`Promise`<`TaxProvider`[]\>

#### Defined in

[services/tax-provider.ts:75](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L75)

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

[services/tax-provider.ts:475](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L475)

___

### retrieveProvider

▸ **retrieveProvider**(`region`): `ITaxService`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `region` | `Region` |  |

#### Returns

`ITaxService`

#### Defined in

[services/tax-provider.ts:85](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L85)

___

### setCache

▸ `Private` **setCache**(`productId`, `regionId`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` |  |
| `regionId` | `string` |  |
| `value` | `TaxServiceRate`[] |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/tax-provider.ts:434](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L434)

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

[services/tax-provider.ts:62](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/tax-provider.ts#L62)
