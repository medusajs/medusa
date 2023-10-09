# Class: AdminInventoryItemsResource

## Hierarchy

- `default`

  ↳ **`AdminInventoryItemsResource`**

## Methods

### create

▸ **create**(`payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminInventoryItemsRes`\>

Create an Inventory Item
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `AdminPostInventoryItemsReq` |
| `query?` | `AdminPostInventoryItemsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminInventoryItemsRes`\>

the created Inventory Item

**`Description`**

creates an Inventory Item

#### Defined in

[admin/inventory-item.ts:88](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/inventory-item.ts#L88)

___

### createLocationLevel

▸ **createLocationLevel**(`inventoryItemId`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminInventoryItemsRes`\>

Create stock for an Inventory Item at a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `payload` | `AdminPostInventoryItemsItemLocationLevelsReq` |
| `query?` | `AdminGetInventoryItemsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminInventoryItemsRes`\>

the Inventory Item

**`Description`**

creates stock levle for an Inventory Item

#### Defined in

[admin/inventory-item.ts:155](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/inventory-item.ts#L155)

___

### delete

▸ **delete**(`inventoryItemId`, `customHeaders?`): `ResponsePromise`<`DeleteResponse`\>

Delete an Inventory Item
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`DeleteResponse`\>

the deleted Inventory Item

**`Description`**

deletes an Inventory Item

#### Defined in

[admin/inventory-item.ts:73](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/inventory-item.ts#L73)

___

### deleteLocationLevel

▸ **deleteLocationLevel**(`inventoryItemId`, `locationId`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminInventoryItemsRes`\>

Removes an Inventory Item from a Stock Location. This erases trace of any quantity currently at the location.
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `query?` | `AdminGetInventoryItemsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminInventoryItemsRes`\>

the Inventory Item

**`Description`**

deletes a location level of an Inventory Item

#### Defined in

[admin/inventory-item.ts:178](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/inventory-item.ts#L178)

___

### list

▸ **list**(`query?`, `customHeaders?`): `ResponsePromise`<`AdminInventoryItemsListWithVariantsAndLocationLevelsRes`\>

Retrieve a list of Inventory Items
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | `AdminGetInventoryItemsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminInventoryItemsListWithVariantsAndLocationLevelsRes`\>

the list of Inventory Items as well as the pagination properties

**`Description`**

Retrieve a list of Inventory Items

#### Defined in

[admin/inventory-item.ts:110](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/inventory-item.ts#L110)

___

### listLocationLevels

▸ **listLocationLevels**(`inventoryItemId`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminInventoryItemsLocationLevelsRes`\>

Retrieve a list of Inventory Levels related to an Inventory Item across Stock Locations
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `query?` | `AdminGetInventoryItemsItemLocationLevelsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminInventoryItemsLocationLevelsRes`\>

the list of inventory levels related to an Inventory Item as well as the pagination properties

**`Description`**

Retrieve a list of location levels related to an Inventory Item

#### Defined in

[admin/inventory-item.ts:201](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/inventory-item.ts#L201)

___

### retrieve

▸ **retrieve**(`inventoryItemId`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminInventoryItemsRes`\>

Retrieve an Inventory Item
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `query?` | `AdminGetInventoryItemsItemParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminInventoryItemsRes`\>

an Inventory Item

**`Description`**

gets an Inventory Item

#### Defined in

[admin/inventory-item.ts:28](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/inventory-item.ts#L28)

___

### update

▸ **update**(`inventoryItemId`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminInventoryItemsRes`\>

Update an Inventory Item
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `payload` | `AdminPostInventoryItemsInventoryItemReq` |
| `query?` | `AdminGetInventoryItemsItemParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminInventoryItemsRes`\>

the updated Inventory Item

**`Description`**

updates an Inventory Item

#### Defined in

[admin/inventory-item.ts:50](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/inventory-item.ts#L50)

___

### updateLocationLevel

▸ **updateLocationLevel**(`inventoryItemId`, `locationId`, `payload`, `query?`, `customHeaders?`): `ResponsePromise`<`AdminInventoryItemsRes`\>

Update an Inventory Item's stock level at a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `payload` | `AdminPostInventoryItemsItemLocationLevelsLevelReq` |
| `query?` | `AdminGetInventoryItemsParams` |
| `customHeaders` | `Record`<`string`, `any`\> |

#### Returns

`ResponsePromise`<`AdminInventoryItemsRes`\>

the updated Inventory Item

**`Description`**

updates an Inventory Item

#### Defined in

[admin/inventory-item.ts:131](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa-js/src/resources/admin/inventory-item.ts#L131)
