# SalesChannel

A Sales Channel is a method a business offers its products for purchase for the customers. For example, a Webshop can be a sales channel, and a mobile app can be another.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`SalesChannel`**

## Constructors

### constructor

**new SalesChannel**()

A Sales Channel is a method a business offers its products for purchase for the customers. For example, a Webshop can be a sales channel, and a mobile app can be another.

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

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### description

 **description**: ``null`` \| `string`

The description of the sales channel.

#### Defined in

[packages/medusa/src/models/sales-channel.ts:14](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/sales-channel.ts#L14)

___

### id

 **id**: `string`

The sales channel's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### is\_disabled

 **is\_disabled**: `boolean`

Specify if the sales channel is enabled or disabled.

#### Defined in

[packages/medusa/src/models/sales-channel.ts:17](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/sales-channel.ts#L17)

___

### locations

 **locations**: [`SalesChannelLocation`](SalesChannelLocation.md)[]

The details of the stock locations related to the sales channel.

#### Defined in

[packages/medusa/src/models/sales-channel.ts:29](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/sales-channel.ts#L29)

___

### metadata

 **metadata**: ``null`` \| Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/sales-channel.ts:20](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/sales-channel.ts#L20)

___

### name

 **name**: `string`

The name of the sales channel.

#### Defined in

[packages/medusa/src/models/sales-channel.ts:11](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/sales-channel.ts#L11)

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

[packages/medusa/src/models/sales-channel.ts:35](https://github.com/medusajs/medusa/blob/3d9f5ae63/packages/medusa/src/models/sales-channel.ts#L35)
