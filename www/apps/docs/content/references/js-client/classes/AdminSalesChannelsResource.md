# Class: AdminSalesChannelsResource

## Hierarchy

- `default`

  ↳ **`AdminSalesChannelsResource`**

## Methods

### addLocation

▸ **addLocation**(`salesChannelId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminSalesChannelsRes`\>

Add a location to a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | `AdminPostSalesChannelsChannelStockLocationsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminSalesChannelsRes`\>

the Medusa SalesChannel

**`Description`**

Add a stock location to a SalesChannel

#### Defined in

[admin/sales-channels.ts:134](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/sales-channels.ts#L134)

___

### addProducts

▸ **addProducts**(`salesChannelId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminSalesChannelsRes`\>

Add products to a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | `AdminPostSalesChannelsChannelProductsBatchReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminSalesChannelsRes`\>

a medusa sales channel

**`Description`**

Add products to a sales channel

#### Defined in

[admin/sales-channels.ts:118](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/sales-channels.ts#L118)

___

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminSalesChannelsRes`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostSalesChannelsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminSalesChannelsRes`\>

#### Defined in

[admin/sales-channels.ts:36](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/sales-channels.ts#L36)

___

### delete

▸ **delete**(`salesChannelId`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

Delete a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

an deletion result

**`Description`**

gets a sales channel

#### Defined in

[admin/sales-channels.ts:87](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/sales-channels.ts#L87)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminSalesChannelsListRes`\>

Retrieve a list of sales channels
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetSalesChannelsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminSalesChannelsListRes`\>

the list of sales channel as well as the pagination properties

**`Description`**

Retrieve a list of sales channels

#### Defined in

[admin/sales-channels.ts:66](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/sales-channels.ts#L66)

___

### removeLocation

▸ **removeLocation**(`salesChannelId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminSalesChannelsRes`\>

remove a location from a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | `AdminDeleteSalesChannelsChannelStockLocationsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminSalesChannelsRes`\>

an deletion result

**`Description`**

Remove a stock location from a SalesChannel

#### Defined in

[admin/sales-channels.ts:150](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/sales-channels.ts#L150)

___

### removeProducts

▸ **removeProducts**(`salesChannelId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminSalesChannelsRes`\>

Remove products from a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | `AdminDeleteSalesChannelsChannelProductsBatchReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminSalesChannelsRes`\>

a medusa sales channel

**`Description`**

Remove products from a sales channel

#### Defined in

[admin/sales-channels.ts:102](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/sales-channels.ts#L102)

___

### retrieve

▸ **retrieve**(`salesChannelId`, `customHeaders?`): `ResponsePromise`<`AdminSalesChannelsRes`\>

retrieve a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminSalesChannelsRes`\>

a medusa sales channel

**`Description`**

gets a sales channel

#### Defined in

[admin/sales-channels.ts:24](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/sales-channels.ts#L24)

___

### update

▸ **update**(`salesChannelId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminSalesChannelsRes`\>

update a sales channel
 This feature is under development and may change in the future.
To use this feature please enable featureflag `sales_channels` in your medusa backend project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `salesChannelId` | `string` |
| `payload` | `AdminPostSalesChannelsSalesChannelReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminSalesChannelsRes`\>

the updated medusa sales channel

**`Description`**

updates a sales channel

#### Defined in

[admin/sales-channels.ts:50](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/sales-channels.ts#L50)
