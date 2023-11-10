# Store

A store holds the main settings of the commerce shop. By default, only one store is created and used within the Medusa backend. It holds settings related to the name of the store, available currencies, and more.

## Hierarchy

- [`BaseEntity`](BaseEntity.md)

  ↳ **`Store`**

## Constructors

### constructor

**new Store**()

A store holds the main settings of the commerce shop. By default, only one store is created and used within the Medusa backend. It holds settings related to the name of the store, available currencies, and more.

#### Inherited from

[BaseEntity](BaseEntity.md).[constructor](BaseEntity.md#constructor)

## Properties

### created\_at

 **created\_at**: `Date`

The date with timezone at which the resource was created.

#### Inherited from

[BaseEntity](BaseEntity.md).[created_at](BaseEntity.md#created_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currencies

 **currencies**: [`Currency`](Currency.md)[]

The details of the enabled currencies in the store.

#### Defined in

[packages/medusa/src/models/store.ts:46](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L46)

___

### default\_currency

 **default\_currency**: [`Currency`](Currency.md) = `usd`

The details of the store's default currency.

#### Defined in

[packages/medusa/src/models/store.ts:32](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L32)

___

### default\_currency\_code

 **default\_currency\_code**: `string`

The three character currency code that is the default of the store.

#### Defined in

[packages/medusa/src/models/store.ts:28](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L28)

___

### default\_location\_id

 **default\_location\_id**: `string`

The location ID the store is associated with.

#### Defined in

[packages/medusa/src/models/store.ts:58](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L58)

___

### default\_sales\_channel

 **default\_sales\_channel**: [`SalesChannel`](SalesChannel.md)

The details of the store's default sales channel.

#### Defined in

[packages/medusa/src/models/store.ts:70](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L70)

___

### default\_sales\_channel\_id

 **default\_sales\_channel\_id**: ``null`` \| `string`

The ID of the store's default sales channel.

#### Defined in

[packages/medusa/src/models/store.ts:64](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L64)

___

### id

 **id**: `string`

The store's ID

#### Inherited from

[BaseEntity](BaseEntity.md).[id](BaseEntity.md#id)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### invite\_link\_template

 **invite\_link\_template**: ``null`` \| `string`

A template to generate Invite links from

#### Defined in

[packages/medusa/src/models/store.ts:55](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L55)

___

### metadata

 **metadata**: ``null`` \| Record<`string`, `unknown`\>

An optional key-value map with additional details

#### Defined in

[packages/medusa/src/models/store.ts:61](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L61)

___

### name

 **name**: `string` = `Medusa Store`

The name of the Store - this may be displayed to the Customer.

#### Defined in

[packages/medusa/src/models/store.ts:25](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L25)

___

### payment\_link\_template

 **payment\_link\_template**: ``null`` \| `string`

A template to generate Payment links from. Use {{cart_id}} to include the payment's `cart_id` in the link.

#### Defined in

[packages/medusa/src/models/store.ts:52](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L52)

___

### swap\_link\_template

 **swap\_link\_template**: ``null`` \| `string`

A template to generate Swap links from. Use {{cart_id}} to include the Swap's `cart_id` in the link.

#### Defined in

[packages/medusa/src/models/store.ts:49](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L49)

___

### updated\_at

 **updated\_at**: `Date`

The date with timezone at which the resource was updated.

#### Inherited from

[BaseEntity](BaseEntity.md).[updated_at](BaseEntity.md#updated_at)

#### Defined in

[packages/medusa/src/interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

`Private` **beforeInsert**(): `void`

#### Returns

`void`

-`void`: (optional) 

#### Defined in

[packages/medusa/src/models/store.ts:76](https://github.com/medusajs/medusa/blob/e39010127/packages/medusa/src/models/store.ts#L76)
