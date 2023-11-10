# ShippingMethod

A Shipping Method represents a way in which an Order or Return can be shipped. Shipping Methods are created from a Shipping Option, but may contain additional details that can be necessary for the Fulfillment Provider to handle the shipment. If the shipping method is created for a return, it may be associated with a claim or a swap that the return is part of.

## Constructors

### constructor

**new ShippingMethod**()

A Shipping Method represents a way in which an Order or Return can be shipped. Shipping Methods are created from a Shipping Option, but may contain additional details that can be necessary for the Fulfillment Provider to handle the shipment. If the shipping method is created for a return, it may be associated with a claim or a swap that the return is part of.

## Properties

### cart

 **cart**: [`Cart`](Cart.md)

The details of the cart that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:61](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L61)

___

### cart\_id

 **cart\_id**: `string`

The ID of the cart that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:57](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L57)

___

### claim\_order

 **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

The details of the claim that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:53](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L53)

___

### claim\_order\_id

 **claim\_order\_id**: ``null`` \| `string`

The ID of the claim that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:49](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L49)

___

### data

 **data**: Record<`string`, `unknown`\>

Additional data that the Fulfillment Provider needs to fulfill the shipment. This is used in combination with the Shipping Options data, and may contain information such as a drop point id.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:92](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L92)

___

### id

 **id**: `string`

The shipping method's ID

#### Defined in

[packages/medusa/src/models/shipping-method.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L33)

___

### includes\_tax

 **includes\_tax**: `boolean`

Whether the shipping method price include tax

#### Defined in

[packages/medusa/src/models/shipping-method.ts:95](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L95)

___

### order

 **order**: [`Order`](Order.md)

The details of the order that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L45)

___

### order\_id

 **order\_id**: `string`

The ID of the order that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:41](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L41)

___

### price

 **price**: `number`

The amount to charge for the Shipping Method. The currency of the price is defined by the Region that the Order that the Shipping Method belongs to is a part of.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:89](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L89)

___

### return\_id

 **return\_id**: `string`

The ID of the return that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:73](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L73)

___

### return\_order

 **return\_order**: [`Return`](Return.md)

The details of the return that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:77](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L77)

___

### shipping\_option

 **shipping\_option**: [`ShippingOption`](ShippingOption.md)

The details of the shipping option the method was created from.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:81](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L81)

___

### shipping\_option\_id

 **shipping\_option\_id**: `string`

The ID of the Shipping Option that the Shipping Method is built from.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:37](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L37)

___

### subtotal

 `Optional` **subtotal**: `number`

The subtotal of the shipping

#### Defined in

[packages/medusa/src/models/shipping-method.ts:97](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L97)

___

### swap

 **swap**: [`Swap`](Swap.md)

The details of the swap that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:69](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L69)

___

### swap\_id

 **swap\_id**: `string`

The ID of the swap that the shipping method is used in.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:65](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L65)

___

### tax\_lines

 **tax\_lines**: [`ShippingMethodTaxLine`](ShippingMethodTaxLine.md)[]

The details of the tax lines applied on the shipping method.

#### Defined in

[packages/medusa/src/models/shipping-method.ts:86](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L86)

___

### tax\_total

 `Optional` **tax\_total**: `number`

The total of tax

#### Defined in

[packages/medusa/src/models/shipping-method.ts:99](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L99)

___

### total

 `Optional` **total**: `number`

The total amount of the shipping

#### Defined in

[packages/medusa/src/models/shipping-method.ts:98](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L98)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/shipping-method.ts:105](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/shipping-method.ts#L105)
