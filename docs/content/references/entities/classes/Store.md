---
displayed_sidebar: entitiesSidebar
---

# Class: Store

## Hierarchy

- `BaseEntity`

  ↳ **`Store`**

## Constructors

### constructor

• **new Store**()

#### Inherited from

BaseEntity.constructor

## Properties

### created\_at

• **created\_at**: `Date`

#### Inherited from

BaseEntity.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### currencies

• **currencies**: [`Currency`](Currency.md)[]

#### Defined in

[models/store.ts:46](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L46)

___

### default\_currency

• **default\_currency**: [`Currency`](Currency.md)

#### Defined in

[models/store.ts:32](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L32)

___

### default\_currency\_code

• **default\_currency\_code**: `string`

#### Defined in

[models/store.ts:28](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L28)

___

### default\_sales\_channel

• **default\_sales\_channel**: [`SalesChannel`](SalesChannel.md)

#### Defined in

[models/store.ts:67](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L67)

___

### default\_sales\_channel\_id

• **default\_sales\_channel\_id**: `string`

#### Defined in

[models/store.ts:61](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L61)

___

### id

• **id**: `string`

#### Inherited from

BaseEntity.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### invite\_link\_template

• **invite\_link\_template**: `string`

#### Defined in

[models/store.ts:55](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L55)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Defined in

[models/store.ts:58](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L58)

___

### name

• **name**: `string`

#### Defined in

[models/store.ts:25](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L25)

___

### payment\_link\_template

• **payment\_link\_template**: `string`

#### Defined in

[models/store.ts:52](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L52)

___

### swap\_link\_template

• **swap\_link\_template**: `string`

#### Defined in

[models/store.ts:49](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L49)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

BaseEntity.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/store.ts:69](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/store.ts#L69)
