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

[models/payment-collection.ts:48](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L48)

___

### authorized\_amount

• **authorized\_amount**: `number`

#### Defined in

[models/payment-collection.ts:51](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L51)

___

### captured\_amount

• **captured\_amount**: `number`

#### Defined in

[models/payment-collection.ts:54](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L54)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

SoftDeletableEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

• **created\_by**: `string`

#### Defined in

[models/payment-collection.ts:107](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L107)

___

### currency

• **currency**: [`Currency`](Currency.md)

#### Defined in

[models/payment-collection.ts:73](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L73)

___

### currency\_code

• **currency\_code**: `string`

#### Defined in

[models/payment-collection.ts:69](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L69)

___

### deleted\_at

• **deleted\_at**: ``null`` \| `Date`

#### Inherited from

SoftDeletableEntity.deleted\_at

#### Defined in

[interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### description

• **description**: `string`

#### Defined in

[models/payment-collection.ts:45](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L45)

___

### id

• **id**: `string`

#### Inherited from

SoftDeletableEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/payment-collection.ts:104](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L104)

___

### payment\_sessions

• **payment\_sessions**: [`PaymentSession`](PaymentSession.md)[]

#### Defined in

[models/payment-collection.ts:87](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L87)

___

### payments

• **payments**: [`Payment`](Payment.md)[]

#### Defined in

[models/payment-collection.ts:101](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L101)

___

### refunded\_amount

• **refunded\_amount**: `number`

#### Defined in

[models/payment-collection.ts:57](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L57)

___

### region

• **region**: [`Region`](Region.md)

#### Defined in

[models/payment-collection.ts:65](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L65)

___

### region\_id

• **region\_id**: `string`

#### Defined in

[models/payment-collection.ts:61](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L61)

___

### status

• **status**: [`PaymentCollectionStatus`](../enums/PaymentCollectionStatus.md)

#### Defined in

[models/payment-collection.ts:42](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L42)

___

### type

• **type**: [`ORDER_EDIT`](../enums/PaymentCollectionType.md#order_edit)

#### Defined in

[models/payment-collection.ts:39](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L39)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

SoftDeletableEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/payment-collection.ts:109](https://github.com/medusajs/medusa/blob/884322447/packages/medusa/src/models/payment-collection.ts#L109)
