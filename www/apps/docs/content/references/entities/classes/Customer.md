---
displayed_sidebar: entitiesSidebar
---

# Class: Customer

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`Customer`**

## Constructors

### constructor

• **new Customer**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### billing\_address

• **billing\_address**: [`Address`](Address.md)

#### Defined in

[models/customer.ts:40](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L40)

___

### billing\_address\_id

• **billing\_address\_id**: ``null`` \| `string`

#### Defined in

[models/customer.ts:36](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L36)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### email

• **email**: `string`

#### Defined in

[models/customer.ts:26](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L26)

___

### first\_name

• **first\_name**: `string`

#### Defined in

[models/customer.ts:29](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L29)

___

### groups

• **groups**: [`CustomerGroup`](CustomerGroup.md)[]

#### Defined in

[models/customer.ts:71](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L71)

___

### has\_account

• **has\_account**: `boolean`

#### Defined in

[models/customer.ts:52](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L52)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### last\_name

• **last\_name**: `string`

#### Defined in

[models/customer.ts:32](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L32)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/customer.ts:74](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L74)

___

### orders

• **orders**: [`Order`](Order.md)[]

#### Defined in

[models/customer.ts:55](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L55)

___

### password\_hash

• **password\_hash**: `string`

#### Defined in

[models/customer.ts:46](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L46)

___

### phone

• **phone**: `string`

#### Defined in

[models/customer.ts:49](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L49)

___

### shipping\_addresses

• **shipping\_addresses**: [`Address`](Address.md)[]

#### Defined in

[models/customer.ts:43](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L43)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/customer.ts:77](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/customer.ts#L77)
