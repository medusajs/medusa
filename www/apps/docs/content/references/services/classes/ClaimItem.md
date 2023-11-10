# ClaimItem

A claim item is an item created as part of a claim. It references an item in the order that should be exchanged or refunded.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ClaimItem`**

## Constructors

### constructor

**new ClaimItem**()

A claim item is an item created as part of a claim. It references an item in the order that should be exchanged or refunded.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### claim\_order

 **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

The details of the claim this item belongs to.

#### Defined in

[packages/medusa/src/models/claim-item.ts:42](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L42)

___

### claim\_order\_id

 **claim\_order\_id**: `string`

The ID of the claim this item is associated with.

#### Defined in

[packages/medusa/src/models/claim-item.ts:38](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L38)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

 **id**: `string`

The claim item's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### images

 **images**: [`ClaimImage`](ClaimImage.md)[]

The claim images that are attached to the claim item.

#### Defined in

[packages/medusa/src/models/claim-item.ts:34](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L34)

___

### item

 **item**: [`LineItem`](LineItem.md)

The details of the line item in the original order that this claim item refers to.

#### Defined in

[packages/medusa/src/models/claim-item.ts:50](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L50)

___

### item\_id

 **item\_id**: `string`

The ID of the line item that the claim item refers to.

#### Defined in

[packages/medusa/src/models/claim-item.ts:46](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L46)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/claim-item.ts:84](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L84)

___

### note

 **note**: `string`

An optional note about the claim, for additional information

#### Defined in

[packages/medusa/src/models/claim-item.ts:64](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L64)

___

### quantity

 **quantity**: `number`

The quantity of the item that is being claimed; must be less than or equal to the amount purchased in the original order.

#### Defined in

[packages/medusa/src/models/claim-item.ts:67](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L67)

___

### reason

 **reason**: [`ClaimReason`](../enums/ClaimReason.md)

The reason for the claim

#### Defined in

[packages/medusa/src/models/claim-item.ts:61](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L61)

___

### tags

 **tags**: [`ClaimTag`](ClaimTag.md)[]

User defined tags for easy filtering and grouping.

#### Defined in

[packages/medusa/src/models/claim-item.ts:81](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L81)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

 **variant**: [`ProductVariant`](ProductVariant.md)

The details of the product variant to potentially replace the item in the original order.

#### Defined in

[packages/medusa/src/models/claim-item.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L58)

___

### variant\_id

 **variant\_id**: `string`

The ID of the product variant that is claimed.

#### Defined in

[packages/medusa/src/models/claim-item.ts:54](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L54)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/claim-item.ts:90](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-item.ts#L90)
