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

[medusa/src/services/tax-provider.ts:45](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L45)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### cacheService\_

• `Protected` `Readonly` **cacheService\_**: `ICacheService`

#### Defined in

[medusa/src/services/tax-provider.ts:38](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L38)

___

### container\_

• `Protected` `Readonly` **container\_**: `AwilixContainer`<`any`\>

#### Defined in

[medusa/src/services/tax-provider.ts:37](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L37)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: `IEventBusService`

#### Defined in

[medusa/src/services/tax-provider.ts:43](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L43)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### smTaxLineRepo\_

• `Protected` `Readonly` **smTaxLineRepo\_**: `Repository`<`ShippingMethodTaxLine`\> & { `deleteForCart`: (`cartId`: `string`) => `Promise`<`void`\> ; `upsertLines`: (`lines`: `ShippingMethodTaxLine`[]) => `Promise`<`ShippingMethodTaxLine`[]\>  }

#### Defined in

[medusa/src/services/tax-provider.ts:41](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L41)

___

### taxLineRepo\_

• `Protected` `Readonly` **taxLineRepo\_**: `Repository`<`LineItemTaxLine`\> & { `deleteForCart`: (`cartId`: `string`) => `Promise`<`void`\> ; `upsertLines`: (`lines`: `LineItemTaxLine`[]) => `Promise`<`LineItemTaxLine`[]\>  }

#### Defined in

[medusa/src/services/tax-provider.ts:40](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L40)

___

### taxProviderRepo\_

• `Protected` `Readonly` **taxProviderRepo\_**: `Repository`<`TaxProvider`\>

#### Defined in

[medusa/src/services/tax-provider.ts:42](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L42)

___

### taxRateService\_

• `Protected` `Readonly` **taxRateService\_**: [`TaxRateService`](TaxRateService.md)

#### Defined in

[medusa/src/services/tax-provider.ts:39](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L39)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/tax-provider.ts:89](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L89)

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

[medusa/src/services/tax-provider.ts:97](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L97)

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

[medusa/src/services/tax-provider.ts:171](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L171)

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

[medusa/src/services/tax-provider.ts:117](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L117)

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

[medusa/src/services/tax-provider.ts:499](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L499)

___

### getRegionRatesForProduct

▸ **getRegionRatesForProduct**(`productIds`, `region`): `Promise`<`Map`<`string`, `TaxServiceRate`[]\>\>

Gets the tax rates configured for a product. The rates are cached between
calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productIds` | `string` \| `string`[] |  |
| `region` | `RegionDetails` | the region to get configured rates for. |

#### Returns

`Promise`<`Map`<`string`, `TaxServiceRate`[]\>\>

the tax rates configured for the shipping option. A map by product id

#### Defined in

[medusa/src/services/tax-provider.ts:434](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L434)

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

[medusa/src/services/tax-provider.ts:387](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L387)

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

[medusa/src/services/tax-provider.ts:192](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L192)

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

[medusa/src/services/tax-provider.ts:246](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L246)

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

[medusa/src/services/tax-provider.ts:350](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L350)

___

### list

▸ **list**(): `Promise`<`TaxProvider`[]\>

#### Returns

`Promise`<`TaxProvider`[]\>

#### Defined in

[medusa/src/services/tax-provider.ts:57](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L57)

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

[medusa/src/services/tax-provider.ts:503](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L503)

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

[medusa/src/services/tax-provider.ts:67](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/services/tax-provider.ts#L67)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/499c3478c/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
