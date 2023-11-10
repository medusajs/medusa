# TaxProviderService

Finds tax providers and assists in tax related operations.

## Hierarchy

- [`TransactionBaseService`](TransactionBaseService.md)

  ↳ **`TaxProviderService`**

## Constructors

### constructor

**new TaxProviderService**(`container`)

#### Parameters

| Name |
| :------ |
| `container` | [`AwilixContainer`](../interfaces/AwilixContainer.md)<`any`\> |

#### Overrides

[TransactionBaseService](TransactionBaseService.md).[constructor](TransactionBaseService.md#constructor)

#### Defined in

[packages/medusa/src/services/tax-provider.ts:46](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L46)

## Properties

### \_\_configModule\_\_

 `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__configModule__](TransactionBaseService.md#__configmodule__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

 `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__container__](TransactionBaseService.md#__container__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

 `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: Record<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[__moduleDeclaration__](TransactionBaseService.md#__moduledeclaration__)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### cacheService\_

 `Protected` `Readonly` **cacheService\_**: [`ICacheService`](../interfaces/ICacheService.md)

#### Defined in

[packages/medusa/src/services/tax-provider.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L39)

___

### container\_

 `Protected` `Readonly` **container\_**: [`AwilixContainer`](../interfaces/AwilixContainer.md)<`any`\>

#### Defined in

[packages/medusa/src/services/tax-provider.ts:38](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L38)

___

### eventBus\_

 `Protected` `Readonly` **eventBus\_**: [`IEventBusService`](../interfaces/IEventBusService.md)

#### Defined in

[packages/medusa/src/services/tax-provider.ts:44](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L44)

___

### manager\_

 `Protected` **manager\_**: [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[manager_](TransactionBaseService.md#manager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### smTaxLineRepo\_

 `Protected` `Readonly` **smTaxLineRepo\_**: [`Repository`](Repository.md)<[`ShippingMethodTaxLine`](ShippingMethodTaxLine.md)\> & { `deleteForCart`: Method deleteForCart ; `upsertLines`: Method upsertLines  }

#### Defined in

[packages/medusa/src/services/tax-provider.ts:42](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L42)

___

### taxLineRepo\_

 `Protected` `Readonly` **taxLineRepo\_**: [`Repository`](Repository.md)<[`LineItemTaxLine`](LineItemTaxLine.md)\> & { `deleteForCart`: Method deleteForCart ; `upsertLines`: Method upsertLines  }

#### Defined in

[packages/medusa/src/services/tax-provider.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L41)

___

### taxProviderRepo\_

 `Protected` `Readonly` **taxProviderRepo\_**: [`Repository`](Repository.md)<[`TaxProvider`](TaxProvider.md)\>

#### Defined in

[packages/medusa/src/services/tax-provider.ts:43](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L43)

___

### taxRateService\_

 `Protected` `Readonly` **taxRateService\_**: [`TaxRateService`](TaxRateService.md)

#### Defined in

[packages/medusa/src/services/tax-provider.ts:40](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L40)

___

### transactionManager\_

 `Protected` **transactionManager\_**: `undefined` \| [`EntityManager`](EntityManager.md)

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[transactionManager_](TransactionBaseService.md#transactionmanager_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

## Accessors

### activeManager\_

`Protected` `get` **activeManager_**(): [`EntityManager`](EntityManager.md)

#### Returns

[`EntityManager`](EntityManager.md)

-`EntityManager`: 

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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
| `isolationOrErrorHandler?` | [`IsolationLevel`](../index.md#isolationlevel) \| (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | the isolation level to be used for the work. |
| `maybeErrorHandlerOrDontFail?` | (`error`: `TError`) => `Promise`<`void` \| `TResult`\> | Potential error handler |

#### Returns

`Promise`<`TResult`\>

-`Promise`: the result of the transactional work

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[atomicPhase_](TransactionBaseService.md#atomicphase_)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### clearLineItemsTaxLines

**clearLineItemsTaxLines**(`itemIds`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `itemIds` | `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:90](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L90)

___

### clearTaxLines

**clearTaxLines**(`cartId`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `cartId` | `string` |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:98](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L98)

___

### createShippingTaxLines

