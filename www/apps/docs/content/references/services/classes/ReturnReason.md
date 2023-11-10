# ReturnReason

A Return Reason is a value defined by an admin. It can be used on Return Items in order to indicate why a Line Item was returned.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`ReturnReason`**

## Constructors

### constructor

**new ReturnReason**()

A Return Reason is a value defined by an admin. It can be used on Return Items in order to indicate why a Line Item was returned.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

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

### description

 **description**: `string`

A description of the Reason.

#### Defined in

[packages/medusa/src/models/return-reason.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/return-reason.ts#L25)

___

### id

 **id**: `string`

The return reason's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### label

 **label**: `string`

A text that can be displayed to the Customer as a reason.

#### Defined in

[packages/medusa/src/models/return-reason.ts:22](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/return-reason.ts#L22)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/return-reason.ts:42](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/return-reason.ts#L42)

___

### parent\_return\_reason

 **parent\_return\_reason**: ``null`` \| [`ReturnReason`](ReturnReason.md)

The details of the parent reason.

#### Defined in

[packages/medusa/src/models/return-reason.ts:32](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/return-reason.ts#L32)

___

### parent\_return\_reason\_id

 **parent\_return\_reason\_id**: ``null`` \| `string`

The ID of the parent reason.

#### Defined in

[packages/medusa/src/models/return-reason.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/return-reason.ts#L28)

___

### return\_reason\_children

 **return\_reason\_children**: [`ReturnReason`](ReturnReason.md)[]

The details of the child reasons.

#### Defined in

[packages/medusa/src/models/return-reason.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/return-reason.ts#L39)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### value

 **value**: `string`

The value to identify the reason by.

#### Defined in

[packages/medusa/src/models/return-reason.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/return-reason.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/return-reason.ts:48](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/return-reason.ts#L48)
