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

[medusa/src/services/region.ts:65](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L65)

## Properties

### \_\_configModule\_\_

• `Protected` `Optional` `Readonly` **\_\_configModule\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_configModule\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L14)

___

### \_\_container\_\_

• `Protected` `Readonly` **\_\_container\_\_**: `any`

#### Inherited from

TransactionBaseService.\_\_container\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:13](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L13)

___

### \_\_moduleDeclaration\_\_

• `Protected` `Optional` `Readonly` **\_\_moduleDeclaration\_\_**: `Record`<`string`, `unknown`\>

#### Inherited from

TransactionBaseService.\_\_moduleDeclaration\_\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:15](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L15)

___

### countryRepository\_

• `Protected` `Readonly` **countryRepository\_**: `Repository`<`Country`\>

#### Defined in

[medusa/src/services/region.ts:57](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L57)

___

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: `Repository`<`Currency`\>

#### Defined in

[medusa/src/services/region.ts:58](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L58)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[medusa/src/services/region.ts:52](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L52)

___

### featureFlagRouter\_

• `Protected` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[medusa/src/services/region.ts:50](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L50)

___

### fulfillmentProviderRepository\_

• `Protected` `Readonly` **fulfillmentProviderRepository\_**: `Repository`<`FulfillmentProvider`\>

#### Defined in

[medusa/src/services/region.ts:62](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L62)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[medusa/src/services/region.ts:55](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L55)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Inherited from

TransactionBaseService.manager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:5](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L5)

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: `Repository`<`PaymentProvider`\>

#### Defined in

[medusa/src/services/region.ts:60](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L60)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[medusa/src/services/region.ts:54](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L54)

___

### regionRepository\_

• `Protected` `Readonly` **regionRepository\_**: `Repository`<`Region`\>

#### Defined in

[medusa/src/services/region.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L56)

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](StoreService.md)

#### Defined in

[medusa/src/services/region.ts:53](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L53)

___

### taxProviderRepository\_

• `Protected` `Readonly` **taxProviderRepository\_**: `Repository`<`TaxProvider`\>

#### Defined in

[medusa/src/services/region.ts:63](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L63)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Inherited from

TransactionBaseService.transactionManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:6](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L6)

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

[medusa/src/services/region.ts:44](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L44)

## Accessors

### activeManager\_

• `Protected` `get` **activeManager_**(): `EntityManager`

#### Returns

`EntityManager`

#### Inherited from

TransactionBaseService.activeManager\_

#### Defined in

[medusa/src/interfaces/transaction-base-service.ts:8](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L8)

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

[medusa/src/services/region.ts:559](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L559)

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

[medusa/src/services/region.ts:687](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L687)

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

[medusa/src/services/region.ts:638](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L638)

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

[medusa/src/interfaces/transaction-base-service.ts:56](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L56)

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

[medusa/src/services/region.ts:101](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L101)

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

[medusa/src/services/region.ts:528](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L528)

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

[medusa/src/services/region.ts:506](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L506)

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

[medusa/src/services/region.ts:597](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L597)

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

[medusa/src/services/region.ts:773](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L773)

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

[medusa/src/services/region.ts:734](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L734)

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

[medusa/src/services/region.ts:471](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L471)

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

[medusa/src/services/region.ts:417](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L417)

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

[medusa/src/services/region.ts:451](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L451)

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

[medusa/src/interfaces/transaction-base-service.ts:37](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L37)

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

[medusa/src/services/region.ts:172](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L172)

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

[medusa/src/services/region.ts:368](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L368)

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

[medusa/src/services/region.ts:343](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L343)

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

[medusa/src/services/region.ts:241](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L241)

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

[medusa/src/services/region.ts:327](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/services/region.ts#L327)

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

[medusa/src/interfaces/transaction-base-service.ts:20](https://github.com/medusajs/medusa/blob/3efe13eef/packages/medusa/src/interfaces/transaction-base-service.ts#L20)
