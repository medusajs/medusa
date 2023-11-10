# IInventoryService

## Methods

### \_\_joinerConfig

**__joinerConfig**(): [`ModuleJoinerConfig`](../types/ModuleJoinerConfig.md)

#### Returns

[`ModuleJoinerConfig`](../types/ModuleJoinerConfig.md)

-`ModuleJoinerConfig`: 
	-`alias`: (optional) Property name to use as entrypoint to the service
	-`args`: (optional) Extra arguments to pass to the remoteFetchData callback
	-`fieldAlias`: (optional) alias for deeper nested relationships (e.g. { 'price': 'prices.calculated_price_set.amount' })
	-`databaseConfig`: (optional) 
		-`extraFields`: (optional) 
		-`idPrefix`: (optional) Prefix for the id column. If not provided it is "link"
		-`tableName`: (optional) Name of the pivot table. If not provided it is auto generated
	-`extends`: (optional) 
		-`fieldAlias`: (optional) 
		-`relationship`: 
		-`serviceName`: 
	-`isLink`: (optional) If the module is a link module
	-`isReadOnlyLink`: (optional) If true it expands a RemoteQuery property but doesn't create a pivot table
	-`linkableKeys`: (optional) Keys that can be used to link to other modules. e.g { product_id: "Product" } "Product" being the entity it refers to
	-`primaryKeys`: (optional) 
	-`relationships`: (optional) 
		-`alias`: 
		-`args`: (optional) Extra arguments to pass to the remoteFetchData callback
		-`foreignKey`: 
		-`inverse`: (optional) In an inverted relationship the foreign key is on the other service and the primary key is on the current service
		-`isInternalService`: (optional) If true, the relationship is an internal service from the medusa core TODO: Remove when there are no more "internal" services
		-`isList`: (optional) Force the relationship to return a list
		-`primaryKey`: 
		-`serviceName`: 
		-`deleteCascade`: (optional) If true, the link joiner will cascade deleting the relationship
		-`isInternalService`: (optional) If true, the relationship is an internal service from the medusa core TODO: Remove when there are no more "internal" services
	-`schema`: (optional) GraphQL schema for the all module's available entities and fields
	-`serviceName`: (optional) 

#### Defined in

packages/types/dist/inventory/service.d.ts:6

___

### adjustInventory

**adjustInventory**(`inventoryItemId`, `locationId`, `adjustment`, `context?`): `Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `adjustment` | `number` |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)\>

-`Promise`: 
	-`InventoryLevelDTO`: 
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`id`: 
		-`incoming_quantity`: the incoming stock quantity of an inventory item at the given location ID
		-`inventory_item_id`: 
		-`location_id`: the item location ID
		-`metadata`: An optional key-value map with additional details
		-`reserved_quantity`: the reserved stock quantity of an inventory item at the given location ID
		-`stocked_quantity`: the total stock quantity of an inventory item at the given location ID
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/inventory/service.d.ts:33

___

### confirmInventory

**confirmInventory**(`inventoryItemId`, `locationIds`, `quantity`, `context?`): `Promise`<`boolean`\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` |
| `locationIds` | `string`[] |
| `quantity` | `number` |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`boolean`\>

-`Promise`: 
	-`boolean`: (optional) 

#### Defined in

packages/types/dist/inventory/service.d.ts:34

___

### createInventoryItem

**createInventoryItem**(`input`, `context?`): `Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)\>

#### Parameters

| Name |
| :------ |
| `input` | [`CreateInventoryItemInput`](../types/CreateInventoryItemInput.md) |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)\>

-`Promise`: 
	-`InventoryItemDTO`: 
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`description`: (optional) Description of the inventory item
		-`height`: (optional) The height of the Inventory Item. May be used in shipping rate calculations.
		-`hs_code`: (optional) The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`id`: The inventory item's ID.
		-`length`: (optional) The length of the Inventory Item. May be used in shipping rate calculations.
		-`material`: (optional) The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`metadata`: (optional) An optional key-value map with additional details
		-`mid_code`: (optional) The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`origin_country`: (optional) The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`requires_shipping`: Whether the item requires shipping.
		-`sku`: (optional) The Stock Keeping Unit (SKU) code of the Inventory Item.
		-`thumbnail`: (optional) Thumbnail for the inventory item
		-`title`: (optional) Title of the inventory item
		-`updated_at`: The date with timezone at which the resource was updated.
		-`weight`: (optional) The weight of the Inventory Item. May be used in shipping rate calculations.
		-`width`: (optional) The width of the Inventory Item. May be used in shipping rate calculations.

#### Defined in

packages/types/dist/inventory/service.d.ts:15

___

### createInventoryItems

**createInventoryItems**(`input`, `context?`): `Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)[]\>

