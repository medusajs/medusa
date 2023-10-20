---
displayed_sidebar: jsClientSidebar
---

# Class: ProductOption

[internal](../modules/internal-3.md).ProductOption

Base abstract entity for all entities

## Hierarchy

- [`SoftDeletableEntity`](internal-1.SoftDeletableEntity.md)

  ↳ **`ProductOption`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/product-option.d.ts:10

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[created_at](internal-1.SoftDeletableEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[deleted_at](internal-1.SoftDeletableEntity.md#deleted_at)

#### Defined in

packages/medusa/dist/interfaces/models/soft-deletable-entity.d.ts:3

___

### id

• **id**: `string`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[id](internal-1.SoftDeletableEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### metadata

• **metadata**: [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/product-option.d.ts:9

___

### product

• **product**: [`Product`](internal-3.Product.md)

#### Defined in

packages/medusa/dist/models/product-option.d.ts:8

___

### product\_id

• **product\_id**: `string`

#### Defined in

packages/medusa/dist/models/product-option.d.ts:7

___

### title

• **title**: `string`

#### Defined in

packages/medusa/dist/models/product-option.d.ts:5

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[SoftDeletableEntity](internal-1.SoftDeletableEntity.md).[updated_at](internal-1.SoftDeletableEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7

___

### values

• **values**: [`ProductOptionValue`](internal-3.ProductOptionValue.md)[]

#### Defined in

packages/medusa/dist/models/product-option.d.ts:6
