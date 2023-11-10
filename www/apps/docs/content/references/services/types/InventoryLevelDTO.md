# InventoryLevelDTO

 **InventoryLevelDTO**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `created_at` | `string` \| `Date` | The date with timezone at which the resource was created. |
| `deleted_at` | `string` \| `Date` \| ``null`` | The date with timezone at which the resource was deleted. |
| `id` | `string` | - |
| `incoming_quantity` | `number` | the incoming stock quantity of an inventory item at the given location ID |
| `inventory_item_id` | `string` | - |
| `location_id` | `string` | the item location ID |
| `metadata` | Record<`string`, `unknown`\> \| ``null`` | An optional key-value map with additional details |
| `reserved_quantity` | `number` | the reserved stock quantity of an inventory item at the given location ID |
| `stocked_quantity` | `number` | the total stock quantity of an inventory item at the given location ID |
| `updated_at` | `string` \| `Date` | The date with timezone at which the resource was updated. |

#### Defined in

packages/types/dist/inventory/common.d.ts:186