#### Parameters

| Name |
| :------ |
| `input` | [`CreateInventoryItemInput`](../types/CreateInventoryItemInput.md)[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)[]\>

-`Promise`: 
	-`InventoryItemDTO[]`: 
		-`InventoryItemDTO`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:16

___

### createInventoryLevel

**createInventoryLevel**(`data`, `context?`): `Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateInventoryLevelInput`](../types/CreateInventoryLevelInput.md) |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)\>

-`Promise`: 
	-`InventoryLevelDTO`: 
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`id`: 
		-`incoming_quantity`: the incoming stock quantity of an inventory item at the given location ID
		-`inventory_item_id`: 
		-`location_id`: the item location ID
		-`metadata`: An optional key-value map with additional details
		-`reserved_quantity`: the reserved stock quantity of an inventory item at the given location ID
		-`stocked_quantity`: the total stock quantity of an inventory item at the given location ID
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/inventory/service.d.ts:17

___

### createInventoryLevels

**createInventoryLevels**(`data`, `context?`): `Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)[]\>

#### Parameters

| Name |
| :------ |
| `data` | [`CreateInventoryLevelInput`](../types/CreateInventoryLevelInput.md)[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)[]\>

-`Promise`: 
	-`InventoryLevelDTO[]`: 
		-`InventoryLevelDTO`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:18

___

### createReservationItem

**createReservationItem**(`input`, `context?`): `Promise`<[`ReservationItemDTO`](../types/ReservationItemDTO.md)\>

#### Parameters

| Name |
| :------ |
| `input` | [`CreateReservationItemInput`](../types/CreateReservationItemInput.md) |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`ReservationItemDTO`](../types/ReservationItemDTO.md)\>

-`Promise`: 
	-`ReservationItemDTO`: Represents a reservation of an inventory item at a stock location
		-`created_at`: The date with timezone at which the resource was created.
		-`created_by`: (optional) UserId of user who created the reservation item
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`description`: (optional) Description of the reservation item
		-`id`: The id of the reservation item
		-`inventory_item_id`: The id of the inventory item the reservation relates to
		-`line_item_id`: (optional) 
		-`location_id`: The id of the location of the reservation
		-`metadata`: An optional key-value map with additional details
		-`quantity`: The id of the reservation item
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/inventory/service.d.ts:13

___

### createReservationItems

**createReservationItems**(`input`, `context?`): `Promise`<[`ReservationItemDTO`](../types/ReservationItemDTO.md)[]\>

#### Parameters

| Name |
| :------ |
| `input` | [`CreateReservationItemInput`](../types/CreateReservationItemInput.md)[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`ReservationItemDTO`](../types/ReservationItemDTO.md)[]\>

-`Promise`: 
	-`ReservationItemDTO[]`: 
		-`ReservationItemDTO`: Represents a reservation of an inventory item at a stock location

#### Defined in

packages/types/dist/inventory/service.d.ts:14

___

### deleteInventoryItem

**deleteInventoryItem**(`inventoryItemId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:28

___

### deleteInventoryItemLevelByLocationId

**deleteInventoryItemLevelByLocationId**(`locationId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `locationId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:30

___

### deleteInventoryLevel

**deleteInventoryLevel**(`inventoryLevelId`, `locationId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `inventoryLevelId` | `string` |
| `locationId` | `string` |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:32

___

### deleteReservationItem

**deleteReservationItem**(`reservationItemId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `reservationItemId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:27

___

### deleteReservationItemByLocationId

**deleteReservationItemByLocationId**(`locationId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `locationId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:31

___

### deleteReservationItemsByLineItem

**deleteReservationItemsByLineItem**(`lineItemId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `lineItemId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:26

___

### listInventoryItems

**listInventoryItems**(`selector`, `config?`, `context?`): `Promise`<[[`InventoryItemDTO`](../types/InventoryItemDTO.md)[], `number`]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`FilterableInventoryItemProps`](../types/FilterableInventoryItemProps.md) |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`InventoryItemDTO`](../types/InventoryItemDTO.md)\> |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[[`InventoryItemDTO`](../types/InventoryItemDTO.md)[], `number`]\>

-`Promise`: 
	-`InventoryItemDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/inventory/service.d.ts:7

___

### listInventoryLevels

**listInventoryLevels**(`selector`, `config?`, `context?`): `Promise`<[[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)[], `number`]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`FilterableInventoryLevelProps`](../types/FilterableInventoryLevelProps.md) |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)\> |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)[], `number`]\>

