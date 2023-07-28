# Class: RegionService

Provides layer to manipulate regions.

## Hierarchy

- `TransactionBaseService`

  ↳ **`RegionService`**

## Constructors

### constructor

• **new RegionService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Overrides

TransactionBaseService.constructor

#### Defined in

[medusa/src/services/region.ts:64](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L64)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### countryRepository\_

• `Protected` `Readonly` **countryRepository\_**: `Repository`<`Country`\>

#### Defined in

[medusa/src/services/region.ts:56](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L56)

___

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: `Repository`<`Currency`\>

#### Defined in

[medusa/src/services/region.ts:57](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L57)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/region.ts:51](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L51)

___

### featureFlagRouter\_

• `Protected` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/region.ts:49](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L49)

___

### fulfillmentProviderRepository\_

• `Protected` `Readonly` **fulfillmentProviderRepository\_**: `Repository`<`FulfillmentProvider`\>

#### Defined in

[medusa/src/services/region.ts:61](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L61)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[medusa/src/services/region.ts:54](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L54)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: `Repository`<`PaymentProvider`\>

#### Defined in

[medusa/src/services/region.ts:59](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L59)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[medusa/src/services/region.ts:53](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L53)

___

### regionRepository\_

• `Protected` `Readonly` **regionRepository\_**: `Repository`<`Region`\>

#### Defined in

[medusa/src/services/region.ts:55](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L55)

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](StoreService.md)

#### Defined in

[medusa/src/services/region.ts:52](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L52)

___

### taxProviderRepository\_

• `Protected` `Readonly` **taxProviderRepository\_**: `Repository`<`TaxProvider`\>

#### Defined in

[medusa/src/services/region.ts:62](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L62)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/region.ts:43](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L43)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

## Methods

### addCountry

▸ **addCountry**(`regionId`, `code`): `Promise`<`Region`\>

Adds a country to the region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to add a country to |
| `code` | `string` | a 2 digit alphanumeric ISO country code. |

#### Returns

`Promise`<`Region`\>

the updated Region

#### Defined in

[medusa/src/services/region.ts:577](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L577)

___

### addFulfillmentProvider

▸ **addFulfillmentProvider**(`regionId`, `providerId`): `Promise`<`Region`\>

Adds a fulfillment provider that is available in the region. Fails if the
provider doesn't exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to add the provider to |
| `providerId` | `string` | the provider to add to the region |

#### Returns

`Promise`<`Region`\>

the updated Region

#### Defined in

[medusa/src/services/region.ts:705](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L705)

___

### addPaymentProvider

▸ **addPaymentProvider**(`regionId`, `providerId`): `Promise`<`Region`\>

Adds a payment provider that is available in the region. Fails if the
provider doesn't exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to add the provider to |
| `providerId` | `string` | the provider to add to the region |

#### Returns

`Promise`<`Region`\>

the updated Region

#### Defined in

[medusa/src/services/region.ts:656](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L656)

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

TransactionBaseService.atomicPhase\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

___

### create

▸ **create**(`data`): `Promise`<`Region`\>

Creates a region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `CreateRegionInput` | the unvalidated region |

#### Returns

`Promise`<`Region`\>

the newly created region

#### Defined in

[medusa/src/services/region.ts:100](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L100)

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

[medusa/src/services/region.ts:546](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L546)

___

### list

▸ **list**(`selector?`, `config?`): `Promise`<`Region`[]\>

