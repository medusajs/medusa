# InventoryItemDTO

 **InventoryItemDTO**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `created_at` | `string` \| `Date` | The date with timezone at which the resource was created. |
| `deleted_at` | `string` \| `Date` \| ``null`` | The date with timezone at which the resource was deleted. |
| `description?` | `string` \| ``null`` | Description of the inventory item |
| `height?` | `number` \| ``null`` | The height of the Inventory Item. May be used in shipping rate calculations. |
| `hs_code?` | `string` \| ``null`` | The Harmonized System code of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers. |
| `id` | `string` | The inventory item's ID. |
| `length?` | `number` \| ``null`` | The length of the Inventory Item. May be used in shipping rate calculations. |
| `material?` | `string` \| ``null`` | The material and composition that the Inventory Item is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers. |
| `metadata?` | Record<`string`, `unknown`\> \| ``null`` | An optional key-value map with additional details |
| `mid_code?` | `string` \| ``null`` | The Manufacturers Identification code that identifies the manufacturer of the Inventory Item. May be used by Fulfillment Providers to pass customs information to shipping carriers. |
| `origin_country?` | `string` \| ``null`` | The country in which the Inventory Item was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers. |
| `requires_shipping` | `boolean` | Whether the item requires shipping. |
| `sku?` | `string` \| ``null`` | The Stock Keeping Unit (SKU) code of the Inventory Item. |
| `thumbnail?` | `string` \| ``null`` | Thumbnail for the inventory item |
| `title?` | `string` \| ``null`` | Title of the inventory item |
| `updated_at` | `string` \| `Date` | The date with timezone at which the resource was updated. |
| `weight?` | `number` \| ``null`` | The weight of the Inventory Item. May be used in shipping rate calculations. |
| `width?` | `number` \| ``null`` | The width of the Inventory Item. May be used in shipping rate calculations. |

#### Defined in

packages/types/dist/inventory/common.d.ts:68
