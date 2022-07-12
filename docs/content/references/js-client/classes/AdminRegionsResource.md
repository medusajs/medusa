# Class: AdminRegionsResource

## Hierarchy

- `default`

  ↳ **`AdminRegionsResource`**

## Methods

### addCountry

▸ **addCountry**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** adds a country to the list of countries in a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionCountriesReq`](internal.AdminPostRegionsRegionCountriesReq.md) | country data |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

updated region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:120](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L120)

___

### addFulfillmentProvider

▸ **addFulfillmentProvider**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** adds a fulfillment provider to a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionFulfillmentProvidersReq`](internal.AdminPostRegionsRegionFulfillmentProvidersReq.md) | fulfillment provider data |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

updated region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:152](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L152)

___

### addPaymentProvider

▸ **addPaymentProvider**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** adds a payment provider to a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionPaymentProvidersReq`](internal.AdminPostRegionsRegionPaymentProvidersReq.md) | payment provider data |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

updated region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:198](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L198)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** creates a region.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostRegionsReq`](internal.AdminPostRegionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

created region.

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:25](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L25)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

**`description`** deletes a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of region to delete. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal.md#deleteresponse)\>

Deleted response

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:52](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L52)

___

### deleteCountry

▸ **deleteCountry**(`id`, `country_code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** remove a country from a region's list of coutnries

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `country_code` | `string` | the 2 character ISO code for the Country. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

updated region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:136](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L136)

___

### deleteFulfillmentProvider

▸ **deleteFulfillmentProvider**(`id`, `provider_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** remove a fulfillment provider from a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `provider_id` | `string` | the if of the fulfillment provider |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

updated region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:168](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L168)

___

### deleteMetadata

▸ **deleteMetadata**(`id`, `key`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** delete a region's metadata key value pair

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `key` | `string` | metadata key |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

updated region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:108](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L108)

___

### deletePaymentProvider

▸ **deletePaymentProvider**(`id`, `provider_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** removes a payment provider from a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `provider_id` | `string` | the id of the payment provider |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

updated region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:214](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L214)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsListRes`](../modules/internal.md#adminregionslistres)\>

**`description`** lists regions matching a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetRegionsParams`](internal.AdminGetRegionsParams.md) | query for searching regions |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsListRes`](../modules/internal.md#adminregionslistres)\>

a list of regions matching the query.

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:74](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L74)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** get a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the region to retrieve. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

the region with the given id

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:63](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L63)

___

### retrieveFulfillmentOptions

▸ **retrieveFulfillmentOptions**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGetRegionsRegionFulfillmentOptionsRes`](internal.AdminGetRegionsRegionFulfillmentOptionsRes.md)\>

**`description`** retrieves the list of fulfillment options available in a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGetRegionsRegionFulfillmentOptionsRes`](internal.AdminGetRegionsRegionFulfillmentOptionsRes.md)\>

list of fulfillment options

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:183](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L183)

___

### setMetadata

▸ **setMetadata**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** adds metadata to a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionMetadata`](internal.AdminPostRegionsRegionMetadata.md) | metadata |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

updated region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:92](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L92)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

**`description`** updates a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the region to update. |
| `payload` | [`AdminPostRegionsRegionReq`](internal.AdminPostRegionsRegionReq.md) | update to apply to region. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal.AdminRegionsRes.md)\>

the updated region.

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:37](https://github.com/medusajs/medusa/blob/2eb2126f/packages/medusa-js/src/resources/admin/regions.ts#L37)
