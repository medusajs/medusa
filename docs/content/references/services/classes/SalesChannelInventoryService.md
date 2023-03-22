# Class: SalesChannelInventoryService

## Constructors

### constructor

• **new SalesChannelInventoryService**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `InjectedDependencies` |

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:21](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-inventory.ts#L21)

## Properties

### eventBusService\_

• `Protected` `Readonly` **eventBusService\_**: [`EventBusService`](EventBusService.md)

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:18](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-inventory.ts#L18)

___

### inventoryService\_

• `Protected` `Readonly` **inventoryService\_**: `IInventoryService`

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:19](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-inventory.ts#L19)

___

### manager\_

• `Protected` **manager\_**: `EntityManager`

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:15](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-inventory.ts#L15)

___

### salesChannelLocationService\_

• `Protected` `Readonly` **salesChannelLocationService\_**: [`SalesChannelLocationService`](SalesChannelLocationService.md)

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:17](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-inventory.ts#L17)

## Methods

### retrieveAvailableItemQuantity

▸ **retrieveAvailableItemQuantity**(`salesChannelId`, `inventoryItemId`): `Promise`<`number`\>

Retrieves the available quantity of an item across all sales channel locations

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `salesChannelId` | `string` | Sales channel id |
| `inventoryItemId` | `string` | Item id |

#### Returns

`Promise`<`number`\>

available quantity of item across all sales channel locations

#### Defined in

[packages/medusa/src/services/sales-channel-inventory.ts:39](https://github.com/medusajs/medusa/blob/a4575c391/packages/medusa/src/services/sales-channel-inventory.ts#L39)
