---
displayed_sidebar: jsClientSidebar
---

# Class: AdminSalesChannelsResource

## Hierarchy

- `default`

  ↳ **`AdminSalesChannelsResource`**

## Methods

### addLocation

▸ **addLocation**(`salesChannelId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

Add a location to a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | [`AdminPostSalesChannelsChannelStockLocationsReq`](internal-8.internal.AdminPostSalesChannelsChannelStockLocationsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

the Medusa SalesChannel

**`Description`**

Add a stock location to a SalesChannel

#### Defined in

[packages/medusa-js/src/resources/admin/sales-channels.ts:134](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/sales-channels.ts#L134)

___

### addProducts

▸ **addProducts**(`salesChannelId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

Add products to a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | [`AdminPostSalesChannelsChannelProductsBatchReq`](internal-8.internal.AdminPostSalesChannelsChannelProductsBatchReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

a medusa sales channel

**`Description`**

Add products to a sales channel

#### Defined in

[packages/medusa-js/src/resources/admin/sales-channels.ts:118](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/sales-channels.ts#L118)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostSalesChannelsReq`](internal-8.internal.AdminPostSalesChannelsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

#### Defined in

[packages/medusa-js/src/resources/admin/sales-channels.ts:36](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/sales-channels.ts#L36)

___

### delete

▸ **delete**(`salesChannelId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

Delete a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

an deletion result

**`Description`**

gets a sales channel

#### Defined in

[packages/medusa-js/src/resources/admin/sales-channels.ts:87](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/sales-channels.ts#L87)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsListRes`](../modules/internal-8.internal.md#adminsaleschannelslistres)\>

Retrieve a list of sales channels
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetSalesChannelsParams`](internal-8.internal.AdminGetSalesChannelsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsListRes`](../modules/internal-8.internal.md#adminsaleschannelslistres)\>

the list of sales channel as well as the pagination properties

**`Description`**

Retrieve a list of sales channels

#### Defined in

[packages/medusa-js/src/resources/admin/sales-channels.ts:66](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/sales-channels.ts#L66)

___

### removeLocation

▸ **removeLocation**(`salesChannelId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

remove a location from a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | [`AdminDeleteSalesChannelsChannelStockLocationsReq`](internal-8.internal.AdminDeleteSalesChannelsChannelStockLocationsReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

an deletion result

**`Description`**

Remove a stock location from a SalesChannel

#### Defined in

[packages/medusa-js/src/resources/admin/sales-channels.ts:150](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/sales-channels.ts#L150)

___

### removeProducts

▸ **removeProducts**(`salesChannelId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

Remove products from a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | [`AdminDeleteSalesChannelsChannelProductsBatchReq`](internal-8.internal.AdminDeleteSalesChannelsChannelProductsBatchReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

a medusa sales channel

**`Description`**

Remove products from a sales channel

#### Defined in

[packages/medusa-js/src/resources/admin/sales-channels.ts:102](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/sales-channels.ts#L102)

___

### retrieve

▸ **retrieve**(`salesChannelId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

retrieve a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

a medusa sales channel

**`Description`**

gets a sales channel

#### Defined in

[packages/medusa-js/src/resources/admin/sales-channels.ts:24](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/sales-channels.ts#L24)

___

### update

▸ **update**(`salesChannelId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

update a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | [`AdminPostSalesChannelsSalesChannelReq`](internal-8.internal.AdminPostSalesChannelsSalesChannelReq.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-8.internal.md#adminsaleschannelsres)\>

the updated medusa sales channel

**`Description`**

updates a sales channel

#### Defined in

[packages/medusa-js/src/resources/admin/sales-channels.ts:50](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/sales-channels.ts#L50)
