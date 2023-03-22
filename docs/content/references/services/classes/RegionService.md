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

[packages/medusa/src/services/region.ts:67](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L67)

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

### countryRepository\_

• `Protected` `Readonly` **countryRepository\_**: typeof `CountryRepository`

#### Defined in

[packages/medusa/src/services/region.ts:59](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L59)

___

### currencyRepository\_

• `Protected` `Readonly` **currencyRepository\_**: typeof `CurrencyRepository`

#### Defined in

[packages/medusa/src/services/region.ts:60](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L60)

___

### eventBus\_

• `Protected` `Readonly` **eventBus\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/region.ts:54](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L54)

___

### featureFlagRouter\_

• `Protected` **featureFlagRouter\_**: `FlagRouter`

#### Defined in

[packages/medusa/src/services/region.ts:52](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L52)

___

### fulfillmentProviderRepository\_

• `Protected` `Readonly` **fulfillmentProviderRepository\_**: typeof `FulfillmentProviderRepository`

#### Defined in

[packages/medusa/src/services/region.ts:64](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L64)

___

### fulfillmentProviderService\_

• `Protected` `Readonly` **fulfillmentProviderService\_**: [`FulfillmentProviderService`](FulfillmentProviderService.md)

#### Defined in

[packages/medusa/src/services/region.ts:57](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L57)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Overrides

TransactionBaseService.manager\_

#### Defined in

[packages/medusa/src/services/region.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L50)

___

### paymentProviderRepository\_

• `Protected` `Readonly` **paymentProviderRepository\_**: typeof `PaymentProviderRepository`

#### Defined in

[packages/medusa/src/services/region.ts:62](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L62)

___

### paymentProviderService\_

• `Protected` `Readonly` **paymentProviderService\_**: [`PaymentProviderService`](PaymentProviderService.md)

#### Defined in

[packages/medusa/src/services/region.ts:56](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L56)

___

### regionRepository\_

• `Protected` `Readonly` **regionRepository\_**: typeof `RegionRepository`

#### Defined in

[packages/medusa/src/services/region.ts:58](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L58)

___

### storeService\_

• `Protected` `Readonly` **storeService\_**: [`StoreService`](StoreService.md)

#### Defined in

[packages/medusa/src/services/region.ts:55](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L55)

___

### taxProviderRepository\_

• `Protected` `Readonly` **taxProviderRepository\_**: typeof `TaxProviderRepository`

#### Defined in

[packages/medusa/src/services/region.ts:65](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L65)

___

### transactionManager\_

• `Protected` **transactionManager\_**: `undefined` \| `EntityManager`

#### Overrides

TransactionBaseService.transactionManager\_

#### Defined in

[packages/medusa/src/services/region.ts:51](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L51)

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

[packages/medusa/src/services/region.ts:44](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L44)

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

[packages/medusa/src/services/region.ts:580](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L580)

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

[packages/medusa/src/services/region.ts:710](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L710)

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

[packages/medusa/src/services/region.ts:659](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L659)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:50](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L50)

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

[packages/medusa/src/services/region.ts:117](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L117)

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

[packages/medusa/src/services/region.ts:549](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L549)

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

[packages/medusa/src/services/region.ts:529](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L529)

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

[packages/medusa/src/services/region.ts:618](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L618)

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

[packages/medusa/src/services/region.ts:798](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L798)

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

[packages/medusa/src/services/region.ts:759](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L759)

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

[packages/medusa/src/services/region.ts:494](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L494)

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

[packages/medusa/src/services/region.ts:437](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L437)

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

[packages/medusa/src/services/region.ts:474](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L474)

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

[packages/medusa/src/services/region.ts:190](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L190)

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

[packages/medusa/src/services/region.ts:388](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L388)

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

[packages/medusa/src/services/region.ts:363](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L363)

___

### validateFields

