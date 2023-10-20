---
displayed_sidebar: jsClientSidebar
---

# Class: RegionService

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).RegionService

Provides layer to manipulate regions.

## Hierarchy

- [`TransactionBaseService`](internal-8.internal.TransactionBaseService.md)

  ↳ **`RegionService`**

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

### countryRepository\_

• `Protected` `Readonly` **countryRepository\_**: `Repository`<[`Country`](internal-3.Country.md)\>

#### Defined in

packages/medusa/dist/services/region.d.ts:46

___

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: `Repository`<[`Currency`](internal-3.Currency.md)\>

#### Defined in

packages/medusa/dist/services/region.d.ts:47

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](internal-8.internal.EventBusService.md)

#### Defined in

packages/medusa/dist/services/region.d.ts:41

___

### featureFlagRouter\_

• `Protected` **featureFlagRouter\_**: [`FlagRouter`](internal-8.FlagRouter.md)

#### Defined in

packages/medusa/dist/services/region.d.ts:40

___

### fulfillmentProviderRepository\_

• `Protected` `Readonly` **fulfillmentProviderRepository\_**: `Repository`<[`FulfillmentProvider`](internal-3.FulfillmentProvider.md)\>

#### Defined in

packages/medusa/dist/services/region.d.ts:49

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](internal-8.internal.FulfillmentProviderService.md)

#### Defined in

packages/medusa/dist/services/region.d.ts:44

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[manager_](internal-8.internal.TransactionBaseService.md#manager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:7

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: `Repository`<[`PaymentProvider`](internal-3.PaymentProvider.md)\>

#### Defined in

packages/medusa/dist/services/region.d.ts:48

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](internal-8.internal.PaymentProviderService.md)

#### Defined in

packages/medusa/dist/services/region.d.ts:43

___

### regionRepository\_

• `Protected` `Readonly` **regionRepository\_**: `Repository`<[`Region`](internal-3.Region.md)\>

#### Defined in

packages/medusa/dist/services/region.d.ts:45

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](internal-8.internal.StoreService.md)

#### Defined in

packages/medusa/dist/services/region.d.ts:42

___

### taxProviderRepository\_

• `Protected` `Readonly` **taxProviderRepository\_**: `Repository`<[`TaxProvider`](internal-3.TaxProvider.md)\>

#### Defined in

