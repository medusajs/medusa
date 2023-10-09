# Class: AdminRegionsResource

## Hierarchy

- `default`

  ↳ **`AdminRegionsResource`**

## Methods

### addCountry

▸ **addCountry**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminRegionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | `AdminPostRegionsRegionCountriesReq` | country data |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminRegionsRes`\>

updated region

**`Description`**

adds a country to the list of countries in a region

#### Defined in

[admin/regions.ts:103](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L103)

___

### addFulfillmentProvider

▸ **addFulfillmentProvider**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminRegionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | `AdminPostRegionsRegionFulfillmentProvidersReq` | fulfillment provider data |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminRegionsRes`\>

updated region

**`Description`**

adds a fulfillment provider to a region

#### Defined in

[admin/regions.ts:135](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L135)

___

### addPaymentProvider

▸ **addPaymentProvider**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminRegionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `payload` | `AdminPostRegionsRegionPaymentProvidersReq` | payment provider data |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminRegionsRes`\>

updated region

**`Description`**

adds a payment provider to a region

#### Defined in

[admin/regions.ts:181](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L181)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminRegionsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostRegionsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminRegionsRes`\>

created region.

**`Description`**

creates a region.

#### Defined in

[admin/regions.ts:24](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L24)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of region to delete. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

Deleted response

**`Description`**

deletes a region

#### Defined in

[admin/regions.ts:54](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L54)

___

### deleteCountry

▸ **deleteCountry**(`id`, `country_code`, `customHeaders?`): `ResponsePromise`<`AdminRegionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `country_code` | `string` | the 2 character ISO code for the Country. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminRegionsRes`\>

updated region

**`Description`**

remove a country from a region's list of coutnries

#### Defined in

[admin/regions.ts:119](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L119)

___

### deleteFulfillmentProvider

▸ **deleteFulfillmentProvider**(`id`, `provider_id`, `customHeaders?`): `ResponsePromise`<`AdminRegionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `provider_id` | `string` | the if of the fulfillment provider |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminRegionsRes`\>

updated region

**`Description`**

remove a fulfillment provider from a region

#### Defined in

[admin/regions.ts:151](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L151)

___

### deletePaymentProvider

▸ **deletePaymentProvider**(`id`, `provider_id`, `customHeaders?`): `ResponsePromise`<`AdminRegionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `provider_id` | `string` | the id of the payment provider |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminRegionsRes`\>

updated region

**`Description`**

removes a payment provider from a region

#### Defined in

[admin/regions.ts:197](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L197)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminRegionsListRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query?` | `AdminGetRegionsParams` | query for searching regions |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminRegionsListRes`\>

a list of regions matching the query.

**`Description`**

lists regions matching a query

#### Defined in

[admin/regions.ts:82](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L82)

___

### retrieve

▸ **retrieve**(`id`, `customHeaders?`): `ResponsePromise`<`AdminRegionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the region to retrieve. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminRegionsRes`\>

the region with the given id

**`Description`**

get a region

#### Defined in

[admin/regions.ts:68](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L68)

___

### retrieveFulfillmentOptions

▸ **retrieveFulfillmentOptions**(`id`, `customHeaders?`): `ResponsePromise`<`AdminGetRegionsRegionFulfillmentOptionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | region id |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminGetRegionsRegionFulfillmentOptionsRes`\>

list of fulfillment options

**`Description`**

retrieves the list of fulfillment options available in a region

#### Defined in

[admin/regions.ts:166](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L166)

___

### update

▸ **update**(`id`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminRegionsRes`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the region to update. |
| `payload` | `AdminPostRegionsRegionReq` | update to apply to region. |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

`ResponsePromise`<`AdminRegionsRes`\>

the updated region.

**`Description`**

updates a region

#### Defined in

[admin/regions.ts:39](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/regions.ts#L39)
