---
displayed_sidebar: jsClientSidebar
---

# Class: Store

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).Store

Base abstract entity for all entities

## Hierarchy

- [`BaseEntity`](internal-1.BaseEntity.md)

  ↳ **`Store`**

## Properties

### beforeInsert

• `Private` **beforeInsert**: `any`

#### Defined in

packages/medusa/dist/models/store.d.ts:16

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[created_at](internal-1.BaseEntity.md#created_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:6

___

### currencies

• **currencies**: [`Currency`](internal-3.Currency.md)[]

#### Defined in

packages/medusa/dist/models/store.d.ts:8

___

### default\_currency

• **default\_currency**: [`Currency`](internal-3.Currency.md)

#### Defined in

packages/medusa/dist/models/store.d.ts:7

___

### default\_currency\_code

• **default\_currency\_code**: `string`

#### Defined in

packages/medusa/dist/models/store.d.ts:6

___

### default\_location\_id

• **default\_location\_id**: `string`

#### Defined in

packages/medusa/dist/models/store.d.ts:12

___

### default\_sales\_channel

• **default\_sales\_channel**: [`SalesChannel`](internal-3.SalesChannel.md)

#### Defined in

packages/medusa/dist/models/store.d.ts:15

___

### default\_sales\_channel\_id

• **default\_sales\_channel\_id**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/store.d.ts:14

___

### id

• **id**: `string`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[id](internal-1.BaseEntity.md#id)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:5

___

### invite\_link\_template

• **invite\_link\_template**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/store.d.ts:11

___

### metadata

• **metadata**: ``null`` \| [`Record`](../modules/internal.md#record)<`string`, `unknown`\>

#### Defined in

packages/medusa/dist/models/store.d.ts:13

___

### name

• **name**: `string`

#### Defined in

packages/medusa/dist/models/store.d.ts:5

___

### payment\_link\_template

• **payment\_link\_template**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/store.d.ts:10

___

### swap\_link\_template

• **swap\_link\_template**: ``null`` \| `string`

#### Defined in

packages/medusa/dist/models/store.d.ts:9

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

[BaseEntity](internal-1.BaseEntity.md).[updated_at](internal-1.BaseEntity.md#updated_at)

#### Defined in

packages/medusa/dist/interfaces/models/base-entity.d.ts:7
