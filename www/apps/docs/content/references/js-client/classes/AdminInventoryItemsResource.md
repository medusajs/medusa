---
displayed_sidebar: jsClientSidebar
---

# Class: AdminInventoryItemsResource

## Hierarchy

- `default`

  ↳ **`AdminInventoryItemsResource`**

## Methods

### create

▸ **create**(`payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

Create an Inventory Item
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`AdminPostInventoryItemsReq`](internal-8.internal.AdminPostInventoryItemsReq.md) |
| `query?` | [`AdminPostInventoryItemsParams`](internal-8.internal.AdminPostInventoryItemsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

the created Inventory Item

**`Description`**

creates an Inventory Item

#### Defined in

[packages/medusa-js/src/resources/admin/inventory-item.ts:88](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/inventory-item.ts#L88)

___

### createLocationLevel

▸ **createLocationLevel**(`inventoryItemId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

Create stock for an Inventory Item at a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `payload` | [`AdminPostInventoryItemsItemLocationLevelsReq`](internal-8.internal.AdminPostInventoryItemsItemLocationLevelsReq.md) |
| `query?` | [`AdminGetInventoryItemsParams`](internal-8.internal.AdminGetInventoryItemsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

the Inventory Item

**`Description`**

creates stock levle for an Inventory Item

#### Defined in

[packages/medusa-js/src/resources/admin/inventory-item.ts:155](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/inventory-item.ts#L155)

___

### delete

▸ **delete**(`inventoryItemId`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

Delete an Inventory Item
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`DeleteResponse`](../modules/internal-8.internal.md#deleteresponse)\>

the deleted Inventory Item

**`Description`**

deletes an Inventory Item

#### Defined in

[packages/medusa-js/src/resources/admin/inventory-item.ts:73](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/inventory-item.ts#L73)

___

### deleteLocationLevel

▸ **deleteLocationLevel**(`inventoryItemId`, `locationId`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

Removes an Inventory Item from a Stock Location. This erases trace of any quantity currently at the location.
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `query?` | [`AdminGetInventoryItemsParams`](internal-8.internal.AdminGetInventoryItemsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

the Inventory Item

**`Description`**

deletes a location level of an Inventory Item

#### Defined in

[packages/medusa-js/src/resources/admin/inventory-item.ts:178](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/inventory-item.ts#L178)

___

### list

▸ **list**(`query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsListWithVariantsAndLocationLevelsRes`](../modules/internal-8.internal.md#admininventoryitemslistwithvariantsandlocationlevelsres)\>

Retrieve a list of Inventory Items
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `query?` | [`AdminGetInventoryItemsParams`](internal-8.internal.AdminGetInventoryItemsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsListWithVariantsAndLocationLevelsRes`](../modules/internal-8.internal.md#admininventoryitemslistwithvariantsandlocationlevelsres)\>

the list of Inventory Items as well as the pagination properties

**`Description`**

Retrieve a list of Inventory Items

#### Defined in

[packages/medusa-js/src/resources/admin/inventory-item.ts:110](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/inventory-item.ts#L110)

___

### listLocationLevels

▸ **listLocationLevels**(`inventoryItemId`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsLocationLevelsRes`](../modules/internal-8.internal.md#admininventoryitemslocationlevelsres)\>

Retrieve a list of Inventory Levels related to an Inventory Item across Stock Locations
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `query?` | [`AdminGetInventoryItemsItemLocationLevelsParams`](internal-8.internal.AdminGetInventoryItemsItemLocationLevelsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsLocationLevelsRes`](../modules/internal-8.internal.md#admininventoryitemslocationlevelsres)\>

the list of inventory levels related to an Inventory Item as well as the pagination properties

**`Description`**

Retrieve a list of location levels related to an Inventory Item

#### Defined in

[packages/medusa-js/src/resources/admin/inventory-item.ts:201](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/inventory-item.ts#L201)

___

### retrieve

▸ **retrieve**(`inventoryItemId`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

Retrieve an Inventory Item
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `query?` | [`AdminGetInventoryItemsItemParams`](internal-8.internal.AdminGetInventoryItemsItemParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

an Inventory Item

**`Description`**

gets an Inventory Item

#### Defined in

[packages/medusa-js/src/resources/admin/inventory-item.ts:28](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/inventory-item.ts#L28)

___

### update

▸ **update**(`inventoryItemId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

Update an Inventory Item
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `payload` | [`AdminPostInventoryItemsInventoryItemReq`](internal-8.internal.AdminPostInventoryItemsInventoryItemReq.md) |
| `query?` | [`AdminGetInventoryItemsItemParams`](internal-8.internal.AdminGetInventoryItemsItemParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

the updated Inventory Item

**`Description`**

updates an Inventory Item

#### Defined in

[packages/medusa-js/src/resources/admin/inventory-item.ts:50](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/inventory-item.ts#L50)

___

### updateLocationLevel

▸ **updateLocationLevel**(`inventoryItemId`, `locationId`, `payload`, `query?`, `customHeaders?`): [`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

Update an Inventory Item's stock level at a Stock Location
 This feature is under development and may change in the future.
To use this feature please install @medusajs/inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `payload` | [`AdminPostInventoryItemsItemLocationLevelsLevelReq`](internal-8.internal.AdminPostInventoryItemsItemLocationLevelsLevelReq.md) |
| `query?` | [`AdminGetInventoryItemsParams`](internal-8.internal.AdminGetInventoryItemsParams.md) |
| `customHeaders` | [`Record`](../modules/internal.md#record)<`string`, `any`\> |

#### Returns

[`ResponsePromise`](../modules/internal-12.md#responsepromise)<[`AdminInventoryItemsRes`](../modules/internal-8.internal.md#admininventoryitemsres)\>

the updated Inventory Item

**`Description`**

updates an Inventory Item

#### Defined in

[packages/medusa-js/src/resources/admin/inventory-item.ts:131](https://github.com/medusajs/medusa/blob/c4ac5e6959/packages/medusa-js/src/resources/admin/inventory-item.ts#L131)
