# Class: TaxProviderService

## Hierarchy

- `TransactionBaseService`<[`TaxProviderService`](TaxProviderService.md)\>

  ↳ **`TaxProviderService`**

## Constructors

### constructor

• **new TaxProviderService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `AwilixContainer`<`any`\> |

#### Overrides

TransactionBaseService&lt;TaxProviderService\&gt;.constructor

#### Defined in

[services/tax-provider.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L53)

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

### container\_

• `Protected` `Readonly` **container\_**: `AwilixContainer`<`any`\>

#### Defined in

[services/tax-provider.ts:45](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L45)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[services/tax-provider.ts:51](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L51)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[services/tax-provider.ts:42](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L42)

___

### redis\_

• `Protected` `Readonly` **redis\_**: `Redis`

#### Defined in

[services/tax-provider.ts:50](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L50)

___

### smTaxLineRepo\_

• `Protected` `Readonly` **smTaxLineRepo\_**: typeof `ShippingMethodTaxLineRepository`

#### Defined in

[services/tax-provider.ts:48](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L48)

___

### taxLineRepo\_

• `Protected` `Readonly` **taxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[services/tax-provider.ts:47](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L47)

___

### taxProviderRepo\_

• `Protected` `Readonly` **taxProviderRepo\_**: typeof `TaxProviderRepository`

#### Defined in

[services/tax-provider.ts:49](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L49)

___

### taxRateService\_

• `Protected` `Readonly` **taxRateService\_**: [`TaxRateService`](TaxRateService.md)

#### Defined in

[services/tax-provider.ts:46](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L46)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[services/tax-provider.ts:43](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L43)

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

[interfaces/transaction-base-service.ts:53](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L53)

___

### clearTaxLines

▸ **clearTaxLines**(`cartId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cartId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[services/tax-provider.ts:94](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L94)

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

[services/tax-provider.ts:170](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L170)

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

[services/tax-provider.ts:116](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L116)

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

[services/tax-provider.ts:457](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L457)

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

[services/tax-provider.ts:426](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L426)

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

[services/tax-provider.ts:379](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L379)

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

[services/tax-provider.ts:333](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L333)

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

[services/tax-provider.ts:191](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L191)

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

[services/tax-provider.ts:243](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L243)

___

### list

▸ **list**(): `Promise`<`TaxProvider`[]\>

#### Returns

`Promise`<`TaxProvider`[]\>

#### Defined in

[services/tax-provider.ts:66](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L66)

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

[services/tax-provider.ts:478](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L478)

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

[services/tax-provider.ts:76](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L76)

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

[services/tax-provider.ts:437](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/services/tax-provider.ts#L437)

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

[interfaces/transaction-base-service.ts:34](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L34)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`TaxProviderService`](TaxProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`TaxProviderService`](TaxProviderService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[interfaces/transaction-base-service.ts:16](https://github.com/medusajs/medusa/blob/6663a629/packages/medusa/src/interfaces/transaction-base-service.ts#L16)
