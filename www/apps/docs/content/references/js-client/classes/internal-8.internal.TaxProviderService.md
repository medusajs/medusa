---
displayed_sidebar: jsClientSidebar
---

# Class: TaxProviderService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).TaxProviderService

Finds tax providers and assists in tax related operations.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`TaxProviderService`**

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__configModule__](internal-8.internal.TransactionBaseService.md#__configmodule__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:5

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__container__](internal-8.internal.TransactionBaseService.md#__container__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:4

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[__moduleDeclaration__](internal-8.internal.TransactionBaseService.md#__moduledeclaration__)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:6

___

### cacheService\_

• `Protected` `Readonly` **cacheService\_**: [`ICacheService`](../interfaces/internal-8.ICacheService.md)

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:19

___

### container\_

• `Protected` `Readonly` **container\_**: `AwilixContainer`<`any`\>

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:18

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`IEventBusService`](../interfaces/internal-8.IEventBusService.md)

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:24

___

### getCacheKey

• `Private` **getCacheKey**: `any`

The cache key to get cache hits by.

**`Param`**

the entity id to cache

**`Param`**

the region id to cache

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:99

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### smTaxLineRepo\_

• `Protected` `Readonly` **smTaxLineRepo\_**: `Repository`<[`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md)\> & { `deleteForCart`: (`cartId`: `string`) => `Promise`<`void`\> ; `upsertLines`: (`lines`: [`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md)[]) => `Promise`<[`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md)[]\>  }

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:22

___

### taxLineRepo\_

• `Protected` `Readonly` **taxLineRepo\_**: `Repository`<[`LineItemTaxLine`](internal-3.LineItemTaxLine.md)\> & { `deleteForCart`: (`cartId`: `string`) => `Promise`<`void`\> ; `upsertLines`: (`lines`: [`LineItemTaxLine`](internal-3.LineItemTaxLine.md)[]) => `Promise`<[`LineItemTaxLine`](internal-3.LineItemTaxLine.md)[]\>  }

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:21

___

### taxProviderRepo\_

• `Protected` `Readonly` **taxProviderRepo\_**: `Repository`<[`TaxProvider`](internal-3.TaxProvider.md)\>

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:23

___

### taxRateService\_

• `Protected` `Readonly` **taxRateService\_**: [`TaxRateService`](internal-8.internal.TaxRateService.md)

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:20

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:9

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

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[atomicPhase_](internal-8.internal.TransactionBaseService.md#atomicphase_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:24

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

packages/medusa/dist/services/tax-provider.d.ts:33

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

packages/medusa/dist/services/tax-provider.d.ts:34

___

### createShippingTaxLines

▸ **createShippingTaxLines**(`shippingMethod`, `calculationContext`): `Promise`<([`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md) \| [`LineItemTaxLine`](internal-3.LineItemTaxLine.md))[]\>

Persists the tax lines relevant for a shipping method to the database. Used
for return shipping methods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethod` | [`ShippingMethod`](internal-3.ShippingMethod.md) | the shipping method to create tax lines for |
| `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) | the calculation context to get tax lines by |

#### Returns

`Promise`<([`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md) \| [`LineItemTaxLine`](internal-3.LineItemTaxLine.md))[]\>

the newly created tax lines

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:49

___

### createTaxLines

▸ **createTaxLines**(`cartOrLineItems`, `calculationContext`): `Promise`<([`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md) \| [`LineItemTaxLine`](internal-3.LineItemTaxLine.md))[]\>

Persists the tax lines relevant for an order to the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cartOrLineItems` | [`Cart`](internal-3.Cart.md) \| [`LineItem`](internal-3.LineItem.md)[] | the cart or line items to create tax lines for |
| `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) | the calculation context to get tax lines by |

#### Returns