-`Promise`: 
	-`InventoryLevelDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/inventory/service.d.ts:9

___

### listReservationItems

**listReservationItems**(`selector`, `config?`, `context?`): `Promise`<[[`ReservationItemDTO`](../types/ReservationItemDTO.md)[], `number`]\>

#### Parameters

| Name |
| :------ |
| `selector` | [`FilterableReservationItemProps`](../types/FilterableReservationItemProps.md) |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`ReservationItemDTO`](../types/ReservationItemDTO.md)\> |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[[`ReservationItemDTO`](../types/ReservationItemDTO.md)[], `number`]\>

-`Promise`: 
	-`ReservationItemDTO[]`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/inventory/service.d.ts:8

___

### restoreInventoryItem

**restoreInventoryItem**(`inventoryItemId`, `context?`): `Promise`<`void`\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` \| `string`[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`void`\>

-`Promise`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:29

___

### retrieveAvailableQuantity

**retrieveAvailableQuantity**(`inventoryItemId`, `locationIds`, `context?`): `Promise`<`number`\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` |
| `locationIds` | `string`[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/inventory/service.d.ts:35

___

### retrieveInventoryItem

**retrieveInventoryItem**(`inventoryItemId`, `config?`, `context?`): `Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` |
| `config?` | [`FindConfig`](FindConfig-1.md)<[`InventoryItemDTO`](../types/InventoryItemDTO.md)\> |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)\>

-`Promise`: 
	-`InventoryItemDTO`: 
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`description`: (optional) Description of the inventory item
		-`height`: (optional) The height of the Inventory Item. May be used in shipping rate calculations.
		-`hs_code`: (optional) The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`id`: The inventory item's ID.
		-`length`: (optional) The length of the Inventory Item. May be used in shipping rate calculations.
		-`material`: (optional) The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`metadata`: (optional) An optional key-value map with additional details
		-`mid_code`: (optional) The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`origin_country`: (optional) The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`requires_shipping`: Whether the item requires shipping.
		-`sku`: (optional) The Stock Keeping Unit (SKU) code of the Inventory Item.
		-`thumbnail`: (optional) Thumbnail for the inventory item
		-`title`: (optional) Title of the inventory item
		-`updated_at`: The date with timezone at which the resource was updated.
		-`weight`: (optional) The weight of the Inventory Item. May be used in shipping rate calculations.
		-`width`: (optional) The width of the Inventory Item. May be used in shipping rate calculations.

#### Defined in

packages/types/dist/inventory/service.d.ts:10

___

### retrieveInventoryLevel

**retrieveInventoryLevel**(`inventoryItemId`, `locationId`, `context?`): `Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)\>

-`Promise`: 
	-`InventoryLevelDTO`: 
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`id`: 
		-`incoming_quantity`: the incoming stock quantity of an inventory item at the given location ID
		-`inventory_item_id`: 
		-`location_id`: the item location ID
		-`metadata`: An optional key-value map with additional details
		-`reserved_quantity`: the reserved stock quantity of an inventory item at the given location ID
		-`stocked_quantity`: the total stock quantity of an inventory item at the given location ID
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/inventory/service.d.ts:11

___

### retrieveReservationItem

**retrieveReservationItem**(`reservationId`, `context?`): `Promise`<[`ReservationItemDTO`](../types/ReservationItemDTO.md)\>

#### Parameters

| Name |
| :------ |
| `reservationId` | `string` |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`ReservationItemDTO`](../types/ReservationItemDTO.md)\>

-`Promise`: 
	-`ReservationItemDTO`: Represents a reservation of an inventory item at a stock location
		-`created_at`: The date with timezone at which the resource was created.
		-`created_by`: (optional) UserId of user who created the reservation item
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`description`: (optional) Description of the reservation item
		-`id`: The id of the reservation item
		-`inventory_item_id`: The id of the inventory item the reservation relates to
		-`line_item_id`: (optional) 
		-`location_id`: The id of the location of the reservation
		-`metadata`: An optional key-value map with additional details
		-`quantity`: The id of the reservation item
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/inventory/service.d.ts:12

___

### retrieveReservedQuantity

