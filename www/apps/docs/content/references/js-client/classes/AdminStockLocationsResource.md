---
displayed_sidebar: jsClientSidebar
---

# Class: AdminStockLocationsResource

## Hierarchy

- `default`

  ↳ **`AdminStockLocationsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStockLocationsRes`](../modules/internal-8.internal.md#adminstocklocationsres)\>

Create a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostStockLocationsReq`](internal-8.internal.AdminPostStockLocationsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStockLocationsRes`](../modules/internal-8.internal.md#adminstocklocationsres)\>

a medusa Stock Location

**`Description`**

gets a medusa Stock Location

#### Defined in

[packages/medusa-js/src/resources/admin/stock-locations.ts:21](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/stock-locations.ts#L21)

___

### delete

▸ **delete**(`id`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.md#deleteresponse)\>

Delete a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.md#deleteresponse)\>

**`Description`**

deletes a Stock Location

#### Defined in

[packages/medusa-js/src/resources/admin/stock-locations.ts:66](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/stock-locations.ts#L66)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStockLocationsListRes`](../modules/internal-8.internal.md#adminstocklocationslistres)\>

Retrieve a list of Stock Locations
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetStockLocationsParams`](internal-8.internal.AdminGetStockLocationsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStockLocationsListRes`](../modules/internal-8.internal.md#adminstocklocationslistres)\>

the list of Stock Locations as well as the pagination properties

**`Description`**

Retrieve a list of Stock Locations

#### Defined in

[packages/medusa-js/src/resources/admin/stock-locations.ts:81](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/stock-locations.ts#L81)

___

### retrieve

▸ **retrieve**(`itemId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStockLocationsRes`](../modules/internal-8.internal.md#adminstocklocationsres)\>

Retrieve a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStockLocationsRes`](../modules/internal-8.internal.md#adminstocklocationsres)\>

a medusa Stock Location

**`Description`**

gets a medusa Stock Location

#### Defined in

[packages/medusa-js/src/resources/admin/stock-locations.ts:36](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/stock-locations.ts#L36)

___

### update

▸ **update**(`stockLocationId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStockLocationsRes`](../modules/internal-8.internal.md#adminstocklocationsres)\>

Update a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `stockLocationId` | `string` |
| `payload` | [`AdminPostStockLocationsLocationReq`](internal-8.internal.AdminPostStockLocationsLocationReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminStockLocationsRes`](../modules/internal-8.internal.md#adminstocklocationsres)\>

the updated medusa Stock Location

**`Description`**

updates a Stock Location

#### Defined in

[packages/medusa-js/src/resources/admin/stock-locations.ts:51](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/stock-locations.ts#L51)
