---
displayed_sidebar: entitiesSidebar
---

# Class: ClaimItem

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`ClaimItem`**

## Constructors

### constructor

• **new ClaimItem**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### claim\_order

• **claim\_order**: [`ClaimOrder`](ClaimOrder.md)

#### Defined in

[models/claim-item.ts:42](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L42)

___

### claim\_order\_id

• **claim\_order\_id**: `string`

#### Defined in

[models/claim-item.ts:38](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L38)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### images

• **images**: [`ClaimImage`](ClaimImage.md)[]

#### Defined in

[models/claim-item.ts:34](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L34)

___

### item

• **item**: [`LineItem`](LineItem.md)

#### Defined in

[models/claim-item.ts:50](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L50)

___

### item\_id

• **item\_id**: `string`

#### Defined in

[models/claim-item.ts:46](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L46)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/claim-item.ts:84](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L84)

___

### note

• **note**: `string`

#### Defined in

[models/claim-item.ts:64](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L64)

___

### quantity

• **quantity**: `number`

#### Defined in

[models/claim-item.ts:67](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L67)

___

### reason

• **reason**: [`ClaimReason`](../enums/ClaimReason.md)

#### Defined in

[models/claim-item.ts:61](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L61)

___

### tags

• **tags**: [`ClaimTag`](ClaimTag.md)[]

#### Defined in

[models/claim-item.ts:81](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L81)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

___

### variant

• **variant**: [`ProductVariant`](ProductVariant.md)

#### Defined in

[models/claim-item.ts:58](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L58)

___

### variant\_id

• **variant\_id**: `string`

#### Defined in

[models/claim-item.ts:54](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L54)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/claim-item.ts:86](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/claim-item.ts#L86)
