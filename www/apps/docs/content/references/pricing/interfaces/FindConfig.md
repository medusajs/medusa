---
displayed_sidebar: pricingReference
---

# FindConfig

An object that is used to configure how an entity is retrieved from the database. It accepts as a typed parameter an `Entity` class, 
which provides correct typing of field names in its properties.

## Type parameters

| Name |
| :------ |
| `Entity` |

## Properties

### order

 `Optional` **order**: `Object`

An object used to specify how to sort the returned records. Its keys are the names of attributes of the entity, and a key's value can either be `ASC` 
to sort retrieved records in an ascending order, or `DESC` to sort retrieved records in a descending order.

#### Index signature

▪ [K: `string`]: ``"ASC"`` \| ``"DESC"``

#### Defined in

[packages/types/src/common/common.ts:64](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/common/common.ts#L64)

___

### relations

 `Optional` **relations**: `string`[]

An array of strings, each being relation names of the entity to retrieve in the result.

#### Defined in

[packages/types/src/common/common.ts:63](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/common/common.ts#L63)

___

### select

 `Optional` **select**: (`string` \| keyof `Entity`)[]

An array of strings, each being attribute names of the entity to retrieve in the result.

#### Defined in

[packages/types/src/common/common.ts:60](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/common/common.ts#L60)

___

### skip

 `Optional` **skip**: `number`

A number indicating the number of records to skip before retrieving the results.

#### Defined in

[packages/types/src/common/common.ts:61](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/common/common.ts#L61)

___

### take

 `Optional` **take**: `number`

A number indicating the number of records to return in the result.

#### Defined in

[packages/types/src/common/common.ts:62](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/common/common.ts#L62)

___

### withDeleted

 `Optional` **withDeleted**: `boolean`

A boolean indicating whether deleted records should also be retrieved as part of the result. This only works if the entity extends the
`SoftDeletableEntity` class.

#### Defined in

[packages/types/src/common/common.ts:65](https://github.com/medusajs/medusa/blob/daea35fe73/packages/types/src/common/common.ts#L65)
