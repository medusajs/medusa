# ClaimImage

The details of an image attached to a claim.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ClaimImage`**

## Constructors

### constructor

**new ClaimImage**()

The details of an image attached to a claim.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### claim\_item

 **claim\_item**: [`ClaimItem`](ClaimItem.md)

The details of the claim item this image is associated with.

#### Defined in

[packages/medusa/src/models/claim-image.ts:23](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-image.ts#L23)

___

### claim\_item\_id

 **claim\_item\_id**: `string`

The ID of the claim item associated with the image

#### Defined in

[packages/medusa/src/models/claim-image.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-image.ts#L19)

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

The claim image's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/claim-image.ts:29](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-image.ts#L29)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### url

 **url**: `string`

The URL of the image

#### Defined in

[packages/medusa/src/models/claim-image.ts:26](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-image.ts#L26)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/claim-image.ts:35](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/claim-image.ts#L35)
