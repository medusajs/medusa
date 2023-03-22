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

[packages/medusa/src/services/tax-provider.ts:51](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L51)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:10](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L10)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:9](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L9)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:11](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L11)

___

### cacheService\_

• `Protected` `Readonly` **cacheService\_**: `ICacheService`

#### Defined in

[packages/medusa/src/services/tax-provider.ts:44](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L44)

___

### container\_

• `Protected` `Readonly` **container\_**: `AwilixContainer`<`any`\>

#### Defined in

[packages/medusa/src/services/tax-provider.ts:43](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L43)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/tax-provider.ts:49](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L49)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/tax-provider.ts:40](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L40)

___

### smTaxLineRepo\_

• `Protected` `Readonly` **smTaxLineRepo\_**: typeof `ShippingMethodTaxLineRepository`

#### Defined in

[packages/medusa/src/services/tax-provider.ts:47](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L47)

___

### taxLineRepo\_

• `Protected` `Readonly` **taxLineRepo\_**: typeof `LineItemTaxLineRepository`

#### Defined in

[packages/medusa/src/services/tax-provider.ts:46](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L46)

___

### taxProviderRepo\_

• `Protected` `Readonly` **taxProviderRepo\_**: typeof `TaxProviderRepository`

#### Defined in

[packages/medusa/src/services/tax-provider.ts:48](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L48)

___

### taxRateService\_

• `Protected` `Readonly` **taxRateService\_**: [`TaxRateService`](TaxRateService.md)

#### Defined in

[packages/medusa/src/services/tax-provider.ts:45](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L45)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/tax-provider.ts:41](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L41)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

___

### clearLineItemsTaxLines

▸ **clearLineItemsTaxLines**(`itemIds`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemIds` | `string`[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/medusa/src/services/tax-provider.ts:97](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L97)

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

[packages/medusa/src/services/tax-provider.ts:107](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L107)

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

[packages/medusa/src/services/tax-provider.ts:183](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L183)

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

[packages/medusa/src/services/tax-provider.ts:129](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L129)

___

### getCacheKey

▸ `Private` **getCacheKey**(`id`, `regionId`): `string`

The cache key to get cache hits by.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the entity id to cache |
| `regionId` | `string` | the region id to cache |

#### Returns

`string`

the cache key to use for the id set

#### Defined in

[packages/medusa/src/services/tax-provider.ts:484](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L484)

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

[packages/medusa/src/services/tax-provider.ts:436](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L436)

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

[packages/medusa/src/services/tax-provider.ts:389](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L389)

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

[packages/medusa/src/services/tax-provider.ts:204](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L204)

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

[packages/medusa/src/services/tax-provider.ts:256](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L256)

___

### getTaxLinesMap

▸ `Protected` **getTaxLinesMap**(`items`, `calculationContext`): `Promise`<`TaxLinesMaps`\>

Return a map of tax lines for line items and shipping methods

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | `LineItem`[] |
| `calculationContext` | `TaxCalculationContext` |

#### Returns

`Promise`<`TaxLinesMaps`\>

#### Defined in

[packages/medusa/src/services/tax-provider.ts:352](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L352)

___

### list

▸ **list**(): `Promise`<`TaxProvider`[]\>

#### Returns

`Promise`<`TaxProvider`[]\>

#### Defined in

[packages/medusa/src/services/tax-provider.ts:65](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L65)

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

[packages/medusa/src/services/tax-provider.ts:488](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L488)

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

[packages/medusa/src/services/tax-provider.ts:75](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/tax-provider.ts#L75)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:31](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L31)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
