# LineItemAdjustment

A Line Item Adjustment includes details on discounts applied on a line item.

## Constructors

### constructor

**new LineItemAdjustment**()

A Line Item Adjustment includes details on discounts applied on a line item.

## Properties

### amount

 **amount**: `number`

The adjustment amount

#### Defined in

[packages/medusa/src/models/line-item-adjustment.ts:44](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item-adjustment.ts#L44)

___

### description

 **description**: `string`

The line item's adjustment description

#### Defined in

[packages/medusa/src/models/line-item-adjustment.ts:33](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item-adjustment.ts#L33)

___

### discount

 **discount**: [`Discount`](Discount.md)

The details of the discount associated with the adjustment.

#### Defined in

[packages/medusa/src/models/line-item-adjustment.ts:37](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item-adjustment.ts#L37)

___

### discount\_id

 **discount\_id**: `string`

The ID of the discount associated with the adjustment

#### Defined in

[packages/medusa/src/models/line-item-adjustment.ts:41](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item-adjustment.ts#L41)

___

### id

 **id**: `string`

The Line Item Adjustment's ID

#### Defined in

[packages/medusa/src/models/line-item-adjustment.ts:22](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item-adjustment.ts#L22)

___

### item

 **item**: [`LineItem`](LineItem.md)

The details of the line item.

#### Defined in

[packages/medusa/src/models/line-item-adjustment.ts:30](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item-adjustment.ts#L30)

___

### item\_id

 **item\_id**: `string`

The ID of the line item

#### Defined in

[packages/medusa/src/models/line-item-adjustment.ts:26](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item-adjustment.ts#L26)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/line-item-adjustment.ts:47](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item-adjustment.ts#L47)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/line-item-adjustment.ts:53](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/line-item-adjustment.ts#L53)
