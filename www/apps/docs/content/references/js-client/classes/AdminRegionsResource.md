---
displayed_sidebar: jsClientSidebar
---

# Class: AdminRegionsResource

## Hierarchy

- `default`

  ↳ **`AdminRegionsResource`**

## Methods

### addCountry

▸ **addCountry**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionCountriesReq`](internal-8.internal.AdminPostRegionsRegionCountriesReq.md) | country data |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

updated region

**`Description`**

adds a country to the list of countries in a region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:103](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L103)

___

### addFulfillmentProvider

▸ **addFulfillmentProvider**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionFulfillmentProvidersReq`](internal-8.internal.AdminPostRegionsRegionFulfillmentProvidersReq.md) | fulfillment provider data |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

updated region

**`Description`**

adds a fulfillment provider to a region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:135](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L135)

___

### addPaymentProvider

▸ **addPaymentProvider**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | [`AdminPostRegionsRegionPaymentProvidersReq`](internal-8.internal.AdminPostRegionsRegionPaymentProvidersReq.md) | payment provider data |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

updated region

**`Description`**

adds a payment provider to a region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:181](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L181)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostRegionsReq`](internal-8.internal.AdminPostRegionsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

created region.

**`Description`**

creates a region.

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:24](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L24)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of region to delete. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

Deleted response

**`Description`**

deletes a region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:54](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L54)

___

### deleteCountry

▸ **deleteCountry**(`id`, `country_code`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `country_code` | `string` | the 2 character ISO code for the Country. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

updated region

**`Description`**

remove a country from a region's list of coutnries

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:119](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L119)

___

### deleteFulfillmentProvider

▸ **deleteFulfillmentProvider**(`id`, `provider_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `provider_id` | `string` | the if of the fulfillment provider |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

updated region

**`Description`**

remove a fulfillment provider from a region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:151](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L151)

___

### deletePaymentProvider

▸ **deletePaymentProvider**(`id`, `provider_id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `provider_id` | `string` | the id of the payment provider |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

updated region

**`Description`**

removes a payment provider from a region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:197](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L197)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsListRes`](../modules/internal-8.internal.md#adminregionslistres)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | [`AdminGetRegionsParams`](internal-8.internal.AdminGetRegionsParams.md) | query for searching regions |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsListRes`](../modules/internal-8.internal.md#adminregionslistres)\>

a list of regions matching the query.

**`Description`**

lists regions matching a query

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:82](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L82)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the region to retrieve. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

the region with the given id

**`Description`**

get a region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:68](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L68)

___

### retrieveFulfillmentOptions

▸ **retrieveFulfillmentOptions**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGetRegionsRegionFulfillmentOptionsRes`](internal-8.internal.AdminGetRegionsRegionFulfillmentOptionsRes.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminGetRegionsRegionFulfillmentOptionsRes`](internal-8.internal.AdminGetRegionsRegionFulfillmentOptionsRes.md)\>

list of fulfillment options

**`Description`**

retrieves the list of fulfillment options available in a region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:166](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L166)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the region to update. |
| `payload` | [`AdminPostRegionsRegionReq`](internal-8.internal.AdminPostRegionsRegionReq.md) | update to apply to region. |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminRegionsRes`](internal-8.internal.AdminRegionsRes.md)\>

the updated region.

**`Description`**

updates a region

#### Defined in

[packages/medusa-js/src/resources/admin/regions.ts:39](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/regions.ts#L39)
