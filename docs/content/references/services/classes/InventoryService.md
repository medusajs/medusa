# Class: InventoryService

## Hierarchy

- `"medusa-interfaces"`

  ↳ **`InventoryService`**

## Constructors

### constructor

• **new InventoryService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Overrides

BaseService.constructor

#### Defined in

[services/inventory.js:5](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/inventory.js#L5)

## Methods

### adjustInventory

▸ **adjustInventory**(`variantId`, `adjustment`): `Promise`<`any`\>

Updates the inventory of a variant based on a given adjustment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to update |
| `adjustment` | `number` | the number to adjust the inventory quantity by |

#### Returns

`Promise`<`any`\>

resolves to the update result.

#### Defined in

[services/inventory.js:36](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/inventory.js#L36)

___

### confirmInventory

▸ **confirmInventory**(`variantId`, `quantity`): `Promise`<`boolean`\>

Checks if the inventory of a variant can cover a given quantity. Will
return true if the variant doesn't have managed inventory or if the variant
allows backorders or if the inventory quantity is greater than `quantity`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` | the id of the variant to check |
| `quantity` | `number` | the number of units to check availability for |

#### Returns

`Promise`<`boolean`\>

true if the inventory covers the quantity

#### Defined in

[services/inventory.js:62](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/inventory.js#L62)

___

### withTransaction

▸ **withTransaction**(`transactionManager`): [`InventoryService`](InventoryService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionManager` | `any` |

#### Returns

[`InventoryService`](InventoryService.md)

#### Defined in

[services/inventory.js:15](https://github.com/medusajs/medusa/blob/ae5c88b89/packages/medusa/src/services/inventory.js#L15)
