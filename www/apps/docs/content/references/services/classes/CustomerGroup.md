# CustomerGroup

A customer group that can be used to organize customers into groups of similar traits.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`CustomerGroup`**

## Constructors

### constructor

**new CustomerGroup**()

A customer group that can be used to organize customers into groups of similar traits.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customers

 **customers**: [`Customer`](Customer.md)[]

The details of the customers that belong to the customer group.

#### Defined in

[packages/medusa/src/models/customer-group.ts:18](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer-group.ts#L18)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### id

 **id**: `string`

The customer group's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/customer-group.ts:26](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer-group.ts#L26)

___

### name

 **name**: `string`

The name of the customer group

#### Defined in

[packages/medusa/src/models/customer-group.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer-group.ts#L13)

___

### price\_lists

 **price\_lists**: [`PriceList`](PriceList.md)[]

The price lists that are associated with the customer group.

#### Defined in

[packages/medusa/src/models/customer-group.ts:23](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer-group.ts#L23)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/customer-group.ts:32](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer-group.ts#L32)
