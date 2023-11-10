# ReservationItemDTO

 **ReservationItemDTO**: `Object`

Represents a reservation of an inventory item at a stock location

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `created_at` | `string` \| `Date` | The date with timezone at which the resource was created. |
| `created_by?` | `string` \| ``null`` | UserId of user who created the reservation item |
| `deleted_at` | `string` \| `Date` \| ``null`` | The date with timezone at which the resource was deleted. |
| `description?` | `string` \| ``null`` | Description of the reservation item |
| `id` | `string` | The id of the reservation item |
| `inventory_item_id` | `string` | The id of the inventory item the reservation relates to |
| `line_item_id?` | `string` \| ``null`` | - |
| `location_id` | `string` | The id of the location of the reservation |
| `metadata` | Record<`string`, `unknown`\> \| ``null`` | An optional key-value map with additional details |
| `quantity` | `number` | The id of the reservation item |
| `updated_at` | `string` \| `Date` | The date with timezone at which the resource was updated. |

#### Defined in

packages/types/dist/inventory/common.d.ts:134
