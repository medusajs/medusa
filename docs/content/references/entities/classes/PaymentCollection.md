---
displayed_sidebar: entitiesSidebar
---

# Class: PaymentCollection

## Hierarchy

- `SoftDeletableEntity`

  ↳ **`PaymentCollection`**

## Constructors

### constructor

• **new PaymentCollection**()

#### Inherited from

SoftDeletableEntity.constructor

## Properties

### amount

• **amount**: `number`

#### Defined in

[models/payment-collection.ts:43](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L43)

___

### authorized\_amount

• **authorized\_amount**: ``null`` \| `number`

#### Defined in

[models/payment-collection.ts:46](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L46)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

• **created\_by**: `string`

#### Defined in

[models/payment-collection.ts:96](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L96)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/payment-collection.ts:62](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L62)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/payment-collection.ts:58](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L58)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### description

• **description**: ``null`` \| `string`

#### Defined in

[models/payment-collection.ts:40](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L40)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment-collection.ts:93](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L93)

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](PaymentSession.md)[]

#### Defined in

[models/payment-collection.ts:76](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L76)

___

### payments

• **payments**: [`Payment`](Payment.md)[]

#### Defined in

[models/payment-collection.ts:90](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L90)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/payment-collection.ts:54](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L54)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/payment-collection.ts:50](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L50)

___

### status

• **status**: [`PaymentCollectionStatus`](../enums/PaymentCollectionStatus.md)

#### Defined in

[models/payment-collection.ts:37](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L37)

___

### type

• **type**: [`ORDER_EDIT`](../enums/PaymentCollectionType.md#order_edit)

#### Defined in

[models/payment-collection.ts:34](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L34)

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

[models/payment-collection.ts:98](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/payment-collection.ts#L98)
