# ReturnItem

A return item represents a line item in an order that is to be returned. It includes details related to the return and the reason behind it.

## Constructors

### constructor

**new ReturnItem**()

A return item represents a line item in an order that is to be returned. It includes details related to the return and the reason behind it.

## Properties

### is\_requested

 **is\_requested**: `boolean` = `true`

Whether the Return Item was requested initially or received unexpectedly in the warehouse.

#### Defined in

[packages/medusa/src/models/return-item.ts:28](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L28)

___

### item

 **item**: [`LineItem`](LineItem.md)

The details of the line item in the original order to be returned.

#### Defined in

[packages/medusa/src/models/return-item.ts:22](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L22)

___

### item\_id

 **item\_id**: `string`

The ID of the Line Item that the Return Item references.

#### Defined in

[packages/medusa/src/models/return-item.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L14)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/return-item.ts:47](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L47)

___

### note

 **note**: `string`

An optional note with additional details about the Return.

#### Defined in

[packages/medusa/src/models/return-item.ts:44](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L44)

___

### quantity

 **quantity**: `number`

The quantity of the Line Item to be returned.

#### Defined in

[packages/medusa/src/models/return-item.ts:25](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L25)

___

### reason

 **reason**: [`ReturnReason`](ReturnReason.md)

The details of the reason for returning the item.

#### Defined in

[packages/medusa/src/models/return-item.ts:41](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L41)

___

### reason\_id

 **reason\_id**: `string`

The ID of the reason for returning the item.

#### Defined in

[packages/medusa/src/models/return-item.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L37)

___

### received\_quantity

 **received\_quantity**: `number`

The quantity that was received in the warehouse.

#### Defined in

[packages/medusa/src/models/return-item.ts:34](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L34)

___

### requested\_quantity

 **requested\_quantity**: `number`

The quantity that was originally requested to be returned.

#### Defined in

[packages/medusa/src/models/return-item.ts:31](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L31)

___

### return\_id

 **return\_id**: `string`

The ID of the Return that the Return Item belongs to.

#### Defined in

[packages/medusa/src/models/return-item.ts:11](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L11)

___

### return\_order

 **return\_order**: [`Return`](Return.md)

Details of the Return that the Return Item belongs to.

#### Defined in

[packages/medusa/src/models/return-item.ts:18](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/return-item.ts#L18)
