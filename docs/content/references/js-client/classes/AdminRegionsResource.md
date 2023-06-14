# Class: AdminRegionsResource

## Hierarchy

- `default`

  ↳ **`AdminRegionsResource`**

## Methods

### addCountry

▸ **addCountry**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

**`Description`**

adds a country to the list of countries in a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionCountriesReq`](internal-22.AdminPostRegionsRegionCountriesReq.md) | country data |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

updated region

#### Defined in

[medusa-js/src/resources/admin/regions.ts:103](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L103)

___

### addFulfillmentProvider

▸ **addFulfillmentProvider**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

**`Description`**

adds a fulfillment provider to a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionFulfillmentProvidersReq`](internal-22.AdminPostRegionsRegionFulfillmentProvidersReq.md) | fulfillment provider data |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

updated region

#### Defined in

[medusa-js/src/resources/admin/regions.ts:135](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L135)

___

### addPaymentProvider

▸ **addPaymentProvider**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

**`Description`**

adds a payment provider to a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionPaymentProvidersReq`](internal-22.AdminPostRegionsRegionPaymentProvidersReq.md) | payment provider data |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

updated region

#### Defined in

[medusa-js/src/resources/admin/regions.ts:181](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L181)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

**`Description`**

creates a region.

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostRegionsReq`](internal-22.AdminPostRegionsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

created region.

#### Defined in

[medusa-js/src/resources/admin/regions.ts:24](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L24)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

**`Description`**

deletes a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of region to delete. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

Deleted response

#### Defined in

[medusa-js/src/resources/admin/regions.ts:54](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L54)

___

### deleteCountry

▸ **deleteCountry**(`id`, `country_code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

**`Description`**

remove a country from a region's list of coutnries

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `country_code` | `string` | the 2 character ISO code for the Country. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

updated region

#### Defined in

[medusa-js/src/resources/admin/regions.ts:119](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L119)

___

### deleteFulfillmentProvider

▸ **deleteFulfillmentProvider**(`id`, `provider_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

**`Description`**

remove a fulfillment provider from a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `provider_id` | `string` | the if of the fulfillment provider |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

updated region

#### Defined in

[medusa-js/src/resources/admin/regions.ts:151](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L151)

___

### deletePaymentProvider

▸ **deletePaymentProvider**(`id`, `provider_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

**`Description`**

removes a payment provider from a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `provider_id` | `string` | the id of the payment provider |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

updated region

#### Defined in

[medusa-js/src/resources/admin/regions.ts:197](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L197)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsListRes`](../modules/internal-22.md#adminregionslistres)\>

**`Description`**

lists regions matching a query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetRegionsParams`](internal-22.AdminGetRegionsParams.md) | query for searching regions |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsListRes`](../modules/internal-22.md#adminregionslistres)\>

a list of regions matching the query.

#### Defined in

[medusa-js/src/resources/admin/regions.ts:82](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L82)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

**`Description`**

get a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the region to retrieve. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

the region with the given id

#### Defined in

[medusa-js/src/resources/admin/regions.ts:68](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L68)

___

### retrieveFulfillmentOptions

▸ **retrieveFulfillmentOptions**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGetRegionsRegionFulfillmentOptionsRes`](internal-22.AdminGetRegionsRegionFulfillmentOptionsRes.md)\>

**`Description`**

retrieves the list of fulfillment options available in a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminGetRegionsRegionFulfillmentOptionsRes`](internal-22.AdminGetRegionsRegionFulfillmentOptionsRes.md)\>

list of fulfillment options

#### Defined in

[medusa-js/src/resources/admin/regions.ts:166](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L166)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

**`Description`**

updates a region

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the region to update. |
| `payload` | [`AdminPostRegionsRegionReq`](internal-22.AdminPostRegionsRegionReq.md) | update to apply to region. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminRegionsRes`](internal-22.AdminRegionsRes.md)\>

the updated region.

#### Defined in

[medusa-js/src/resources/admin/regions.ts:39](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/regions.ts#L39)