Lists all regions based on a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Region`\> | query object for find |
| `config` | `FindConfig`<`Region`\> | configuration settings |

#### Returns

`Promise`<`Region`[]\>

result of the find operation

#### Defined in

[medusa/src/services/region.ts:505](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L505)

___

### listAndCount

▸ **listAndCount**(`selector?`, `config?`): `Promise`<[`Region`[], `number`]\>

Lists all regions based on a query and returns them along with count

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `Selector`<`Region`\> | query object for find |
| `config` | `FindConfig`<`Region`\> | configuration settings |

#### Returns

`Promise`<[`Region`[], `number`]\>

result of the find operation

#### Defined in

[medusa/src/services/region.ts:524](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L524)

___

### removeCountry

▸ **removeCountry**(`regionId`, `code`): `Promise`<`Region`\>

Removes a country from a Region.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to remove from |
| `code` | `string` | a 2 digit alphanumeric ISO country code to remove |

#### Returns

`Promise`<`Region`\>

the updated Region

#### Defined in

[medusa/src/services/region.ts:615](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L615)

___

### removeFulfillmentProvider

▸ **removeFulfillmentProvider**(`regionId`, `providerId`): `Promise`<`Region`\>

Removes a fulfillment provider from a region. Is idempotent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to remove the provider from |
| `providerId` | `string` | the provider to remove from the region |

#### Returns

`Promise`<`Region`\>

the updated Region

#### Defined in

[medusa/src/services/region.ts:791](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L791)

___

### removePaymentProvider

▸ **removePaymentProvider**(`regionId`, `providerId`): `Promise`<`Region`\>

Removes a payment provider from a region. Is idempotent.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to remove the provider from |
| `providerId` | `string` | the provider to remove from the region |

#### Returns

`Promise`<`Region`\>

the updated Region

#### Defined in

[medusa/src/services/region.ts:752](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L752)

___

### retrieve

▸ **retrieve**(`regionId`, `config?`): `Promise`<`Region`\>

Retrieves a region by its id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the id of the region to retrieve |
| `config` | `FindConfig`<`Region`\> | configuration settings |

#### Returns

`Promise`<`Region`\>

the region

#### Defined in

[medusa/src/services/region.ts:470](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L470)

___

### retrieveByCountryCode

▸ **retrieveByCountryCode**(`code`, `config?`): `Promise`<`Region`\>

Retrieve a region by country code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | a 2 digit alphanumeric ISO country code |
| `config` | `FindConfig`<`Region`\> | region find config |

#### Returns

`Promise`<`Region`\>

a Region with country code

#### Defined in

[medusa/src/services/region.ts:416](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L416)

___

### retrieveByName

▸ **retrieveByName**(`name`): `Promise`<`Region`\>

Retrieves a region by name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the name of the region to retrieve |

#### Returns

`Promise`<`Region`\>

region with the matching name

#### Defined in

[medusa/src/services/region.ts:450](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L450)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

___

### update

▸ **update**(`regionId`, `update`): `Promise`<`Region`\>

Updates a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionId` | `string` | the region to update |
| `update` | `UpdateRegionInput` | the data to update the region with |

#### Returns

`Promise`<`Region`\>

the result of the update operation

#### Defined in

[medusa/src/services/region.ts:171](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L171)

___

### validateCountry

▸ `Protected` **validateCountry**(`code`, `regionId`): `Promise`<`Country`\>

Validates a country code. Will normalize the code before checking for
existence.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | a 2 digit alphanumeric ISO country code |
| `regionId` | `string` | the id of the current region to check against |

#### Returns

`Promise`<`Country`\>

the validated Country

#### Defined in

[medusa/src/services/region.ts:367](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L367)

___

### validateCurrency

▸ `Protected` **validateCurrency**(`currencyCode`): `Promise`<`void`\>

Validates a currency code. Will throw if the currency code doesn't exist.

**`Throws`**

if the provided currency code is invalid

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currencyCode` | `string` | an ISO currency code |

#### Returns

`Promise`<`void`\>

void

#### Defined in

[medusa/src/services/region.ts:342](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L342)

___

### validateFields

▸ `Protected` **validateFields**<`T`\>(`regionData`, `id?`): `Promise`<`DeepPartial`<`Region`\>\>

Validates fields for creation and updates. If the region already exists
the id can be passed to check that country updates are allowed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UpdateRegionInput` \| `CreateRegionInput` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `regionData` | `Omit`<`T`, ``"metadata"`` \| ``"currency_code"``\> | the region data to validate |
| `id?` | `T` extends `UpdateRegionInput` ? `string` : `undefined` | optional id of the region to check against |

#### Returns

`Promise`<`DeepPartial`<`Region`\>\>

the validated region data

#### Defined in

[medusa/src/services/region.ts:240](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L240)

___

### validateTaxRate

▸ `Protected` **validateTaxRate**(`taxRate`): `void`

Validates a tax rate. Will throw if the tax rate is not between 0 and 1.

**`Throws`**

if the tax rate isn't number between 0-100

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `taxRate` | `number` | a number representing the tax rate of the region |

#### Returns

`void`

void

#### Defined in

[medusa/src/services/region.ts:326](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/services/region.ts#L326)

___

### withTransaction

▸ **withTransaction**(`transactionManager?`): [`RegionService`](RegionService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager?` | `EntityManager` |

#### Returns

[`RegionService`](RegionService.md)

#### Inherited from

TransactionBaseService.withTransaction

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/95c538c67/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
