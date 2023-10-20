---
displayed_sidebar: jsClientSidebar
---

# Interface: IInventoryService

[internal](../modules/internal-8.md).IInventoryService

## Methods

### \_\_joinerConfig

▸ **__joinerConfig**(): [`ModuleJoinerConfig`](../modules/internal-8.md#modulejoinerconfig)

#### Returns

[`ModuleJoinerConfig`](../modules/internal-8.md#modulejoinerconfig)

#### Defined in

packages/types/dist/inventory/service.d.ts:6

___

### adjustInventory

▸ **adjustInventory**(`inventoryItemId`, `locationId`, `adjustment`, `context?`): `Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `adjustment` | `number` |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:32

___

### confirmInventory

▸ **confirmInventory**(`inventoryItemId`, `locationIds`, `quantity`, `context?`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationIds` | `string`[] |
| `quantity` | `number` |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:33

___

### createInventoryItem

▸ **createInventoryItem**(`input`, `context?`): `Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CreateInventoryItemInput`](../modules/internal-8.md#createinventoryiteminput) |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:15

___

### createInventoryItems

▸ **createInventoryItems**(`input`, `context?`): `Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CreateInventoryItemInput`](../modules/internal-8.md#createinventoryiteminput)[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)[]\>

#### Defined in

packages/types/dist/inventory/service.d.ts:16

___

### createInventoryLevel

▸ **createInventoryLevel**(`data`, `context?`): `Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateInventoryLevelInput`](../modules/internal-8.md#createinventorylevelinput) |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:17

___

### createInventoryLevels

▸ **createInventoryLevels**(`data`, `context?`): `Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`CreateInventoryLevelInput`](../modules/internal-8.md#createinventorylevelinput)[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)[]\>

#### Defined in

packages/types/dist/inventory/service.d.ts:18

___

### createReservationItem

▸ **createReservationItem**(`input`, `context?`): `Promise`<[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CreateReservationItemInput`](../modules/internal-8.md#createreservationiteminput) |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:13

___

### createReservationItems

▸ **createReservationItems**(`input`, `context?`): `Promise`<[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CreateReservationItemInput`](../modules/internal-8.md#createreservationiteminput)[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)[]\>

#### Defined in

packages/types/dist/inventory/service.d.ts:14

___

### deleteInventoryItem

▸ **deleteInventoryItem**(`inventoryItemId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:28

___

### deleteInventoryItemLevelByLocationId

▸ **deleteInventoryItemLevelByLocationId**(`locationId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locationId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:29

___

### deleteInventoryLevel

▸ **deleteInventoryLevel**(`inventoryLevelId`, `locationId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryLevelId` | `string` |
| `locationId` | `string` |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:31

___

### deleteReservationItem

▸ **deleteReservationItem**(`reservationItemId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reservationItemId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:27

___

### deleteReservationItemByLocationId

▸ **deleteReservationItemByLocationId**(`locationId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locationId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:30

___

### deleteReservationItemsByLineItem

▸ **deleteReservationItemsByLineItem**(`lineItemId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `lineItemId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`void`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:26

___

### listInventoryItems

▸ **listInventoryItems**(`selector`, `config?`, `context?`): `Promise`<[[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`FilterableInventoryItemProps`](../modules/internal-8.md#filterableinventoryitemprops) |
| `config?` | [`FindConfig`](internal-8.FindConfig.md)<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)\> |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)[], `number`]\>

#### Defined in

packages/types/dist/inventory/service.d.ts:7

___

### listInventoryLevels

▸ **listInventoryLevels**(`selector`, `config?`, `context?`): `Promise`<[[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`FilterableInventoryLevelProps`](../modules/internal-8.md#filterableinventorylevelprops) |
| `config?` | [`FindConfig`](internal-8.FindConfig.md)<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)\> |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)[], `number`]\>

#### Defined in

packages/types/dist/inventory/service.d.ts:9

___

### listReservationItems

▸ **listReservationItems**(`selector`, `config?`, `context?`): `Promise`<[[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)[], `number`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector` | [`FilterableReservationItemProps`](../modules/internal-8.md#filterablereservationitemprops) |
| `config?` | [`FindConfig`](internal-8.FindConfig.md)<[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)\> |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)[], `number`]\>

#### Defined in

packages/types/dist/inventory/service.d.ts:8

___

### retrieveAvailableQuantity

▸ **retrieveAvailableQuantity**(`inventoryItemId`, `locationIds`, `context?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationIds` | `string`[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`number`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:34

___

### retrieveInventoryItem

▸ **retrieveInventoryItem**(`inventoryItemId`, `config?`, `context?`): `Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `config?` | [`FindConfig`](internal-8.FindConfig.md)<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)\> |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:10

___

### retrieveInventoryLevel

▸ **retrieveInventoryLevel**(`inventoryItemId`, `locationId`, `context?`): `Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:11

___

### retrieveReservationItem

▸ **retrieveReservationItem**(`reservationId`, `context?`): `Promise`<[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reservationId` | `string` |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:12

___

### retrieveReservedQuantity

▸ **retrieveReservedQuantity**(`inventoryItemId`, `locationIds`, `context?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationIds` | `string`[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`number`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:36

___

### retrieveStockedQuantity

▸ **retrieveStockedQuantity**(`inventoryItemId`, `locationIds`, `context?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationIds` | `string`[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<`number`\>

#### Defined in

packages/types/dist/inventory/service.d.ts:35

___

### updateInventoryItem

▸ **updateInventoryItem**(`inventoryItemId`, `input`, `context?`): `Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `input` | [`CreateInventoryItemInput`](../modules/internal-8.md#createinventoryiteminput) |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryItemDTO`](../modules/internal-8.md#inventoryitemdto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:24

___

### updateInventoryLevel

▸ **updateInventoryLevel**(`inventoryItemId`, `locationId`, `update`, `context?`): `Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `update` | [`UpdateInventoryLevelInput`](../modules/internal-8.md#updateinventorylevelinput) |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:23

___

### updateInventoryLevels

▸ **updateInventoryLevels**(`updates`, `context?`): `Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `updates` | { `inventory_item_id`: `string` ; `location_id`: `string`  } & [`UpdateInventoryLevelInput`](../modules/internal-8.md#updateinventorylevelinput)[] |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../modules/internal-8.md#inventoryleveldto)[]\>

#### Defined in

packages/types/dist/inventory/service.d.ts:19

___

### updateReservationItem

▸ **updateReservationItem**(`reservationItemId`, `input`, `context?`): `Promise`<[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reservationItemId` | `string` |
| `input` | [`UpdateReservationItemInput`](../modules/internal-8.md#updatereservationiteminput) |
| `context?` | [`SharedContext`](../modules/internal-8.md#sharedcontext) |

#### Returns

`Promise`<[`ReservationItemDTO`](../modules/internal-8.md#reservationitemdto)\>

#### Defined in

packages/types/dist/inventory/service.d.ts:25
