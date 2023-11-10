# Address

An address is used across the Medusa backend within other schemas and object types. For example, a customer's billing and shipping addresses both use the Address entity.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`Address`**

## Constructors

### constructor

**new Address**()

An address is used across the Medusa backend within other schemas and object types. For example, a customer's billing and shipping addresses both use the Address entity.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### address\_1

 **address\_1**: ``null`` \| `string`

Address line 1

#### Defined in

[packages/medusa/src/models/address.ts:36](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L36)

___

### address\_2

 **address\_2**: ``null`` \| `string`

Address line 2

#### Defined in

[packages/medusa/src/models/address.ts:39](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L39)

___

### city

 **city**: ``null`` \| `string`

City

#### Defined in

[packages/medusa/src/models/address.ts:42](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L42)

___

### company

 **company**: ``null`` \| `string`

Company name

#### Defined in

[packages/medusa/src/models/address.ts:27](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L27)

___

### country

 **country**: ``null`` \| [`Country`](Country.md)

A country object.

#### Defined in

[packages/medusa/src/models/address.ts:49](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L49)

___

### country\_code

 **country\_code**: ``null`` \| `string`

The 2 character ISO code of the country in lower case

#### Defined in

[packages/medusa/src/models/address.ts:45](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L45)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### customer

 **customer**: ``null`` \| [`Customer`](Customer.md)

Available if the relation `customer` is expanded.

#### Defined in

[packages/medusa/src/models/address.ts:24](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L24)

___

### customer\_id

 **customer\_id**: ``null`` \| `string`

ID of the customer this address belongs to

#### Defined in

[packages/medusa/src/models/address.ts:20](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L20)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### first\_name

 **first\_name**: ``null`` \| `string`

First name

#### Defined in

[packages/medusa/src/models/address.ts:30](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L30)

___

### id

 **id**: `string`

ID of the address

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### last\_name

 **last\_name**: ``null`` \| `string`

Last name

#### Defined in

[packages/medusa/src/models/address.ts:33](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L33)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/address.ts:61](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L61)

___

### phone

 **phone**: ``null`` \| `string`

Phone Number

#### Defined in

[packages/medusa/src/models/address.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L58)

___

### postal\_code

 **postal\_code**: ``null`` \| `string`

Postal Code

#### Defined in

[packages/medusa/src/models/address.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L55)

___

### province

 **province**: ``null`` \| `string`

Province

#### Defined in

[packages/medusa/src/models/address.ts:52](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L52)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[updated_at](SoftDeletableEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/address.ts:67](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/address.ts#L67)
