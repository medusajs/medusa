# PaymentCollection

A payment collection allows grouping and managing a list of payments at one. This can be helpful when making additional payment for order edits or integrating installment payments.

## Hierarchy

- [`SoftDeletableEntity`](SoftDeletableEntity.md)

  ↳ **`PaymentCollection`**

## Constructors

### constructor

**new PaymentCollection**()

A payment collection allows grouping and managing a list of payments at one. This can be helpful when making additional payment for order edits or integrating installment payments.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[constructor](SoftDeletableEntity.md#constructor)

## Properties

### amount

 **amount**: `number`

Amount of the payment collection.

#### Defined in

[packages/medusa/src/models/payment-collection.ts:69](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L69)

___

### authorized\_amount

 **authorized\_amount**: ``null`` \| `number`

Authorized amount of the payment collection.

#### Defined in

[packages/medusa/src/models/payment-collection.ts:72](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L72)

___

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[created_at](SoftDeletableEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### created\_by

 **created\_by**: `string`

The ID of the user that created the payment collection.

#### Defined in

[packages/medusa/src/models/payment-collection.ts:122](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L122)

___

### currency

 **currency**: [`Currency`](Currency.md)

The details of the currency this payment collection is associated with.

#### Defined in

[packages/medusa/src/models/payment-collection.ts:88](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L88)

___

### currency\_code

 **currency\_code**: `string`

The three character ISO code for the currency this payment collection is associated with.

#### Defined in

[packages/medusa/src/models/payment-collection.ts:84](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L84)

___

### deleted\_at

 **deleted\_at**: ``null`` \| `Date`

The date with timezone at which the resource was deleted.

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[deleted_at](SoftDeletableEntity.md#deleted_at)

#### Defined in

[packages/medusa/src/interfaces/models/soft-deletable-entity.ts:7](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/soft-deletable-entity.ts#L7)

___

### description

 **description**: ``null`` \| `string`

Description of the payment collection

#### Defined in

[packages/medusa/src/models/payment-collection.ts:66](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L66)

___

### id

 **id**: `string`

The payment collection's ID

#### Inherited from

[SoftDeletableEntity](SoftDeletableEntity.md).[id](SoftDeletableEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### metadata

 **metadata**: Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/payment-collection.ts:119](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L119)

___

### payment\_sessions

 **payment\_sessions**: [`PaymentSession`](PaymentSession.md)[]

The details of the payment sessions created as part of the payment collection.

#### Defined in

[packages/medusa/src/models/payment-collection.ts:102](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L102)

___

### payments

 **payments**: [`Payment`](Payment.md)[]

The details of the payments created as part of the payment collection.

#### Defined in

[packages/medusa/src/models/payment-collection.ts:116](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L116)

___

### region

 **region**: [`Region`](Region.md)

The details of the region this payment collection is associated with.

#### Defined in

[packages/medusa/src/models/payment-collection.ts:80](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L80)

___

### region\_id

 **region\_id**: `string`

The ID of the region this payment collection is associated with.

#### Defined in

[packages/medusa/src/models/payment-collection.ts:76](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L76)

___

### status

 **status**: [`PaymentCollectionStatus`](../enums/PaymentCollectionStatus.md)

The type of the payment collection

#### Defined in

[packages/medusa/src/models/payment-collection.ts:63](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L63)

___

### type

 **type**: [`ORDER_EDIT`](../index.md#order_edit)

The type of the payment collection

#### Defined in

[packages/medusa/src/models/payment-collection.ts:60](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L60)

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

[packages/medusa/src/models/payment-collection.ts:128](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/payment-collection.ts#L128)
