# Class: AdminSalesChannelsResource

## Hierarchy

- `default`

  ↳ **`AdminSalesChannelsResource`**

## Methods

### addProducts

▸ **addProducts**(`salesChannelId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

Add products to a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

**`Description`**

Add products to a sales channel

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | [`AdminPostSalesChannelsChannelProductsBatchReq`](internal-25.AdminPostSalesChannelsChannelProductsBatchReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

a medusa sales channel

#### Defined in

[medusa-js/src/resources/admin/sales-channels.ts:116](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/sales-channels.ts#L116)

___

### create

▸ **create**(`payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostSalesChannelsReq`](internal-25.AdminPostSalesChannelsReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

#### Defined in

[medusa-js/src/resources/admin/sales-channels.ts:34](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/sales-channels.ts#L34)

___

### delete

▸ **delete**(`salesChannelId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

Delete a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

**`Description`**

gets a sales channel

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`DeleteResponse`](../modules/internal-3.md#deleteresponse)\>

an deletion result

#### Defined in

[medusa-js/src/resources/admin/sales-channels.ts:85](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/sales-channels.ts#L85)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsListRes`](../modules/internal-21.md#adminsaleschannelslistres)\>

Retrieve a list of sales channels
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

**`Description`**

Retrieve a list of sales channels

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetSalesChannelsParams`](internal-25.AdminGetSalesChannelsParams.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsListRes`](../modules/internal-21.md#adminsaleschannelslistres)\>

the list of sales channel as well as the pagination properties

#### Defined in

[medusa-js/src/resources/admin/sales-channels.ts:64](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/sales-channels.ts#L64)

___

### removeProducts

▸ **removeProducts**(`salesChannelId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

Remove products from a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

**`Description`**

Remove products from a sales channel

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | [`AdminDeleteSalesChannelsChannelProductsBatchReq`](internal-25.AdminDeleteSalesChannelsChannelProductsBatchReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

a medusa sales channel

#### Defined in

[medusa-js/src/resources/admin/sales-channels.ts:100](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/sales-channels.ts#L100)

___

### retrieve

▸ **retrieve**(`salesChannelId`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

retrieve a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

**`Description`**

gets a sales channel

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

a medusa sales channel

#### Defined in

[medusa-js/src/resources/admin/sales-channels.ts:22](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/sales-channels.ts#L22)

___

### update

▸ **update**(`salesChannelId`, `payload`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

update a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

**`Description`**

updates a sales channel

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | [`AdminPostSalesChannelsSalesChannelReq`](internal-25.AdminPostSalesChannelsSalesChannelReq.md) |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`AdminSalesChannelsRes`](../modules/internal-25.md#adminsaleschannelsres)\>

the updated medusa sales channel

#### Defined in

[medusa-js/src/resources/admin/sales-channels.ts:48](https://github.com/medusajs/medusa/blob/29135c051/packages/medusa-js/src/resources/admin/sales-channels.ts#L48)