**retrieveReservedQuantity**(`inventoryItemId`, `locationIds`, `context?`): `Promise`<`number`\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` |
| `locationIds` | `string`[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/inventory/service.d.ts:37

___

### retrieveStockedQuantity

**retrieveStockedQuantity**(`inventoryItemId`, `locationIds`, `context?`): `Promise`<`number`\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` |
| `locationIds` | `string`[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<`number`\>

-`Promise`: 
	-`number`: (optional) 

#### Defined in

packages/types/dist/inventory/service.d.ts:36

___

### updateInventoryItem

**updateInventoryItem**(`inventoryItemId`, `input`, `context?`): `Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` |
| `input` | [`CreateInventoryItemInput`](../types/CreateInventoryItemInput.md) |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryItemDTO`](../types/InventoryItemDTO.md)\>

-`Promise`: 
	-`InventoryItemDTO`: 
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`description`: (optional) Description of the inventory item
		-`height`: (optional) The height of the Inventory Item. May be used in shipping rate calculations.
		-`hs_code`: (optional) The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`id`: The inventory item's ID.
		-`length`: (optional) The length of the Inventory Item. May be used in shipping rate calculations.
		-`material`: (optional) The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`metadata`: (optional) An optional key-value map with additional details
		-`mid_code`: (optional) The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`origin_country`: (optional) The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
		-`requires_shipping`: Whether the item requires shipping.
		-`sku`: (optional) The Stock Keeping Unit (SKU) code of the Inventory Item.
		-`thumbnail`: (optional) Thumbnail for the inventory item
		-`title`: (optional) Title of the inventory item
		-`updated_at`: The date with timezone at which the resource was updated.
		-`weight`: (optional) The weight of the Inventory Item. May be used in shipping rate calculations.
		-`width`: (optional) The width of the Inventory Item. May be used in shipping rate calculations.

#### Defined in

packages/types/dist/inventory/service.d.ts:24

___

### updateInventoryLevel

**updateInventoryLevel**(`inventoryItemId`, `locationId`, `update`, `context?`): `Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)\>

#### Parameters

| Name |
| :------ |
| `inventoryItemId` | `string` |
| `locationId` | `string` |
| `update` | [`UpdateInventoryLevelInput`](../types/UpdateInventoryLevelInput.md) |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)\>

-`Promise`: 
	-`InventoryLevelDTO`: 
		-`created_at`: The date with timezone at which the resource was created.
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`id`: 
		-`incoming_quantity`: the incoming stock quantity of an inventory item at the given location ID
		-`inventory_item_id`: 
		-`location_id`: the item location ID
		-`metadata`: An optional key-value map with additional details
		-`reserved_quantity`: the reserved stock quantity of an inventory item at the given location ID
		-`stocked_quantity`: the total stock quantity of an inventory item at the given location ID
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/inventory/service.d.ts:23

___

### updateInventoryLevels

**updateInventoryLevels**(`updates`, `context?`): `Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)[]\>

#### Parameters

| Name |
| :------ |
| `updates` | { `inventory_item_id`: `string` ; `location_id`: `string`  } & [`UpdateInventoryLevelInput`](../types/UpdateInventoryLevelInput.md)[] |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`InventoryLevelDTO`](../types/InventoryLevelDTO.md)[]\>

-`Promise`: 
	-`InventoryLevelDTO[]`: 
		-`InventoryLevelDTO`: 

#### Defined in

packages/types/dist/inventory/service.d.ts:19

___

### updateReservationItem

**updateReservationItem**(`reservationItemId`, `input`, `context?`): `Promise`<[`ReservationItemDTO`](../types/ReservationItemDTO.md)\>

#### Parameters

| Name |
| :------ |
| `reservationItemId` | `string` |
| `input` | [`UpdateReservationItemInput`](../types/UpdateReservationItemInput.md) |
| `context?` | [`SharedContext`](../types/SharedContext.md) |

#### Returns

`Promise`<[`ReservationItemDTO`](../types/ReservationItemDTO.md)\>

-`Promise`: 
	-`ReservationItemDTO`: Represents a reservation of an inventory item at a stock location
		-`created_at`: The date with timezone at which the resource was created.
		-`created_by`: (optional) UserId of user who created the reservation item
		-`deleted_at`: The date with timezone at which the resource was deleted.
		-`description`: (optional) Description of the reservation item
		-`id`: The id of the reservation item
		-`inventory_item_id`: The id of the inventory item the reservation relates to
		-`line_item_id`: (optional) 
		-`location_id`: The id of the location of the reservation
		-`metadata`: An optional key-value map with additional details
		-`quantity`: The id of the reservation item
		-`updated_at`: The date with timezone at which the resource was updated.

#### Defined in

packages/types/dist/inventory/service.d.ts:25
