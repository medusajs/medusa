---
displayed_sidebar: jsClientSidebar
---

# Class: ProductOption

[internal](../modules/internal.md).ProductOption

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal.SoftDeletableEntity.md)

  ↳ **`ProductOption`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

medusa/dist/models/product-option.d.ts:10

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[created_at](internal.SoftDeletableEntity.md#created_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[deleted_at](internal.SoftDeletableEntity.md#deleted_at)

#### Defined in

medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[id](internal.SoftDeletableEntity.md#id)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:5

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

medusa/dist/models/product-option.d.ts:9

___

### product

• **product**: [`Product`](internal.Product.md)

#### Defined in

medusa/dist/models/product-option.d.ts:8

___

### product\_id

• **product\_id**: `string`

#### Defined in

medusa/dist/models/product-option.d.ts:7

___

### title

• **title**: `string`

#### Defined in

medusa/dist/models/product-option.d.ts:5

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal.SoftDeletableEntity.md).[updated_at](internal.SoftDeletableEntity.md#updated_at)

#### Defined in

medusa/dist/interfaces/models/base-entity.d.ts:7

___

### values

• **values**: [`ProductOptionValue`](internal.ProductOptionValue.md)[]

#### Defined in

medusa/dist/models/product-option.d.ts:6