▸ `Protected` **validateFields**<`T`\>(`regionData`, `id?`): `Promise`<{ `automatic_taxes?`: `boolean` ; `countries?`: (`undefined` \| { id?: number \| undefined; iso\_2?: string \| undefined; iso\_3?: string \| undefined; num\_code?: number \| undefined; name?: string \| undefined; display\_name?: string \| undefined; region\_id?: string \| ... 1 more ... \| undefined; region?: { ...; } \| undefined; })[] ; `created_at?`: { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } ; `currency?`: { code?: string \| undefined; symbol?: string \| undefined; symbol\_native?: string \| undefined; name?: string \| undefined; includes\_tax?: boolean \| undefined; } ; `currency_code?`: `string` ; `deleted_at?`: ``null`` \| { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } ; `fulfillment_providers?`: (`undefined` \| { id?: string \| undefined; is\_installed?: boolean \| undefined; })[] ; `gift_cards_taxable?`: `boolean` ; `id?`: `string` ; `includes_tax?`: `boolean` ; `metadata?`: { [x: string]: unknown; } ; `name?`: `string` ; `payment_providers?`: (`undefined` \| { id?: string \| undefined; is\_installed?: boolean \| undefined; })[] ; `tax_code?`: `string` ; `tax_provider?`: { id?: string \| undefined; is\_installed?: boolean \| undefined; } ; `tax_provider_id?`: ``null`` \| `string` ; `tax_rate?`: `number` ; `tax_rates?`: ``null`` \| (`undefined` \| { rate?: number \| null \| undefined; code?: string \| null \| undefined; name?: string \| undefined; region\_id?: string \| undefined; region?: { name?: string \| undefined; currency\_code?: string \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 9 more ...; updated\_at?: { ...; } \| undefin...)[] ; `updated_at?`: { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; }  }\>

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

`Promise`<{ `automatic_taxes?`: `boolean` ; `countries?`: (`undefined` \| { id?: number \| undefined; iso\_2?: string \| undefined; iso\_3?: string \| undefined; num\_code?: number \| undefined; name?: string \| undefined; display\_name?: string \| undefined; region\_id?: string \| ... 1 more ... \| undefined; region?: { ...; } \| undefined; })[] ; `created_at?`: { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } ; `currency?`: { code?: string \| undefined; symbol?: string \| undefined; symbol\_native?: string \| undefined; name?: string \| undefined; includes\_tax?: boolean \| undefined; } ; `currency_code?`: `string` ; `deleted_at?`: ``null`` \| { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; } ; `fulfillment_providers?`: (`undefined` \| { id?: string \| undefined; is\_installed?: boolean \| undefined; })[] ; `gift_cards_taxable?`: `boolean` ; `id?`: `string` ; `includes_tax?`: `boolean` ; `metadata?`: { [x: string]: unknown; } ; `name?`: `string` ; `payment_providers?`: (`undefined` \| { id?: string \| undefined; is\_installed?: boolean \| undefined; })[] ; `tax_code?`: `string` ; `tax_provider?`: { id?: string \| undefined; is\_installed?: boolean \| undefined; } ; `tax_provider_id?`: ``null`` \| `string` ; `tax_rate?`: `number` ; `tax_rates?`: ``null`` \| (`undefined` \| { rate?: number \| null \| undefined; code?: string \| null \| undefined; name?: string \| undefined; region\_id?: string \| undefined; region?: { name?: string \| undefined; currency\_code?: string \| undefined; ... 16 more ...; updated\_at?: { ...; } \| undefined; } \| undefined; ... 9 more ...; updated\_at?: { ...; } \| undefin...)[] ; `updated_at?`: { toString?: {} \| undefined; toDateString?: {} \| undefined; toTimeString?: {} \| undefined; toLocaleString?: {} \| undefined; toLocaleDateString?: {} \| undefined; toLocaleTimeString?: {} \| undefined; ... 37 more ...; [Symbol.toPrimitive]?: {} \| undefined; }  }\>

the validated region data

#### Defined in

[packages/medusa/src/services/region.ts:261](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L261)

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

[packages/medusa/src/services/region.ts:347](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/region.ts#L347)

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

[packages/medusa/src/interfaces/transaction-base-service.ts:14](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/interfaces/transaction-base-service.ts#L14)