**createShippingTaxLines**(`shippingMethod`, `calculationContext`): `Promise`<([`LineItemTaxLine`](LineItemTaxLine.md) \| [`ShippingMethodTaxLine`](ShippingMethodTaxLine.md))[]\>

Persists the tax lines relevant for a shipping method to the database. Used
for return shipping methods.

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingMethod` | [`ShippingMethod`](ShippingMethod.md) | the shipping method to create tax lines for |
| `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) | the calculation context to get tax lines by |

#### Returns

`Promise`<([`LineItemTaxLine`](LineItemTaxLine.md) \| [`ShippingMethodTaxLine`](ShippingMethodTaxLine.md))[]\>

-`Promise`: the newly created tax lines
	-`(LineItemTaxLine \| ShippingMethodTaxLine)[]`: 
		-`LineItemTaxLine \| ShippingMethodTaxLine`: (optional) 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:172](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L172)

___

### createTaxLines

**createTaxLines**(`cartOrLineItems`, `calculationContext`): `Promise`<([`LineItemTaxLine`](LineItemTaxLine.md) \| [`ShippingMethodTaxLine`](ShippingMethodTaxLine.md))[]\>

Persists the tax lines relevant for an order to the database.

#### Parameters

| Name | Description |
| :------ | :------ |
| `cartOrLineItems` | [`LineItem`](LineItem.md)[] \| [`Cart`](Cart.md) | the cart or line items to create tax lines for |
| `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) | the calculation context to get tax lines by |

#### Returns

`Promise`<([`LineItemTaxLine`](LineItemTaxLine.md) \| [`ShippingMethodTaxLine`](ShippingMethodTaxLine.md))[]\>

-`Promise`: the newly created tax lines
	-`(LineItemTaxLine \| ShippingMethodTaxLine)[]`: 
		-`LineItemTaxLine \| ShippingMethodTaxLine`: (optional) 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:118](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L118)

___

### getCacheKey

`Private` **getCacheKey**(`id`, `regionId`): `string`

The cache key to get cache hits by.

#### Parameters

| Name | Description |
| :------ | :------ |
| `id` | `string` | the entity id to cache |
| `regionId` | `string` | the region id to cache |

#### Returns

`string`

-`string`: (optional) the cache key to use for the id set

#### Defined in

[packages/medusa/src/services/tax-provider.ts:493](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L493)

___

### getRegionRatesForProduct

**getRegionRatesForProduct**(`productIds`, `region`): `Promise`<`Map`<`string`, [`TaxServiceRate`](../index.md#taxservicerate)[]\>\>

Gets the tax rates configured for a product. The rates are cached between
calls.

#### Parameters

| Name | Description |
| :------ | :------ |
| `productIds` | `string` \| `string`[] |
| `region` | [`RegionDetails`](../index.md#regiondetails) | the region to get configured rates for. |

#### Returns

`Promise`<`Map`<`string`, [`TaxServiceRate`](../index.md#taxservicerate)[]\>\>

-`Promise`: the tax rates configured for the shipping option. A map by product id
	-`Map`: 
		-`string`: (optional) 
		-`TaxServiceRate[]`: 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:428](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L428)

___

### getRegionRatesForShipping

**getRegionRatesForShipping**(`optionId`, `regionDetails`): `Promise`<[`TaxServiceRate`](../index.md#taxservicerate)[]\>

Gets the tax rates configured for a shipping option. The rates are cached
between calls.

#### Parameters

| Name | Description |
| :------ | :------ |
| `optionId` | `string` | the option id of the shipping method. |
| `regionDetails` | [`RegionDetails`](../index.md#regiondetails) | the region to get configured rates for. |

#### Returns

`Promise`<[`TaxServiceRate`](../index.md#taxservicerate)[]\>

-`Promise`: the tax rates configured for the shipping option.
	-`TaxServiceRate[]`: 
		-`TaxServiceRate`: The tax rate object as configured in Medusa. These may have an unspecified numerical rate as they may be used for lookup purposes in the tax provider plugin.

#### Defined in

[packages/medusa/src/services/tax-provider.ts:381](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L381)

___

### getShippingTaxLines

**getShippingTaxLines**(`shippingMethod`, `calculationContext`): `Promise`<[`ShippingMethodTaxLine`](ShippingMethodTaxLine.md)[]\>

Gets the relevant tax lines for a shipping method. Note: this method
doesn't persist the tax lines. Use createShippingTaxLines if you wish to
persist the tax lines to the DB layer.

#### Parameters

| Name | Description |
| :------ | :------ |
| `shippingMethod` | [`ShippingMethod`](ShippingMethod.md) | the shipping method to get tax lines for |
| `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) | the calculation context to get tax lines by |

