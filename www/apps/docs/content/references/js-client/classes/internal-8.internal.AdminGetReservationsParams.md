---
displayed_sidebar: jsClientSidebar
---

# Class: AdminGetReservationsParams

[internal](../modules/internal-8.md).[internal](../modules/internal-8.internal.md).AdminGetReservationsParams

## Hierarchy

- [`AdminGetReservationsParams_base`](../modules/internal-8.md#admingetreservationsparams_base)

  ↳ **`AdminGetReservationsParams`**

## Properties

### created\_at

• `Optional` **created\_at**: [`DateComparisonOperator`](internal-2.DateComparisonOperator.md)

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/list-reservations.d.ts:153

___

### created\_by

• `Optional` **created\_by**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/list-reservations.d.ts:151

___

### description

• `Optional` **description**: `string` \| [`StringComparisonOperator`](internal-6.StringComparisonOperator.md)

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/list-reservations.d.ts:154

___

### expand

• `Optional` **expand**: `string`

#### Inherited from

AdminGetReservationsParams\_base.expand

#### Defined in

packages/medusa/dist/types/common.d.ts:239

___

### fields

• `Optional` **fields**: `string`

#### Inherited from

AdminGetReservationsParams\_base.fields

#### Defined in

packages/medusa/dist/types/common.d.ts:240

___

### inventory\_item\_id

• `Optional` **inventory\_item\_id**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/list-reservations.d.ts:149

___

### limit

• `Optional` **limit**: `number`

#### Inherited from

AdminGetReservationsParams\_base.limit

#### Defined in

packages/medusa/dist/types/common.d.ts:244

___

### line\_item\_id

• `Optional` **line\_item\_id**: `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/list-reservations.d.ts:150

___

### location\_id

• `Optional` **location\_id**: `string` \| `string`[]

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/list-reservations.d.ts:148

___

### offset

• `Optional` **offset**: `number`

#### Inherited from

AdminGetReservationsParams\_base.offset

#### Defined in

packages/medusa/dist/types/common.d.ts:243

___

### quantity

• `Optional` **quantity**: [`NumericalComparisonOperator`](internal-8.internal.NumericalComparisonOperator.md)

#### Defined in

packages/medusa/dist/api/routes/admin/reservations/list-reservations.d.ts:152