`Promise`<([`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md) \| [`LineItemTaxLine`](internal-3.LineItemTaxLine.md))[]\>

the newly created tax lines

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:41

___

### getRegionRatesForProduct

▸ **getRegionRatesForProduct**(`productIds`, `region`): `Promise`<`Map`<`string`, [`TaxServiceRate`](../modules/internal-8.md#taxservicerate)[]\>\>

Gets the tax rates configured for a product. The rates are cached between
calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productIds` | `string` \| `string`[] |  |
| `region` | [`RegionDetails`](../modules/internal-8.md#regiondetails) | the region to get configured rates for. |

#### Returns

`Promise`<`Map`<`string`, [`TaxServiceRate`](../modules/internal-8.md#taxservicerate)[]\>\>

the tax rates configured for the shipping option. A map by product id

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:92

___

### getRegionRatesForShipping

▸ **getRegionRatesForShipping**(`optionId`, `regionDetails`): `Promise`<[`TaxServiceRate`](../modules/internal-8.md#taxservicerate)[]\>

Gets the tax rates configured for a shipping option. The rates are cached
between calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `optionId` | `string` | the option id of the shipping method. |
| `regionDetails` | [`RegionDetails`](../modules/internal-8.md#regiondetails) | the region to get configured rates for. |

#### Returns

`Promise`<[`TaxServiceRate`](../modules/internal-8.md#taxservicerate)[]\>

the tax rates configured for the shipping option.

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:84

___

### getShippingTaxLines

▸ **getShippingTaxLines**(`shippingMethod`, `calculationContext`): `Promise`<[`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md)[]\>

Gets the relevant tax lines for a shipping method. Note: this method
doesn't persist the tax lines. Use createShippingTaxLines if you wish to
persist the tax lines to the DB layer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `shippingMethod` | [`ShippingMethod`](internal-3.ShippingMethod.md) | the shipping method to get tax lines for |
| `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) | the calculation context to get tax lines by |

#### Returns

`Promise`<[`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md)[]\>

the computed tax lines

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:58

___

### getTaxLines

▸ **getTaxLines**(`lineItems`, `calculationContext`): `Promise`<([`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md) \| [`LineItemTaxLine`](internal-3.LineItemTaxLine.md))[]\>

Gets the relevant tax lines for an order or cart. If an order is provided
the order's tax lines will be returned. If a cart is provided the tax lines
will be computed from the tax rules and potentially a 3rd party tax plugin.
Note: this method doesn't persist the tax lines. Use createTaxLines if you
wish to persist the tax lines to the DB layer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lineItems` | [`LineItem`](internal-3.LineItem.md)[] | the cart or order to get tax lines for |
| `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) | the calculation context to get tax lines by |

#### Returns

`Promise`<([`ShippingMethodTaxLine`](internal-3.ShippingMethodTaxLine.md) \| [`LineItemTaxLine`](internal-3.LineItemTaxLine.md))[]\>

the computed tax lines

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:69

___

### getTaxLinesMap

▸ `Protected` **getTaxLinesMap**(`items`, `calculationContext`): `Promise`<[`TaxLinesMaps`](../modules/internal-8.md#taxlinesmaps)\>

Return a map of tax lines for line items and shipping methods

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | [`LineItem`](internal-3.LineItem.md)[] |
| `calculationContext` | [`TaxCalculationContext`](../modules/internal-8.internal.md#taxcalculationcontext) |

#### Returns

`Promise`<[`TaxLinesMaps`](../modules/internal-8.md#taxlinesmaps)\>

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:76

___

### list

▸ **list**(): `Promise`<[`TaxProvider`](internal-3.TaxProvider.md)[]\>

#### Returns

`Promise`<[`TaxProvider`](internal-3.TaxProvider.md)[]\>

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:26

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

packages/medusa/dist/services/tax-provider.d.ts:100

___

### retrieveProvider

▸ **retrieveProvider**(`region`): [`ITaxService`](../interfaces/internal-8.internal.ITaxService.md)

Retrieves the relevant tax provider for the given region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `region` | [`Region`](internal-3.Region.md) | the region to get tax provider for. |

#### Returns

[`ITaxService`](../interfaces/internal-8.internal.ITaxService.md)

the region specific tax provider

#### Defined in

packages/medusa/dist/services/tax-provider.d.ts:32

___

### shouldRetryTransaction\_

▸ `Protected` **shouldRetryTransaction_**(`err`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | [`Record`](../modules/internal.md#record)<`string`, `unknown`\> \| { `code`: `string`  } |

#### Returns

`boolean`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[shouldRetryTransaction_](internal-8.internal.TransactionBaseService.md#shouldretrytransaction_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:12

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`TaxProviderService`](internal-8.internal.TaxProviderService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
