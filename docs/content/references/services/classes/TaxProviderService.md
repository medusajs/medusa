# Class: TaxProviderService

Finds tax providers and assists in tax related operations.

## Hierarchy

- `TransactionBaseService`

  ↳ **`TaxProviderService`**

## Constructors

### constructor

• **new TaxProviderService**(`container`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `AwilixContainer`<`any`\> |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[packages/medusa/src/services/tax-provider.ts:53](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L53)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### container\_

• `Protected` `Readonly` **container\_**: `AwilixContainer`<`any`\>

#### Defined in

[packages/medusa/src/services/tax-provider.ts:45](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L45)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/tax-provider.ts:51](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L51)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/tax-provider.ts:42](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L42)

___

### redis\_

• `Protected` `Readonly` **redis\_**: `Redis`

#### Defined in

[packages/medusa/src/services/tax-provider.ts:50](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L50)

___

### smTaxLineRepo\_

• `Protected` `Readonly` **smTaxLineRepo\_**: typeof `ShippingMethodTaxLineRepository`

#### Defined in

[packages/medusa/src/services/tax-provider.ts:48](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L48)

___

### taxLineRepo\_

• `Protected` `Readonly` **taxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[packages/medusa/src/services/tax-provider.ts:47](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L47)

___

### taxProviderRepo\_

• `Protected` `Readonly` **taxProviderRepo\_**: typeof `TaxProviderRepository`

#### Defined in

[packages/medusa/src/services/tax-provider.ts:49](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L49)

___

### taxRateService\_

• `Protected` `Readonly` **taxRateService\_**: [`TaxRateService`](TaxRateService.md)

#### Defined in

[packages/medusa/src/services/tax-provider.ts:46](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L46)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/tax-provider.ts:43](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L43)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/tax-provider.ts:94](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L94)

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

[packages/medusa/src/services/tax-provider.ts:170](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L170)

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

[packages/medusa/src/services/tax-provider.ts:116](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L116)

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

[packages/medusa/src/services/tax-provider.ts:457](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L457)

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

[packages/medusa/src/services/tax-provider.ts:426](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L426)

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

[packages/medusa/src/services/tax-provider.ts:379](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L379)

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

[packages/medusa/src/services/tax-provider.ts:333](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L333)

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

[packages/medusa/src/services/tax-provider.ts:191](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L191)

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

[packages/medusa/src/services/tax-provider.ts:243](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L243)

___

### list

▸ **list**(): `Promise`<`TaxProvider`[]\>

#### Returns

`Promise`<`TaxProvider`[]\>

#### Defined in

[packages/medusa/src/services/tax-provider.ts:66](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L66)

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

[packages/medusa/src/services/tax-provider.ts:478](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L478)

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

[packages/medusa/src/services/tax-provider.ts:76](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L76)

___

### setCache

▸ `Private` **setCache**(`productId`, `regionId`, `value`): `Promise`<``null`` \| `string`\>

Sets the cache results for a set of ids

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productId` | `string` | the product id to cache |
| `regionId` | `string` | the region id to cache |
| `value` | `TaxServiceRate`[] | tax rates to cache |

#### Returns

`Promise`<``null`` \| `string`\>

promise that resolves after the cache has been set

#### Defined in

[packages/medusa/src/services/tax-provider.ts:437](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/services/tax-provider.ts#L437)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/70139d0bb/packages/medusa/src/interfaces/transaction-base-service.ts#L13)
