# Class: AdminStockLocationsResource

## Hierarchy

- `default`

  ↳ **`AdminStockLocationsResource`**

## Methods

### create

▸ **create**(`payload`, `customHeaders?`): `ResponsePromise`<`AdminStockLocationsRes`\>

Create a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostStockLocationsReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminStockLocationsRes`\>

a medusa Stock Location

**`Description`**

gets a medusa Stock Location

#### Defined in

[admin/stock-locations.ts:21](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/stock-locations.ts#L21)

___

### delete

▸ **delete**(`id`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

Delete a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

**`Description`**

deletes a Stock Location

#### Defined in

[admin/stock-locations.ts:66](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/stock-locations.ts#L66)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminStockLocationsListRes`\>

Retrieve a list of Stock Locations
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetStockLocationsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminStockLocationsListRes`\>

the list of Stock Locations as well as the pagination properties

**`Description`**

Retrieve a list of Stock Locations

#### Defined in

[admin/stock-locations.ts:81](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/stock-locations.ts#L81)

___

### retrieve

▸ **retrieve**(`itemId`, `customHeaders?`): `ResponsePromise`<`AdminStockLocationsRes`\>

Retrieve a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminStockLocationsRes`\>

a medusa Stock Location

**`Description`**

gets a medusa Stock Location

#### Defined in

[admin/stock-locations.ts:36](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/stock-locations.ts#L36)

___

### update

▸ **update**(`stockLocationId`, `payload`, `customHeaders?`): `ResponsePromise`<`AdminStockLocationsRes`\>

Update a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/stock-location

#### Parameters

| Name | Type |
| :------ | :------ |
| `stockLocationId` | `string` |
| `payload` | `AdminPostStockLocationsLocationReq` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminStockLocationsRes`\>

the updated medusa Stock Location

**`Description`**

updates a Stock Location

#### Defined in

[admin/stock-locations.ts:51](https://github.com/medusajs/medusa/blob/33df8122b/packages/medusa-js/src/resources/admin/stock-locations.ts#L51)