#### Returns

`Promise`<[`ShippingMethodTaxLine`](ShippingMethodTaxLine.md)[]\>

-`Promise`: the computed tax lines
	-`ShippingMethodTaxLine[]`: 
		-`ShippingMethodTaxLine`: 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:193](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L193)

___

### getTaxLines

**getTaxLines**(`lineItems`, `calculationContext`): `Promise`<([`LineItemTaxLine`](LineItemTaxLine.md) \| [`ShippingMethodTaxLine`](ShippingMethodTaxLine.md))[]\>

Gets the relevant tax lines for an order or cart. If an order is provided
the order's tax lines will be returned. If a cart is provided the tax lines
will be computed from the tax rules and potentially a 3rd party tax plugin.
Note: this method doesn't persist the tax lines. Use createTaxLines if you
wish to persist the tax lines to the DB layer.

#### Parameters

| Name | Description |
| :------ | :------ |
| `lineItems` | [`LineItem`](LineItem.md)[] | the cart or order to get tax lines for |
| `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) | the calculation context to get tax lines by |

#### Returns

`Promise`<([`LineItemTaxLine`](LineItemTaxLine.md) \| [`ShippingMethodTaxLine`](ShippingMethodTaxLine.md))[]\>

-`Promise`: the computed tax lines
	-`(LineItemTaxLine \| ShippingMethodTaxLine)[]`: 
		-`LineItemTaxLine \| ShippingMethodTaxLine`: (optional) 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:247](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L247)

___

### getTaxLinesMap

`Protected` **getTaxLinesMap**(`items`, `calculationContext`): `Promise`<[`TaxLinesMaps`](../index.md#taxlinesmaps)\>

Return a map of tax lines for line items and shipping methods

#### Parameters

| Name |
| :------ |
| `items` | [`LineItem`](LineItem.md)[] |
| `calculationContext` | [`TaxCalculationContext`](../index.md#taxcalculationcontext) |

#### Returns

`Promise`<[`TaxLinesMaps`](../index.md#taxlinesmaps)\>

-`Promise`: 
	-`TaxLinesMaps`: 
		-`lineItemsTaxLines`: 
		-`shippingMethodsTaxLines`: 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:344](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L344)

___

### list

**list**(): `Promise`<[`TaxProvider`](TaxProvider.md)[]\>

#### Returns

`Promise`<[`TaxProvider`](TaxProvider.md)[]\>

-`Promise`: 
	-`TaxProvider[]`: 
		-`TaxProvider`: 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L58)

___

### registerInstalledProviders

**registerInstalledProviders**(`providers`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `providers` | `string`[] |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:497](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L497)

___

### retrieveProvider

**retrieveProvider**(`region`): [`ITaxService`](../interfaces/ITaxService.md)

Retrieves the relevant tax provider for the given region.

#### Parameters

| Name | Description |
| :------ | :------ |
| `region` | [`Region`](Region.md) | the region to get tax provider for. |

#### Returns

[`ITaxService`](../interfaces/ITaxService.md)

-`getTaxLines`: 

#### Defined in

[packages/medusa/src/services/tax-provider.ts:68](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/services/tax-provider.ts#L68)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### withTransaction

**withTransaction**(`transactionManager?`): [`TaxProviderService`](TaxProviderService.md)

#### Parameters

| Name |
| :------ |
| `transactionManager?` | [`EntityManager`](EntityManager.md) |

#### Returns

[`TaxProviderService`](TaxProviderService.md)

-`TaxProviderService`: 

#### Inherited from

[TransactionBaseService](TransactionBaseService.md).[withTransaction](TransactionBaseService.md#withtransaction)

#### Defined in

[packages/medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
