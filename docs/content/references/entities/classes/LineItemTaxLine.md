---
displayed_sidebar: entitiesSidebar
---

# Class: LineItemTaxLine

## Hierarchy

- `TaxLine`

  ↳ **`LineItemTaxLine`**

## Constructors

### constructor

• **new LineItemTaxLine**()

#### Inherited from

TaxLine.constructor

## Properties

### code

• **code**: ``null`` \| `string`

#### Inherited from

TaxLine.code

#### Defined in

[models/tax-line.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-line.ts#L13)

___

### created\_at

• **created\_at**: `Date`

#### Inherited from

TaxLine.created\_at

#### Defined in

[interfaces/models/base-entity.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L16)

___

### id

• **id**: `string`

#### Inherited from

TaxLine.id

#### Defined in

[interfaces/models/base-entity.ts:13](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L13)

___

### item

• **item**: [`LineItem`](LineItem.md)

#### Defined in

[models/line-item-tax-line.ts:24](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item-tax-line.ts#L24)

___

### item\_id

• **item\_id**: `string`

#### Defined in

[models/line-item-tax-line.ts:20](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item-tax-line.ts#L20)

___

### metadata

• **metadata**: `Record`<`string`, `unknown`\>

#### Inherited from

TaxLine.metadata

#### Defined in

[models/tax-line.ts:16](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-line.ts#L16)

___

### name

• **name**: `string`

#### Inherited from

TaxLine.name

#### Defined in

[models/tax-line.ts:10](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-line.ts#L10)

___

### rate

• **rate**: `number`

#### Inherited from

TaxLine.rate

#### Defined in

[models/tax-line.ts:7](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/tax-line.ts#L7)

___

### updated\_at

• **updated\_at**: `Date`

#### Inherited from

TaxLine.updated\_at

#### Defined in

[interfaces/models/base-entity.ts:19](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/interfaces/models/base-entity.ts#L19)

## Methods

### beforeInsert

▸ `Private` **beforeInsert**(): `void`

#### Returns

`void`

#### Defined in

[models/line-item-tax-line.ts:26](https://github.com/medusajs/medusa/blob/da7ea8c5d/packages/medusa/src/models/line-item-tax-line.ts#L26)
