# Customer

A customer can make purchases in your store and manage their profile.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`Customer`**

## Constructors

### constructor

**new Customer**()

A customer can make purchases in your store and manage their profile.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### billing\_address

 **billing\_address**: [`Address`](Address.md)

The details of the billing address associated with the customer.

#### Defined in

[packages/medusa/src/models/customer.ts:40](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L40)

___

### billing\_address\_id

 **billing\_address\_id**: ``null`` \| `string`

The customer's billing address ID

#### Defined in

[packages/medusa/src/models/customer.ts:36](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L36)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### email

 **email**: `string`

The customer's email

#### Defined in

[packages/medusa/src/models/customer.ts:26](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L26)

___

### first\_name

 **first\_name**: `string`

The customer's first name

#### Defined in

[packages/medusa/src/models/customer.ts:29](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L29)

___

### groups

 **groups**: [`CustomerGroup`](CustomerGroup.md)[]

The customer groups the customer belongs to.

#### Defined in

[packages/medusa/src/models/customer.ts:74](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L74)

___

### has\_account

 **has\_account**: `boolean`

Whether the customer has an account or not

#### Defined in

[packages/medusa/src/models/customer.ts:55](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L55)

___

### id

 **id**: `string`

The customer's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### last\_name

 **last\_name**: `string`

The customer's last name

#### Defined in

[packages/medusa/src/models/customer.ts:32](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L32)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/customer.ts:77](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L77)

___

### orders

 **orders**: [`Order`](Order.md)[]

The details of the orders this customer placed.

#### Defined in

[packages/medusa/src/models/customer.ts:58](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L58)

___

### password\_hash

 **password\_hash**: `string`

#### Defined in

[packages/medusa/src/models/customer.ts:49](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L49)

___

### phone

 **phone**: `string`

The customer's phone number

#### Defined in

[packages/medusa/src/models/customer.ts:52](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L52)

___

### shipping\_addresses

 **shipping\_addresses**: [`Address`](Address.md)[]

The details of the shipping addresses associated with the customer.

#### Defined in

[packages/medusa/src/models/customer.ts:43](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L43)

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

[packages/medusa/src/models/customer.ts:83](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/customer.ts#L83)
