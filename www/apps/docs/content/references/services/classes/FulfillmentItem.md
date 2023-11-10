# FulfillmentItem

This represents the association between a Line Item and a Fulfillment.

## Constructors

### constructor

**new FulfillmentItem**()

This represents the association between a Line Item and a Fulfillment.

## Properties

### fulfillment

 **fulfillment**: [`Fulfillment`](Fulfillment.md)

The details of the fulfillment.

#### Defined in

[packages/medusa/src/models/fulfillment-item.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/fulfillment-item.ts#L16)

___

### fulfillment\_id

 **fulfillment\_id**: `string`

The ID of the Fulfillment that the Fulfillment Item belongs to.

#### Defined in

[packages/medusa/src/models/fulfillment-item.ts:9](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/fulfillment-item.ts#L9)

___

### item

 **item**: [`LineItem`](LineItem.md)

The details of the line item.

#### Defined in

[packages/medusa/src/models/fulfillment-item.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/fulfillment-item.ts#L20)

___

### item\_id

 **item\_id**: `string`

The ID of the Line Item that the Fulfillment Item references.

#### Defined in

[packages/medusa/src/models/fulfillment-item.ts:12](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/fulfillment-item.ts#L12)

___

### quantity

 **quantity**: `number`

The quantity of the Line Item that is included in the Fulfillment.

#### Defined in

[packages/medusa/src/models/fulfillment-item.ts:23](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/fulfillment-item.ts#L23)
