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

[models/customer.ts:38](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L38)

___

### billing\_address\_id

• **billing\_address\_id**: ``null`` \| `string`

#### Defined in

[models/customer.ts:34](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L34)

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

### email

• **email**: `string`

#### Defined in

[models/customer.ts:24](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L24)

___

### first\_name

• **first\_name**: `string`

#### Defined in

[models/customer.ts:27](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L27)

___

### groups

• **groups**: [`CustomerGroup`](CustomerGroup.md)[]

#### Defined in

[models/customer.ts:69](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L69)

___

### has\_account

• **has\_account**: `boolean`

#### Defined in

[models/customer.ts:50](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L50)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### last\_name

• **last\_name**: `string`

#### Defined in

[models/customer.ts:30](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L30)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/customer.ts:72](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L72)

___

### orders

• **orders**: [`Order`](Order.md)[]

#### Defined in

[models/customer.ts:53](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L53)

___

### password\_hash

• **password\_hash**: `string`

#### Defined in

[models/customer.ts:44](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L44)

___

### phone

• **phone**: `string`

#### Defined in

[models/customer.ts:47](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L47)

___

### shipping\_addresses

• **shipping\_addresses**: [`Address`](Address.md)[]

#### Defined in

[models/customer.ts:41](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L41)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/customer.ts:74](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/customer.ts#L74)