packages/medusa/dist/services/region.d.ts:50

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[transactionManager_](internal-8.internal.TransactionBaseService.md#transactionmanager_)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:8

___

### Events

▪ `Static` **Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CREATED` | `string` |
| `DELETED` | `string` |
| `UPDATED` | `string` |

#### Defined in

packages/medusa/dist/services/region.d.ts:35

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

### addCountry

▸ **addCountry**(`regionId`, `code`): `Promise`<[`Region`](internal-3.Region.md)\>

Adds a country to the region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to add a country to |
| `code` | `string` | a 2 digit alphanumeric ISO country code. |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

the updated Region

#### Defined in

packages/medusa/dist/services/region.d.ts:154

___

### addFulfillmentProvider

▸ **addFulfillmentProvider**(`regionId`, `providerId`): `Promise`<[`Region`](internal-3.Region.md)\>

Adds a fulfillment provider that is available in the region. Fails if the
provider doesn't exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to add the provider to |
| `providerId` | `string` | the provider to add to the region |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

the updated Region

#### Defined in

packages/medusa/dist/services/region.d.ts:180

___

### addPaymentProvider

▸ **addPaymentProvider**(`regionId`, `providerId`): `Promise`<[`Region`](internal-3.Region.md)\>

Adds a payment provider that is available in the region. Fails if the
provider doesn't exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to add the provider to |
| `providerId` | `string` | the provider to add to the region |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

the updated Region

#### Defined in

packages/medusa/dist/services/region.d.ts:171

___

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

### create

▸ **create**(`data`): `Promise`<[`Region`](internal-3.Region.md)\>

Creates a region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`CreateRegionInput`](../modules/internal-8.md#createregioninput) | the unvalidated region |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

the newly created region

#### Defined in

packages/medusa/dist/services/region.d.ts:58

___

### delete

▸ **delete**(`regionId`): `Promise`<`void`\>

Deletes a region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to delete |

#### Returns

`Promise`<`void`\>

the result of the delete operation

#### Defined in

packages/medusa/dist/services/region.d.ts:146

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<[`Region`](internal-3.Region.md)[]\>

Lists all regions based on a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Region`](internal-3.Region.md)\> | query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Region`](internal-3.Region.md)\> | configuration settings |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)[]\>

result of the find operation

#### Defined in

packages/medusa/dist/services/region.d.ts:131

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[[`Region`](internal-3.Region.md)[], `number`]\>

Lists all regions based on a query and returns them along with count

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector?` | [`Selector`](../modules/internal-8.internal.md#selector)<[`Region`](internal-3.Region.md)\> | query object for find |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Region`](internal-3.Region.md)\> | configuration settings |

#### Returns

`Promise`<[[`Region`](internal-3.Region.md)[], `number`]\>

result of the find operation

#### Defined in

packages/medusa/dist/services/region.d.ts:139

___

### removeCountry

▸ **removeCountry**(`regionId`, `code`): `Promise`<[`Region`](internal-3.Region.md)\>

Removes a country from a Region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to remove from |
| `code` | `string` | a 2 digit alphanumeric ISO country code to remove |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

the updated Region

#### Defined in

packages/medusa/dist/services/region.d.ts:162

___

### removeFulfillmentProvider

▸ **removeFulfillmentProvider**(`regionId`, `providerId`): `Promise`<[`Region`](internal-3.Region.md)\>

Removes a fulfillment provider from a region. Is idempotent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to remove the provider from |
| `providerId` | `string` | the provider to remove from the region |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

the updated Region

#### Defined in

packages/medusa/dist/services/region.d.ts:196

___

### removePaymentProvider

▸ **removePaymentProvider**(`regionId`, `providerId`): `Promise`<[`Region`](internal-3.Region.md)\>

Removes a payment provider from a region. Is idempotent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to remove the provider from |
| `providerId` | `string` | the provider to remove from the region |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

the updated Region

#### Defined in

packages/medusa/dist/services/region.d.ts:188

___

### retrieve

▸ **retrieve**(`regionId`, `config?`): `Promise`<[`Region`](internal-3.Region.md)\>

Retrieves a region by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the id of the region to retrieve |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Region`](internal-3.Region.md)\> | configuration settings |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

the region

#### Defined in

packages/medusa/dist/services/region.d.ts:123

___

### retrieveByCountryCode

▸ **retrieveByCountryCode**(`code`, `config?`): `Promise`<[`Region`](internal-3.Region.md)\>

Retrieve a region by country code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | a 2 digit alphanumeric ISO country code |
| `config?` | [`FindConfig`](../interfaces/internal-8.internal.FindConfig.md)<[`Region`](internal-3.Region.md)\> | region find config |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

a Region with country code

#### Defined in

packages/medusa/dist/services/region.d.ts:108

___

### retrieveByName

▸ **retrieveByName**(`name`): `Promise`<[`Region`](internal-3.Region.md)\>

Retrieves a region by name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the name of the region to retrieve |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

region with the matching name

#### Defined in

packages/medusa/dist/services/region.d.ts:115

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

### update

▸ **update**(`regionId`, `update`): `Promise`<[`Region`](internal-3.Region.md)\>

Updates a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to update |
| `update` | [`UpdateRegionInput`](../modules/internal-8.md#updateregioninput) | the data to update the region with |

#### Returns

`Promise`<[`Region`](internal-3.Region.md)\>

the result of the update operation

#### Defined in

packages/medusa/dist/services/region.d.ts:66

___

### validateCountry

▸ `Protected` **validateCountry**(`code`, `regionId`): `Promise`<[`Country`](internal-3.Country.md)\>

Validates a country code. Will normalize the code before checking for
existence.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | a 2 digit alphanumeric ISO country code |
| `regionId` | `string` | the id of the current region to check against |

#### Returns

`Promise`<[`Country`](internal-3.Country.md)\>

the validated Country

#### Defined in

packages/medusa/dist/services/region.d.ts:100

___

### validateCurrency

▸ `Protected` **validateCurrency**(`currencyCode`): `Promise`<`void`\>

Validates a currency code. Will throw if the currency code doesn't exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currencyCode` | `string` | an ISO currency code |

#### Returns

`Promise`<`void`\>

void

**`Throws`**

if the provided currency code is invalid

#### Defined in

packages/medusa/dist/services/region.d.ts:91

___

### validateFields

▸ `Protected` **validateFields**<`T`\>(`regionData`, `id?`): `Promise`<`DeepPartial`<[`Region`](internal-3.Region.md)\>\>

Validates fields for creation and updates. If the region already exists
the id can be passed to check that country updates are allowed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CreateRegionInput`](../modules/internal-8.md#createregioninput) \| [`UpdateRegionInput`](../modules/internal-8.md#updateregioninput) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionData` | [`Omit`](../modules/internal-1.md#omit)<`T`, ``"metadata"`` \| ``"currency_code"``\> | the region data to validate |
| `id?` | `T` extends [`UpdateRegionInput`](../modules/internal-8.md#updateregioninput) ? `string` : `undefined` | optional id of the region to check against |

#### Returns

`Promise`<`DeepPartial`<[`Region`](internal-3.Region.md)\>\>

the validated region data

#### Defined in

packages/medusa/dist/services/region.d.ts:75

___

### validateTaxRate

▸ `Protected` **validateTaxRate**(`taxRate`): `void`

Validates a tax rate. Will throw if the tax rate is not between 0 and 1.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taxRate` | `number` | a number representing the tax rate of the region |

#### Returns

`void`

void

**`Throws`**

if the tax rate isn't number between 0-100

#### Defined in

packages/medusa/dist/services/region.d.ts:83

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`RegionService`](internal-8.internal.RegionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`RegionService`](internal-8.internal.RegionService.md)

#### Inherited from

[TransactionBaseService](internal-8.internal.TransactionBaseService.md).[withTransaction](internal-8.internal.TransactionBaseService.md#withtransaction)

#### Defined in

packages/medusa/dist/interfaces/transaction-base-service.d.ts:11
