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

[services/inventory.js:5](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/inventory.js#L5)

## Methods

### adjustInventory

▸ **adjustInventory**(`variantId`, `adjustment`): `Promise`<`any`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `adjustment` | `number` |  |

#### Returns

`Promise`<`any`\>

#### Defined in

[services/inventory.js:36](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/inventory.js#L36)

___

### confirmInventory

▸ **confirmInventory**(`variantId`, `quantity`): `Promise`<`boolean`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `variantId` | `string` |  |
| `quantity` | `number` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[services/inventory.js:62](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/inventory.js#L62)

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

[services/inventory.js:15](https://github.com/medusajs/medusa/blob/32b066d92/packages/medusa/src/services/inventory.js#L15)
