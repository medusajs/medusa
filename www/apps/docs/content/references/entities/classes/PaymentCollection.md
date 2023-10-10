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

[models/payment-collection.ts:41](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L41)

___

### authorized\_amount

• **authorized\_amount**: ``null`` \| `number`

#### Defined in

[models/payment-collection.ts:44](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L44)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

• **created\_by**: `string`

#### Defined in

[models/payment-collection.ts:94](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L94)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/payment-collection.ts:60](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L60)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/payment-collection.ts:56](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L56)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### description

• **description**: ``null`` \| `string`

#### Defined in

[models/payment-collection.ts:38](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L38)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment-collection.ts:91](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L91)

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](PaymentSession.md)[]

#### Defined in

[models/payment-collection.ts:74](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L74)

___

### payments

• **payments**: [`Payment`](Payment.md)[]

#### Defined in

[models/payment-collection.ts:88](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L88)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/payment-collection.ts:52](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L52)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/payment-collection.ts:48](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L48)

___

### status

• **status**: [`PaymentCollectionStatus`](../enums/PaymentCollectionStatus.md)

#### Defined in

[models/payment-collection.ts:35](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L35)

___

### type

• **type**: [`ORDER_EDIT`](../enums/PaymentCollectionType.md#order_edit)

#### Defined in

[models/payment-collection.ts:32](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L32)

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

[models/payment-collection.ts:97](https://github.com/medusajs/medusa/blob/418ff2a33/packages/medusa/src/models/payment-collection.ts#L97)
